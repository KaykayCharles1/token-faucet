// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Faucet is Ownable {
    using SafeERC20 for IERC20;
    event UserClaim(address indexed user, uint256 amount, uint256 timestamp);
    event TokensWithdrawn(address indexed owner, uint256 amount);

    error ClaimTooSoon(address user); //Custom error saves gas fees and even save more without any string

    IERC20 public token;
    uint256 public immutable claimAmount;
    uint256 public immutable claimPeriod;
    uint256 private constant DECIMALS = 10**18;
    
    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public totalClaimed;

    constructor(address _token, uint256 _claimPeriod, uint256 _claimAmount) Ownable(msg.sender) {
        token = IERC20(_token);
        claimAmount = _claimAmount * DECIMALS;
        claimPeriod = _claimPeriod; // When deploying, write 86400 for 24 hours 
    }

    modifier hasWaitedClaimPeriod () {
        if (block.timestamp < lastClaimTime[msg.sender] + claimPeriod) {
            revert ClaimTooSoon(msg.sender);
        }
        _;
    }

    function claim() public hasWaitedClaimPeriod {
        require(token.balanceOf(address(this)) >= claimAmount, "Unable to claim");
        lastClaimTime[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += claimAmount;
        token.safeTransfer(msg.sender, claimAmount);
        
        emit UserClaim(msg.sender, claimAmount, block.timestamp);
    }

    function getLastClaimed(address user) external view returns (uint256) {
        return lastClaimTime[user];
    }

    function withdrawTokens(uint256 _amount) external onlyOwner {
        uint256 amount = _amount * DECIMALS;
        uint256 faucet_balance = token.balanceOf(address(this));

        require(amount > 0, "Must be greater than zero");
        require(faucet_balance >= amount, "Insufficient faucet balance");

        token.safeTransfer(owner(), amount);

        emit TokensWithdrawn(owner(), amount);
    }
}