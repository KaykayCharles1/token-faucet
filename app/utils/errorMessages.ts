export function getErrorMessage (error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes("user rejected ")) {
        return "You rejected the transaction";
    }

    if (message.includes("insufficient funds")) {
        return "Not enough ETH for gas fees"
    }

    if (message.includes("execution reverted")) {
        return "Claim failed — you may still be in your cooldown period"
    }

    return "Something went wrong. Please try again"

}