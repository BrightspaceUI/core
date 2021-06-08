
export const LabelMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_label: { type: String, reflect: true }
		};
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

		if (this.labelledBy) {

			let labelElem = this.getRootNode().querySelector(`#${this.labelledBy}`);
			const ancestor = this._getCommonAncestor(labelElem);

			const getLabel = () => {
				if (labelElem.tagName.includes('-')) return labelElem._label;
				else return labelElem.textContent;
			};

			this._labelObserver = new MutationObserver((mutations) => {
				for (let i = 0; i < mutations.length; i++) {

					for (let j = 0; j < mutations[i].removedNodes.length; j++) {
						if (mutations[i].removedNodes[j] === labelElem) {
							labelElem = null;
							break;
						}
					}

					if (!labelElem && mutations[i].addedNodes.length > 0) {
						labelElem = this.getRootNode().querySelector(`#${this.labelledBy}`);
						break;
					}

				}

				if (labelElem) {
					this.label = getLabel();
				} else {
					console.warn('LabelledMixin with specified labelledBy but no such element exists.');
					this.label = undefined;
				}

			});
			this._labelObserver.observe(ancestor, { attributes: true, characterData: true, childList: true, subtree: true });

			this.label = getLabel();
		}

	}

	_getCommonAncestor(labelledByElem) {

		const labelledPath = new WeakMap();
		let elem = this;
		while (elem) {
			labelledPath.set(elem, elem);
			elem = elem.parentNode;
		}

		let ancestorElem = labelledByElem.parentNode;
		while (ancestorElem) {
			if (labelledPath.has(ancestorElem)) return ancestorElem;
			ancestorElem = ancestorElem.parentNode;
		}

	}

};
