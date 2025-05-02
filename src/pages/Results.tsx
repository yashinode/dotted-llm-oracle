
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';

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
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-muted-foreground mb-4">No results saved yet</p>
              <p className="text-sm text-muted-foreground">
                Run some comparisons on the Test page to see results here
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Results;
