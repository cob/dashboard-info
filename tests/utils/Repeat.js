import sleep from "src/utils/Sleep.js"

export default async function repeat(retries, sleepBetweenRetries, fn) {
    for (let i = 0; i < retries; i++) {
        fn();
        await sleep(sleepBetweenRetries)
    }
}