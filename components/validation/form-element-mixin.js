export const FormElementMixin = superclass => class extends superclass {

	constructor() {
		super();
		this.__hiddenInput = document.createElement('input');
		this.__hiddenInput.type = 'hidden';
	}

	connectedCallback() {
		super.connectedCallback();
		requestAnimationFrame(() => {
			const parentNode = this.parentNode;
			const parent = parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? this.getRootNode().host : parentNode;
			parent.appendChild(this.__hiddenInput);
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.__hiddenInput.parentNode.removeChild(this.__hiddenInput);
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'value') {
				this.__hiddenInput.value = this.value;
			} else if (prop === 'name') {
				this.__hiddenInput.name = this.name;
			}
		});
	}

};
