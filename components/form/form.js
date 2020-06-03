import { css, html, LitElement } from 'lit-element/lit-element.js';
import { findFormElements, getFormElementData, installSubmitBehavior, submitFormData, uninstallSubmitBehavior } from './form-helpers.js';
import { ValidationGroupMixin } from '../validation/validation-group-mixin.js';

class Form extends ValidationGroupMixin(LitElement) {

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
		this._mutationObserver = new MutationObserver(this._onMutation);
		this._onMutation = this._onMutation.bind(this);
		this._onSubmitClicked = this._onSubmitClicked.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();

		this._mutationObserver.observe(this, { childList: true, subtree: true, attributes: false });
		const formElements = findFormElements(this);
		for (const ele of formElements) {
			installSubmitBehavior(ele, this._onSubmitClicked);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._mutationObserver.disconnect();
		const formElements = findFormElements(this._form);
		for (const ele of formElements) {
			uninstallSubmitBehavior(ele, this._onSubmitClicked);
		}
	}

	render() {
		return html`<slot></slot>`;
	}

	getRootNode() {
		return this;
	}

	submit() {
		this._formBehavior.submit();
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

	async _submit() {

		const errors = await this.validate();
		if (errors.length > 0) {
			return;
		}
		this.commit();

		const formData = new FormData();
		const formElements = findFormElements(this);
		for (const ele of formElements) {
			const eleData = getFormElementData(ele);
			for (const pair of eleData) {
				formData.append(pair[0], pair[1]);
			}
		}
		submitFormData(this.method, this.location, formData);
	}

}
customElements.define('d2l-form', Form);
