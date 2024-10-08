// components/ChargingPointForm.tsx
"use client";
import { useState } from "react";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { BN, web3 } from "@project-serum/anchor";
import { getProgram } from "@/utils/anchorClient";

export default function ChargingPointForm() {
  const [greenPrice, setGreenPrice] = useState("");
  const [nonGreenPrice, setNonGreenPrice] = useState("");
  const { connection } = useConnection();
  // const wallet = useWallet();
  const anchorWallet=useAnchorWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!wallet.publicKey) return;
    if (!anchorWallet.publicKey) return;

    // const program = getProgram(connection, wallet);
    const program = getProgram(connection, anchorWallet);
    const chargingPointKeypair = web3.Keypair.generate();

    try {
      await program.methods
        // .createChargingPoint(new web3.BN(greenPrice), new web3.BN(nonGreenPrice))
        .createChargingPoint(new BN(greenPrice), new BN(nonGreenPrice))
        .accounts({
          chargingPoint: chargingPointKeypair.publicKey,
          // owner: wallet.publicKey,
          owner: anchorWallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([chargingPointKeypair])
        .rpc();

      console.log("Charging point created successfully!");
    } catch (error) {
      console.error("Error creating charging point:", error);
    }
  };

  // ... (rest of the component remains the same)
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Create Charging Point</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="greenPrice">
            Green Energy Price
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="greenPrice"
            type="number"
            value={greenPrice}
            onChange={(e) => setGreenPrice(e.target.value)}
            placeholder="Green Energy Price"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nonGreenPrice">
            Non-Green Energy Price
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="nonGreenPrice"
            type="number"
            value={nonGreenPrice}
            onChange={(e) => setNonGreenPrice(e.target.value)}
            placeholder="Non-Green Energy Price"
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Create Charging Point
          </button>
        </div>
      </form>
    </div>
  )
}
