
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
    selected: true
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
      selected: true
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

  return (
    <div className="space-y-2">
      {models.map((model) => (
        <div key={model.id} className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`model-${model.id}`}
              checked={model.selected}
              onCheckedChange={() => onToggleModel(model.id)}
              className="data-[state=checked]:bg-nothing-black data-[state=checked]:border-nothing-black"
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
            className="h-6 px-2 text-xs"
          >
            Edit
          </Button>
        </div>
      ))}
      
      <Dialog open={isAddModelOpen} onOpenChange={setIsAddModelOpen}>
        <DialogTrigger asChild>
          <button className="w-full mt-2 text-xs text-nothing-blue border border-dashed border-nothing-blue/30 rounded p-1 hover:bg-nothing-blue/5 transition-colors">
            + Add custom model
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Model</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="advanced">CURL Template</TabsTrigger>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-api-endpoint">API Endpoint</Label>
                  <Input 
                    id="new-api-endpoint" 
                    value={newModel.apiEndpoint}
                    onChange={(e) => setNewModel({ ...newModel, apiEndpoint: e.target.value })}
                    placeholder="https://api.example.com/v1/completions"
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
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={handleAddNewModel} className="w-full">Add Model</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModelOpen} onOpenChange={setIsEditModelOpen}>
        {currentEditModel && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Model: {currentEditModel.name}</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="advanced">CURL Template</TabsTrigger>
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
            </Tabs>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModelOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ModelSelector;
