import { type Abi } from "viem";
import BashTokenContract from "../../contracts/out/FaucetToken.sol/BashToken.json"
import FaucetContract from "../../contracts/out/Faucet.sol/Faucet.json"

export const BASH_TOKEN_ABI = BashTokenContract.abi as Abi;
export const BASH_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_BASH_TOKEN_ADDRESS as `0x${string}`;

export const FAUCET_ABI = FaucetContract.abi as Abi;
export const FAUCET_ADDRESS = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as `0x${string}`;