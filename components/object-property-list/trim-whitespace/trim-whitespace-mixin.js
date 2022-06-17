import { TrimWhitespaceEngine } from './trim-whitespace.js';

export const TrimWhitespaceMixin = superclass => class extends superclass {
	static get properties() {
		return {
			trimWhitespaceDeep: { type: Boolean, attribute: 'trim-whitespace-deep', reflect: true },
		};
	}

	constructor() {
		super();
		this._trimWhitespaceEngine = new TrimWhitespaceEngine(this, this.trimWhitespaceDeep);
	}

	set trimWhitespaceDeep(value) {
		const oldValue = this._trimWhitespaceEngine.deep;
		this._trimWhitespaceEngine.deep = value;
		this.requestUpdate('trimWhitespaceDeep', oldValue);
	}

	connectedCallback() {
		super.connectedCallback();
		this._trimWhitespaceEngine.start();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._trimWhitespaceEngine.stop();
	}
};

export { noTrim } from './trim-whitespace-directive.js';
