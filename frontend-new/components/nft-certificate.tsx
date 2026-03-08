'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Download,
  Share2,
  ExternalLink,
  CheckCircle,
  MapPin,
  Calendar,
  User,
  Package,
  Fingerprint,
  Award,
} from 'lucide-react';
import { ProvenanceRecord } from '@/lib/blockchain-provenance-service';

interface NFTCertificateProps {
  record: ProvenanceRecord;
  showActions?: boolean;
}

export function NFTCertificate({ record, showActions = true }: NFTCertificateProps) {
  const handleDownload = () => {
    // In production, this would generate a PDF certificate
    console.log('Downloading certificate:', record.certificateNumber);
  };

  const handleShare = () => {
    // In production, this would open share dialog
    const url = `${window.location.origin}/verify/${record.certificateNumber}`;
    navigator.clipboard.writeText(url);
    alert('Certificate link copied to clipboard!');
  };

  const handleViewBlockchain = () => {
    const explorers = {
      ethereum: 'https://etherscan.io',
      polygon: 'https://polygonscan.com',
      binance: 'https://bscscan.com',
      solana: 'https://solscan.io',
    };

    const baseUrl = explorers[record.blockchainNetwork];
    window.open(`${baseUrl}/tx/${record.transactionHash}`, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'disputed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'revoked':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Certificate of Authenticity</h2>
            </div>
            <p className="text-sm text-white/90">Blockchain-Verified NFT Certificate</p>
          </div>
          <Badge
            variant="secondary"
            className="border-white/30 bg-white/20 text-white backdrop-blur-sm"
          >
            <Award className="mr-1 h-3 w-3" />
            NFT
          </Badge>
        </div>

        {/* Certificate Number */}
        <div className="mt-6 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs text-white/70">Certificate Number</p>
              <p className="font-mono text-lg font-bold">{record.certificateNumber}</p>
            </div>
            <div className="text-right">
              <p className="mb-1 text-xs text-white/70">Status</p>
              <Badge variant="outline" className={getStatusColor(record.verificationStatus)}>
                {record.verificationStatus === 'verified' && (
                  <CheckCircle className="mr-1 h-3 w-3" />
                )}
                {record.verificationStatus.charAt(0).toUpperCase() +
                  record.verificationStatus.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="space-y-6 p-6">
        {/* Product Image */}
        {record.images && record.images.length > 0 && (
          <div className="relative overflow-hidden rounded-lg bg-gray-100">
            <img
              src={record.images[0]}
              alt={record.productName}
              className="h-64 w-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge
                variant="secondary"
                className="border-white/20 bg-black/70 text-white backdrop-blur-sm"
              >
                Authenticated
              </Badge>
            </div>
          </div>
        )}

        {/* Product Details */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">{record.productName}</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Package className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Craft Type</p>
                <p className="font-medium">{record.craftType}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Artisan</p>
                <p className="font-medium">{record.artisanName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Origin</p>
                <p className="font-medium">
                  {record.manufacturingLocation.city}, {record.manufacturingLocation.state}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Minted On</p>
                <p className="font-medium">{record.timestamp.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* GI Tag */}
        {record.giTag && (
          <>
            <Separator />
            <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <Award className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-900">Geographical Indication Tag</p>
                <p className="text-sm text-amber-700">{record.giTag}</p>
              </div>
            </div>
          </>
        )}

        {/* Blockchain Details */}
        <Separator />
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold">
            <Fingerprint className="h-4 w-4" />
            Blockchain Verification
          </h4>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network</span>
              <span className="font-medium capitalize">{record.blockchainNetwork}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract</span>
              <span className="font-mono text-xs">
                {record.contractAddress.slice(0, 8)}...{record.contractAddress.slice(-6)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction</span>
              <span className="font-mono text-xs">
                {record.transactionHash.slice(0, 8)}...{record.transactionHash.slice(-6)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Block Number</span>
              <span className="font-medium">{record.blockNumber.toLocaleString()}</span>
            </div>
            {record.metadata.ipfsHash && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">IPFS Hash</span>
                <span className="font-mono text-xs">
                  {record.metadata.ipfsHash.slice(0, 8)}...{record.metadata.ipfsHash.slice(-6)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Attributes */}
        {record.metadata.attributes.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="mb-3 font-semibold">Attributes</h4>
              <div className="grid grid-cols-2 gap-2">
                {record.metadata.attributes.map((attr, index) => (
                  <div key={index} className="rounded-lg bg-gray-50 p-3">
                    <p className="text-muted-foreground mb-1 text-xs">{attr.trait_type}</p>
                    <p className="text-sm font-medium">{attr.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Provenance Trail */}
        {record.provenance.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="mb-3 font-semibold">Provenance Trail</h4>
              <div className="space-y-3">
                {record.provenance.map((stage, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${stage.verified ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium capitalize">
                          {stage.stage.replace(/_/g, ' ')}
                        </p>
                        {stage.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {stage.actor} • {stage.location}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {stage.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        {showActions && (
          <>
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleDownload} variant="default">
                <Download className="mr-2 h-4 w-4" />
                Download Certificate
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button onClick={handleViewBlockchain} variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Blockchain
              </Button>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="border-t pt-4 text-center">
          <p className="text-muted-foreground text-xs">
            This certificate is secured by blockchain technology and cannot be duplicated or forged.
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Verify authenticity at artisansofindia.com/verify
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
