import axios from 'axios';
import FormData from 'form-data';

// Pinata API configuration
const JWT = process.env.NEXT_PUBLIC_PINATA_JWT || '';
const GATEWAY_URL = 'https://gateway.pinata.cloud/ipfs/';

/**
 * Upload a file to IPFS using Pinata
 * @param file The file to upload
 * @returns CID of the uploaded file
 */
export async function uploadToIPFS(file: File): Promise<string> {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Set options for Pinata
    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', metadata);
    
    // Upload to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          'Authorization': `Bearer ${JWT}`
        }
      }
    );
    
    // Return the IPFS hash (CID)
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

/**
 * Upload multiple files to IPFS using Pinata
 * @param files Array of files to upload
 * @returns Array of CIDs for the uploaded files
 */
export async function uploadMultipleToIPFS(files: File[]): Promise<string[]> {
  try {
    // Upload each file individually
    const promises = files.map(file => uploadToIPFS(file));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error uploading multiple files to IPFS:', error);
    throw new Error('Failed to upload multiple files to IPFS');
  }
}

/**
 * Upload JSON metadata to IPFS
 * @param metadata Object containing metadata
 * @returns CID of the uploaded metadata
 */
export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  try {
    // Upload JSON to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT}`
        }
      }
    );
    
    // Return the IPFS hash (CID)
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

/**
 * Get the IPFS gateway URL for a CID
 * @param cid The CID of the file
 * @param filename Optional filename
 * @returns IPFS gateway URL
 */
export function getIPFSGatewayURL(cid: string, filename?: string): string {
  if (filename) {
    return `${GATEWAY_URL}${cid}/${filename}`;
  }
  return `${GATEWAY_URL}${cid}`;
}
