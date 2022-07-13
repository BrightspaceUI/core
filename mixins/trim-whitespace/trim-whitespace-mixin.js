import { TrimWhitespaceCore } from './trim-whitespace.js';

export const TrimWhitespaceMixin = superclass => class extends superclass {
	static get properties() {
		return {
			trimWhitespaceDeep: { type: Boolean, attribute: 'trim-whitespace-deep', reflect: true },
		};
	}

	constructor() {
		super();
		this._trimWhitespaceCore = new TrimWhitespaceCore(this, this.trimWhitespaceDeep);
	}

	set trimWhitespaceDeep(value) {
		const oldValue = this._trimWhitespaceCore.deep;
		this._trimWhitespaceCore.deep = value;
		this.requestUpdate('trimWhitespaceDeep', oldValue);
	}

	connectedCallback() {
		super.connectedCallback();
		this._trimWhitespaceCore.start();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._trimWhitespaceCore.stop();
	}
};

export { noTrim } from './trim-whitespace-directive.js';
