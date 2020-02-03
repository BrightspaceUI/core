import { html, LitElement } from 'lit-element/lit-element.js';
import { DropdownContentMixin } from './dropdown-content-mixin.js';
import { dropdownContentStyles } from './dropdown-content-styles.js';

class DropdownContent extends DropdownContentMixin(LitElement) {

	static get properties() {
		return {};
	}

	static get styles() {
		return dropdownContentStyles;
	}

	render() {
		return html`
			${this._renderContent()}
			<div class="d2l-dropdown-content-pointer">
				<div></div>
			</div>
		`;
	}

}
customElements.define('d2l-dropdown-content', DropdownContent);
