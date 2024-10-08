import { useState } from "react";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "@/utils/anchorClient";
import { BN, web3 } from "@project-serum/anchor";

export default function ProducerForm() {
  const [isGreen, setIsGreen] = useState(false);
  const [initialEnergy, setInitialEnergy] = useState("");
  const [price, setPrice] = useState("");
  const { connection } = useConnection();
  // const wallet = useWallet();
  const anchorWallet=useAnchorWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!wallet.publicKey) return;
    if (!anchorWallet.publicKey) return;

    // const program = getProgram(connection, wallet);
    const program = getProgram(connection, anchorWallet);
    const producerKeypair = web3.Keypair.generate();

    try {
      await program.methods
        // .createProducer(isGreen, new BN(initialEnergy), new web3.BN(price))
        .createProducer(isGreen, new BN(initialEnergy), new BN(price))
        .accounts({
          producer: producerKeypair.publicKey,
          // owner: wallet.publicKey,
          owner: anchorWallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([producerKeypair])
        .rpc();

      console.log("Producer created successfully!");
    } catch (error) {
      console.error("Error creating producer:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Create Producer</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <input type="checkbox" checked={isGreen} onChange={(e) => setIsGreen(e.target.checked)} className="mr-2" />
            Is Green Energy?
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="initialEnergy">
            Initial Energy
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="initialEnergy"
            type="number"
            value={initialEnergy}
            onChange={(e) => setInitialEnergy(e.target.value)}
            placeholder="Initial Energy"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Create Producer
          </button>
        </div>
      </form>
    </div>
  );
}
