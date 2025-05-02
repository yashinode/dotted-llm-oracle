
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
  curlTemplate?: string;
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
    
    // Check if we have a custom CURL template
    if (model.curlTemplate) {
      // Parse the CURL template to extract headers and body
      try {
        const templateParts = parseCurlTemplate(model.curlTemplate, prompt, parameters);
        headers = { ...headers, ...templateParts.headers };
        body = templateParts.body;
      } catch (error) {
        console.error("Error parsing CURL template:", error);
        // Fall back to standard approach if CURL parsing fails
      }
    } else {
      // Standard provider-specific body formats
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
          top_p: parameters.topP,
          frequency_penalty: parameters.frequency_penalty,
          presence_penalty: parameters.presence_penalty
        };
      }
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
    
    // Process response based on provider or CURL template
    let textResponse = '';
    let tokens = 0;
    
    // Extract response text based on provider or try to extract from common patterns
    if (model.provider === 'OpenAI') {
      textResponse = data.choices[0].message.content;
      tokens = data.usage?.total_tokens || 0;
    } else if (model.provider === 'Anthropic') {
      textResponse = data.content[0].text;
      tokens = data.usage?.total_tokens || 0;
    } else {
      // Try to extract from common response patterns
      textResponse = extractResponseText(data);
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

// Helper function to parse CURL template and replace variables
function parseCurlTemplate(
  curlTemplate: string, 
  prompt: string,
  parameters: any
): { headers: Record<string, string>, body: any } {
  const headers: Record<string, string> = {};
  let body: any = {};
  
  try {
    // Extract the body from between curly braces
    const bodyMatch = curlTemplate.match(/-d\s+'?({.*?})'?\s/s);
    if (bodyMatch && bodyMatch[1]) {
      let bodyStr = bodyMatch[1].replace(/'/g, '"')
        .replace(/{{prompt}}/g, prompt)
        .replace(/{{temperature}}/g, parameters.temperature.toString())
        .replace(/{{maxTokens}}/g, parameters.maxTokens.toString())
        .replace(/{{topP}}/g, parameters.topP.toString())
        .replace(/{{frequency_penalty}}/g, parameters.frequency_penalty?.toString() || '0')
        .replace(/{{presence_penalty}}/g, parameters.presence_penalty?.toString() || '0');
        
      // Parse the body JSON
      body = JSON.parse(bodyStr);
    }
    
    // Extract headers from -H parameters
    const headerMatches = curlTemplate.matchAll(/-H\s+"([^"]+)"/g);
    for (const match of headerMatches) {
      if (match[1] && match[1].includes(':')) {
        const [key, ...valueParts] = match[1].split(':');
        const value = valueParts.join(':').trim();
        headers[key.trim()] = value.replace(/{{apiKey}}/g, parameters.apiKey);
      }
    }
    
    return { headers, body };
  } catch (error) {
    console.error("Error parsing CURL template:", error);
    return { headers: {}, body: {} };
  }
}

// Helper function to extract response text from various API formats
function extractResponseText(data: any): string {
  // Try various common response patterns
  if (data.choices && data.choices[0]) {
    if (data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content;
    }
    if (data.choices[0].text) {
      return data.choices[0].text;
    }
  }
  
  if (data.content && Array.isArray(data.content) && data.content[0]) {
    if (typeof data.content[0] === 'string') {
      return data.content[0];
    }
    if (data.content[0].text) {
      return data.content[0].text;
    }
  }
  
  if (data.output) {
    return data.output;
  }
  
  if (data.completion) {
    return data.completion;
  }
  
  if (data.text) {
    return data.text;
  }
  
  if (data.response) {
    return data.response;
  }
  
  return 'No response content detected';
}
