export default function retry(retries, sleepBetweenRetries, evalFn, onSuccess) {
    const result = evalFn()

    if (result) {
        onSuccess()
        return;
    }

    if (retries === 0) return

    setTimeout(
        () => retry(--retries, sleepBetweenRetries, evalFn, onSuccess),
        sleepBetweenRetries)
}