import { client } from '$services/redis';
import { itemsByViewsKey, itemsKey } from '$services/keys';
import { itemsViewsKey } from '../../../seeds/seed-keys';

export const incrementView = async (itemId: string, userId: string) => {

	return client.incrementView(itemId, userId)
	// const inserted = await client.pfAdd(itemsViewsKey(itemId), userId)
	//
	// if (inserted) {
	// 	return Promise.all([
	// 		client.hIncrBy(itemsKey(itemId), "views", 1),
	// 		client.zIncrBy(itemsByViewsKey(), 1, itemId)
	// 	])
	// }

};
