import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { FAUCET_ADDRESS } from "../lib/contracts";

interface LeaderboardEntry {
    address: string,
    total: bigint
}

type Totals = Record<string, bigint>;
type TotalsWithBigInt = { [address: string]: bigint };
type TotalsWithStrings = { [address: string]: string };

function serializeTotals(totals: TotalsWithBigInt): TotalsWithStrings {
    return Object.fromEntries(
        Object.entries(totals).map(([address, amount]) =>[
            address,
            amount.toString()
        ])
    )
}

function deserializeTotals(totals: TotalsWithStrings): TotalsWithBigInt {
    return Object.fromEntries(
        Object.entries(totals).map(([address, amountString]) => [
            address,
            BigInt(amountString)
        ])
    )
}

export function useLeaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const publicClient = usePublicClient();

    useEffect(() => {
        const CACHE_KEY = "faucet_leaderboard_cache" 

        const fetchLogs = async () => {
            if (!publicClient) return;

            const cached = localStorage.getItem(CACHE_KEY);
            let cachedTotals: Totals = {};
            let startingFrom = 45532593n;

            if(cached) {
                const parsed = JSON.parse(cached);
                cachedTotals = deserializeTotals(parsed.totals);
                startingFrom = BigInt(parsed.latestScannedBlock) + 1n;
            }

            const latestBlock = await publicClient.getBlockNumber();
            const chunkSize = 10000n;
            const allLogs = [];

            
            while (startingFrom <= latestBlock) {
                const toBlock = startingFrom + chunkSize > latestBlock ? latestBlock : startingFrom + chunkSize;

                const chunkLogs = await publicClient.getLogs({
                    address: FAUCET_ADDRESS,
                    event: parseAbiItem("event UserClaim(address indexed user, uint256 amount, uint256 timestamp)"),
                    fromBlock: startingFrom,
                    toBlock: toBlock
                });

                allLogs.push(...chunkLogs); 
                startingFrom = toBlock + 1n;

                // console.log("All logs: ", allLogs);
                console.log("Chunk from", startingFrom, "found", chunkLogs.length, "logs. Running total:", allLogs.length);
            }

            const updatedTotals = allLogs.reduce((accumulator, log) => {
                const { user, amount } = log.args;
                if(!user || amount === undefined) return accumulator;
                accumulator[user] = (accumulator[user] ?? 0n) + amount;
                return accumulator;
            }, cachedTotals)
            
            const cacheSerialized = {
                latestScannedBlock: latestBlock.toString(),
                totals: serializeTotals(updatedTotals)
            }

            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheSerialized))

            const leaderboardFormat: LeaderboardEntry[] = Object.entries(updatedTotals)
            .map(([ address, total ]) => ({address,total}))
            .sort((userA, userB) => {
                return userB.total > userA.total ? 1 : userB.total < userA.total ? -1 : 0
            })
            .slice(0, 10);
            setLeaderboard(leaderboardFormat); 
            setIsLoading(false);
            console.log("Totals: ", updatedTotals);
        }   
        fetchLogs();
    }, [publicClient])
    return {leaderboard, isLoading};
}