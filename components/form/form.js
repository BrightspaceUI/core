import { css, html, LitElement } from 'lit-element/lit-element.js';

const formElements = {
	button: true,
	fieldset: true,
	input: true,
	object: true,
	output: true,
	select: true,
	textarea: true
};

class Form extends LitElement {

	static get styles() {
		return css``;
	}

	constructor() {
		super();

		this._onSubmitClicked = this._onSubmitClicked.bind(this);

		this._customElements = [];
		this.addEventListener('d2l-form-element-connected', this._onFormElementConnected);
		this.addEventListener('d2l-form-element-disconnected', this._onFormElementDisconnected);
	}

	firstUpdated() {
	}

	render() {
		return html`<slot></slot>`;
	}

	_onFormElementConnected(e) {
		const formElement = e.composedPath()[0];
		if (this._isSubmitElement(formElement)) {
			formElement.addEventListener('click', this._onSubmitClicked);
		}
		this._customElements.push(formElement);
	}

	_onFormElementDisconnected(e) {
		const formElement = e.composedPath()[0];
		const index = this._customElements.indexOf(formElement);
		if (index > -1) {
			if (this._isSubmitElement(formElement)) {
				formElement.removeEventListener('click', this._onSubmitClicked);
			}
			this._customElements.splice(index, 1);
		}
	}

	_isSubmitElement(e) {
		return e.getAttribute('type') === 'submit';
	}

	submit() {

		const customElements = [...this._customElements];
		const nativeElements = this._findNativeFormElements();

		const errors = [];
		for (const ele of customElements) {
			if (!ele.checkValidity()) {
				errors.push({ ele, message: ele.validationMessage });
			}
			ele.classList.add('d2l-dirty');
		}
		for (const ele of nativeElements) {
			if (!ele.checkValidity()) {
				errors.push({ ele, message: ele.validationMessage });
			}
			ele.classList.add('d2l-dirty');
		}
		if (errors.length !== 0) {
			// TODO: Order errors on DOM order or getBoundingClientRect top
			console.log(errors);
			return;
		}
	}

	_findNativeFormElements() {
		const eles = [];
		this._findNativeFormElementsHelper(this, eles);
		return eles;
	}

	_findNativeFormElementsHelper(ele, eles) {
		const nodeName = ele.nodeName.toLowerCase();
		if (nodeName === 'fieldset' && ele.hasAttribute('disabled')) {
			return;
		} else if (formElements[nodeName]) {
			eles.push(ele);
		}
		for (const child of ele.children) {
			this._findNativeFormElementsHelper(child, eles);
		}
	}

	_onSubmitClicked() {
		this.submit();
	}

}
customElements.define('d2l-form', Form);
