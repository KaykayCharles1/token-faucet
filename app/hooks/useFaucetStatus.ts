import { useAccount, useReadContract } from "wagmi";
import { BASH_TOKEN_ABI, BASH_TOKEN_ADDRESS, FAUCET_ABI, FAUCET_ADDRESS } from "../lib/contracts";

interface FaucetStatus {
    balance: bigint,
    canClaim: boolean,
    secondsRemaining: number,
    isLoading: boolean,
    isConnected: boolean
}

export function useFaucetStatus(): FaucetStatus {
    const { address } = useAccount(); //gets the user wallet address 

    const { data: balance, isLoading: balanceLoading} = useReadContract({
        address: BASH_TOKEN_ADDRESS,
        abi: BASH_TOKEN_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,  //check if user wallet is connected
        query: {
            enabled: !!address
        }
    });

    const { data: lastClaimed, isLoading: claimLoading} = useReadContract({
        address: FAUCET_ADDRESS,
        abi: FAUCET_ABI,
        functionName: "getLastClaimed",
        args:address ? [address] : undefined,
        query: {
            enabled: !!address
        }
    });

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const currentTimeInBI = BigInt(nowInSeconds);
    const twentyFourHoursBI = BigInt(24 * 60 * 60);

    const lastClaimedTime = (lastClaimed as bigint) ?? BigInt(0);

    const canClaim = currentTimeInBI >= (lastClaimedTime + twentyFourHoursBI);

    const rawSecondsRemaining = twentyFourHoursBI - (currentTimeInBI - lastClaimedTime);

    const secondsRemaining = canClaim ? 0 : Number(rawSecondsRemaining);

    return {
        balance: (balance as bigint) ?? BigInt(0),
        canClaim: canClaim,
        secondsRemaining: secondsRemaining,
        isLoading: balanceLoading || claimLoading,
        isConnected: !!address
    };
}

