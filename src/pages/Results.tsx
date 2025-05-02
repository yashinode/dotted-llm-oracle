
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';

// Mock data for saved results
const mockSavedResults = [
  {
    id: 1,
    name: "Product description comparison",
    date: "2023-05-01T14:30:00",
    prompt: "Write a compelling product description for a new wireless headphone with noise cancellation features.",
    models: ["GPT-4o", "Claude 3 Opus", "GPT-4o-mini"],
    metrics: {
      bestPerformance: "Claude 3 Opus",
      averageTime: "2.4s",
      tokensUsed: 1423,
      totalCost: "$0.087"
    }
  },
  {
    id: 2,
    name: "Email response test",
    date: "2023-05-01T16:45:00",
    prompt: "Draft a professional email response to a customer complaint about late delivery.",
    models: ["GPT-4o", "GPT-4o-mini"],
    metrics: {
      bestPerformance: "GPT-4o",
      averageTime: "1.7s",
      tokensUsed: 892,
      totalCost: "$0.042"
    }
  },
  {
    id: 3,
    name: "Code refactoring",
    date: "2023-05-02T09:15:00",
    prompt: "Refactor this React component to improve performance and readability.",
    models: ["GPT-4o", "Claude 3 Opus", "Llama 3"],
    metrics: {
      bestPerformance: "GPT-4o",
      averageTime: "3.1s",
      tokensUsed: 1876,
      totalCost: "$0.112"
    }
  },
];

const Results = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dotted-pattern">
      <Navbar />
      
      <main className="flex-1 container max-w-6xl py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-mono font-medium">Saved Results</h1>
        </div>
        
        <Card className="border-dotted-custom bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-mono">History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/20">
                  <TableHead className="font-mono text-xs">Name</TableHead>
                  <TableHead className="font-mono text-xs">Date</TableHead>
                  <TableHead className="font-mono text-xs">Models</TableHead>
                  <TableHead className="font-mono text-xs">Best Performance</TableHead>
                  <TableHead className="font-mono text-xs">Metrics</TableHead>
                  <TableHead className="font-mono text-xs w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSavedResults.map((result) => (
                  <TableRow key={result.id} className="hover:bg-muted/20 cursor-pointer">
                    <TableCell className="font-medium">{result.name}</TableCell>
                    <TableCell className="text-sm">{new Date(result.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {result.models.map((model) => (
                          <Badge key={model} variant="outline" className="font-mono text-[10px]">
                            {model}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-nothing-blue/10 text-nothing-blue font-mono text-[10px]">
                        {result.metrics.bestPerformance}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="font-mono">Time:</span>
                          <span>{result.metrics.averageTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-mono">Tokens:</span>
                          <span>{result.metrics.tokensUsed}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-mono">Cost:</span>
                          <span>{result.metrics.totalCost}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button className="text-xs text-nothing-blue hover:underline font-mono">
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Results;
