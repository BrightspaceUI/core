
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

export const LabelMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_label: { type: String, reflect: true }
		};
	}

	updateLabel(text) {
		this._label = text;
	}

};

export const LabelledMixin = superclass => class extends superclass {

	static get properties() {
		return {
			labelledBy: { type: String, reflect: true, attribute: 'labelled-by' },
			label: { type: String }
		};
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (!changedProperties.has('labelledBy')) return;

		if (this._labelObserver) this._labelObserver.disconnect();

		if (!this.labelledBy) return;

		let labelElem = this.getRootNode().querySelector(`#${this.labelledBy}`);
		const ancestor = getCommonAncestor(this, labelElem);

		this._labelObserver = new MutationObserver(mutations => {

			mutations.forEach(mutation => {

				if (mutation.removedNodes.length > 0 && Array.from(mutation.removedNodes).indexOf(labelElem) !== -1) {
					labelElem = null;
				}

				if (mutation.addedNodes.length > 0) {
					labelElem = this.getRootNode().querySelector(`#${this.labelledBy}`);
					return;
				}

			});

			if (labelElem) {
				this.label = getLabel(labelElem);
			} else {
				console.warn(`LabelledMixin: element with labelled-by="${this.labelledBy}", but no such element exists.`);
				this.label = undefined;
			}

		});

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

};
