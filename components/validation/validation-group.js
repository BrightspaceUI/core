import { html, LitElement } from 'lit-element/lit-element.js';
import { ValidationGroupMixin } from './validation-group-mixin.js';

class ValidationGroup extends ValidationGroupMixin(LitElement) {

	render() {
		return html`<slot></slot>`;
	}

	getRootNode() {
		return this;
	}

}
customElements.define('d2l-validation-group', ValidationGroup);
