export interface ChecklistItem {
	id: number;
	question: string;
	answer: string;
	feedback: string;
	correctAnswer: string; //todo: move to exemplar, these will be in the teacher checklist
	//todo: move to exemplar,
	correct: boolean; //todo: move to exemplar,
}

export type File = {
	name: string;
	fileType: string;
	url: string;
};
export interface Artefact {
	id: number;
	title: string;
	checklist: ChecklistItem[];
	content: string | null;
	files: File[];
	createdAt: string;
	authorName: string;
	author_id: number;
	meta: {};

	reviews: any[] | null;
}

export interface Exemplar extends Artefact {
	id: number;
	authoritative_checklist: ChecklistItem[];
	official_artefact_feedback_id: number;
	artefact_id: number;
}

export type NewArtefact = Partial<
	Pick<Artefact, 'title' | 'content' | 'files' | 'checklist' | 'meta'>
>;

export const emptyNewArtefact: NewArtefact = {
	title: '',
	content: '',
	files: [],
	checklist: [],
	meta: {}
};

export const buildArtefact = (artefactData: any): Artefact => {
	return {
		id: artefactData.id,
		title: artefactData.title,
		content: artefactData.content,
		createdAt: artefactData.created,
		authorName: artefactData.author_name,
		author_id: artefactData.author_id,
		checklist: artefactData.checklist,
		files: artefactData.files, //todo: fix URL here
		reviews: artefactData.reviews,
		brief_title: artefactData.brief_title,
		brief_version_id: artefactData.brief_version_id
	};
};

export const buildExemplar = (exemplarData: any): Exemplar => {
	const artefact = buildArtefact(exemplarData);

	//TODO:
	//check that the two checklists have same items in same order
	//throw error if not
	return {
		...artefact,
		id: exemplarData.id,
		authoritative_checklist: exemplarData.authoritative_checklist,
		official_artefact_feedback_id: exemplarData.official_artefact_feedback_id,
		artefact_id: exemplarData.artefact_id
	};
};

export interface RequirementTemplate {
	id: string;
	description: string;
}

export interface Requirement {
	id: string;
	brief_id: string;
	description: string;
	status: 'future' | 'active' | 'complete' | 'failed';
	section_name: string;
}

export interface Brief {
	id: string;
	version: number;
	title: string;
	content: string;
	requirements: Requirement[];
	requirements_text: string;
	brief_version_id: number;
	checklist_items: ChecklistItem[];
	version_number: number;
}
