// app/page.tsx
"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import ProducerForm from "@/components/ProducerForm";
import ChargingPointForm from "@/components/ChargingPointForm";
import EnergyTransactions from "@/components/EnergyTransactions";

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Green Energy Management</h1>
      <div className="flex justify-center mb-8">
        <WalletMultiButton />
      </div>
      {connected ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProducerForm />
            <ChargingPointForm />
          </div>
          <EnergyTransactions />
        </>
      ) : (
        <p className="text-center">Please connect your wallet to use the application.</p>
      )}
    </div>
  );
}
