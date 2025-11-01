import Hashids from 'hashids';

const hashids = new Hashids('secret salt', 6, 'abcdefghjkmnpqrstuvwxyz23456789'); // remove ambiguous chars i,l,1,o,0 from alphabet; minimum length of hash 6

export function encodeId(id) {
	return hashids.encode(id);
}

export function decodeId(hash) {
	const decoded = hashids.decode(hash);
	if (decoded.length > 0) {
		return decoded[0];
	}
	return null;
}
