
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CurlTemplateField from './CurlTemplateField';

interface Model {
  id: number;
  name: string;
  selected: boolean;
  provider?: string;
  apiKey?: string;
  apiEndpoint?: string;
  curlTemplate?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

interface ModelSelectorProps {
  models: Model[];
  onToggleModel: (id: number) => void;
  onUpdateModel: (id: number, updates: Partial<Model>) => void;
  onAddModel: (model: Omit<Model, 'id'>) => void;
}

const ModelSelector = ({ 
  models, 
  onToggleModel, 
  onUpdateModel,
  onAddModel
}: ModelSelectorProps) => {
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [currentEditModel, setCurrentEditModel] = useState<Model | null>(null);
  const [newModel, setNewModel] = useState({
    name: '',
    provider: '',
    apiKey: '',
    apiEndpoint: '',
    curlTemplate: '',
    selected: true,
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  });
  const [activeTab, setActiveTab] = useState('basic');

  const handleEditModel = (model: Model) => {
    setCurrentEditModel(model);
    setIsEditModelOpen(true);
  };

  const handleSaveEdit = () => {
    if (currentEditModel) {
      onUpdateModel(currentEditModel.id, currentEditModel);
      setIsEditModelOpen(false);
      setCurrentEditModel(null);
    }
  };

  const handleAddNewModel = () => {
    onAddModel(newModel);
    setNewModel({
      name: '',
      provider: '',
      apiKey: '',
      apiEndpoint: '',
      curlTemplate: '',
      selected: true,
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    });
    setIsAddModelOpen(false);
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
    "top_p": {{topP}},
    "frequency_penalty": {{frequency_penalty}},
    "presence_penalty": {{presence_penalty}}
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
    "max_tokens": {{maxTokens}},
    "top_p": {{topP}}
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
    "top_p": {{topP}},
    "frequency_penalty": {{frequency_penalty}},
    "presence_penalty": {{presence_penalty}}
  }'`;
  };

