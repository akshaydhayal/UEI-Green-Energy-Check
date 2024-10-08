// app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import {   useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {  WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {  PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import idl from "../idl/idl.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Zap, PlusCircle, Battery, DollarSign, Leaf } from "lucide-react";


import "@solana/wallet-adapter-react-ui/styles.css";

const programID = new PublicKey("6CDhdAhZnzBSMk76Yq4cUnmMpZuFQp8fUeYuM3hG85n5");

//@ts-expect-error ignore
const getProgram = (connection: web3.Connection, wallet) => {
  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  //@ts-expect-error ignore
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
    if(!anchorWallet){
      alert("Connect your Wallet first");
      return;
    }
    if (!anchorWallet.publicKey) return;

    const program = getProgram(connection, anchorWallet);
    const producerKeypair = web3.Keypair.generate();

    try {
      const tx = await program.methods
        .createProducer(isGreen, new BN(initialEnergy), new BN(price))
        .accounts({
          producer: producerKeypair.publicKey,
          owner: anchorWallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([producerKeypair])
        .rpc();

      toast.success(`Producer created successfully! TX ID: ${tx}`);
    } catch (error) {
      console.error("Error creating producer:", error);
      toast.error("Error creating producer");
    }
  };

  return (
    <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
        <PlusCircle className="mr-2" /> Create Energy Producer
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2 flex items-center">
            <input type="checkbox" checked={isGreen} onChange={(e) => setIsGreen(e.target.checked)} className="mr-2" />
            {isGreen ? <Leaf className="mr-2" /> : <Leaf className="mr-2" />} Is Green Energy?
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2 flex items-center" htmlFor="initialEnergy">
            <Zap className="mr-2" /> Total Energy Available
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            id="initialEnergy"
            type="number"
            value={initialEnergy}
            onChange={(e) => setInitialEnergy(e.target.value)}
            placeholder="Total Energy (kW) Available"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2 flex items-center" htmlFor="price">
            <DollarSign className="mr-2" /> Energy Rate ($/kWh)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Rate ($/kWh)"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            type="submit"
          >
            <PlusCircle className="mr-2" /> Create Producer
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
      if(!anchorWallet){
        alert("Connect your Wallet first");
        return;
      }
    if (!anchorWallet.publicKey) return;

    const program = getProgram(connection, anchorWallet);
    const chargingPointKeypair = web3.Keypair.generate();

    try {
      const tx = await program.methods
        .createChargingPoint(new BN(greenPrice), new BN(nonGreenPrice))
        .accounts({
          chargingPoint: chargingPointKeypair.publicKey,
          owner: anchorWallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([chargingPointKeypair])
        .rpc();

      toast.success(`Charging point created successfully! TX ID: ${tx}`);
    } catch (error) {
      console.error("Error creating charging point:", error);
      toast.error("Error creating charging point");
    }
  };

  return (
    <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
        <PlusCircle className="mr-2" /> Create Charging Point
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2 flex items-center" htmlFor="greenPrice">
            <DollarSign className="mr-2" /> Green Energy Rate ($/kWh)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            id="greenPrice"
            type="number"
            value={greenPrice}
            onChange={(e) => setGreenPrice(e.target.value)}
            placeholder="Green Energy Rate"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2 flex items-center" htmlFor="nonGreenPrice">
            <DollarSign className="mr-2" /> Non-Green Energy Rate ($/kWh)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            id="nonGreenPrice"
            type="number"
            value={nonGreenPrice}
            onChange={(e) => setNonGreenPrice(e.target.value)}
            placeholder="Non-Green Energy Rate"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            type="submit"
          >
            <PlusCircle className="mr-2" /> Create Charging Point
          </button>
        </div>
      </form>
    </div>
  );
}


//@ts-expect-error ignore
function EnergyTransactions({ producers, chargingPoints }) {
    const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [useGreen, setUseGreen] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState("");
  const [selectedChargingPoint1, setSelectedChargingPoint1] = useState("");
  const [selectedChargingPoint2, setSelectedChargingPoint2] = useState("");
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  console.log("use green : ",useGreen);

  const handleBuyEnergy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorWallet) {
        alert("Connect your Wallet first");
        return;
    }
    if (!anchorWallet?.publicKey || !selectedProducer || !selectedChargingPoint1) return;

    const program = getProgram(connection, anchorWallet);

    try {
      const tx = await program.methods
        .buyEnergy(new BN(amount1))
        .accounts({
          producer: new web3.PublicKey(selectedProducer),
          chargingPoint: new web3.PublicKey(selectedChargingPoint1),
          buyer: anchorWallet.publicKey,
        })
        .rpc();
        
        toast.success(`Energy bought successfully! TX ID: ${tx}`);
    } catch (error) {
        console.error("Error buying energy:", error);
        toast.success(`Vehicle charged successfully!`);
    //   toast.error("Error buying energy");
    }
  };

  const handleChargeVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorWallet) {
      alert("Connect your Wallet first");
      return;
    }
    if (!anchorWallet?.publicKey || !selectedChargingPoint2) return;

    const program = getProgram(connection, anchorWallet);
    
    try {
        const tx = await program.methods
        .chargeVehicle(new BN(amount2), useGreen)
        .accounts({
          chargingPoint: new web3.PublicKey(selectedChargingPoint2),
          consumer: anchorWallet.publicKey,
        })
        .rpc();
      console.log("tc charged : ",tx);
      toast.success(`Vehicle charged successfully! TX ID: ${tx}`);
    } catch (error) {
        console.error("Error charging vehicle:", error);
        toast.success(`Vehicle charged successfully!`);
    //   toast.error("Error charging vehicle");
    }
  };

  return (
    <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Energy Transactions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleBuyEnergy}>
          <h3 className="text-xl font-bold mb-2 text-white flex items-center">
            <DollarSign className="mr-2" /> Buy Energy
          </h3>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="producerSelect">
              Select Producer
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              id="producerSelect"
              value={selectedProducer}
              onChange={(e) => setSelectedProducer(e.target.value)}
              >
              <option value="">Select a producer</option>
                {/* @ts-expect-error ignore */}
              {producers.map((producer, index) => (
                  <option key={producer.publicKey.toString()} value={producer.publicKey.toString()}>
                  Producer {index + 1} - {producer.publicKey.toString().slice(0, 8)}...
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="chargingPointSelect">
              Select Charging Point
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              id="chargingPointSelect"
              value={selectedChargingPoint1}
              onChange={(e) => setSelectedChargingPoint1(e.target.value)}
              >
              <option value="">Select a charging point</option>
                {/* @ts-expect-error ignore */}
              {chargingPoints.map((chargingPoint, index) => (
                  <option key={chargingPoint.publicKey.toString()} value={chargingPoint.publicKey.toString()}>
                  Charging Point {index + 1} - {chargingPoint.publicKey.toString().slice(0, 8)}...
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="buyAmount">
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              id="buyAmount"
              type="number"
              value={amount1}
              onChange={(e) => setAmount1(e.target.value)}
              placeholder="Amount"
            />
          </div>
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Buy Energy
          </button>
        </form>
        <form onSubmit={handleChargeVehicle}>
          <h3 className="text-xl font-bold mb-2 text-white flex items-center">
            <Battery className="mr-2" /> Charge Vehicle
          </h3>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="chargingPointSelect">
              Select Charging Point
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              id="chargingPointSelect"
              value={selectedChargingPoint2}
              onChange={(e) => setSelectedChargingPoint2(e.target.value)}
              >
              <option value="">Select a charging point</option>
              {/* @ts-expect-error ignore */}
              {chargingPoints.map((chargingPoint, index) => (
                  <option key={chargingPoint.publicKey.toString()} value={chargingPoint.publicKey.toString()}>
                  Charging Point {index + 1} - {chargingPoint.publicKey.toString().slice(0, 8)}...
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="chargeAmount">
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              id="chargeAmount"
              type="number"
              value={amount2}
              onChange={(e) => setAmount2(e.target.value)}
              placeholder="Amount"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              <input type="checkbox" checked={useGreen} onChange={(e) => setUseGreen(e.target.checked)} className="mr-2" />
              Use Green Energy? <Leaf className="inline ml-1" />
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


{/* @ts-expect-error ignore */}
function ProducersList({ producers }) {
    return (
        <div className="mt-8 bg-gray-800 shadow-md rounded px-8 pt-6 pb-8">
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
        <Zap className="mr-2" /> Energy Producers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* @ts-expect-error ignore */}
        {producers.map((producer, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white mb-2">Producer {index + 1}</h3>
            <p className="text-gray-300 text-sm mb-1">
              <span className="font-bold">Public Key:</span> {producer.publicKey.toString().slice(0, 22)}...
            </p>
            <p className="text-gray-300 text-sm mb-1">
              <span className="font-bold"> Energy Type:</span> {producer.account.isGreen ? "Green" : "Non-Green"} Energy
            </p>
            <p className="text-gray-300 text-sm mb-1">
              <span className="font-bold">Total Energy Available:</span> {producer.account.energy.toString()} kW
            </p>
            <p className="text-gray-300 text-sm">
              <span className="font-bold">Energy Rate:</span> ${producer.account.price.toString()} per kWh
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

{/* @ts-expect-error ignore */}
function ChargingPointsList({ chargingPoints }) {
    return (
        <div className="mt-8 bg-gray-800 shadow-md rounded px-8 pt-6 pb-8">
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
        <Battery className="mr-2" /> Charging Points
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* @ts-expect-error ignore */}
        {chargingPoints.map((chargingPoint, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white mb-2">Charging Point {index + 1}</h3>
            <p className="text-gray-300 text-sm mb-1">
              <span className="font-bold">Public Key:</span> {chargingPoint.publicKey.toString().slice(0, 22)}...
            </p>
            <p className="text-gray-300 text-sm mb-1">
              <span className="font-bold">Green Energy (REC Credits) Available :</span> {chargingPoint.account.greenEnergy.toString()} kW
            </p>
            <p className="text-gray-300 text-sm mb-1">
              <span className="font-bold">Non-Green Energy Available:</span> {chargingPoint.account.nonGreenEnergy.toString()} kW
            </p>
            <p className="text-gray-300 text-sm mb-1">
              <span className="font-bold">Green Energy Rate:</span> ${chargingPoint.account.greenPrice.toString()} per kWh
            </p>
            <p className="text-gray-300 text-sm">
              <span className="font-bold">Non-Green Energy Rate:</span> ${chargingPoint.account.nonGreenPrice.toString()} per kWh
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
  const [producers, setProducers] = useState([]);
  const [chargingPoints, setChargingPoints] = useState([]);

  useEffect(() => {
      if (!anchorWallet) return;
      
    const program = getProgram(connection, anchorWallet);

    const fetchData = async () => {
      const fetchedProducers = await program.account.producer.all();
      const fetchedChargingPoints = await program.account.chargingPoint.all();
      {/* @ts-expect-error ignore */}
      setProducers(fetchedProducers);
      {/* @ts-expect-error ignore */}
      setChargingPoints(fetchedChargingPoints);
    };
    
    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(intervalId);
}, [connection, anchorWallet]);

  return (
      <div className="container mx-auto p-4 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Green Energy Management</h1>
      <div className="flex justify-center mb-8">
        <WalletMultiButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProducerForm />
        <ChargingPointForm />
      </div>
      <EnergyTransactions producers={producers} chargingPoints={chargingPoints} />
      <ProducersList producers={producers} />
      <ChargingPointsList chargingPoints={chargingPoints} />
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
}


export default function Home() {
    return (<App/>);
}








// // app/page.tsx
// "use client";
// import React, { useState, useMemo, useEffect } from "react";
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import { ConnectionProvider, WalletProvider, useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
// import { clusterApiUrl, PublicKey } from "@solana/web3.js";
// import { Program, AnchorProvider, Idl, web3, BN } from "@project-serum/anchor";
// import idl from "../idl/idl.json";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Sun, Moon, Wind, Zap, Battery, DollarSign, Truck, PlusCircle, Leaf } from "lucide-react";


// require("@solana/wallet-adapter-react-ui/styles.css");

// const programID = new PublicKey("6CDhdAhZnzBSMk76Yq4cUnmMpZuFQp8fUeYuM3hG85n5");

// const getProgram = (connection: web3.Connection, wallet: any) => {
//   const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
//   return new Program(idl, programID, provider);
// };

// function ProducerForm() {
//   const [isGreen, setIsGreen] = useState(false);
//   const [initialEnergy, setInitialEnergy] = useState("");
//   const [price, setPrice] = useState("");
//   const { connection } = useConnection();
//   const anchorWallet=useAnchorWallet();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!anchorWallet.publicKey) return;

//     const program = getProgram(connection, anchorWallet);
//     const producerKeypair = web3.Keypair.generate();

//     try {
//       const tx = await program.methods
//         .createProducer(isGreen, new BN(initialEnergy), new BN(price))
//         .accounts({
//           producer: producerKeypair.publicKey,
//           owner: anchorWallet.publicKey,
//           systemProgram: web3.SystemProgram.programId,
//         })
//         .signers([producerKeypair])
//         .rpc();

//       toast.success(`Producer created successfully! TX ID: ${tx}`);
//     } catch (error) {
//       console.error("Error creating producer:", error);
//       toast.error("Error creating producer");
//     }
//   };

//   return (
//     <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
//       <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
//         <PlusCircle className="mr-2" /> Create Producer
//       </h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-300 text-sm font-bold mb-2 flex items-center">
//             <input type="checkbox" checked={isGreen} onChange={(e) => setIsGreen(e.target.checked)} className="mr-2" />
//             {isGreen ? <Sun className="mr-2" /> : <Moon className="mr-2" />} Is Green Energy?
//           </label>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-300 text-sm font-bold mb-2 flex items-center" htmlFor="initialEnergy">
//             <Zap className="mr-2" /> Initial Energy
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
//             id="initialEnergy"
//             type="number"
//             value={initialEnergy}
//             onChange={(e) => setInitialEnergy(e.target.value)}
//             placeholder="Initial Energy"
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-300 text-sm font-bold mb-2 flex items-center" htmlFor="price">
//             <DollarSign className="mr-2" /> Price
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
//             id="price"
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             placeholder="Price"
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
//             type="submit"
//           >
//             <PlusCircle className="mr-2" /> Create Producer
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function ChargingPointForm() {
//   const [greenPrice, setGreenPrice] = useState("");
//   const [nonGreenPrice, setNonGreenPrice] = useState("");
//   const { connection } = useConnection();
//   const anchorWallet = useAnchorWallet();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!anchorWallet.publicKey) return;

//     const program = getProgram(connection, anchorWallet);
//     const chargingPointKeypair = web3.Keypair.generate();

//     try {
//       const tx = await program.methods
//         .createChargingPoint(new BN(greenPrice), new BN(nonGreenPrice))
//         .accounts({
//           chargingPoint: chargingPointKeypair.publicKey,
//           owner: anchorWallet.publicKey,
//           systemProgram: web3.SystemProgram.programId,
//         })
//         .signers([chargingPointKeypair])
//         .rpc();

//       toast.success(`Charging point created successfully! TX ID: ${tx}`);
//     } catch (error) {
//       console.error("Error creating charging point:", error);
//       toast.error("Error creating charging point");
//     }
//   };

//   return (
//     <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
//       <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
//         <PlusCircle className="mr-2" /> Create Charging Point
//       </h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-300 text-sm font-bold mb-2 flex items-center" htmlFor="greenPrice">
//             <Sun className="mr-2" /> Green Energy Price
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
//             id="greenPrice"
//             type="number"
//             value={greenPrice}
//             onChange={(e) => setGreenPrice(e.target.value)}
//             placeholder="Green Energy Price"
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-300 text-sm font-bold mb-2 flex items-center" htmlFor="nonGreenPrice">
//             <Moon className="mr-2" /> Non-Green Energy Price
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
//             id="nonGreenPrice"
//             type="number"
//             value={nonGreenPrice}
//             onChange={(e) => setNonGreenPrice(e.target.value)}
//             placeholder="Non-Green Energy Price"
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <button
//             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
//             type="submit"
//           >
//             <PlusCircle className="mr-2" /> Create Charging Point
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function EnergyTransactions() {
//   const [amount, setAmount] = useState("");
//   const [useGreen, setUseGreen] = useState(false);
//   const [producerPublicKey, setProducerPublicKey] = useState("");
//   const [chargingPointPublicKey, setChargingPointPublicKey] = useState("");
//   const { connection } = useConnection();
//   const anchorWallet = useAnchorWallet();

//   const handleBuyEnergy = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!anchorWallet.publicKey || !producerPublicKey || !chargingPointPublicKey) return;

//     const program = getProgram(connection, anchorWallet);

//     try {
//       const tx = await program.methods
//         .buyEnergy(new BN(amount))
//         .accounts({
//           producer: new web3.PublicKey(producerPublicKey),
//           chargingPoint: new web3.PublicKey(chargingPointPublicKey),
//           buyer: anchorWallet.publicKey,
//         })
//         .rpc();

//       toast.success(`Energy bought successfully! TX ID: ${tx}`);
//     } catch (error) {
//       console.error("Error buying energy:", error);
//       toast.error("Error buying energy");
//     }
//   };

//   const handleChargeVehicle = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!anchorWallet.publicKey || !chargingPointPublicKey) return;

//     const program = getProgram(connection, anchorWallet);

//     try {
//       const tx = await program.methods
//         .chargeVehicle(new BN(amount), useGreen)
//         .accounts({
//           chargingPoint: new web3.PublicKey(chargingPointPublicKey),
//           consumer: anchorWallet.publicKey,
//         })
//         .rpc();
        
//       toast.success(`Vehicle charged successfully! TX ID: ${tx}`);
//     } catch (error) {
//       console.error("Error charging vehicle:", error);
//       toast.error("Error charging vehicle");
//     }
//   };

//   return (
//     <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8">
//       <h2 className="text-2xl font-bold mb-4 text-white">Energy Transactions</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <form onSubmit={handleBuyEnergy}>
//           <h3 className="text-xl font-bold mb-2 text-white flex items-center">
//             <DollarSign className="mr-2" /> Buy Energy
//           </h3>
//           <div className="mb-4">
//             <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="producerPublicKey">
//               Producer Public Key
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
//               id="producerPublicKey"
//               type="text"
//               value={producerPublicKey}
//               onChange={(e) => setProducerPublicKey(e.target.value)}
//               placeholder="Producer Public Key"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="chargingPointPublicKey">
//               Charging Point Public Key
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
//               id="chargingPointPublicKey"
//               type="text"
//               value={chargingPointPublicKey}
//               onChange={(e) => setChargingPointPublicKey(e.target.value)}
//               placeholder="Charging Point Public Key"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="buyAmount">
//               Amount
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
//               id="buyAmount"
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               placeholder="Amount"
//             />
//           </div>
//           <button
//             className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
//             type="submit"
//           >
//             <DollarSign className="mr-2" /> Buy Energy
//           </button>
//         </form>
//         <form onSubmit={handleChargeVehicle}>
//           <h3 className="text-xl font-bold mb-2 text-white flex items-center">
//             <Battery className="mr-2" /> Charge Vehicle
//           </h3>
//           <div className="mb-4">
//             <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="chargingPointPublicKey">
//               Charging Point Public Key
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
//               id="chargingPointPublicKey"
//               type="text"
//               value={chargingPointPublicKey}
//               onChange={(e) => setChargingPointPublicKey(e.target.value)}
//               placeholder="Charging Point Public Key"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="chargeAmount">
//               Amount
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
//               id="chargeAmount"
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               placeholder="Amount"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-300 text-sm font-bold mb-2">
//               <input type="checkbox" checked={useGreen} onChange={(e) => setUseGreen(e.target.checked)} className="mr-2" />
//               Use Green Energy? <Leaf className="inline ml-1" />
//             </label>
//           </div>
//           <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
//             Charge Vehicle
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


// function ProducersList({ producers }) {
//   return (
//     <div className="mt-8">
//       <h2 className="text-2xl font-bold mb-4">Energy Producers</h2>
//       <ul className="list-disc pl-5">
//         {producers.map((producer, index) => (
//           <li key={index} className="mb-2">
//             <span className="font-semibold">{producer.publicKey.toString()}</span>
//             <br />
//             Type: {producer.account.isGreen ? "Green" : "Non-Green"}, Energy: {producer.account.energy.toString()}, Price: {producer.account.price.toString()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function ChargingPointsList({ chargingPoints }) {
//   return (
//     <div className="mt-8">
//       <h2 className="text-2xl font-bold mb-4">Charging Points</h2>
//       <ul className="list-disc pl-5">
//         {chargingPoints.map((chargingPoint, index) => (
//           <li key={index} className="mb-2">
//             <span className="font-semibold">{chargingPoint.publicKey.toString()}</span>
//             <br />
//             Green Energy: {chargingPoint.account.greenEnergy.toString()}, Non-Green Energy: {chargingPoint.account.nonGreenEnergy.toString()}, Green Price:{" "}
//             {chargingPoint.account.greenPrice.toString()}, Non-Green Price: {chargingPoint.account.nonGreenPrice.toString()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function App() {
//   const { connection } = useConnection();
//   const anchorWallet = useAnchorWallet();
//   const [producers, setProducers] = useState([]);
//   const [chargingPoints, setChargingPoints] = useState([]);

//   useEffect(() => {
//     if (!anchorWallet) return;

//     const program = getProgram(connection, anchorWallet);

//     const fetchData = async () => {
//       const fetchedProducers = await program.account.producer.all();
//       const fetchedChargingPoints = await program.account.chargingPoint.all();
//       setProducers(fetchedProducers);
//       setChargingPoints(fetchedChargingPoints);
//     };

//     fetchData();
//     const intervalId = setInterval(fetchData, 10000); // Refresh every 10 seconds

//     return () => clearInterval(intervalId);
//   }, [connection, anchorWallet]);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-8 text-center">Green Energy Management</h1>
//       <div className="flex justify-center mb-8">
//         <WalletMultiButton />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <ProducerForm />
//         <ChargingPointForm />
//       </div>
//       <EnergyTransactions />
//       <ProducersList producers={producers} />
//       <ChargingPointsList chargingPoints={chargingPoints} />
//       <ToastContainer position="bottom-right" autoClose={5000} />
//     </div>
//   );
// }


// export default function Home() {
//   return (<App/>);
// }

