import type { CreateItemAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { itemsKey } from '$services/keys';
import { serialize } from './serialize';
import { deserialize } from '$services/queries/items/deserialize';
export const getItem = async (id: string) => {
	const item = await  client.hGetAll(itemsKey(id))

	if (Object.keys(item).length === 0){
		return null
	}

	return deserialize(id, item)
};

export const getItems = async (ids: string[]) => {
	return []
};

export const createItem = async (attrs: CreateItemAttrs) => {
	const id = genId()

	const serialized = serialize(attrs)

	await client.hSet(itemsKey(id), serialized)

	return id
};