  return (
    <div className="space-y-2">
      {models.map((model) => (
        <div key={model.id} className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`model-${model.id}`}
              checked={model.selected}
              onCheckedChange={() => onToggleModel(model.id)}
              className="data-[state=checked]:bg-[#1A1F2C] data-[state=checked]:border-[#1A1F2C]"
            />
            <Label 
              htmlFor={`model-${model.id}`}
              className="text-sm cursor-pointer"
            >
              {model.name}
            </Label>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditModel(model)}
            className="h-6 px-2 text-xs hover:bg-[#F1F1F1]"
          >
            Edit
          </Button>
        </div>
      ))}
      
      <Dialog open={isAddModelOpen} onOpenChange={setIsAddModelOpen}>
        <DialogTrigger asChild>
          <button className="w-full mt-2 text-xs text-[#1A1F2C] border border-solid border-[#ccc] rounded p-1 hover:bg-[#F1F1F1] transition-colors">
            + Add custom model
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Add New Model</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 bg-[#eee] text-[#333]">
              <TabsTrigger value="basic" className="data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-white">Basic Settings</TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-white">API Template</TabsTrigger>
              <TabsTrigger value="params" className="data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-white">Parameters</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="new-model-name">Model Name</Label>
                  <Input 
                    id="new-model-name" 
                    value={newModel.name}
                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                    placeholder="e.g., GPT-4o"
                    className="border-solid border-[#ccc]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-provider">Provider</Label>
                  <Input 
                    id="new-provider" 
                    value={newModel.provider}
                    onChange={(e) => {
                      const provider = e.target.value;
                      setNewModel({ 
                        ...newModel, 
                        provider,
                        curlTemplate: getDefaultCurlTemplate(provider) 
                      });
                    }}
                    placeholder="e.g., OpenAI"
                    className="border-solid border-[#ccc]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-api-key">API Key</Label>
                  <Input 
                    id="new-api-key" 
                    value={newModel.apiKey}
                    onChange={(e) => setNewModel({ ...newModel, apiKey: e.target.value })}
                    placeholder="Enter API key"
                    type="password"
                    className="border-solid border-[#ccc]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-api-endpoint">API Endpoint</Label>
                  <Input 
                    id="new-api-endpoint" 
                    value={newModel.apiEndpoint}
                    onChange={(e) => setNewModel({ ...newModel, apiEndpoint: e.target.value })}
                    placeholder="https://api.example.com/v1/completions"
                    className="border-solid border-[#ccc]"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced">
              <CurlTemplateField 
                value={newModel.curlTemplate || ''} 
                onChange={(value) => setNewModel({ ...newModel, curlTemplate: value })}
                onReset={() => {
                  setNewModel({ 
                    ...newModel, 
                    curlTemplate: getDefaultCurlTemplate(newModel.provider || '')
                  });
                }}
              />
            </TabsContent>
            
            <TabsContent value="params">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-temperature" className="text-sm">Temperature</Label>
                  <Input 
                    id="new-temperature" 
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={newModel.temperature}
                    onChange={(e) => setNewModel({ ...newModel, temperature: parseFloat(e.target.value) || 0 })}
                    className="text-sm border-solid border-[#ccc]"
                  />
                  <p className="text-xs text-[#8E9196]">Controls randomness (0-2)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-max-tokens" className="text-sm">Max Tokens</Label>
                  <Input 
                    id="new-max-tokens" 
                    type="number"
                    min="1"
                    value={newModel.maxTokens}
                    onChange={(e) => setNewModel({ ...newModel, maxTokens: parseInt(e.target.value) || 1 })}
                    className="text-sm border-solid border-[#ccc]"
                  />
                  <p className="text-xs text-[#8E9196]">Maximum length of generated text</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-top-p" className="text-sm">Top P</Label>
                  <Input 
                    id="new-top-p" 
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={newModel.topP}
                    onChange={(e) => setNewModel({ ...newModel, topP: parseFloat(e.target.value) || 0 })}
                    className="text-sm border-solid border-[#ccc]"
                  />
                  <p className="text-xs text-[#8E9196]">Nucleus sampling (0-1)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-frequency-penalty" className="text-sm">Frequency Penalty</Label>
                  <Input 
                    id="new-frequency-penalty" 
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={newModel.frequencyPenalty}
                    onChange={(e) => setNewModel({ ...newModel, frequencyPenalty: parseFloat(e.target.value) || 0 })}
                    className="text-sm border-solid border-[#ccc]"
                  />
                  <p className="text-xs text-[#8E9196]">Reduces repetition (0-2)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-presence-penalty" className="text-sm">Presence Penalty</Label>
                  <Input 
                    id="new-presence-penalty" 
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={newModel.presencePenalty}
                    onChange={(e) => setNewModel({ ...newModel, presencePenalty: parseFloat(e.target.value) || 0 })}
                    className="text-sm border-solid border-[#ccc]"
                  />
                  <p className="text-xs text-[#8E9196]">Encourages new topics (0-2)</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={handleAddNewModel} className="bg-[#1A1F2C] hover:bg-[#1A1F2C]/90 text-white w-full">Add Model</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModelOpen} onOpenChange={setIsEditModelOpen}>
        {currentEditModel && (
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Edit Model: {currentEditModel.name}</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4 bg-[#eee] text-[#333]">
                <TabsTrigger value="basic" className="data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-white">Basic Settings</TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-white">API Template</TabsTrigger>
                <TabsTrigger value="params" className="data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-white">Parameters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-model-name">Model Name</Label>
                    <Input 
                      id="edit-model-name" 
                      value={currentEditModel.name}
                      onChange={(e) => setCurrentEditModel({ 
                        ...currentEditModel, 
                        name: e.target.value 
                      })}
                      className="border-solid border-[#ccc]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-provider">Provider</Label>
                    <Input 
                      id="edit-provider" 
                      value={currentEditModel.provider || ''}
                      onChange={(e) => {
                        const provider = e.target.value;
                        setCurrentEditModel({ 
                          ...currentEditModel, 
                          provider,
                          curlTemplate: !currentEditModel.curlTemplate ? 
                            getDefaultCurlTemplate(provider) : 
                            currentEditModel.curlTemplate 
                        });
                      }}
                      className="border-solid border-[#ccc]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-api-key">API Key</Label>
                    <Input 
                      id="edit-api-key" 
                      value={currentEditModel.apiKey || ''}
                      onChange={(e) => setCurrentEditModel({ 
                        ...currentEditModel, 
                        apiKey: e.target.value 
                      })}
                      type="password"
                      className="border-solid border-[#ccc]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-api-endpoint">API Endpoint</Label>
                    <Input 
                      id="edit-api-endpoint" 
                      value={currentEditModel.apiEndpoint || ''}
                      onChange={(e) => setCurrentEditModel({ 
                        ...currentEditModel, 
                        apiEndpoint: e.target.value 
                      })}
                      className="border-solid border-[#ccc]"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced">
                <CurlTemplateField 
                  value={currentEditModel.curlTemplate || ''} 
                  onChange={(value) => setCurrentEditModel({ 
                    ...currentEditModel, 
                    curlTemplate: value 
                  })}
                  onReset={() => {
                    setCurrentEditModel({ 
                      ...currentEditModel, 
                      curlTemplate: getDefaultCurlTemplate(currentEditModel.provider || '')
                    });
                  }}
                />
              </TabsContent>
              
              <TabsContent value="params">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-temperature" className="text-sm">Temperature</Label>
                    <Input 
                      id="edit-temperature" 
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={currentEditModel.temperature || 0.7}
                      onChange={(e) => setCurrentEditModel({ 
                        ...currentEditModel, 
                        temperature: parseFloat(e.target.value) || 0 
                      })}
                      className="text-sm border-solid border-[#ccc]"
                    />
                    <p className="text-xs text-[#8E9196]">Controls randomness (0-2)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-max-tokens" className="text-sm">Max Tokens</Label>
                    <Input 
                      id="edit-max-tokens" 
                      type="number"
                      min="1"
                      value={currentEditModel.maxTokens || 1000}
                      onChange={(e) => setCurrentEditModel({ 
                        ...currentEditModel, 
                        maxTokens: parseInt(e.target.value) || 1 
                      })}
                      className="text-sm border-solid border-[#ccc]"
                    />
                    <p className="text-xs text-[#8E9196]">Maximum length of generated text</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-top-p" className="text-sm">Top P</Label>
                    <Input 
                      id="edit-top-p" 
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={currentEditModel.topP || 1}
                      onChange={(e) => setCurrentEditModel({ 
                        ...currentEditModel, 
                        topP: parseFloat(e.target.value) || 0 
                      })}
                      className="text-sm border-solid border-[#ccc]"
                    />
                    <p className="text-xs text-[#8E9196]">Nucleus sampling (0-1)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-frequency-penalty" className="text-sm">Frequency Penalty</Label>
                    <Input 
                      id="edit-frequency-penalty" 
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={currentEditModel.frequencyPenalty || 0}
                      onChange={(e) => setCurrentEditModel({ 
                        ...currentEditModel, 
                        frequencyPenalty: parseFloat(e.target.value) || 0 
                      })}
                      className="text-sm border-solid border-[#ccc]"
                    />
                    <p className="text-xs text-[#8E9196]">Reduces repetition (0-2)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-presence-penalty" className="text-sm">Presence Penalty</Label>
                    <Input 
                      id="edit-presence-penalty" 
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={currentEditModel.presencePenalty || 0}
                      onChange={(e) => setCurrentEditModel({ 
                        ...currentEditModel, 
                        presencePenalty: parseFloat(e.target.value) || 0 
                      })}
                      className="text-sm border-solid border-[#ccc]"
                    />
                    <p className="text-xs text-[#8E9196]">Encourages new topics (0-2)</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModelOpen(false)}
                className="border-solid border-[#ccc]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveEdit}
                className="bg-[#1A1F2C] hover:bg-[#1A1F2C]/90 text-white"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ModelSelector;
