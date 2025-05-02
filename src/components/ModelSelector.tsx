
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Model {
  id: number;
  name: string;
  selected: boolean;
}

interface ModelSelectorProps {
  models: Model[];
  onToggleModel: (id: number) => void;
}

const ModelSelector = ({ models, onToggleModel }: ModelSelectorProps) => {
  return (
    <div className="space-y-2">
      {models.map((model) => (
        <div key={model.id} className="flex items-center space-x-2 py-1">
          <Checkbox
            id={`model-${model.id}`}
            checked={model.selected}
            onCheckedChange={() => onToggleModel(model.id)}
            className="data-[state=checked]:bg-nothing-black data-[state=checked]:border-nothing-black"
          />
          <Label 
            htmlFor={`model-${model.id}`}
            className="font-mono text-sm cursor-pointer"
          >
            {model.name}
          </Label>
        </div>
      ))}
      <button className="w-full mt-2 text-xs text-nothing-blue font-mono border border-dashed border-nothing-blue/30 rounded p-1 hover:bg-nothing-blue/5 transition-colors">
        + Add custom model
      </button>
    </div>
  );
};

export default ModelSelector;
