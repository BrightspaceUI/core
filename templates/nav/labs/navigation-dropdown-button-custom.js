import { css, html, LitElement } from 'lit';
import { highlightBorderStyles, highlightButtonStyles } from './navigation-styles.js';
import { DropdownOpenerMixin } from '../../../components/dropdown/dropdown-opener-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';

class NavigationDropdownButtonCustom extends DropdownOpenerMixin(LitElement) {

	static get properties() {
		return {
			openerLabel: { type: String, attribute: 'opener-label' }
		};
	}

	static get styles() {
		return [highlightBorderStyles, highlightButtonStyles, css`
			:host {
				display: inline-block;
				height: 100%;
				position: relative;
			}
			:host([hidden]) {
				display: none;
			}
		`];
	}

	render() {
		return html`
			<button
				type="button"
				aria-haspopup="menu"
				aria-label="${ifDefined(this.openerLabel)}">
				<span class="d2l-labs-navigation-highlight-border"></span>
				<slot name="opener"></slot>
			</button>
			<slot></slot>
		`;
	}

	getOpenerElement() {
		return this.shadowRoot?.querySelector('button');
	}
}

customElements.define('d2l-labs-navigation-dropdown-button-custom', NavigationDropdownButtonCustom);
