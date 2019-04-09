export const RtlMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_dir: { type: String, reflect: true, attribute: 'dir' }
		};
	}

	constructor() {
		super();
		this._dir = document.documentElement.getAttribute('dir');
	}

};
