import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-menu.js';
import '../menu/menu.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * To Do
 */
class Filter extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			disabled: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
			}
		`];
	}

	constructor() {
		super();
		this.disabled = false;
	}

	render() {
		return html`
			<d2l-dropdown-button-subtle
				text="Filter"
				?disabled="${this.disabled}">
				<d2l-dropdown-menu>
					<d2l-menu label="Filter">
						<slot></slot>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-button-subtle>
		`;
	}

}

customElements.define('d2l-filter', Filter);
