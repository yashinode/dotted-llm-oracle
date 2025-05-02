
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Model {
  id: number;
  name: string;
  selected: boolean;
  provider?: string;
  apiKey?: string;
  apiEndpoint?: string;
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
    selected: true
  });

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
      selected: true
    });
    setIsAddModelOpen(false);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Model</DialogTitle>
          </DialogHeader>
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
                onChange={(e) => setNewModel({ ...newModel, provider: e.target.value })}
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
            <Button onClick={handleAddNewModel} className="w-full">Add Model</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModelOpen} onOpenChange={setIsEditModelOpen}>
        {currentEditModel && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Model: {currentEditModel.name}</DialogTitle>
            </DialogHeader>
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
                  onChange={(e) => setCurrentEditModel({ 
                    ...currentEditModel, 
                    provider: e.target.value 
                  })}
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
              <Button onClick={handleSaveEdit} className="w-full">Save Changes</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ModelSelector;
