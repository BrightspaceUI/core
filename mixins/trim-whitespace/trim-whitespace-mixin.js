import { TrimWhitespaceCore } from './trim-whitespace-core.js';

export const TrimWhitespaceMixin = superclass => class extends superclass {
	constructor() {
		super();
		this._trimWhitespaceCore = new TrimWhitespaceCore(this, this.constructor.trimWhitespaceDeep);
	}

	static get trimWhitespaceDeep() {
		return false;
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
