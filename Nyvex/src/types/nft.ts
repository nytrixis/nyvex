export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes: NFTAttribute[];
  }
  
  export interface NFTAttribute {
    trait_type: string;
    value: string | number;
  }
  
  export interface InvestmentCertificate {
    tokenId: number;
    startupId: number;
    startupName: string;
    investmentAmount: string;
    investmentDate: Date;
    equity: string;
    ownerAddress: string;
    metadata: NFTMetadata;
  }
  
  export interface Milestone {
    id: number;
    startupId: number;
    title: string;
    description: string;
    deadline: Date;
    status: 'Not Started' | 'In Progress' | 'Completed';
    completedDate?: Date;
  }
  