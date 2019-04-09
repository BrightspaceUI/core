export const RtlMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_dir: { type: String, reflect: true, attribute: 'dir' }
		};
	}

	constructor() {
		super();
		const dir = document.documentElement.getAttribute('dir');
		if (dir) this._dir = dir;
	}

};
