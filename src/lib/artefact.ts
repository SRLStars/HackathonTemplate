import type { Artefact } from '$lib/types';
import { postJson } from '$lib/fetch';

export const requestAIReview = (artefact: Artefact, callback = () => {}) => {
	console.log('startReview on artefact id', artefact.id);

	postJson('/ai-review', {
		artefact_id: artefact.id
	}).then((data) => {
		console.log(data);
		console.log('complete review: invalidateAll');
		callback();
	});
};
