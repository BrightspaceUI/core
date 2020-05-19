import { css, html, LitElement } from 'lit-element/lit-element.js';
import { findFormElements, getFormElementData, installSubmitBehavior, submitFormData, uninstallSubmitBehavior } from './form-helpers.js';

class Form extends LitElement {

	static get properties() {
		return {
			method: { type: String },
			location: { type: String }
		};
	}
	static get styles() {
		return css``;
	}

	constructor() {
		super();

		this._onSubmitClicked = this._onSubmitClicked.bind(this);
		this._onMutation = this._onMutation.bind(this);
		this._mutationObserver = new MutationObserver(this._onMutation);
		this._mutationObserver.observe(this, { childList: true, subtree: true, attributes: false });
	}

	connectedCallback() {
		super.connectedCallback();
		const formElements = findFormElements(this);
		for (const ele of formElements) {
			installSubmitBehavior(ele, this._onSubmitClicked);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		const formElements = findFormElements(this);
		for (const ele of formElements) {
			uninstallSubmitBehavior(ele, this._onSubmitClicked);
		}
	}

	render() {
		return html`<slot></slot>`;
	}

	submit() {
		this._submit();
	}

	_submit() {

		const formElements = findFormElements(this);

		const errors = [];
		const formData = new FormData();
		for (const ele of formElements) {
			if (ele.checkValidity()) {
				const eleData = getFormElementData(ele);
				for (const pair of eleData) {
					formData.append(pair[0], pair[1]);
				}
			} else {
				errors.push({ ele, message: ele.validationMessage });
			}
		}
		if (errors.length !== 0) {
			console.log(errors);
			return;
		}
		submitFormData(this.method, this.location, formData);
	}

	_onMutation(mutationsList) {
		for (const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				for (const node of mutation.removedNodes) {
					uninstallSubmitBehavior(node, this._onSubmitClicked);
				}
				for (const node of mutation.addedNodes) {
					installSubmitBehavior(node, this._onSubmitClicked);
				}
			}
		}
	}

	_onSubmitClicked(e) {
		this._submit(e.target);
	}

}
customElements.define('d2l-form', Form);
