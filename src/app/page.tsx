// app/page.tsx
"use client";
import React, { useState, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider, useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Idl, web3, BN } from "@project-serum/anchor";
import idl from "../idl/idl.json";

require("@solana/wallet-adapter-react-ui/styles.css");

const programID = new PublicKey("6CDhdAhZnzBSMk76Yq4cUnmMpZuFQp8fUeYuM3hG85n5");

const getProgram = (connection: web3.Connection, wallet: any) => {
  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  return new Program(idl, programID, provider);
};

function ProducerForm() {
  const [isGreen, setIsGreen] = useState(false);
  const [initialEnergy, setInitialEnergy] = useState("");
  const [price, setPrice] = useState("");
  const { connection } = useConnection();
  const anchorWallet=useAnchorWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorWallet.publicKey) return;

    const program = getProgram(connection, anchorWallet);
    const producerKeypair = web3.Keypair.generate();

    try {
      await program.methods
        .createProducer(isGreen, new BN(initialEnergy), new BN(price))
        .accounts({
          producer: producerKeypair.publicKey,
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

function ChargingPointForm() {
  const [greenPrice, setGreenPrice] = useState("");
  const [nonGreenPrice, setNonGreenPrice] = useState("");
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorWallet.publicKey) return;

    const program = getProgram(connection, anchorWallet);
    const chargingPointKeypair = web3.Keypair.generate();

    try {
      await program.methods
        .createChargingPoint(new BN(greenPrice), new BN(nonGreenPrice))
        .accounts({
          chargingPoint: chargingPointKeypair.publicKey,
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
  );
}

function EnergyTransactions() {
  const [amount, setAmount] = useState("");
  const [useGreen, setUseGreen] = useState(false);
  const [producerPublicKey, setProducerPublicKey] = useState("");
  const [chargingPointPublicKey, setChargingPointPublicKey] = useState("");
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  const handleBuyEnergy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorWallet.publicKey || !producerPublicKey || !chargingPointPublicKey) return;

    const program = getProgram(connection, anchorWallet);

    try {
      await program.methods
        .buyEnergy(new BN(amount))
        .accounts({
          producer: new web3.PublicKey(producerPublicKey),
          chargingPoint: new web3.PublicKey(chargingPointPublicKey),
          buyer: anchorWallet.publicKey,
        })
        .rpc();

      console.log("Energy bought successfully!");
    } catch (error) {
      console.error("Error buying energy:", error);
    }
  };

  const handleChargeVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorWallet.publicKey || !chargingPointPublicKey) return;

    const program = getProgram(connection, anchorWallet);

    try {
      await program.methods
        .chargeVehicle(new BN(amount), useGreen)
        .accounts({
          chargingPoint: new web3.PublicKey(chargingPointPublicKey),
          consumer: anchorWallet.publicKey,
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

export default function Home() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-3xl font-bold mb-8 text-center">Green Energy Management</h1>
    <div className="flex justify-center mb-8">
        <WalletMultiButton />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProducerForm />
        <ChargingPointForm />
    </div>
    <EnergyTransactions />
    </div>

  );
}
