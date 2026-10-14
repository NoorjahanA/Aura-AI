import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { getDBStatus } from '../config/db.js';

// Pre-hashed default fallback password for memory storage
const defaultSalt = bcrypt.genSaltSync(10);
const defaultHash = bcrypt.hashSync('password123', defaultSalt);

// In-memory fallback users store if MongoDB is not running locally
const memoryUsers = [
  {
    id: 'user_default_1',
    name: 'Neo Minimalist',
    email: 'user@example.com',
    password: defaultHash,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aura',
    settings: { theme: 'dark', reasoningVisible: true }
  }
];

const generateToken = (userId, email, name) => {
  return jwt.sign(
    { id: userId, email, name },
    process.env.JWT_SECRET || 'neumorphic_chatbot_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = (name || cleanEmail.split('@')[0]).trim();

    if (getDBStatus()) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      // Password will be securely hashed by the pre('save') hook in User model
      const user = await User.create({
        name: cleanName,
        email: cleanEmail,
        password,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`
      });

      const token = generateToken(user._id, user.email, user.name);
      return res.status(201).json({
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, settings: user.settings },
        token
      });
    } else {
      // Memory fallback
      const existing = memoryUsers.find((u) => u.email === cleanEmail);
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: `user_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
        settings: { theme: 'dark', reasoningVisible: true }
      };
      memoryUsers.push(newUser);
      const token = generateToken(newUser.id, newUser.email, newUser.name);
      return res.status(201).json({
        user: { id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar, settings: newUser.settings },
        token
      });
    }
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration: ' + err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (getDBStatus()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Use bcrypt instance method to compare candidate password with hash
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user._id, user.email, user.name);
      return res.json({
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, settings: user.settings },
        token
      });
    } else {
      // Memory fallback
      const user = memoryUsers.find((u) => u.email === cleanEmail);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user.id, user.email, user.name);
      return res.json({
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, settings: user.settings },
        token
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login: ' + err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (getDBStatus()) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json({ user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, settings: user.settings } });
    } else {
      const user = memoryUsers.find((u) => u.id === req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, settings: user.settings } });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching user details' });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential, email, name, avatar, googleId } = req.body;
    let resolvedEmail = email;
    let resolvedName = name;
    let resolvedAvatar = avatar;
    let resolvedGoogleId = googleId;

    // Verify token with Google's API or decode safely
    if (credential) {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (verifyRes.ok) {
          const googleData = await verifyRes.json();
          resolvedEmail = googleData.email || resolvedEmail;
          resolvedName = googleData.name || resolvedName;
          resolvedAvatar = googleData.picture || resolvedAvatar;
          resolvedGoogleId = googleData.sub || resolvedGoogleId;
        } else {
          // Decode safely from base64 payload
          const parts = credential.split('.');
          if (parts.length === 3) {
            const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
            const decoded = JSON.parse(payloadJson);
            resolvedEmail = decoded.email || resolvedEmail;
            resolvedName = decoded.name || resolvedName;
            resolvedAvatar = decoded.picture || resolvedAvatar;
            resolvedGoogleId = decoded.sub || resolvedGoogleId;
          }
        }
      } catch (tokenErr) {
        console.warn('Google token verify note:', tokenErr.message);
      }
    }

    if (!resolvedEmail) {
      return res.status(400).json({ error: 'Valid Google email is required' });
    }

    const cleanEmail = resolvedEmail.toLowerCase().trim();
    const cleanName = (resolvedName || cleanEmail.split('@')[0]).trim();
    const cleanAvatar = resolvedAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`;
    const finalGoogleId = resolvedGoogleId || `goog_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

    if (getDBStatus()) {
      let user = await User.findOne({
        $or: [{ email: cleanEmail }, { googleId: finalGoogleId }]
      });

      if (user) {
        let changed = false;
        if (!user.googleId) {
          user.googleId = finalGoogleId;
          changed = true;
        }
        if (!user.avatar || user.avatar.includes('dicebear')) {
          user.avatar = cleanAvatar;
          changed = true;
        }
        if (changed) {
          await user.save();
        }
      } else {
        user = await User.create({
          name: cleanName,
          email: cleanEmail,
          googleId: finalGoogleId,
          avatar: cleanAvatar
        });
      }

      const token = generateToken(user._id, user.email, user.name);
      return res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          settings: user.settings
        },
        token
      });
    } else {
      // In-memory fallback
      let user = memoryUsers.find((u) => u.email === cleanEmail || u.googleId === finalGoogleId);
      if (!user) {
        user = {
          id: `user_google_${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          googleId: finalGoogleId,
          avatar: cleanAvatar,
          settings: { theme: 'dark', reasoningVisible: true }
        };
        memoryUsers.push(user);
      }
      const token = generateToken(user.id, user.email, user.name);
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          settings: user.settings
        },
        token
      });
    }
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ error: 'Server error during Google authentication: ' + err.message });
  }
};
