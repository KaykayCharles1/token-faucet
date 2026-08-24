"use client";

import { useLeaderboard } from "../hooks/useLeaderboard";
import { formatUnits } from "viem";
import {Search} from "lucide-react";

export function LeaderboardTable() {
    const{isLoading, leaderboard} = useLeaderboard();
    
    const formatAddress = (address: string) => {
        if(!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    const formatAmount = (amount: bigint) => {
        try{
            const formatted = formatUnits(amount, 18);

            //Round to 2 decimal in case I choose to change my claim amount to decimal figures
            return parseFloat(formatted).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            })
        } catch {
            return amount.toString();
        }
        
    }
    
    if(isLoading) {
        return(
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                <p className="text-grey-400 font-medium">Loading Leaderboard</p>
            </div>
        )
    }

    if(leaderboard.length === 0) {
        return(
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <Search className="h-10 w-10 text-blue-400" />
            <p className="text-center text-yellow-200 font-medium">No claims yet</p>
        </div>
        )
    }

    if(leaderboard){
        return(
        <div className="w-full items-center mt-6 shadow-2xl rounded-2xl bg-gray-900">

            {/* Header */}
            <div className="p-6 border-b border-gray-800 bg-gray-900/50 text-center">
                <h2 className="text-2xl font-bold text-white tracking-wide">Top 10 Claimers</h2>
                <p className="text-medium text-gray-400 mt-1">Ranked by total BASH token claimed</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-gray-800 text-sm font-semibold uppercase tracking-wider text-gray-400 bg-gray-950/40">
                            <th>Rank</th>
                            <th>Address</th>
                            <th>Total Claimed</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700/60">
                        {leaderboard.map((entry, index) => {
                            const rank = index + 1;

                            const rankBg = 
                                rank === 1 ? "bg-amber-500/10 text-amber-400" :
                                rank === 2 ? "bg-slate-400/10 text-slate-300" :
                                rank === 3 ? "bg-amber-700/10 text-amber-600" :
                                "text-gray-400"

                            return (
                                <tr key={entry.address} className="w-full hover:bg-gray-800/30 transition-colors duration-150">

                                    {/* Rank Column */}
                                    <td className="py-4 px-6 font-bold">
                                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm ${rankBg}`}>
                                            {rank}
                                        </span>
                                    </td>

                                    {/* Addresses Column */}
                                    <td className="py-4 px-6 font-mono text-sm font-medium text-gray-300">
                                        <span>{formatAddress(entry.address)}</span>
                                    </td>

                                    {/* Amount Column */}
                                    <td className="py-4 px-6 font-semibold text-emerald-400 text-sm tracking-wide">
                                        <span>{formatAmount(entry.total)}</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
    }
    
}