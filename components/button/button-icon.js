import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { VisibleOnAncestorMixin, visibleOnAncestorStyles } from '../../mixins/visible-on-ancestor-mixin.js';
import { ButtonMixin } from './button-mixin.js';
import { buttonSharedStyles } from './button-shared-styles.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class ButtonIcon extends ButtonMixin(VisibleOnAncestorMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			hAlign: { type: String, reflect: true, attribute: 'h-align' },
			icon: { type: String, reflect: true },
			text: { type: String, reflect: true },
			translucent: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [ buttonSharedStyles, visibleOnAncestorStyles,
			css`
				:host {
					display: inline-block;
					--d2l-button-icon-border-radius: 0.3rem;
					--d2l-button-icon-min-height: calc(2rem + 2px);
					--d2l-button-icon-min-width: calc(2rem + 2px);
					--d2l-button-icon-h-align: calc(((2rem + 2px - 0.9rem) / 2) * -1);
				}
				:host([hidden]) {
					display: none;
				}

				button {
					background-color: transparent;
					border-color: transparent;
					font-family: inherit;
					border-radius: var(--d2l-button-icon-border-radius);
					min-height: var(--d2l-button-icon-min-height);
					min-width: var(--d2l-button-icon-min-width);
					position: relative;
				}

				:host([h-align="text"]) button {
					left: var(--d2l-button-icon-h-align);
				}
				:host([dir="rtl"][h-align="text"]) button {
					left: 0;
					right: var(--d2l-button-icon-h-align);
				}

				// Firefox includes a hidden border which messes up button dimensions
				button::-moz-focus-inner {
					border: 0;
				}
				button[disabled]:hover,
				button[disabled]:focus,
				:host([active]) button[disabled] {
					background-color: transparent;
				}
				button:hover,
				button:focus,
				:host([active]) button {
					background-color: var(--d2l-color-gypsum);
				}

				.d2l-button-icon {
					height: 0.9rem;
					width: 0.9rem;
				}

				:host([translucent]) button {
					background-color: rgba(0,0,0,0.5);
					transition: background-color 0.5s;
				}
				:host([translucent]) .d2l-button-icon {
					color: white;
				}
				:host([active][translucent]) button,
				:host([translucent]) button:hover,
				:host([translucent]) button:focus {
					border: none;
					background-color: var(--d2l-color-celestine);
					box-shadow: none;
				}

				button[disabled] {
					cursor: default;
					opacity: 0.5;
				}
			`
		];
	}

	render() {
		return html`
			<button
				aria-expanded="${ifDefined(this.ariaExpanded)}"
				aria-haspopup="${ifDefined(this.ariaHaspopup)}"
				aria-label="${this.ariaLabel ? this.ariaLabel : ifDefined(this.text)}"
				?autofocus="${ifDefined(this.autofocus)}"
				class="d2l-label-text"
				?disabled="${this.disabled}"
				form="${ifDefined(this.form)}"
				formaction="${ifDefined(this.formaction)}"
				formenctype="${ifDefined(this.formenctype)}"
				formmethod="${ifDefined(this.formmethod)}"
				formnovalidate="${ifDefined(this.formnovalidate)}"
				formtarget="${ifDefined(this.formtarget)}"
				name="${ifDefined(this.name)}"
				title="${ifDefined(this.text)}"
				type="${this.type}">
				<d2l-icon icon="${ifDefined(this.icon)}" class="d2l-button-icon"></d2l-icon>
		</button>
		`;
	}

}

customElements.define('d2l-button-icon', ButtonIcon);
