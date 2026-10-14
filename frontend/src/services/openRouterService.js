const OPENROUTER_API_KEY = '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';
const DEFAULT_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';
const BACKEND_STREAM_URL = 'http://localhost:5000/api/chat/stream';

/**
 * Stream chat completions from OpenRouter via server proxy or direct API fallback
 */
export async function streamChatCompletion({
  messages,
  conversationId,
  token,
  onDelta,
  onReasoningDelta,
  onDone,
  onError,
  abortSignal
}) {
  // Format messages according to OpenRouter guidelines (preserve reasoning_details)
  const formattedMessages = messages.map((m) => {
    const obj = {
      role: m.role,
      content: m.content || ''
    };
    if (m.reasoning_details && Array.isArray(m.reasoning_details) && m.reasoning_details.length > 0) {
      obj.reasoning_details = m.reasoning_details;
    }
    return obj;
  });

  // Try server proxy first, then fallback to direct OpenRouter
  let response;
  try {
    response = await fetch(BACKEND_STREAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        conversationId,
        messages: formattedMessages,
        stream: true
      }),
      signal: abortSignal
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (proxyErr) {
    // If backend is not reached, stream directly to OpenRouter API
    try {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Minimal Neumorphic AI Chatbot'
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: formattedMessages,
          stream: true
        }),
        signal: abortSignal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter API error ${response.status}: ${errText}`);
      }
    } catch (directErr) {
      if (directErr.name === 'AbortError') {
        return;
      }
      onError?.(directErr);
      return;
    }
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';
  let fullReasoning = '';
  let reasoningDetails = [];
  let usage = null;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep last incomplete fragment

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Skip keep-alive comments from OpenRouter (e.g. ": OPENROUTER PROCESSING")
        if (trimmed.startsWith(':')) {
          continue;
        }

        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6).trim();

          if (dataStr === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(dataStr);
            const choice = parsed.choices?.[0];
            const delta = choice?.delta;

            // Content streaming
            if (delta?.content) {
              fullContent += delta.content;
              onDelta?.(delta.content, fullContent);
            }

            // Reasoning tokens streaming
            if (delta?.reasoning) {
              fullReasoning += delta.reasoning;
              onReasoningDelta?.(delta.reasoning, fullReasoning);
            }

            if (delta?.reasoning_details) {
              reasoningDetails = delta.reasoning_details;
            }

            if (parsed.usage) {
              usage = parsed.usage;
            }
          } catch (jsonErr) {
            // Ignore partial JSON parse errors in stream
          }
        }
      }
    }

    onDone?.({
      content: fullContent,
      reasoning: fullReasoning,
      reasoning_details:
        reasoningDetails.length > 0
          ? reasoningDetails
          : fullReasoning
          ? [{ type: 'reasoning.text', text: fullReasoning, index: 0 }]
          : [],
      usage
    });
  } catch (streamErr) {
    if (streamErr.name === 'AbortError') {
      onDone?.({
        content: fullContent,
        reasoning: fullReasoning,
        reasoning_details: fullReasoning ? [{ type: 'reasoning.text', text: fullReasoning, index: 0 }] : [],
        usage
      });
      return;
    }
    onError?.(streamErr);
  }
}
