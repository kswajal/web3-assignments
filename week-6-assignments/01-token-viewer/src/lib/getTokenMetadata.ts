import { Connection, PublicKey } from "@solana/web3.js";

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

function readMetadataString(data: Uint8Array, offset: number) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const length = view.getUint32(offset, true);
  const start = offset + 4;
  const end = start + length;

  return {
    value: new TextDecoder()
      .decode(data.slice(start, end))
      .replace(/\0/g, "")
      .trim(),
    offset: end,
  };
}

export async function getTokenMetadata(
  connection: Connection,
  mint: string
) {
  try {
    const mintKey = new PublicKey(mint);

    const metadataPDA = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )[0];

    const account = await connection.getAccountInfo(metadataPDA);

    if (!account) {
      return null;
    }

    let offset = 1 + 32 + 32;
    const name = readMetadataString(account.data, offset);
    offset = name.offset;
    const symbol = readMetadataString(account.data, offset);
    offset = symbol.offset;
    const uri = readMetadataString(account.data, offset);

    return {
      name: name.value,
      symbol: symbol.value,
      uri: uri.value,
    };
  } catch (err) {
    console.log(err);

    return null;
  }
}
