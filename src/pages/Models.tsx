
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
import CurlTemplateField from '@/components/CurlTemplateField';

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
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    curlTemplate: `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer {{apiKey}}" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "{{prompt}}"
      }
    ],
    "temperature": {{temperature}},
    "max_tokens": {{maxTokens}},
    "top_p": {{topP}}
  }'`
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
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    curlTemplate: `curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: {{apiKey}}" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "claude-3-opus-20240229",
    "messages": [
      {
        "role": "user",
        "content": "{{prompt}}"
      }
    ],
    "temperature": {{temperature}},
    "max_tokens": {{maxTokens}}
  }'`
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
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    curlTemplate: `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer {{apiKey}}" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": "{{prompt}}"
      }
    ],
    "temperature": {{temperature}},
    "max_tokens": {{maxTokens}},
    "top_p": {{topP}}
  }'`
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
    apiEndpoint: 'https://api.together.xyz/v1/completions',
    curlTemplate: `curl https://api.together.xyz/v1/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer {{apiKey}}" \\
  -d '{
    "model": "meta-llama/Llama-3-8b-chat",
    "prompt": "{{prompt}}",
    "temperature": {{temperature}},
    "max_tokens": {{maxTokens}},
    "top_p": {{topP}}
  }'`
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
    enabled: true,
    curlTemplate: '',
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  });
  const [activeTab, setActiveTab] = useState('configured');
  const [editTab, setEditTab] = useState('basic');
  const { toast } = useToast();

  const toggleModelEnabled = (id: number) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, enabled: !model.enabled } : model
    ));
  };

  const handleEditModel = (model: typeof initialModels[0]) => {
    setEditingModel({...model});
    // Switch to edit tab
    setActiveTab('add');
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

  const getDefaultCurlTemplate = (provider: string) => {
    if (provider === 'OpenAI') {
      return `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer {{apiKey}}" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "{{prompt}}"
      }
    ],
    "temperature": {{temperature}},
    "max_tokens": {{maxTokens}},
    "top_p": {{topP}}
  }'`;
    } else if (provider === 'Anthropic') {
      return `curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: {{apiKey}}" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "claude-3-opus-20240229",
    "messages": [
      {
        "role": "user",
        "content": "{{prompt}}"
      }
    ],
    "temperature": {{temperature}},
    "max_tokens": {{maxTokens}}
  }'`;
    }
    return `curl {{apiEndpoint}} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer {{apiKey}}" \\
  -d '{
    "model": "{{modelName}}",
    "prompt": "{{prompt}}",
    "temperature": {{temperature}},
    "max_tokens": {{maxTokens}},
    "top_p": {{topP}}
  }'`;
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
      enabled: true,
      curlTemplate: ''
    });
    
    // Switch back to configured tab
    setActiveTab('configured');
  };

  const handleCancelEdit = () => {
    setEditingModel(null);
    setActiveTab('configured');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F6F7]">
      <Navbar />
      
      <main className="flex-1 container max-w-6xl py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-[#1A1F2C]">Models</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 bg-[#eee] text-[#333]">
            <TabsTrigger value="configured" className="data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-white">Configured Models</TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-white">{editingModel ? "Edit Model" : "Add Model"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configured">
            <Card className="border border-solid border-[#ccc] bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#1A1F2C]">Available Models</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-[#F1F1F1]">
                      <TableHead className="text-xs text-[#8E9196]">Model</TableHead>
                      <TableHead className="text-xs text-[#8E9196]">Provider</TableHead>
                      <TableHead className="text-xs text-[#8E9196]">Context</TableHead>
                      <TableHead className="text-xs text-[#8E9196]">Cost</TableHead>
                      <TableHead className="text-xs text-[#8E9196]">Features</TableHead>
                      <TableHead className="text-xs text-[#8E9196]">Status</TableHead>
                      <TableHead className="text-xs w-[100px] text-[#8E9196]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => (
                      <TableRow key={model.id} className="hover:bg-[#F1F1F1]">
                        <TableCell className="font-medium">{model.name}</TableCell>
                        <TableCell>{model.provider}</TableCell>
                        <TableCell className="text-xs">{model.contextWindow.toLocaleString()} tokens</TableCell>
                        <TableCell className="text-xs">{model.costPer1kTokens}/1K</TableCell>
                        <TableCell>
                          {model.supportsImages && (
                            <Badge variant="outline" className="text-[10px] border-[#1A1F2C] text-[#1A1F2C]">
                              Images
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={model.enabled}
                              onCheckedChange={() => toggleModelEnabled(model.id)}
                              className="data-[state=checked]:bg-[#1A1F2C]"
                            />
                            <span className="text-xs">{model.enabled ? 'Active' : 'Inactive'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <button 
                            className="text-xs text-[#1A1F2C] hover:underline"
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
            <Card className="border border-solid border-[#ccc] bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#1A1F2C]">{editingModel ? `Edit ${editingModel.name}` : "Add New Model"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={editTab} onValueChange={setEditTab} className="w-full">
                  <TabsList className="mb-4 bg-[#eee] text-[#333]">
                    <TabsTrigger value="basic" className="data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-white">Basic Settings</TabsTrigger>
                    <TabsTrigger value="advanced" className="data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-white">API Template</TabsTrigger>
                    <TabsTrigger value="params" className="data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-white">Parameters</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="model-name" className="text-sm">Model Name</Label>
                        <Input 
                          id="model-name" 
                          placeholder="e.g., GPT-4" 
                          value={editingModel ? editingModel.name : newModel.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="text-sm border-solid border-[#ccc]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="provider" className="text-sm">Provider</Label>
                        <Input 
                          id="provider" 
                          placeholder="e.g., OpenAI" 
                          value={editingModel ? editingModel.provider : newModel.provider}
                          onChange={(e) => {
                            const provider = e.target.value;
                            if (editingModel) {
                              setEditingModel({
                                ...editingModel,
                                provider,
                                curlTemplate: !editingModel.curlTemplate ? 
                                  getDefaultCurlTemplate(provider) : 
                                  editingModel.curlTemplate
                              });
                            } else {
                              setNewModel({
                                ...newModel,
                                provider,
                                curlTemplate: !newModel.curlTemplate ? 
                                  getDefaultCurlTemplate(provider) : 
                                  newModel.curlTemplate
                              });
                            }
                          }}
                          className="text-sm border-solid border-[#ccc]"
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
                          className="text-sm border-solid border-[#ccc]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cost-per-1k" className="text-sm">Cost per 1K tokens</Label>
                        <Input 
                          id="cost-per-1k" 
                          placeholder="e.g., $0.005" 
                          value={editingModel ? editingModel.costPer1kTokens : newModel.costPer1kTokens}
                          onChange={(e) => handleInputChange('costPer1kTokens', e.target.value)}
                          className="text-sm border-solid border-[#ccc]"
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
                          className="text-sm border-solid border-[#ccc]"
                        />
                        {editingModel?.apiKey.includes('•') && (
                          <p className="text-xs text-[#8E9196] mt-1">Leave empty to keep current API key</p>
                        )}
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="api-endpoint" className="text-sm">API Endpoint</Label>
                        <Input 
                          id="api-endpoint" 
                          placeholder="https://api.example.com/v1/completions" 
                          value={editingModel ? editingModel.apiEndpoint : newModel.apiEndpoint}
                          onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
                          className="text-sm border-solid border-[#ccc]"
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2 flex items-center gap-2">
                        <Switch 
                          id="supports-images"
                          checked={editingModel ? editingModel.supportsImages : newModel.supportsImages}
                          onCheckedChange={(checked) => handleInputChange('supportsImages', checked)}
                          className="data-[state=checked]:bg-[#1A1F2C]"
                        />
                        <Label htmlFor="supports-images" className="text-sm">Supports image inputs</Label>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced">
                    <CurlTemplateField 
                      value={editingModel ? editingModel.curlTemplate || '' : newModel.curlTemplate || ''} 
                      onChange={(value) => {
                        if (editingModel) {
                          setEditingModel({
                            ...editingModel,
                            curlTemplate: value
                          });
                        } else {
                          setNewModel({
                            ...newModel,
                            curlTemplate: value
                          });
                        }
                      }}
                      onReset={() => {
                        const provider = editingModel ? editingModel.provider : newModel.provider;
                        if (editingModel) {
                          setEditingModel({
                            ...editingModel,
                            curlTemplate: getDefaultCurlTemplate(provider)
                          });
                        } else {
                          setNewModel({
                            ...newModel,
                            curlTemplate: getDefaultCurlTemplate(provider)
                          });
                        }
                      }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="params">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="temperature" className="text-sm">Temperature</Label>
                        <Input 
                          id="temperature" 
                          type="number"
                          step="0.1"
                          min="0"
                          max="2"
                          value={editingModel ? editingModel.temperature || 0.7 : newModel.temperature}
                          onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                          className="text-sm border-solid border-[#ccc]"
                        />
                        <p className="text-xs text-[#8E9196]">Controls randomness (0-2)</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="max-tokens" className="text-sm">Max Tokens</Label>
                        <Input 
                          id="max-tokens" 
                          type="number"
                          min="1"
                          value={editingModel ? editingModel.maxTokens || 1000 : newModel.maxTokens}
                          onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value) || 1)}
                          className="text-sm border-solid border-[#ccc]"
                        />
                        <p className="text-xs text-[#8E9196]">Maximum length of generated text</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="top-p" className="text-sm">Top P</Label>
                        <Input 
                          id="top-p" 
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={editingModel ? editingModel.topP || 1 : newModel.topP}
                          onChange={(e) => handleInputChange('topP', parseFloat(e.target.value) || 0)}
                          className="text-sm border-solid border-[#ccc]"
                        />
                        <p className="text-xs text-[#8E9196]">Nucleus sampling (0-1)</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="frequency-penalty" className="text-sm">Frequency Penalty</Label>
                        <Input 
                          id="frequency-penalty" 
                          type="number"
                          step="0.1"
                          min="0"
                          max="2"
                          value={editingModel ? editingModel.frequencyPenalty || 0 : newModel.frequencyPenalty}
                          onChange={(e) => handleInputChange('frequencyPenalty', parseFloat(e.target.value) || 0)}
                          className="text-sm border-solid border-[#ccc]"
                        />
                        <p className="text-xs text-[#8E9196]">Reduces repetition (0-2)</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="presence-penalty" className="text-sm">Presence Penalty</Label>
                        <Input 
                          id="presence-penalty" 
                          type="number"
                          step="0.1"
                          min="0"
                          max="2"
                          value={editingModel ? editingModel.presencePenalty || 0 : newModel.presencePenalty}
                          onChange={(e) => handleInputChange('presencePenalty', parseFloat(e.target.value) || 0)}
                          className="text-sm border-solid border-[#ccc]"
                        />
                        <p className="text-xs text-[#8E9196]">Encourages new topics (0-2)</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end gap-2 mt-6">
                  {editingModel && (
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      className="text-sm border-solid border-[#ccc]"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    onClick={handleAddOrUpdateModel}
                    className="bg-[#1A1F2C] hover:bg-[#1A1F2C]/90 text-white text-sm"
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
