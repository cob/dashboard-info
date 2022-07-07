import sleep from "src/utils/Sleep.js"

export default async function retry(retries, sleepBetweenRetries, evalFn) {
    for (let i = 0; i < retries; i++) {

        const result = evalFn()

        if (result) {
            return Promise.resolve(true);
        }

        await sleep(sleepBetweenRetries)
    }

    return Promise.resolve(false);

}