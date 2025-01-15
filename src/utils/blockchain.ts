export class BlockchainVoting {
  private chain: Block[] = [];
  private difficulty = 4;

  constructor() {
    // Create genesis block
    this.createBlock({
      voterId: "0",
      candidateId: "0",
      timestamp: new Date().toISOString()
    });
  }

  private async calculateHash(index: number, previousHash: string, timestamp: string, vote: Vote, nonce: number): Promise<string> {
    const data = index + previousHash + timestamp + JSON.stringify(vote) + nonce;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public async createBlock(vote: Vote): Promise<Block> {
    const previousBlock = this.getLatestBlock();
    const newIndex = previousBlock ? previousBlock.index + 1 : 0;
    const previousHash = previousBlock ? previousBlock.hash : "0";
    let nonce = 0;
    let timestamp = new Date().toISOString();
    let hash = await this.calculateHash(newIndex, previousHash, timestamp, vote, nonce);

    // Simple proof of work
    while (hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
      nonce++;
      hash = await this.calculateHash(newIndex, previousHash, timestamp, vote, nonce);
    }

    const newBlock: Block = {
      index: newIndex,
      timestamp,
      vote,
      previousHash,
      hash,
      nonce
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  public async isChainValid(): Promise<boolean> {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      const hash = await this.calculateHash(
        currentBlock.index,
        currentBlock.previousHash,
        currentBlock.timestamp,
        currentBlock.vote,
        currentBlock.nonce
      );

      if (currentBlock.hash !== hash) {
        return false;
      }
    }
    return true;
  }

  public getChain(): Block[] {
    return this.chain;
  }

  public hasVoted(voterId: string): boolean {
    return this.chain.some(block => block.vote.voterId === voterId);
  }

  public getResults(): Record<string, number> {
    const results: Record<string, number> = {};
    this.chain.forEach(block => {
      if (block.vote.candidateId !== "0") { // Exclude genesis block
        results[block.vote.candidateId] = (results[block.vote.candidateId] || 0) + 1;
      }
    });
    return results;
  }
}