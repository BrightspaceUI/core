import '../button/button.js';
import { html } from 'lit';

//const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const pagingTypes = {
	NONE: 'none',
	LOADMORE: 'load-more'
};

/*
export const PageableMixin = superclass => class extends superclass {

	static get properties() {
		return {
			pagingType: { type: String, attribute: 'paging-type' }
		};
	}

	constructor() {
		super();
		this.pagingType = pagingTypes.NONE;
	}

	renderPager() {
		return html`<d2l-button>Load More</d2l-button>`;
	}

};
*/
