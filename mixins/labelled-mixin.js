
import { cssEscape } from '../helpers/dom.js';

const getCommonAncestor = (elem1, elem2) => {

	const labelledPath = new WeakMap();
	let elem = elem1;
	while (elem) {
		labelledPath.set(elem, elem);
		elem = elem.parentNode;
	}

	let ancestorElem = elem2.parentNode;
	while (ancestorElem) {
		if (labelledPath.has(ancestorElem)) return ancestorElem;
		ancestorElem = ancestorElem.parentNode;
	}

};

const isCustomElement = elem => {
	return elem.tagName.includes('-');
};

const getLabel = labelElem => {
	if (isCustomElement(labelElem)) return labelElem._label;
	else return labelElem.textContent;
};

const waitForElement = async(contextElement, selector, timeout) => {
	let elem = contextElement.querySelector(selector);
	if (elem) return elem;

	return new Promise(resolve => {
		let elapsedTime = 0;
		const intervalId = setInterval(() => {
			elem = contextElement.querySelector(selector);
			if (!elem) elapsedTime += 100;
			if (elem || elapsedTime > timeout) {
				clearInterval(intervalId);
				resolve(elem);
				return;
			}
		}, 100);
	});
};

export const LabelMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_label: { type: String, reflect: true }
		};
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-label-change', this._handleLabelChange);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-label-change', this._handleLabelChange);
	}

	updateLabel(text) {
		this._label = text;
	}

	_handleLabelChange(e) {
		e.stopPropagation();
		this.updateLabel(e.detail);
	}

};

export const LabelledMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * The id of element that provides the label for this element
			 * @type {string}
			 */
			labelledBy: { type: String, reflect: true, attribute: 'labelled-by' },
			/**
			 * Explicitly defined label used to provide context for accessibility
			 * @type {string}
			 */
			label: { type: String }
		};
	}

	constructor() {
		super();
		this._missingLabelErrorHasBeenThrown = false;
		this._throwNoLabelExceptionImmediately = false;
	}

	async updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('label')) {
			this._validateLabel();
		}

		if (!changedProperties.has('labelledBy')) return;

		if (this._labelObserver) this._labelObserver.disconnect();

		if (!this.labelledBy) return;

		// try to get the labelling element syncronously first
		let labelElem = this.getRootNode().querySelector(`#${cssEscape(this.labelledBy)}`);
		if (!labelElem) {
			labelElem = await waitForElement(this.getRootNode(), `#${cssEscape(this.labelledBy)}`, 3000);
		}

		this._labelObserver = new MutationObserver(mutations => {

			mutations.forEach(mutation => {

				if (mutation.removedNodes.length > 0 && Array.from(mutation.removedNodes).indexOf(labelElem) !== -1) {
					labelElem = null;
				}

				if (mutation.addedNodes.length > 0) {
					labelElem = this.getRootNode().querySelector(`#${cssEscape(this.labelledBy)}`);
					return;
				}

			});

			if (labelElem) {
				this.label = getLabel(labelElem);
				// TODO: how to validate empty label?
			} else {
				this.label = undefined;
				this._validateLabel();
			}

		});

		if (!labelElem) {
			this._validateLabel();
			return;
		}
		const ancestor = getCommonAncestor(this, labelElem);

		/* assumption: the labelling element will not change from a native to a custom element
		or vice versa, which allows the use of a more optimal observer configuration */
		if (isCustomElement(labelElem)) {
			this._labelObserver.observe(ancestor, {
				attributes: true, /* required for legacy-Edge, otherwise attributeFilter throws a syntax error */
				attributeFilter: ['_label'],
				childList: true,
				subtree: true
			});
		} else {
			this._labelObserver.observe(ancestor, {
				characterData: true,
				childList: true,
				subtree: true
			});
		}

		this.label = getLabel(labelElem);

	}

	_validateLabel() {

		if (this._missingLabelErrorHasBeenThrown) return true;

		const hasLabel = (typeof this.label === 'string') && this.label.length > 0;
		if (hasLabel) return true;

		this._missingLabelErrorHasBeenThrown = true;

		let err = null;
		if (this.labelledBy) {
			err = new Error(`LabelledMixin: "${this.tagName.toLowerCase()}" is labelled-by="${this.labelledBy}", but no such element exists or its label is empty`);
		} else {
			err = new Error(`LabelledMixin: "${this.tagName.toLowerCase()}" is missing a required "label" attribute`);
		}

		// we don't want to prevent rendering
		if (!this._throwNoLabelExceptionImmediately) {
			setTimeout(() => { throw err; });
		// just for testing so we can actually catch it
		} else {
			throw err;
		}

		return false;

	}

};
