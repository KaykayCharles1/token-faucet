import {formatUnits} from "viem";
import { useFaucetStatus } from "../hooks/useFaucetStatus";

function formatSecondsToHMS(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600)/60);
    const seconds = Math.floor(totalSeconds % 60);

    const hourChange = String(hours).padStart(2, "0");
    const minutesChange = String(minutes).padStart(2, "0");
    const secondsChange = String(seconds).padStart(2, "0");
    
    return(`${hourChange}:${minutesChange}:${secondsChange}`)
}

export function BalanceDisplay() {
    const {balance, canClaim, secondsRemaining, isConnected, isLoading} = useFaucetStatus()
    const cleanBalance = formatUnits(balance, 18);

    if(!isConnected) {
        return (
            <div>
                <p>Connect your wallet</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div>
                <p>Loading data...</p>
            </div>
        )
    }

    return (
        <div>
            <h2>Bash Token Faucet</h2>
            <p>Bash Token Balance: {cleanBalance} BASH</p>

            <div>
                {canClaim ? (
                <p>Claim Tokens</p> 
            ) : (
                <p>Time Remaining: {formatSecondsToHMS(secondsRemaining)}</p>
            )}
            </div>
        </div>
    )
}