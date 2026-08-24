// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {Faucet} from "../src/Faucet.sol";
import {BashToken} from "../src/FaucetToken.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract FaucetTest is Test {
    BashToken public bashToken;
    Faucet public faucet;

    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    uint256 MAX_SUPPLY = 1_000_000;


    function setUp() public {
        bashToken = new BashToken("Bash Token", "BASH", MAX_SUPPLY);
        faucet = new Faucet(address(bashToken), 86400, 1);

        bashToken.transfer(address(faucet), 500_000 ether);

        vm.warp(block.timestamp + 1 days); //This changes the default timestamp in Foundry from default 1 to 1 day(86401)

        vm.label(alice, "Alice");
        vm.label(bob, "Bob");
        vm.label(address(bashToken), "Bash Token CA");
        vm.label(address(faucet), "Faucet CA");
    }

    function testFirstClaimSucceeds() public {
        vm.startPrank(bob);
        faucet.claim();
        vm.stopPrank();

        assertEq(bashToken.balanceOf(bob), 1 ether);
    }

    function testClaimSucceedAfter24hrs() public {
        vm.startPrank(alice);
        faucet.claim();
        vm.warp(block.timestamp + 1 days);
        faucet.claim();
        vm.stopPrank();

        assertEq(bashToken.balanceOf(alice), 2 ether);
        console.log("Alice claim balance:", bashToken.balanceOf(alice));
        console.log("Faucet balance:", bashToken.balanceOf(address(faucet)));
    }

    function testClaimFailedBefore24hrs() public {
        vm.startPrank(alice);
        faucet.claim();
        vm.warp(block.timestamp + 6 hours);
        vm.expectRevert();
        faucet.claim();
        vm.stopPrank();

        assertEq(bashToken.balanceOf(alice), 1 ether);
    }

    function testUserTotalClaimIncrement() public {
        vm.startPrank(alice);
        faucet.claim();
        vm.warp(block.timestamp + 24 hours);
        faucet.claim();
        vm.warp(block.timestamp + 24 hours);
        faucet.claim();
        vm.stopPrank();

        assertEq(bashToken.balanceOf(alice), 3 ether);
        assertEq(faucet.totalClaimed(alice), 3 ether);
    }

    function testOnlyOwnerWithdraw() public {
        address deployer = faucet.owner();
        vm.startPrank(deployer);
        uint256 old_balance = bashToken.balanceOf(deployer);
        faucet.withdrawTokens(200);
        uint256 new_balance = bashToken.balanceOf(deployer);
        vm.stopPrank();

        assertEq(new_balance, old_balance + 200 ether);
        console.log("Deployer balance:", bashToken.balanceOf(deployer));
        console.log("Faucet balance:", bashToken.balanceOf(address(faucet)));
    }

    function testUserWithdrawFails() public {
        vm.startPrank(alice);
        vm.expectRevert();
        faucet.withdrawTokens(200);
        vm.stopPrank();
        
        assertEq(bashToken.balanceOf(alice), 0);
    }

    function testInsufficientFaucetBalance() public {
        Faucet poorFaucet = new Faucet(address(bashToken), 86400, 1);
        bashToken.transfer(address(poorFaucet), 0.1 ether);

        vm.startPrank(alice);
        vm.expectRevert();
        poorFaucet.claim();
        vm.stopPrank();

        assertEq(bashToken.balanceOf(alice), 0);
    }

    function testGetLastClaimedForUsers() public {
        vm.startPrank(alice);
        faucet.claim();
        uint256 firstClaimTime = faucet.getLastClaimed(alice);
        vm.warp(firstClaimTime + 1 days);
        faucet.claim();
        uint256 secondClaimTime = faucet.getLastClaimed(alice);
        vm.stopPrank();

        console.log("Last claim time:", firstClaimTime);
        console.log("Current time:", block.timestamp); 
        console.log("Second claim time:", secondClaimTime);
        assertEq(secondClaimTime, block.timestamp);

    }

    function testUserEmit() public {
        vm.startPrank(alice);
        vm.expectEmit(true, false, false, true, address(faucet));
        emit Faucet.UserClaim(alice, 1 ether, block.timestamp);
        uint256 time_before = block.timestamp;

        faucet.claim();
        uint256 time_after = block.timestamp;

        assertEq(time_before, time_after);
    }
}

