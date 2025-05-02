
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ModelResponse } from '@/utils/api';

interface ModelComparisonProps {
  results: ModelResponse[];
}

const ModelComparison = ({ results }: ModelComparisonProps) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="mt-8 animate-in fade-in">
      <h2 className="text-lg font-medium mb-4">Comparison Results</h2>
      
      <div className="space-y-6">
        {results.map((result) => (
          <Card key={result.model} className="border-dotted-custom w-full">
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{result.model}</h3>
                </div>
                
                <div className="flex gap-4 text-xs text-muted-foreground mb-2">
                  <span>Time: {(result.metrics.time / 1000).toFixed(2)}s</span>
                  <span>Tokens: {result.metrics.tokens}</span>
                  <span>Cost: {result.metrics.cost}</span>
                </div>
                
                <Separator className="mb-4" />
                <div className="bg-muted/50 p-4 rounded text-sm whitespace-pre-wrap">
                  {result.response}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModelComparison;
