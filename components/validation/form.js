import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

const formElements = {
	'button': true,
	'fieldset': true,
	'input': true,
	'object': true,
	'output': true,
	'select': true,
	'textarea': true
};

class Form extends LitElement {

	static get properties() {
		return {
			action: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css``;
	}

	constructor() {
		super();
		this._associatedFormElements = [];
		this._associateCustomElements = [];
		this._onMutation = this._onMutation.bind(this);
		this._mutationObserver = new MutationObserver(this._onMutation);
		this._formData = new FormData();
		requestAnimationFrame(() => {
			this._form = this.shadowRoot.querySelector('form');
			this._associateElements(this);
			this._mutationObserver.observe(this, { childList: true, subtree: true, attributes: true });
		});
	}

	render() {
		return html`<slot></slot>`;
	}

	_onMutation(mutationsList) {
		for (const mutation of mutationsList) {
			console.log(mutation.type);
			if (mutation.type === 'childList') {
				for (const node of mutation.addedNodes) {
					this._associateElementIfNecessary(node);
				}
			} else {
				console.log(mutation.type);
			}
		}
	}

	_associateElements(e) {
		for (const ele of e.children) {
			this._associateElementIfNecessary(ele);
			this._associateElements(ele);
		}
	}

	_associateElementIfNecessary(ele) {
		if (ele.nodeType !== Node.ELEMENT_NODE) {
			return;
		}
		const nodeName = ele.nodeName.toLowerCase();
		if (formElements[nodeName]) {
			this._associateFormElement(ele);
		} else if (ele.constructor.formAssociated) {
			this._associateCustomElement(ele);
		}
	}

	_associateFormElement(ele) {
		ele.addEventListener('input', (e) => {
			this.setFormValue(ele, e.target.value);
		});
		this.setFormValue(ele, ele.getAttribute('value'));
		this._associatedFormElements.push(ele);

		if (ele.type === 'submit') {
			ele.addEventListener('click', () => this.submit());
		}
	}

	_associateCustomElement(ele) {
		this._associateCustomElements.push(ele);
		ele.formAssociatedCallback(this);

		if (ele.type === 'submit') {
			ele.addEventListener('click', () => this.submit());
		}
	}

	setFormValue(ele, val) {
		console.log(`${ele.name  }: ${  val}`);
		this._formData.set(ele.name, val);
	}

	submit() {
		const request = new XMLHttpRequest();
		request.open('POST', this.action);
		request.send(this._formData);
	}
}
customElements.define('d2l-form', Form);
