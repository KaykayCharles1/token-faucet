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
        <div>
            <button
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

            {writeError && (
                <p>Transaction Failed: {getErrorMessage(writeError)}</p>
            )}


            {isSuccess && (
                <p>BASH Claimed Successfully</p>
            )}
        </div>
    )
    
    
}


