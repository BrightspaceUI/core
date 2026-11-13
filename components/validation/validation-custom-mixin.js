import { isCustomFormElement } from '../form/form-helper.js';

export const ValidationCustomMixin = superclass => class extends superclass {

	static properties = {
		/**
		 * REQUIRED: The text to display when validation fails.
		 * @type {string}
		 */
		failureText: { type: String, attribute: 'failure-text' },
		/**
		 * REQUIRED: The id of the form element to validate.
		 * @type {string}
		 */
		for: { type: String }
	};

	constructor() {
		super();
		this._forElement = null;
	}

	get forElement() {
		return this._forElement;
	}

	connectedCallback() {
		super.connectedCallback();
		this._updateForElement();
		/**@ignore */
		this.dispatchEvent(new CustomEvent('d2l-validation-custom-connected', { bubbles: true }));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (isCustomFormElement(this._forElement)) {
			this._forElement.validationCustomDisconnected(this);
		}
		this._forElement = null;
		/**@ignore */
		this.dispatchEvent(new CustomEvent('d2l-validation-custom-disconnected'));
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'for') {
				this._updateForElement();
			}
		});
	}

	async validate() {
		throw new Error('ValidationCustomMixin requires validate to be overridden');
	}

	_updateForElement() {
		const oldForElement = this._forElement;
		if (this.for) {
			const root = this.getRootNode();
			this._forElement = root.getElementById(this.for);
			if (!this._forElement) {
				throw new Error(`validation-custom failed to find element with id ${this.for}`);
			}
		} else {
			this._forElement = null;
		}
		if (this._forElement !== oldForElement) {
			if (isCustomFormElement(oldForElement)) {
				oldForElement.validationCustomDisconnected(this);
			}
			if (isCustomFormElement(this._forElement)) {
				this._forElement.validationCustomConnected(this);
			}
		}
	}

};
