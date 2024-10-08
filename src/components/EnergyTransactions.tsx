// components/EnergyTransactions.tsx
"use client";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { web3 } from "@project-serum/anchor";
import { getProgram } from "@/utils/anchorClient";

export default function EnergyTransactions() {
  const [amount, setAmount] = useState("");
  const [useGreen, setUseGreen] = useState(false);
  const [producerPublicKey, setProducerPublicKey] = useState("");
  const [chargingPointPublicKey, setChargingPointPublicKey] = useState("");
  const { connection } = useConnection();
  const wallet = useWallet();

  const handleBuyEnergy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey || !producerPublicKey || !chargingPointPublicKey) return;

    const program = getProgram(connection, wallet);

    try {
      await program.methods
        .buyEnergy(new web3.BN(amount))
        .accounts({
          producer: new web3.PublicKey(producerPublicKey),
          chargingPoint: new web3.PublicKey(chargingPointPublicKey),
          buyer: wallet.publicKey,
        })
        .rpc();

      console.log("Energy bought successfully!");
    } catch (error) {
      console.error("Error buying energy:", error);
    }
  };

  const handleChargeVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey || !chargingPointPublicKey) return;

    const program = getProgram(connection, wallet);

    try {
      await program.methods
        .chargeVehicle(new web3.BN(amount), useGreen)
        .accounts({
          chargingPoint: new web3.PublicKey(chargingPointPublicKey),
          consumer: wallet.publicKey,
        })
        .rpc();

      console.log("Vehicle charged successfully!");
    } catch (error) {
      console.error("Error charging vehicle:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">Energy Transactions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleBuyEnergy}>
          <h3 className="text-xl font-bold mb-2">Buy Energy</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="producerPublicKey">
              Producer Public Key
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="producerPublicKey"
              type="text"
              value={producerPublicKey}
              onChange={(e) => setProducerPublicKey(e.target.value)}
              placeholder="Producer Public Key"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="chargingPointPublicKey">
              Charging Point Public Key
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="chargingPointPublicKey"
              type="text"
              value={chargingPointPublicKey}
              onChange={(e) => setChargingPointPublicKey(e.target.value)}
              placeholder="Charging Point Public Key"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="buyAmount">
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="buyAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
          </div>
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Buy Energy
          </button>
        </form>
        <form onSubmit={handleChargeVehicle}>
          <h3 className="text-xl font-bold mb-2">Charge Vehicle</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="chargingPointPublicKey">
              Charging Point Public Key
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="chargingPointPublicKey"
              type="text"
              value={chargingPointPublicKey}
              onChange={(e) => setChargingPointPublicKey(e.target.value)}
              placeholder="Charging Point Public Key"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="chargeAmount">
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="chargeAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input type="checkbox" checked={useGreen} onChange={(e) => setUseGreen(e.target.checked)} className="mr-2" />
              Use Green Energy?
            </label>
          </div>
          <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Charge Vehicle
          </button>
        </form>
      </div>
    </div>
  );
}
