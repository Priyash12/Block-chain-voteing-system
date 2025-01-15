import React from 'react';
import { Vote } from '../types';
import { CheckCircle } from 'lucide-react';

interface VotingCardProps {
  candidate: Candidate;
  onVote: (vote: Omit<Vote, 'timestamp'>) => void;
  disabled: boolean;
}

export function VotingCard({ candidate, onVote, disabled }: VotingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      <img
        src={candidate.imageUrl}
        alt={candidate.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{candidate.name}</h3>
        <p className="text-gray-600 mb-4">{candidate.party}</p>
        <button
          onClick={() => onVote({ voterId: crypto.randomUUID(), candidateId: candidate.id })}
          disabled={disabled}
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2
            ${disabled 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          {disabled ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Voted
            </>
          ) : (
            'Vote'
          )}
        </button>
      </div>
    </div>
  );
}