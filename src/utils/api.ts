
export interface ModelSettings {
  id: number;
  name: string;
  provider: string;
  apiKey: string;
  enabled: boolean;
  contextWindow: number;
  costPer1kTokens: string;
  supportsImages: boolean;
  apiEndpoint: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface ModelResponse {
  model: string;
  response: string;
  metrics: {
    time: number;
    tokens: number;
    cost: string;
  };
}

export const fetchModelResponse = async (
  prompt: string, 
  model: ModelSettings,
  parameters: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequency_penalty: number;
    presence_penalty: number;
  }
): Promise<ModelResponse> => {
  const startTime = Date.now();
  
  try {
    let body = {};
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${model.apiKey}`
    };
    
    // Adjust body based on provider
    if (model.provider === 'OpenAI') {
      body = {
        model: model.name,
        messages: [{ role: "user", content: prompt }],
        temperature: parameters.temperature,
        max_tokens: parameters.maxTokens,
        top_p: parameters.topP,
        frequency_penalty: parameters.frequency_penalty,
        presence_penalty: parameters.presence_penalty
      };
    } else if (model.provider === 'Anthropic') {
      body = {
        model: model.name,
        messages: [{ role: "user", content: prompt }],
        temperature: parameters.temperature,
        max_tokens: parameters.maxTokens,
        top_p: parameters.topP
      };
    } else {
      // Generic format for other providers
      body = {
        model: model.name,
        prompt: prompt,
        temperature: parameters.temperature,
        max_tokens: parameters.maxTokens,
        top_p: parameters.topP
      };
    }
    
    const response = await fetch(model.apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    
    // Process response based on provider
    let textResponse = '';
    let tokens = 0;
    
    if (model.provider === 'OpenAI') {
      textResponse = data.choices[0].message.content;
      tokens = data.usage?.total_tokens || 0;
    } else if (model.provider === 'Anthropic') {
      textResponse = data.content[0].text;
      tokens = data.usage?.total_tokens || 0;
    } else {
      // Generic extraction
      textResponse = data.choices?.[0]?.text || data.output || data.completion || 'No response content detected';
      tokens = data.usage?.total_tokens || 0;
    }

    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    
    // Calculate cost based on tokens and cost per 1k tokens
    const costPerToken = parseFloat(model.costPer1kTokens.replace('$', '')) / 1000;
    const estimatedCost = (tokens * costPerToken).toFixed(4);

    return {
      model: model.name,
      response: textResponse,
      metrics: {
        time: timeTaken, 
        tokens: tokens,
        cost: `$${estimatedCost}`
      }
    };
  } catch (error) {
    console.error(`Error with model ${model.name}:`, error);
    
    return {
      model: model.name,
      response: `Error: Could not get response from ${model.name}. ${error instanceof Error ? error.message : 'Unknown error occurred.'}`,
      metrics: {
        time: Date.now() - startTime,
        tokens: 0,
        cost: '$0.000'
      }
    };
  }
};
