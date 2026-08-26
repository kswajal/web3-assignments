import {
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
} from "@solana/web3.js";
import { getCreateMetadataAccountV3InstructionDataSerializer } from "@metaplex-foundation/mpl-token-metadata";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

export async function createToken(
  wallet: WalletContextState,
  name: string,
  symbol: string,
  metadataUrl: string,
  supply: number,
  decimals: number,
  freezeAuthority: boolean,
) {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected or does not support transaction signing");
  }

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const mintKeypair = Keypair.generate();

  const lamports = await getMinimumBalanceForRentExemptMint(connection);

  const associatedTokenAccount = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    wallet.publicKey,
  );

  const [metadataAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintKeypair.publicKey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  );

  const metadataInstruction = new TransactionInstruction({
    programId: TOKEN_METADATA_PROGRAM_ID,
    keys: [
      { pubkey: metadataAccount, isSigner: false, isWritable: true },
      { pubkey: mintKeypair.publicKey, isSigner: false, isWritable: false },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(
      getCreateMetadataAccountV3InstructionDataSerializer().serialize({
        data: {
          name,
          symbol,
          uri: metadataUrl,
          sellerFeeBasisPoints: 0,
          creators: null,
          collection: null,
          uses: null,
        },
        isMutable: true,
        collectionDetails: null,
      }),
    ),
  });

  const rawAmount = BigInt(supply) * (BigInt(10) ** BigInt(decimals));

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      wallet.publicKey,
      freezeAuthority ? wallet.publicKey : null,
    ),
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      associatedTokenAccount,
      wallet.publicKey,
      mintKeypair.publicKey,
    ),
    createMintToInstruction(
      mintKeypair.publicKey,
      associatedTokenAccount,
      wallet.publicKey,
      rawAmount,
    ),
    metadataInstruction,
  );

  transaction.feePayer = wallet.publicKey;
  const latestBlockhash = await connection.getLatestBlockhash();
  transaction.recentBlockhash = latestBlockhash.blockhash;

  transaction.partialSign(mintKeypair);
  const signedTx = await wallet.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signedTx.serialize());

  await connection.confirmTransaction(signature);

  return {
    tokenAddress: mintKeypair.publicKey.toBase58(),
    explorerUrl: `https://explorer.solana.com/address/${mintKeypair.publicKey.toBase58()}?cluster=devnet`,
  };
}
