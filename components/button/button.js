import { css, html, LitElement } from 'lit-element/lit-element.js';
import { VisibleOnAncestorMixin, visibleOnAncestorStyles } from '../../mixins/visible-on-ancestor-mixin.js';
import { ButtonMixin } from './button-mixin.js';
import { buttonStyles } from './button-styles.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class Button extends ButtonMixin(VisibleOnAncestorMixin(RtlMixin(LitElement))) {

	static get styles() {
		return [ buttonStyles,
			css`

			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			button {
				font-family: inherit;
				padding: 0.5rem 1.5rem;
				@apply --d2l-button-shared;
				@apply --d2l-label-text;
				@apply --d2l-button;
				@apply --d2l-button-clear-focus;
				width: 100%;
			}
			/* Firefox includes a hidden border which messes up button dimensions */
			button::-moz-focus-inner {
				border: 0;
			}
			button,
			button[disabled]:hover,
			button[disabled]:focus,
			:host([active]) button[disabled] {
				background-color: var(--d2l-color-regolith);
				border-color: var(--d2l-color-mica);
				color: var(--d2l-color-ferrite);
			}
			button:hover,
			button:focus,
			:host([active]) button,
			:host(.d2l-button-hover) button,
			:host(.d2l-button-focus) button {
				background-color: var(--d2l-color-gypsum);
			}
			button:hover, :host(.d2l-button-hover) button, :host([active]) button {
				@apply --d2l-button-hover;
			}
			button:focus, :host(.d2l-button-focus) button {
				@apply --d2l-button-focus;
				outline: none; /* needed for Edge, can't be in the mixin */
			}
			button[disabled] {
				opacity: 0.5;
				cursor: default;
			}
			:host([primary]) button,
			:host([primary]) button[disabled]:hover,
			:host([primary]) button[disabled]:focus,
			:host([primary][active]) button[disabled] {
				background-color: var(--d2l-color-celestine);
				border-color: var(--d2l-color-celestine-minus-1);
				color: #ffffff;
				@apply --d2l-button-primary;
			}
			:host([primary]) button:hover,
			:host([primary]) button:focus,
			:host([primary][active]) button,
			:host([primary].d2l-button-hover) button,
			:host([primary].d2l-button-focus) button {
				background-color: var(--d2l-color-celestine-minus-1);
			}
			:host([primary]) button:hover,
			:host([primary].d2l-button-hover) button,
			:host([primary][active]) button {
				@apply --d2l-button-primary-hover;
			}
			:host([primary]) button:focus, :host([primary].d2l-button-focus) button {
				@apply --d2l-button-focus;
			}
		`
		];
	}

	render() {
		return html`
			<button
				aria-expanded="${ifDefined(this.ariaExpanded)}"
				aria-haspopup="${ifDefined(this.ariaHaspopup)}"
				aria-label="${ifDefined(this.ariaLabel)}"
				?autofocus="${ifDefined(this.autofocus)}"
				class="d2l-focusable"
				?disabled="${this.disabled}"
				form="${ifDefined(this.form)}"
				formaction="${ifDefined(this.formaction)}"
				formenctype="${ifDefined(this.formenctype)}"
				formmethod="${ifDefined(this.formmethod)}"
				formnovalidate="${ifDefined(this.formnovalidate)}"
				formtarget="${ifDefined(this.formtarget)}"
				name="${ifDefined(this.name)}"
				type="${this.type}">
				<slot></slot>
			</button>
		`;
	}
}
customElements.define('d2l-button', Button);
