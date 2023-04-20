import '../colors/colors.js';
import '../count-badge/count-badge-icon.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * An icon link that can be placed in the `footer` slot.
 * @slot tooltip - slot for the link tooltip
 */
class CardFooterLink extends FocusMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Download a URL instead of navigating to it
			 * @type {boolean}
			 */
			download: { type: Boolean, reflect: true },
			/**
			 * URL or URL fragment of the link
			 * @type {string}
			 */
			href: { type: String, reflect: true },
			/**
			 * Indicates the human language of the linked resource; purely advisory, with no built-in functionality
			 * @type {string}
			 */
			hreflang: { type: String, reflect: true },
			/**
			 * REQUIRED: Preset icon key (e.g. "tier1:gear"). Must be a tier 1 icon.
			 * @type {string}
			 */
			icon: { type: String, reflect: true },
			/**
			 * Specifies the relationship of the target object to the link object
			 * @type {string}
			 */
			rel: { type: String, reflect: true },
			/**
			 * Secondary count to display as a count bubble on the icon
			 * @type {number}
			 */
			secondaryCount: { type: Number, attribute: 'secondary-count', reflect: true },
			/**
			 * Maximum digits to display in the secondary count. Defaults to no limit
			 * @type {string}
			 */
			secondaryCountMaxDigits: { type: String, attribute: 'secondary-count-max-digits' },
			/**
			 * Controls the style of the secondary count bubble
			 * @type {'count'|'notification'}
			 */
			secondaryCountType: { type: String, attribute: 'secondary-count-type', reflect: true },
			/**
			 * Where to display the linked URL
			 * @type {string}
			 */
			target: { type: String, reflect: true },
			/**
			 * REQUIRED: Accessible text for the link (not visible, gets announced when user focuses)
			 * @type {string}
			 */
			text: { type: String, reflect: true },
			/**
			 * Specifies the media type in the form of a MIME type for the linked URL; purely advisory, with no built-in functionality
			 * @type {string}
			 */
			type: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [offscreenStyles, css`
			:host {
				display: inline-block;
				position: relative;
			}
			:host[hidden] {
				display: none;
			}
			a {
				box-sizing: border-box;
				display: inline-block;
				height: 100%;
				outline: none;
				width: 100%;
			}
			d2l-count-badge-icon {
				text-align: initial;
			}
		`];
	}

	constructor() {
		super();
		this.download = false;
		this.secondaryCountType = 'notification';
	}

	static get focusElementSelector() {
		return 'a';
	}

	render() {
		const noNumber = this.secondaryCount === undefined;
		return html`
			<a @focus="${this._onFocus}"
				@blur="${this._onBlur}"
				?download="${this.download}"
				href="${ifDefined(this.href)}"
				hreflang="${ifDefined(this.hreflang)}"
				rel="${ifDefined(this.rel)}"
				target="${ifDefined(this.target)}"
				type="${ifDefined(this.type)}">
				<span class="d2l-offscreen">${this.text}</span>
				<d2l-count-badge-icon
					aria-hidden="true"
					icon="${this.icon}"
					max-digits="${ifDefined(this.secondaryCountMaxDigits ? this.secondaryCountMaxDigits : undefined)}"
					number="${noNumber ? 0 : this.secondaryCount}"
					?hide-zero="${noNumber}"
					text="${this.text}"
					type="${this._getType()}">
				</d2l-count-badge-icon>
			</a>
			<slot name="tooltip"></slot>
		`;
	}

	_getType() {
		if (this.secondaryCountType === 'count') {
			return this.secondaryCountType;
		}
		return 'notification';
	}

	_onBlur() {
		if (this.shadowRoot) this.shadowRoot.querySelector('d2l-count-badge-icon').forceFocusRing = false;
	}

	_onFocus() {
		if (this.shadowRoot) this.shadowRoot.querySelector('d2l-count-badge-icon').forceFocusRing = true;
	}

}

customElements.define('d2l-card-footer-link', CardFooterLink);
