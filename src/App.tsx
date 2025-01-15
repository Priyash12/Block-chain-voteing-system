import React, { useState, useEffect } from 'react';
import { Vote } from './types';
import { BlockchainVoting } from './utils/blockchain';
import { VotingCard } from './components/VotingCard';
import { Results } from './components/Results';
import { Vote as VoteIcon } from 'lucide-react';

const blockchain = new BlockchainVoting();

const candidates = [
  {
    id: "1",
    name: "Alice Johnson",
    party: "Progressive Party",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=600"
  },
  {
    id: "2",
    name: "Bob Smith",
    party: "Conservative Party",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800&h=600"
  },
  {
    id: "3",
    name: "Carol Williams",
    party: "Independent",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800&h=600"
  }
];

function App() {
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState<Record<string, number>>({});
  const [totalVotes, setTotalVotes] = useState(0);

  const handleVote = async (voteData: Omit<Vote, 'timestamp'>) => {
    const vote: Vote = {
      ...voteData,
      timestamp: new Date().toISOString()
    };
    
    await blockchain.createBlock(vote);
    setHasVoted(true);
    updateResults();
  };

  const updateResults = () => {
    const newResults = blockchain.getResults();
    setResults(newResults);
    setTotalVotes(Object.values(newResults).reduce((a, b) => a + b, 0));
  };

  useEffect(() => {
    updateResults();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <VoteIcon className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Blockchain Voting System
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Secure, transparent, and immutable voting powered by blockchain technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {candidates.map(candidate => (
            <VotingCard
              key={candidate.id}
              candidate={candidate}
              onVote={handleVote}
              disabled={hasVoted}
            />
          ))}
        </div>

        <Results
          results={results}
          candidates={candidates}
          totalVotes={totalVotes}
        />
      </div>
    </div>
  );
}

export default App;