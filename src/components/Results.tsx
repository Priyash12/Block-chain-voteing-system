import React from 'react';
import { Block, Candidate } from '../types';
import { BarChart } from 'lucide-react';

interface ResultsProps {
  results: Record<string, number>;
  candidates: Candidate[];
  totalVotes: number;
}

export function Results({ results, candidates, totalVotes }: ResultsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Election Results</h2>
      </div>
      <div className="space-y-4">
        {candidates.map(candidate => {
          const votes = results[candidate.id] || 0;
          const percentage = totalVotes ? ((votes / totalVotes) * 100).toFixed(1) : '0';
          
          return (
            <div key={candidate.id} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{candidate.name}</span>
                <span className="text-gray-600">{votes} votes ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}