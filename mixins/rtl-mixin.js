import { dedupeMixin } from '@open-wc/dedupe-mixin';

export const RtlMixin = dedupeMixin(superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * The directionality of the text of the document
			 * @type {'ltr'|'rtl'}
			 */
			dir: { type: String, reflect: true }
		};
	}

	constructor() {
		super();
		const dir = document.documentElement.getAttribute('dir');
		// avoid reflecting "ltr" for better performance
		if (dir && dir !== 'ltr') {
			this.dir = dir;
		}
	}

});
