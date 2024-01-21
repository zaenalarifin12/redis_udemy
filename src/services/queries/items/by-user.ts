import { client } from '$services/redis';
import { itemsIndexKey } from '../../../../seeds/seed-keys';
import { deserialize } from '$services/queries/items/deserialize';

interface QueryOpts {
	page: number;
	perPage: number;
	sortBy: string;
	direction: string;
}

export const itemsByUser = async (userId: string, opts: QueryOpts) => {
	const query = `@ownerId:{${userId}}`

	const sortCriteria = opts.sortBy && opts.direction && {
		BY: opts.sortBy, direction: opts.direction
	}

	const { total, documents} = await client.ft.search(itemsIndexKey(), query, {
		ON: "HASH",
		// SORTBY: sortCriteria,
		// LIMIT: {
		// 	from: opts.page * opts.perPage,
		// 	size: opts.perPage
		// }
	} as any)

	console.log("okkkkk", total, documents)

	return {
		totalPages: Math.ceil(total / opts.perPage),
		items: documents.map(({id, value}) => {
			return deserialize(id.replace("items#", ""), value as any)
		})
	}
};
