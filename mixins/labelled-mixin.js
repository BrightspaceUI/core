
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
		this._labelElem = null;
		this._missingLabelErrorHasBeenThrown = false;
		this._throwNoLabelExceptionImmediately = false;
	}

	async updated(changedProperties) {

		super.updated(changedProperties);

		// need to check this even if "label" isn't updated in case it's never set
		const hasLabel = (typeof this.label === 'string') && this.label.length > 0;
		if (!hasLabel) {
			if (this.labelledBy) {
				if (this._labelElem) {
					this._throwError(
						new Error(`LabelledMixin: "${this.tagName.toLowerCase()}" is labelled-by="${this.labelledBy}", but its label is empty`)
					);
				}
			} else {
				this._throwError(
					new Error(`LabelledMixin: "${this.tagName.toLowerCase()}" is missing a required "label" attribute`)
				);
			}
		}

		if (!changedProperties.has('labelledBy')) return;

		if (!this.labelledBy) {
			this._updateLabelElem(null);
		} else {
			const labelElem = await waitForElement(this.getRootNode(), `#${cssEscape(this.labelledBy)}`, 3000);
			if (!labelElem) {
				this._throwError(
					new Error(`LabelledMixin: "${this.tagName.toLowerCase()}" is labelled-by="${this.labelledBy}", but no such element exists`)
				);
			}
			this._updateLabelElem(labelElem);
		}

	}

	_throwError(err) {
		if (this._missingLabelErrorHasBeenThrown) return;
		this._missingLabelErrorHasBeenThrown = true;
		// we don't want to prevent rendering
		if (!this._throwNoLabelExceptionImmediately) {
			setTimeout(() => { throw err; });
		// just for testing so we can actually catch it
		} else {
			throw err;
		}
	}

	_updateLabelElem(labelElem) {

		// setting textContent doesn't change labelElem but we do need to refetch the label
		if (labelElem === this._labelElem && this._labelElem) {
			this.label = getLabel(this._labelElem);
			return;
		}

		this._labelElem = labelElem;

		if (this._labelObserver) this._labelObserver.disconnect();
		if (!this._labelElem) {
			this.label = undefined;
			return;
		}

		this._labelObserver = new MutationObserver(() => {
			this._updateLabelElem(
				this.getRootNode().querySelector(`#${cssEscape(this.labelledBy)}`)
			);
		});

		const ancestor = getCommonAncestor(this, this._labelElem);

		// assumption: the labelling element will not change from a native to a custom element
		// or vice versa, which allows the use of a more optimal observer configuration
		if (isCustomElement(this._labelElem)) {
			this._labelObserver.observe(ancestor, {
				attributes: true, // required for legacy-Edge, otherwise attributeFilter throws a syntax error
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

		this.label = getLabel(this._labelElem);

	}

};
