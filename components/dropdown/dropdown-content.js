import { html, LitElement } from 'lit-element/lit-element.js';
import { DropdownContentMixin } from './dropdown-content-mixin.js';
import { dropdownContentStyles } from './dropdown-content-styles.js';

class DropdownContent extends DropdownContentMixin(LitElement) {

	static get properties() {
		return {};
	}

	static get styles() {
		return [dropdownContentStyles];
	}

	render() {
		return html`
			<slot></slot>
		`;
	}

}
customElements.define('d2l-dropdown-content', DropdownContent);
