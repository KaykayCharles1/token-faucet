"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFaucetStatus } from "../hooks/useFaucetStatus";

export function ConnectWallet() {
    const { isConnected } = useFaucetStatus();

    if(isConnected || !isConnected) {
        return <ConnectButton/>
    }
    
}
