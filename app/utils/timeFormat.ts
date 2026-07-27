export function formatSecondsToHMS(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600)/60);
    const seconds = Math.floor(totalSeconds % 60);

    const hourChange = String(hours).padStart(2, "0");
    const minutesChange = String(minutes).padStart(2, "0");
    const secondsChange = String(seconds).padStart(2, "0");
    
    return(`${hourChange}:${minutesChange}:${secondsChange}`)
}
