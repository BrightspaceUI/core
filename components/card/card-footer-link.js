import '../colors/colors.js';
import '../count-badge/count-badge-icon.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * An icon link that can be placed in the `footer` slot.
 * @slot tooltip - Optional slot for the link tooltip
 */
class CardFooterLink extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Download a URL instead of navigating to it
			 */
			download: { type: Boolean, reflect: true },
			/**
			 * URL or URL fragment of the link
			 */
			href: { type: String, reflect: true },
			/**
			 * Indicates the human language of the linked resource; purely advisory, with no built-in functionality
			 */
			hreflang: { type: String, reflect: true },
			/**
			 * REQUIRED: Preset icon key (e.g. "tier1:gear")
			 */
			icon: { type: String, reflect: true },
			/**
			 * Specifies the relationship of the target object to the link object
			 */
			rel: { type: String, reflect: true },
			/**
			 * Secondary text to display as a superscript on the icon
			 */
			secondaryText: { type: Number, attribute: 'secondary-text', reflect: true },
			/**
			 * Maximum digits to display in the secondary text. Defaults to no limit
			 */
			secondaryTextMaxDigits: { type: String, attribute: 'secondary-text-max-digits' },
			/**
			 * Controls the style of the secondary text bubble; options are 'notification' and 'count'
			 */
			secondaryTextType: { type: String, attribute: 'secondary-text-type', reflect: true },
			/**
			 * Where to display the linked URL
			 */
			target: { type: String, reflect: true },
			/**
			 * REQUIRED: Accessible text for the link (not visible, gets announced when user focuses)
			 */
			text: { type: String, reflect: true },
			/**
			 * Specifies the media type in the form of a MIME type for the linked URL; purely advisory, with no built-in functionality
			 */
			type: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [offscreenStyles, css`
			:host {
				display: inline-block;
				left: 0.15rem;
				margin-right: 0.3rem;
				position: relative;
			}
			:host[hidden] {
				display: none;
			}
			:host([dir="rtl"]) {
				left: auto;
				margin-left: 0.3rem;
				margin-right: 0;
				right: 0.15rem;
			}
			a {
				box-sizing: border-box;
				display: inline-block;
				height: 100%;
				outline: none;
				width: 100%;
				z-index: 1;
			}
			d2l-count-badge-icon {
				text-align: initial;
			}
			::slotted(d2l-tooltip) {
				left: calc(-50% + 11px) !important;
			}
			:host([dir="rtl"]) ::slotted(d2l-tooltip) {
				left: 0;
				right: calc(-50% + 11px) !important;
			}
		`];
	}

	constructor() {
		super();
		this.download = false;
		this.secondaryTextType = 'notification';
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('focus', this._onFocus);
		this.addEventListener('blur', this._onBlur);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('focus', this._onFocus);
		this.removeEventListener('blur', this._onBlur);
	}

	render() {
		const noNumber = !this.secondaryText && this.secondaryText !== 0;
		return html`
			<a ?download="${this.download}"
				href="${ifDefined(this.href)}"
				hreflang="${ifDefined(this.hreflang)}"
				rel="${ifDefined(this.rel)}"
				target="${ifDefined(this.target)}"
				type="${ifDefined(this.type)}">
				<span class="d2l-offscreen">${this.text}</span>
				<d2l-count-badge-icon 
					aria-hidden="true"
					icon="${this.icon}"
					max-digits="${ifDefined(this.secondaryTextMaxDigits ? this.secondaryTextMaxDigits : undefined)}"
					number="${noNumber ? 0 : this.secondaryText}" 
					?hide-zero="${noNumber}"
					text="${this.text}"
					type="${this.secondaryTextType}">
				</d2l-count-badge-icon>
			</a>
			<slot name="tooltip"></slot>
		`;
	}

	_onBlur() {
		const icon = this.shadowRoot.querySelector('d2l-count-badge-icon');
		icon.classList.remove('focus-visible');
	}

	_onFocus() {
		const icon = this.shadowRoot.querySelector('d2l-count-badge-icon');
		icon.classList.add('focus-visible');
	}

}

customElements.define('d2l-card-footer-link', CardFooterLink);
