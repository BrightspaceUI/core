export const ValidationContainerMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_customElements: { type: Array },
			_dirty: { type: Boolean },
			_errors: { type: Array }
		};
	}

	constructor() {
		super();
		this._onFormSubmit = this._onFormSubmit.bind(this);
		this._onChangeEvent = this._onChangeEvent.bind(this);
		this._onUnload = this._onUnload.bind(this);
		this._customElements = [];

		this.addEventListener('d2l-form-element-connected', this._onFormElementConnected);
		this.addEventListener('d2l-form-element-disconnected', this._onFormElementDisconnected);
		this.addEventListener('change', this._onChangeEvent);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('beforeunload', this._onUnload);

		requestAnimationFrame(() => {
			const form = this.getFormElement();
			if (form) {
				form.addEventListener('submit', this._onFormSubmit);
				form.setAttribute('novalidate', '');
			}
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.remove('beforeunload', this._onUnload);
	}

	async _onFormSubmit(e) {
		e.preventDefault();

		const errors = [];
		const validations = [];
		const customElements = [...this._customElements];
		for (const ele of customElements) {
			validations.push(ele.checkValidity());
			ele.classList.add('d2l-dirty');
		}
		const validationsPromise = Promise.all(validations);
		const form = this.getFormElement();
		if (form) {
			for (const ele of form.elements) {
				if (!ele.validity.valid) {
					errors.push({ ele, message: ele.validationMessage});
				}
				ele.classList.add('d2l-dirty');
			}
		}
		const validationResults = await validationsPromise;
		for (let i = 0; i < validationResults.length; i += 1) {
			const valid = validationResults[i];
			if (!valid) {
				const ele = customElements[i];
				errors.push({ ele, message: ele.validationMessage});
			}
		}
		if (errors.length !== 0) {
			// TODO: Order errors on DOM order or getBoundingClientRect top
			this._errors = errors;
			return;
		}
		if (form) {
			this._dirty = false;
			form.submit();
		}
	}

	_onChangeEvent(e) {
		const ele = e.composedPath()[0];
		const form = this.getFormElement();
		const nativeElements = (form && [...form.elements]) || [];
		if (nativeElements.indexOf(ele) === -1 && this._customElements.indexOf(ele) === -1) {
			return;
		}
		if (ele.validity.valid && this._errors) {
			this._errors = this._errors.filter(error => error.ele !== ele);
		}
		ele.classList.add('d2l-dirty');
		this._dirty = true;
	}

	_onFormElementConnected(e) {
		const formElement = e.composedPath()[0];
		this._customElements.push(formElement);
	}

	_onFormElementDisconnected(e) {
		const formElement = e.composedPath()[0];
		const index = this._customElements.indexOf(formElement);
		if (index > -1) {
			this._customElements.splice(index, 1);
		}
	}

	_onUnload(e) {
		if (this._dirty) {
			e.returnValue = 'You have unsaved changes!';
		}
	}

	// Override by users of the mixin
	getFormElement() {}
};
