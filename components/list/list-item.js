import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ListItemMixin } from './list-item-mixin.js';

class ListItem extends ListItemMixin(LitElement) {

	static get properties() {
		return {
			illustrationOutside: { type: Boolean, attribute: 'illustration-outside' }
		};
	}

	static get styles() {
		return [ super.styles, css`
			::slotted([slot="illustration"]) {
				flex-grow: 0;
				flex-shrink: 0;
				margin: 0.15rem 0.9rem 0.15rem 0;
				max-height: 2.6rem;
				max-width: 4.5rem;
				overflow: hidden;
			}

			:host([dir="rtl"]) ::slotted([slot="illustration"]){
				margin-left: 0.9rem;
				margin-right: 0;
			}

			:host([illustration-outside]) .d2l-list-item-content-flex {
				padding: 0.55rem 0;
			}

			:host([illustration-outside]) ::slotted([slot="illustration"]) {
				margin-bottom: 0.7rem;
				margin-top: 0.7rem;
			}

			:host([illustration-outside]) input[type="checkbox"].d2l-input-checkbox {
				margin-bottom: 1.15rem;
				margin-top: 1.15rem;
			}

			.d2l-list-item-container[breakpoint="1"] ::slotted([slot="illustration"]) {
				margin-right: 1rem;
				max-height: 3.55rem;
				max-width: 6rem;
			}

			:host([dir="rtl"]) .d2l-list-item-container[breakpoint="1"] ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
			}

			.d2l-list-item-container[breakpoint="2"] ::slotted([slot="illustration"]) {
				margin-right: 1rem;
				max-height: 5.1rem;
				max-width: 9rem;
			}

			:host([dir="rtl"]) .d2l-list-item-container[breakpoint="2"] ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
			}

			.d2l-list-item-container[breakpoint="3"] ::slotted([slot="illustration"]) {
				margin-right: 1rem;
				max-height: 6rem;
				max-width: 10.8rem;
			}

			:host([dir="rtl"]) .d2l-list-item-container[breakpoint="3"] ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
			}

		`];
	}

	_renderIllustration() {
		return html`<slot name="illustration"></slot>`;
	}

	_renderOutside() {
		return this.illustrationOutside ? html`${this._renderSelectable()}${this._renderIllustration()}` : null;
	}

	_renderBeforeContent() {
		return !this.illustrationOutside ? html`${this._renderSelectable()}${this._renderIllustration()}` : null;
	}

}

customElements.define('d2l-list-item', ListItem);
