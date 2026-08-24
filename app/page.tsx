"use client";

import { ConnectWallet } from "./components/ConnectWallet";
import { BalanceDisplay } from "./components/BalanceDisplay";
import { ClaimButton } from "./components/ClaimButton";
import { LeaderboardTable } from "./components/LeaderboardDisplay";

export default function Home() {  
  return (
    <div className="flex flex-col min-h-screen items-center font-sans bg-zinc-50 dark:bg-black">
      <main className="flex flex-col flex-1 gap-5 w-full max-w-3xl justify-center items-center p-8">
        <ConnectWallet/>
        <BalanceDisplay/>
        <ClaimButton/>
        <LeaderboardTable/>
      </main>
    </div>
  );
}
