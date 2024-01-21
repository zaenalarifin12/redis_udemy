import { client } from '$services/redis/client';
import { itemsIndexKey } from '../../../seeds/seed-keys';
import { SchemaFieldTypes } from 'redis';
import { itemsKey } from '$services/keys';

export const createIndexes = async () => {
	const indexes = await client.ft._list()

	const exists = indexes.find(index => index == itemsIndexKey())

	if (exists) {
		return
	}


	// @ts-ignore
	return client.ft.create(itemsIndexKey(), {
		name: {
			type: SchemaFieldTypes.TEXT,
			SORTABLE: true, // Enable sorting for the "name" field
		},
		description: {
			type: SchemaFieldTypes.TEXT,
			SORTABLE: false, // Use unfielded sorting for "description"
		},
		ownerId: {
			type: SchemaFieldTypes.TAG,
			SORTABLE: false, // Enable sorting for "ownerId"
		},
		bids: {
			type: SchemaFieldTypes.NUMERIC,
			SORTABLE: true, // Enable sorting for "bids"
		},
		endingAt: { // Include "endingAt" field if needed
			type: SchemaFieldTypes.NUMERIC,
			SORTABLE: true,
		},
		views: { // Include "views" field if needed
			type: SchemaFieldTypes.NUMERIC,
			SORTABLE: true,
		},
		price: { // Include "price" field if needed
			type: SchemaFieldTypes.NUMERIC,
			SORTABLE: true,
		},
		likes: { // Include "likes" field if needed
			type: SchemaFieldTypes.NUMERIC,
			SORTABLE: true,
		}
	}, {
		ON: 'HASH',
		PREFIX: itemsKey("")
	});
};
