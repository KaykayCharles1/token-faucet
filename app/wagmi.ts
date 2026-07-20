import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { baseSepolia } from "wagmi/chains";

const projectId=process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!;
const rpcUrl=process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL!;

export const config = getDefaultConfig({
    appName: "Bash Token Faucet",
    projectId: projectId,
    chains: [baseSepolia],
    transports: {
        [baseSepolia.id]: http(rpcUrl)
    },
    ssr: true,
});