// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {BashToken} from "../src/FaucetToken.sol";
import {Faucet} from "../src/Faucet.sol";

contract DeployBash is Script {
    function run() external {
        string memory _name = "Bash Token";
        string memory _symbol = "BASH";
        uint256 maxSupply = 1_000_000;
        uint256 claimPeriod = 86400; // 1 day claim period before another claim

        vm.startBroadcast();
        BashToken bashtoken = new BashToken(_name, _symbol, maxSupply);
        Faucet faucet = new Faucet(address(bashtoken), claimPeriod, 1);
        
        bashtoken.transfer(address(faucet), 100_000 ether);
        vm.stopBroadcast();
    }

    
}

