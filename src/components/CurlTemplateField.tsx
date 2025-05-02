
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CurlTemplateFieldProps {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
}

const CurlTemplateField = ({ value, onChange, onReset }: CurlTemplateFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="curl-template" className="text-sm">CURL Template</Label>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs h-6 px-2"
          onClick={onReset}
        >
          Reset to Default
        </Button>
      </div>
      <Textarea
        id="curl-template"
        placeholder={`curl https://api.example.com/v1/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer {{apiKey}}" \\
  -d '{
    "model": "model-name",
    "prompt": "{{prompt}}",
    "temperature": {{temperature}},
    "max_tokens": {{maxTokens}},
    "top_p": {{topP}}
  }'`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[150px] font-mono text-xs"
      />
      <p className="text-xs text-muted-foreground">
        Use placeholders: <code>{'{{prompt}}'}</code>, <code>{'{{temperature}}'}</code>, <code>{'{{maxTokens}}'}</code>, <code>{'{{topP}}'}</code>, <code>{'{{apiKey}}'}</code>
      </p>
    </div>
  );
};

export default CurlTemplateField;
