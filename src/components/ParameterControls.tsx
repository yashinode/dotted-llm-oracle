
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ParametersProps {
  parameters: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequency_penalty: number;
    presence_penalty: number;
  };
  onChange: (param: string, value: number) => void;
}

const ParameterControls = ({ parameters, onChange }: ParametersProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="temperature" className="text-xs font-mono">Temperature</Label>
          <span className="text-xs font-mono">{parameters.temperature}</span>
        </div>
        <Slider
          id="temperature"
          min={0}
          max={2}
          step={0.1}
          value={[parameters.temperature]}
          onValueChange={(value) => onChange('temperature', value[0])}
          className="cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="maxTokens" className="text-xs font-mono">Max Tokens</Label>
          <span className="text-xs font-mono">{parameters.maxTokens}</span>
        </div>
        <div className="flex items-center gap-2">
          <Slider
            id="maxTokens"
            min={1}
            max={4000}
            step={1}
            value={[parameters.maxTokens]}
            onValueChange={(value) => onChange('maxTokens', value[0])}
            className="cursor-pointer"
          />
          <Input
            type="number"
            value={parameters.maxTokens}
            onChange={(e) => onChange('maxTokens', parseInt(e.target.value) || 1)}
            className="w-16 h-7 text-xs font-mono text-center"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="topP" className="text-xs font-mono">Top P</Label>
          <span className="text-xs font-mono">{parameters.topP}</span>
        </div>
        <Slider
          id="topP"
          min={0}
          max={1}
          step={0.01}
          value={[parameters.topP]}
          onValueChange={(value) => onChange('topP', value[0])}
          className="cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="frequency_penalty" className="text-xs font-mono">Frequency Penalty</Label>
          <span className="text-xs font-mono">{parameters.frequency_penalty}</span>
        </div>
        <Slider
          id="frequency_penalty"
          min={0}
          max={2}
          step={0.1}
          value={[parameters.frequency_penalty]}
          onValueChange={(value) => onChange('frequency_penalty', value[0])}
          className="cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="presence_penalty" className="text-xs font-mono">Presence Penalty</Label>
          <span className="text-xs font-mono">{parameters.presence_penalty}</span>
        </div>
        <Slider
          id="presence_penalty"
          min={0}
          max={2}
          step={0.1}
          value={[parameters.presence_penalty]}
          onValueChange={(value) => onChange('presence_penalty', value[0])}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ParameterControls;
