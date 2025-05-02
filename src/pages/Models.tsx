
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';

// Define initial models with more details
const initialModels = [
  { 
    id: 1, 
    name: 'GPT-4o',
    provider: 'OpenAI',
    apiKey: '••••••••••••••••••••••••••••••',
    enabled: true,
    contextWindow: 128000,
    costPer1kTokens: '$0.005',
    supportsImages: true,
    apiEndpoint: 'https://api.openai.com/v1/chat/completions'
  },
  { 
    id: 2, 
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    apiKey: '••••••••••••••••••••••••',
    enabled: true,
    contextWindow: 200000,
    costPer1kTokens: '$0.008',
    supportsImages: true,
    apiEndpoint: 'https://api.anthropic.com/v1/messages'
  },
  { 
    id: 3, 
    name: 'GPT-4o-mini',
    provider: 'OpenAI',
    apiKey: '••••••••••••••••••••••••••••••',
    enabled: true,
    contextWindow: 128000,
    costPer1kTokens: '$0.001',
    supportsImages: true,
    apiEndpoint: 'https://api.openai.com/v1/chat/completions'
  },
  { 
    id: 4, 
    name: 'Llama 3',
    provider: 'Meta',
    apiKey: '•••••••••••••••••••••',
    enabled: false,
    contextWindow: 8000,
    costPer1kTokens: '$0.0005',
    supportsImages: false,
    apiEndpoint: 'https://api.together.xyz/v1/completions'
  },
];

const Models = () => {
  const [models, setModels] = useState(initialModels);
  const [newModel, setNewModel] = useState({
    name: '',
    provider: '',
    apiKey: '',
    apiEndpoint: ''
  });

  const toggleModelEnabled = (id: number) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, enabled: !model.enabled } : model
    ));
  };

  const handleInputChange = (field: string, value: string) => {
    setNewModel({
      ...newModel,
      [field]: value
    });
  };

  const handleAddModel = () => {
    // In a real app, we would validate and save the new model
    console.log("Adding new model:", newModel);
    // Reset form
    setNewModel({
      name: '',
      provider: '',
      apiKey: '',
      apiEndpoint: ''
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-dotted-pattern">
      <Navbar />
      
      <main className="flex-1 container max-w-6xl py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-mono font-medium">Models</h1>
        </div>
        
        <Tabs defaultValue="configured" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="configured" className="font-mono">Configured Models</TabsTrigger>
            <TabsTrigger value="add" className="font-mono">Add Model</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configured">
            <Card className="border-dotted-custom bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-mono">Available Models</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/20">
                      <TableHead className="font-mono text-xs">Model</TableHead>
                      <TableHead className="font-mono text-xs">Provider</TableHead>
                      <TableHead className="font-mono text-xs">Context</TableHead>
                      <TableHead className="font-mono text-xs">Cost</TableHead>
                      <TableHead className="font-mono text-xs">Features</TableHead>
                      <TableHead className="font-mono text-xs">Status</TableHead>
                      <TableHead className="font-mono text-xs w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => (
                      <TableRow key={model.id} className="hover:bg-muted/20">
                        <TableCell className="font-medium">{model.name}</TableCell>
                        <TableCell>{model.provider}</TableCell>
                        <TableCell className="font-mono text-xs">{model.contextWindow.toLocaleString()} tokens</TableCell>
                        <TableCell className="font-mono text-xs">{model.costPer1kTokens}/1K</TableCell>
                        <TableCell>
                          {model.supportsImages && (
                            <Badge variant="outline" className="font-mono text-[10px]">
                              Images
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={model.enabled}
                              onCheckedChange={() => toggleModelEnabled(model.id)}
                              className="data-[state=checked]:bg-nothing-blue"
                            />
                            <span className="text-xs">{model.enabled ? 'Active' : 'Inactive'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <button className="text-xs text-nothing-blue hover:underline font-mono">
                            Edit
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add">
            <Card className="border-dotted-custom bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-mono">Add New Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model-name" className="text-sm font-mono">Model Name</Label>
                    <Input 
                      id="model-name" 
                      placeholder="e.g., GPT-4" 
                      value={newModel.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="provider" className="text-sm font-mono">Provider</Label>
                    <Input 
                      id="provider" 
                      placeholder="e.g., OpenAI" 
                      value={newModel.provider}
                      onChange={(e) => handleInputChange('provider', e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="api-key" className="text-sm font-mono">API Key</Label>
                    <Input 
                      id="api-key" 
                      placeholder="Enter API key" 
                      type="password"
                      value={newModel.apiKey}
                      onChange={(e) => handleInputChange('apiKey', e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="api-endpoint" className="text-sm font-mono">API Endpoint</Label>
                    <Input 
                      id="api-endpoint" 
                      placeholder="https://api.example.com/v1/completions" 
                      value={newModel.apiEndpoint}
                      onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddModel}
                  className="bg-nothing-black hover:bg-nothing-black/90 text-white mt-6 font-mono text-sm"
                >
                  Add Model
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Models;
