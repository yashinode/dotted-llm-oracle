
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
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
  const [editingModel, setEditingModel] = useState<null | typeof initialModels[0]>(null);
  const [newModel, setNewModel] = useState({
    name: '',
    provider: '',
    apiKey: '',
    apiEndpoint: '',
    contextWindow: 0,
    costPer1kTokens: '',
    supportsImages: false,
    enabled: true
  });
  const { toast } = useToast();

  const toggleModelEnabled = (id: number) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, enabled: !model.enabled } : model
    ));
  };

  const handleEditModel = (model: typeof initialModels[0]) => {
    setEditingModel({...model});
    // Switch to edit tab
    const tabsList = document.querySelector('[role="tablist"]');
    const editTab = tabsList?.querySelector('[value="add"]') as HTMLButtonElement | null;
    if (editTab) editTab.click();
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    if (editingModel) {
      setEditingModel({
        ...editingModel,
        [field]: value
      });
    } else {
      setNewModel({
        ...newModel,
        [field]: value
      });
    }
  };

  const handleAddOrUpdateModel = () => {
    if (editingModel) {
      // Update existing model
      setModels(models.map(model => 
        model.id === editingModel.id ? editingModel : model
      ));
      toast({
        title: "Model updated",
        description: `${editingModel.name} has been updated successfully.`
      });
      setEditingModel(null);
    } else {
      // Add new model
      const newId = Math.max(...models.map(model => model.id), 0) + 1;
      setModels([...models, { ...newModel, id: newId }]);
      toast({
        title: "Model added",
        description: `${newModel.name} has been added successfully.`
      });
    }
    
    // Reset form
    setNewModel({
      name: '',
      provider: '',
      apiKey: '',
      apiEndpoint: '',
      contextWindow: 0,
      costPer1kTokens: '',
      supportsImages: false,
      enabled: true
    });
  };

  const handleCancelEdit = () => {
    setEditingModel(null);
    // Switch back to configured tab
    const tabsList = document.querySelector('[role="tablist"]');
    const configuredTab = tabsList?.querySelector('[value="configured"]') as HTMLButtonElement | null;
    if (configuredTab) configuredTab.click();
  };

  return (
    <div className="flex flex-col min-h-screen bg-dotted-pattern">
      <Navbar />
      
      <main className="flex-1 container max-w-6xl py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Models</h1>
        </div>
        
        <Tabs defaultValue="configured" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="configured">Configured Models</TabsTrigger>
            <TabsTrigger value="add">{editingModel ? "Edit Model" : "Add Model"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configured">
            <Card className="border-dotted-custom bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Available Models</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/20">
                      <TableHead className="text-xs">Model</TableHead>
                      <TableHead className="text-xs">Provider</TableHead>
                      <TableHead className="text-xs">Context</TableHead>
                      <TableHead className="text-xs">Cost</TableHead>
                      <TableHead className="text-xs">Features</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => (
                      <TableRow key={model.id} className="hover:bg-muted/20">
                        <TableCell className="font-medium">{model.name}</TableCell>
                        <TableCell>{model.provider}</TableCell>
                        <TableCell className="text-xs">{model.contextWindow.toLocaleString()} tokens</TableCell>
                        <TableCell className="text-xs">{model.costPer1kTokens}/1K</TableCell>
                        <TableCell>
                          {model.supportsImages && (
                            <Badge variant="outline" className="text-[10px]">
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
                          <button 
                            className="text-xs text-nothing-blue hover:underline"
                            onClick={() => handleEditModel(model)}
                          >
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
                <CardTitle className="text-lg">{editingModel ? `Edit ${editingModel.name}` : "Add New Model"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model-name" className="text-sm">Model Name</Label>
                    <Input 
                      id="model-name" 
                      placeholder="e.g., GPT-4" 
                      value={editingModel ? editingModel.name : newModel.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="provider" className="text-sm">Provider</Label>
                    <Input 
                      id="provider" 
                      placeholder="e.g., OpenAI" 
                      value={editingModel ? editingModel.provider : newModel.provider}
                      onChange={(e) => handleInputChange('provider', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="context-window" className="text-sm">Context Window (tokens)</Label>
                    <Input 
                      id="context-window" 
                      placeholder="e.g., 8000" 
                      type="number"
                      value={editingModel ? editingModel.contextWindow : newModel.contextWindow}
                      onChange={(e) => handleInputChange('contextWindow', parseInt(e.target.value) || 0)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cost-per-1k" className="text-sm">Cost per 1K tokens</Label>
                    <Input 
                      id="cost-per-1k" 
                      placeholder="e.g., $0.005" 
                      value={editingModel ? editingModel.costPer1kTokens : newModel.costPer1kTokens}
                      onChange={(e) => handleInputChange('costPer1kTokens', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="api-key" className="text-sm">API Key</Label>
                    <Input 
                      id="api-key" 
                      placeholder="Enter API key" 
                      type="password"
                      value={editingModel ? (editingModel.apiKey.includes('•') ? '' : editingModel.apiKey) : newModel.apiKey}
                      onChange={(e) => handleInputChange('apiKey', e.target.value)}
                      className="text-sm"
                    />
                    {editingModel?.apiKey.includes('•') && (
                      <p className="text-xs text-muted-foreground mt-1">Leave empty to keep current API key</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="api-endpoint" className="text-sm">API Endpoint</Label>
                    <Input 
                      id="api-endpoint" 
                      placeholder="https://api.example.com/v1/completions" 
                      value={editingModel ? editingModel.apiEndpoint : newModel.apiEndpoint}
                      onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2 flex items-center gap-2">
                    <Switch 
                      id="supports-images"
                      checked={editingModel ? editingModel.supportsImages : newModel.supportsImages}
                      onCheckedChange={(checked) => handleInputChange('supportsImages', checked)}
                      className="data-[state=checked]:bg-nothing-blue"
                    />
                    <Label htmlFor="supports-images" className="text-sm">Supports image inputs</Label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  {editingModel && (
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      className="text-sm"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    onClick={handleAddOrUpdateModel}
                    className="bg-nothing-black hover:bg-nothing-black/90 text-white text-sm"
                  >
                    {editingModel ? "Save Changes" : "Add Model"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Models;
