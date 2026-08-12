import {formatUnits} from "viem";
import { useFaucetStatus } from "../hooks/useFaucetStatus";

export function BalanceDisplay() {
    const {balance, isConnected, isLoading} = useFaucetStatus()
    const cleanBalance = formatUnits(balance, 18);

    if(!isConnected) {
        return (
            <div className="text-gray-900 dark:text-slate-100">
                <p>Connect your wallet</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="text-gray-900 dark:text-slate-100">
                <p>Loading data...</p>
            </div>
        )
    }


    return (
        <div className="flex flex-col w-full text-gray-900 dark:text-slate-100">
            <h2 className="text-center text-2xl mb-2 font-bold">Bash Token Faucet</h2>
            <p className="font-medium text-center">Bash Token Balance: {cleanBalance} BASH</p>
        </div>
    )
}