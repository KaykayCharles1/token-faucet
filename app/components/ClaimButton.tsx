"use client";

import { useFaucetStatus } from "../hooks/useFaucetStatus"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { FAUCET_ABI, FAUCET_ADDRESS } from "../lib/contracts"
import { formatSecondsToHMS } from "../utils/timeFormat";
import { getErrorMessage } from "../utils/errorMessages";


export function ClaimButton() {
    const {
        canClaim,
        isConnected,
        isLoading: isStatusLoading,
        secondsRemaining
    } = useFaucetStatus()

    const {
        writeContract, 
        data: hash, 
        isPending: isSigning, 
        error: writeError
    } = useWriteContract();

    const {
        isLoading: isConfirming, 
        isSuccess
    } = useWaitForTransactionReceipt({
        hash,
    });

    const {openConnectModal} = useConnectModal(); 

    const handleClaim = () => {
        if (!isConnected && openConnectModal) {
            openConnectModal();
        } else {
            writeContract({
            address: FAUCET_ADDRESS,
            abi: FAUCET_ABI,
            functionName: "claim",
        });
        }
    };

    const buttonDisabled = isSigning || isConfirming || isStatusLoading || !canClaim

    return(
        <div className="flex flex-col w-full items-center gap-3">
            <button
                className="flex gap-2 bg-blue-500 text-white text-sm px-4 py-3 rounded-lg border-2 border-slate-400 font-bold hover:bg-blue-600 cursor-pointer"
                disabled = {buttonDisabled}
                onClick={handleClaim}
            >
                {!isConnected && "Connect wallet to claim"}
                {isConnected && isStatusLoading && "Please wait..."}
                {isConnected && !isStatusLoading && !isSigning && !isConfirming && canClaim && "Claim BASH"}
                {isConnected && !isStatusLoading && isSigning && "Confirm in Wallet"}
                {isConnected && !isStatusLoading && isConfirming && "Claiming..."}
                {isConnected && !isStatusLoading && !isSigning && !isConfirming && !canClaim && `Next Claim in ${formatSecondsToHMS(secondsRemaining)}`}
            </button>

            <div className="w-full text-center break-words">
                {writeError && (
                    <p className="text-red-400">Transaction Failed: {getErrorMessage(writeError)}</p>
                )}

                {isSuccess && (
                    <p className="text-green-400">BASH Claimed Successfully</p>
                )}
            </div>
            
        </div>
    )
}


