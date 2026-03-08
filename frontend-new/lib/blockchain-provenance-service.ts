/**
 * Blockchain Provenance Service
 *
 * Manages blockchain-based product authenticity and provenance tracking
 * Integrates with Ethereum/Polygon for NFT certificates and supply chain tracking
 */

export interface ProvenanceRecord {
  id: string;
  productId: string;

  // Blockchain Data
  blockchainNetwork: 'ethereum' | 'polygon' | 'binance' | 'solana';
  contractAddress: string;
  tokenId?: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;

  // Product Information
  productName: string;
  craftType: string;
  artisanId: string;
  artisanName: string;

  // Authenticity Details
  certificateNumber: string;
  giTag?: string;
  materialOrigin: string[];
  manufacturingLocation: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Provenance Chain
  provenance: {
    stage: 'raw_material' | 'creation' | 'quality_check' | 'packaging' | 'shipment' | 'delivery';
    actor: string;
    location: string;
    timestamp: Date;
    verified: boolean;
    proofHash?: string;
  }[];

  // Media Evidence
  images: string[];
  videos?: string[];
  processDocumentation?: string[];

  // Verification
  verificationStatus: 'pending' | 'verified' | 'disputed' | 'revoked';
  verifiedBy?: string[];
  verificationDate?: Date;

  // Ownership
  currentOwner?: string;
  ownershipHistory: {
    owner: string;
    acquiredDate: Date;
    transferHash?: string;
  }[];

  // Metadata
  metadata: {
    ipfsHash?: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
  };
}

export interface CreateProvenanceRequest {
  productId: string;
  productName: string;
  craftType: string;
  artisanId: string;
  artisanName: string;
  giTag?: string;
  materialOrigin: string[];
  manufacturingLocation: {
    city: string;
    state: string;
    country: string;
  };
  images: string[];
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

export interface VerificationResult {
  isAuthentic: boolean;
  confidence: number; // 0-100
  record?: ProvenanceRecord;
  issues?: string[];
  verificationTimestamp: Date;
}

export class BlockchainProvenanceService {
  private records: Map<string, ProvenanceRecord>;
  private readonly DEFAULT_NETWORK = 'polygon'; // Lower fees than Ethereum

  constructor() {
    this.records = new Map();
  }

  /**
   * Create a new provenance record and mint NFT certificate
   */
  async createProvenanceRecord(request: CreateProvenanceRequest): Promise<ProvenanceRecord> {
    const certificateNumber = this.generateCertificateNumber();
    const transactionHash = this.simulateBlockchainTransaction();

    const record: ProvenanceRecord = {
      id: `prov-${Date.now()}`,
      productId: request.productId,
      blockchainNetwork: this.DEFAULT_NETWORK,
      contractAddress: this.getContractAddress(this.DEFAULT_NETWORK),
      transactionHash,
      blockNumber: Math.floor(Math.random() * 10000000) + 40000000,
      timestamp: new Date(),
      productName: request.productName,
      craftType: request.craftType,
      artisanId: request.artisanId,
      artisanName: request.artisanName,
      certificateNumber,
      giTag: request.giTag,
      materialOrigin: request.materialOrigin,
      manufacturingLocation: request.manufacturingLocation,
      provenance: [
        {
          stage: 'creation',
          actor: request.artisanName,
          location: `${request.manufacturingLocation.city}, ${request.manufacturingLocation.state}`,
          timestamp: new Date(),
          verified: true,
          proofHash: this.generateHash(),
        },
      ],
      images: request.images,
      verificationStatus: 'pending',
      ownershipHistory: [],
      metadata: {
        ipfsHash: this.simulateIPFSUpload(request),
        attributes: request.attributes || this.generateDefaultAttributes(request),
      },
    };

    this.records.set(record.id, record);

    // In production, this would:
    // 1. Upload metadata to IPFS
    // 2. Mint NFT on blockchain
    // 3. Store hash on-chain

    return record;
  }

  /**
   * Verify product authenticity using certificate number or QR code
   */
  async verifyAuthenticity(certificateNumber: string): Promise<VerificationResult> {
    const record = Array.from(this.records.values()).find(
      (r) => r.certificateNumber === certificateNumber
    );

    if (!record) {
      return {
        isAuthentic: false,
        confidence: 0,
        issues: ['Certificate number not found in blockchain records'],
        verificationTimestamp: new Date(),
      };
    }

    const issues: string[] = [];
    let confidence = 100;

    // Check verification status
    if (record.verificationStatus === 'revoked') {
      issues.push('Certificate has been revoked');
      confidence -= 100;
    } else if (record.verificationStatus === 'disputed') {
      issues.push('Certificate authenticity is under dispute');
      confidence -= 50;
    } else if (record.verificationStatus === 'pending') {
      issues.push('Certificate pending official verification');
      confidence -= 20;
    }

    // Check blockchain confirmation
    if (!record.transactionHash) {
      issues.push('No blockchain transaction found');
      confidence -= 40;
    }

    // Check provenance chain
    if (record.provenance.length === 0) {
      issues.push('No provenance trail recorded');
      confidence -= 30;
    }

    const unverifiedStages = record.provenance.filter((p) => !p.verified);
    if (unverifiedStages.length > 0) {
      issues.push(`${unverifiedStages.length} provenance stage(s) unverified`);
      confidence -= unverifiedStages.length * 10;
    }

    return {
      isAuthentic: confidence > 50,
      confidence: Math.max(0, confidence),
      record,
      issues: issues.length > 0 ? issues : undefined,
      verificationTimestamp: new Date(),
    };
  }

