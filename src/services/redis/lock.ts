import { randomBytes } from 'crypto';
import { client } from '$services/redis/client';

export const withLock = async (key: string, cb : (redisClient: Client, signal: any) => any) => {
	// Initialize a few variable to control retry behaviour
	const retryDelayMs = 100
	let retries = 200

	// generates a random value to store at the lock key
	const token = randomBytes(6).toString("hex")
	// create the lock key
	const lockKey = `lock:${key}`

	let expiredTime = 2000

	// set up a while loop to implement the retry behaviour
	while (retries >= 0) {
		retries--
		// Try to do a SET NX operation
		const acquired = await client.set(lockKey, token, {
			NX: true,
			PX: expiredTime
		})

		if (!acquired) {
			// ELSE brief pause (RetryDelayMs) and then retry
			await pause(retryDelayMs)
			// continue;
		}

		// IF the set is successful, then run the callback

		try {
			const signal = { expired: false}
			setTimeout(() => {
				signal.expired = true
			}, expiredTime)

			const proxiesClient = buildClientProxy(expiredTime)
			const result = await cb(proxiesClient, signal)
			// unset the locked set
			return result

		} finally {
			// await client.del(lockKey)
			await client.unlock(lockKey, token)


		}

	}

};

type Client = typeof client
const buildClientProxy = (timeoutMs: number) => {
	const startTime = Date.now()

	const handler = {
		get(target: Client, prop: keyof Client) {
			if (Date.now() >= startTime + timeoutMs) {
				throw new Error("Lock has expired")
			}

			const value = target[prop]
			return typeof value === "function" ? value.bind(target) : value
		}
	}

	return new Proxy(client, handler) as Client

};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
