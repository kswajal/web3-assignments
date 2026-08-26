const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
}

export async function uploadToIPFS(file: File): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Missing Pinata JWT. Please set VITE_PINATA_JWT in your .env file.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.reason || data.error || "Image upload failed");
  }

  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
}

export async function uploadMetadata(metadata: TokenMetadata): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Missing Pinata JWT. Please set VITE_PINATA_JWT in your .env file.");
  }

  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify(metadata),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.reason || data.error || "Metadata upload failed");
  }

  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
}
