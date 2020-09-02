import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * An icon link that can be placed in the `footer` slot.
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
			secondaryText: { type: String, attribute: 'secondary-text', reflect: true },
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
			type: { type: String, reflect: true },
			_secondaryTextHidden: { type: Boolean }
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
			.d2l-card-footer-link-content {
				display: inline-block;
				line-height: 0;
				padding: 0.6rem;
				position: relative;
				text-align: center;
			}
			a {
				box-sizing: border-box;
				display: inline-block;
				height: 100%;
				outline: none;
				position: absolute;
				width: 100%;
				z-index: 1;
			}
			a[href]:focus + .d2l-card-footer-link-content > d2l-icon,
			a[href]:hover + .d2l-card-footer-link-content > d2l-icon {
				color: var(--d2l-color-celestine);
			}
			d2l-icon {
				height: 0.9rem;
				width: 0.9rem;
			}
			.d2l-card-footer-link-secondary-text {
				border-radius: 0.75rem;
				box-shadow: 0 0 0 1px white;
				box-sizing: content-box;
				display: inline-block;
				font-size: 0.55rem;
				font-weight: 400;
				line-height: 100%;
				min-width: 0.5rem;
				padding: 2px;
				position: relative;
			}
			.d2l-card-footer-link-secondary-text-container {
				position: absolute;
				right: 1rem;
				top: 0;
				width: 1px;
			}
			:host([dir="rtl"]) .d2l-card-footer-link-secondary-text-container {
				left: 1rem;
				right: auto;
			}
			:host([secondary-text-type="notification"]) .d2l-card-footer-link-secondary-text {
				background-color: var(--d2l-color-carnelian-minus-1);
				border: 2px solid var(--d2l-color-carnelian-minus-1);
				color: white;
			}
			:host([secondary-text-type="count"]) .d2l-card-footer-link-secondary-text {
				background-color: var(--d2l-color-gypsum);
				border: 2px solid var(--d2l-color-gypsum);
				color: var(--d2l-color-ferrite);
			}
			[hidden].d2l-card-footer-link-secondary-text {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.download = false;
		this.secondaryTextType = 'notification';
		this._secondaryTextHidden = true;
	}

	render() {
		return html`
			<a ?download="${this.download}"
				href="${ifDefined(this.href)}"
				hreflang="${ifDefined(this.hreflang)}"
				rel="${ifDefined(this.rel)}"
				target="${ifDefined(this.target)}"
				type="${ifDefined(this.type)}">
				<span class="d2l-offscreen">${this.text}</span>
			</a>
			<div class="d2l-card-footer-link-content">
				<d2l-icon icon="${this.icon}"></d2l-icon>
				<div class="d2l-card-footer-link-secondary-text-container">
					<div class="d2l-card-footer-link-secondary-text" aria-hidden="true" ?hidden="${this._secondaryTextHidden}">${this.secondaryText}</div>
				</div>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!changedProperties.has('secondaryText')) return;
		this._secondaryTextHidden = !(this.secondaryText && this.secondaryText.length > 0);
	}

	focus() {
		const elem = this.shadowRoot.querySelector('a');
		if (!elem) return;
		elem.focus();
	}

}

customElements.define('d2l-card-footer-link', CardFooterLink);
