
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import ModelSelector from '@/components/ModelSelector';
import ParameterControls from '@/components/ParameterControls';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import ModelComparison from '@/components/ModelComparison';
import { fetchModelResponse, ModelResponse } from '@/utils/api';
import { Loader2 } from 'lucide-react';

// Define initial models with more details
const initialModels = [
  { 
    id: 1, 
    name: 'GPT-4o',
    provider: 'OpenAI',
    apiKey: '',
    selected: true,
    apiEndpoint: 'https://api.openai.com/v1/chat/completions'
  },
  { 
    id: 2, 
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    apiKey: '',
    selected: false,
    apiEndpoint: 'https://api.anthropic.com/v1/messages'
  },
  { 
    id: 3, 
    name: 'GPT-4o-mini',
    provider: 'OpenAI',
    apiKey: '',
    selected: false,
    apiEndpoint: 'https://api.openai.com/v1/chat/completions'
  },
  { 
    id: 4, 
    name: 'Llama 3',
    provider: 'Meta',
    apiKey: '',
    selected: false,
    apiEndpoint: 'https://api.together.xyz/v1/completions'
  },
];

// Define initial parameters
const initialParams = {
  temperature: 0.7,
  maxTokens: 1000,
  topP: 1,
  frequency_penalty: 0,
  presence_penalty: 0
};

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [models, setModels] = useState(initialModels);
  const [parameters, setParameters] = useState(initialParams);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<null | ModelResponse[]>(null);
  const [processingModels, setProcessingModels] = useState<number[]>([]);
  const { toast } = useToast();

  const handleModelToggle = (id: number) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, selected: !model.selected } : model
    ));
  };

  const handleUpdateModel = (id: number, updates: Partial<typeof models[0]>) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, ...updates } : model
    ));
  };

  const handleAddModel = (model: Omit<typeof models[0], 'id'>) => {
    const newId = Math.max(...models.map(m => m.id), 0) + 1;
    setModels([...models, { ...model, id: newId }]);
  };

  const handleParameterChange = (param: string, value: number) => {
    setParameters({
      ...parameters,
      [param]: value
    });
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to test.",
        variant: "destructive"
      });
      return;
    }

    const selectedModels = models.filter(model => model.selected);
    if (selectedModels.length === 0) {
      toast({
        title: "No models selected",
        description: "Please select at least one model to test.",
        variant: "destructive"
      });
      return;
    }

    // Check if API keys are provided for selected models
    const missingKeys = selectedModels.filter(model => !model.apiKey);
    if (missingKeys.length > 0) {
      toast({
        title: "Missing API keys",
        description: `Please provide API keys for: ${missingKeys.map(m => m.name).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResults(null);
    
    try {
      // Process models concurrently but track individually
      const allResults: ModelResponse[] = [];
      
      await Promise.all(selectedModels.map(async (model) => {
        setProcessingModels(prev => [...prev, model.id]);
        
        try {
          const result = await fetchModelResponse(prompt, {
            ...model,
            contextWindow: 0,
            costPer1kTokens: '$0.005', // Default estimation
            supportsImages: false,
            enabled: true
          }, parameters);
          
          allResults.push(result);
        } catch (error) {
          console.error(`Error with ${model.name}:`, error);
          allResults.push({
            model: model.name,
            response: `Error: Could not get response from ${model.name}. Please check API key and endpoint.`,
            metrics: { time: 0, tokens: 0, cost: '$0.00' }
          });
        } finally {
          setProcessingModels(prev => prev.filter(id => id !== model.id));
        }
      }));
      
      setResults(allResults);
      
      toast({
        title: "Test completed",
        description: `Tested ${selectedModels.length} models successfully.`
      });
    } catch (error) {
      toast({
        title: "Error testing models",
        description: "There was an error testing the selected models.",
        variant: "destructive"
      });
      console.error("Error testing models:", error);
    } finally {
      setIsLoading(false);
      setProcessingModels([]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dotted-pattern">
      <Navbar />
      
      <main className="flex-1 container max-w-6xl py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Prompt input */}
          <div className="md:col-span-2">
            <Card className="bg-card border-dotted-custom rounded-md overflow-hidden shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Enter your prompt here..." 
                  className="min-h-[200px] text-sm focus:ring-nothing-blue resize-none border-dashed" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button 
                  onClick={handleSubmit}
                  className="bg-nothing-black hover:bg-nothing-black/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Testing...
                    </span>
                  ) : 'Test Prompt'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right column - Model selection and parameters */}
          <div>
            <Card className="bg-card border-dotted-custom rounded-md overflow-hidden shadow-sm mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Models</CardTitle>
              </CardHeader>
              <CardContent>
                <ModelSelector 
                  models={models} 
                  onToggleModel={handleModelToggle}
                  onUpdateModel={handleUpdateModel}
                  onAddModel={handleAddModel}
                />
              </CardContent>
            </Card>
            
            <Card className="bg-card border-dotted-custom rounded-md overflow-hidden shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <ParameterControls 
                  parameters={parameters}
                  onChange={handleParameterChange}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Processing indicators */}
        {processingModels.length > 0 && (
          <div className="mt-8 animate-pulse">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Processing {processingModels.length} model(s)...</p>
            </div>
          </div>
        )}
        
        {/* Results area with side-by-side comparison */}
        {results && results.length > 0 && (
          <ModelComparison results={results} />
        )}
      </main>
    </div>
  );
};

export default Index;