  /**
   * Add a provenance stage to the product's journey
   */
  async addProvenanceStage(
    recordId: string,
    stage: ProvenanceRecord['provenance'][0]
  ): Promise<ProvenanceRecord> {
    const record = this.records.get(recordId);

    if (!record) {
      throw new Error('Provenance record not found');
    }

    // Add stage with blockchain proof
    const stageWithProof = {
      ...stage,
      proofHash: this.generateHash(),
      timestamp: new Date(),
    };

    record.provenance.push(stageWithProof);

    // In production, this would add a new transaction to the blockchain

    return record;
  }

  /**
   * Transfer ownership of authenticated product
   */
  async transferOwnership(recordId: string, newOwner: string): Promise<ProvenanceRecord> {
    const record = this.records.get(recordId);

    if (!record) {
      throw new Error('Provenance record not found');
    }

    const transferHash = this.simulateBlockchainTransaction();

    record.ownershipHistory.push({
      owner: newOwner,
      acquiredDate: new Date(),
      transferHash,
    });

    record.currentOwner = newOwner;

    // In production, this would transfer the NFT on blockchain

    return record;
  }

  /**
   * Get provenance record by product ID
   */
  async getProvenanceByProductId(productId: string): Promise<ProvenanceRecord | null> {
    const records = Array.from(this.records.values()).filter((r) => r.productId === productId);

    return records[0] || null;
  }

  /**
   * Get all records for an artisan
   */
  async getArtisanProvenance(artisanId: string): Promise<ProvenanceRecord[]> {
    return Array.from(this.records.values()).filter((r) => r.artisanId === artisanId);
  }

  /**
   * Verify provenance on blockchain
   */
  async verifyOnBlockchain(transactionHash: string): Promise<boolean> {
    // In production, this would query the blockchain
    // For now, simulate verification
    const record = Array.from(this.records.values()).find(
      (r) => r.transactionHash === transactionHash
    );

    return !!record;
  }

  /**
   * Get blockchain explorer URL
   */
  getExplorerUrl(record: ProvenanceRecord): string {
    const explorers = {
      ethereum: 'https://etherscan.io',
      polygon: 'https://polygonscan.com',
      binance: 'https://bscscan.com',
      solana: 'https://solscan.io',
    };

    const baseUrl = explorers[record.blockchainNetwork];
    return `${baseUrl}/tx/${record.transactionHash}`;
  }

  /**
   * Generate QR code data for product verification
   */
  generateVerificationQR(certificateNumber: string): {
    data: string;
    url: string;
  } {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://artisansofindia.com'}/verify/${certificateNumber}`;

    return {
      data: JSON.stringify({
        certificateNumber,
        verificationUrl,
        timestamp: new Date().toISOString(),
      }),
      url: verificationUrl,
    };
  }

  /**
   * Get provenance statistics
   */
  async getProvenanceStats() {
    const records = Array.from(this.records.values());

    const totalRecords = records.length;
    const verifiedRecords = records.filter((r) => r.verificationStatus === 'verified').length;
    const pendingRecords = records.filter((r) => r.verificationStatus === 'pending').length;
    const disputedRecords = records.filter((r) => r.verificationStatus === 'disputed').length;

    const totalTransactions = records.reduce((sum, r) => sum + r.provenance.length, 0);

    const networkDistribution = records.reduce(
      (acc, r) => {
        acc[r.blockchainNetwork] = (acc[r.blockchainNetwork] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalRecords,
      verifiedRecords,
      pendingRecords,
      disputedRecords,
      verificationRate: totalRecords > 0 ? (verifiedRecords / totalRecords) * 100 : 0,
      totalTransactions,
      networkDistribution,
    };
  }

  /**
   * Helper: Generate certificate number
   */
  private generateCertificateNumber(): string {
    const prefix = 'AOI';
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${year}-${random}`;
  }

  /**
   * Helper: Simulate blockchain transaction
   */
  private simulateBlockchainTransaction(): string {
    return (
      '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    );
  }

  /**
   * Helper: Generate hash
   */
  private generateHash(): string {
    return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  /**
   * Helper: Get contract address for network
   */
  private getContractAddress(network: string): string {
    const contracts = {
      ethereum: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      polygon: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      binance: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      solana: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    };

    return contracts[network as keyof typeof contracts] || contracts.polygon;
  }

  /**
   * Helper: Simulate IPFS upload
   */
  private simulateIPFSUpload(data: any): string {
    // In production, this would upload to IPFS
    return 'Qm' + Array.from({ length: 44 }, () => Math.random().toString(36).charAt(2)).join('');
  }

  /**
   * Helper: Generate default attributes
   */
  private generateDefaultAttributes(request: CreateProvenanceRequest) {
    return [
      { trait_type: 'Craft Type', value: request.craftType },
      { trait_type: 'Artisan', value: request.artisanName },
      {
        trait_type: 'Origin',
        value: `${request.manufacturingLocation.city}, ${request.manufacturingLocation.state}`,
      },
      { trait_type: 'Authenticity', value: 'Verified' },
      { trait_type: 'Year', value: new Date().getFullYear().toString() },
    ];
  }
}

// Export singleton instance
export const blockchainProvenanceService = new BlockchainProvenanceService();
