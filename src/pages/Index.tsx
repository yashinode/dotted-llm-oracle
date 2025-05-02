
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import ModelSelector from '@/components/ModelSelector';
import ParameterControls from '@/components/ParameterControls';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

// Define initial models
const initialModels = [
  { id: 1, name: 'GPT-4o', selected: true },
  { id: 2, name: 'Claude 3 Opus', selected: false },
  { id: 3, name: 'GPT-4o-mini', selected: false },
  { id: 4, name: 'Llama 3', selected: false },
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
  const [results, setResults] = useState<null | any[]>(null);
  const { toast } = useToast();

  const handleModelToggle = (id: number) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, selected: !model.selected } : model
    ));
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

    setIsLoading(true);
    
    // Simulate API calls to the selected models
    try {
      // In a real implementation, these would be actual API calls
      const mockResults = await Promise.all(
        selectedModels.map(async (model) => {
          // Simulate different response times
          const delay = Math.random() * 2000 + 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return {
            model: model.name,
            response: `This is a simulated response from ${model.name} using the provided prompt. In a real implementation, this would be the actual response from the API.`,
            metrics: {
              time: delay,
              tokens: Math.floor(Math.random() * 500) + 100,
              cost: (Math.random() * 0.05).toFixed(4)
            }
          };
        })
      );
      
      setResults(mockResults);
      
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
                <CardTitle className="text-lg font-mono">Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Enter your prompt here..." 
                  className="min-h-[200px] font-mono text-sm focus:ring-nothing-blue resize-none border-dashed" 
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
                  {isLoading ? 'Testing...' : 'Test Prompt'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right column - Model selection and parameters */}
          <div>
            <Card className="bg-card border-dotted-custom rounded-md overflow-hidden shadow-sm mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-mono">Models</CardTitle>
              </CardHeader>
              <CardContent>
                <ModelSelector 
                  models={models} 
                  onToggleModel={handleModelToggle} 
                />
              </CardContent>
            </Card>
            
            <Card className="bg-card border-dotted-custom rounded-md overflow-hidden shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-mono">Parameters</CardTitle>
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
        
        {/* Results area */}
        {results && (
          <div className="mt-8 animate-fade-in">
            <h2 className="text-lg font-mono mb-4">Results</h2>
            <Tabs defaultValue={results[0]?.model} className="w-full">
              <TabsList className="mb-2">
                {results.map((result) => (
                  <TabsTrigger key={result.model} value={result.model} className="font-mono">
                    {result.model}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {results.map((result) => (
                <TabsContent key={result.model} value={result.model} className="border-dotted-custom rounded-md p-4">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-mono text-sm">{result.model}</h3>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Time: {(result.metrics.time / 1000).toFixed(2)}s</span>
                        <span>Tokens: {result.metrics.tokens}</span>
                        <span>Cost: ${result.metrics.cost}</span>
                      </div>
                    </div>
                    <Separator className="mb-4" />
                    <div className="bg-muted/50 p-4 rounded font-mono text-sm whitespace-pre-wrap">
                      {result.response}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline" className="font-mono text-sm mr-2">
                Save Results
              </Button>
              <Button className="bg-nothing-blue hover:bg-nothing-blue/90 text-white font-mono text-sm">
                Compare Details
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
