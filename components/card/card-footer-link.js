import '../colors/colors.js';
import '../count-badge/count-badge-icon.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { forceFocusVisible } from '../../helpers/focus.js';
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
			a {
				box-sizing: border-box;
				display: inline-block;
				height: 100%;
				outline: none;
				width: 100%;
				z-index: 1;
			}
			[hidden] d2l-count-badge-icon {
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

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('focus', this._onFocus);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('focus', this._onFocus);
	}

	render() {
		return html`
			<a ?download="${this.download}"
				href="${ifDefined(this.href)}"
				hreflang="${ifDefined(this.hreflang)}"
				rel="${ifDefined(this.rel)}"
				target="${ifDefined(this.target)}"
				type="${ifDefined(this.type)}">
				<d2l-count-badge-icon 
					id="${this._countBadgeId}"
					tab-stop
					icon="${this.icon}"
					max-digits="${ifDefined(this.secondaryTextMaxDigits ? this.secondaryTextMaxDigits : undefined)}"
					number="${this._secondaryTextHidden ? 0 : this.secondaryText}" 
					?hide-zero="${this._secondaryTextHidden}"
					text="${this.text}"
					type="${this.secondaryTextType}">
				</d2l-count-badge-icon>
			</a>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!changedProperties.has('secondaryText')) return;
		this._secondaryTextHidden = !(this.secondaryText && this.secondaryText.length > 0);
	}

	_onFocus() {
		const icon = this.shadowRoot.querySelector('d2l-count-badge-icon');
		forceFocusVisible(icon);
	}

}

customElements.define('d2l-card-footer-link', CardFooterLink);
