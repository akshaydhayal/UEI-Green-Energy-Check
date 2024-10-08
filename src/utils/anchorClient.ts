import { Program, AnchorProvider, Idl } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
// import idl from "./green_energy_management.json";
import idl from "../idl/idl.json";

const programID = new PublicKey("6CDhdAhZnzBSMk76Yq4cUnmMpZuFQp8fUeYuM3hG85n5");

export const getProgram = (connection: Connection, wallet: any) => {
//   const anchorWallet=useAnchorWallet();
  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
//   const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
  return new Program(idl as Idl, programID, provider);
};
