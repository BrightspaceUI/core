import '../../../components/icons/icon.js';
import '../../../components/tooltip/tooltip.js';
import { css, html, LitElement, nothing } from 'lit';
import { highlightBorderStyles, highlightLinkStyles } from './navigation-styles.js';
import { FocusMixin } from '../../../mixins/focus-mixin.js';
import { getUniqueId } from '../../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { offscreenStyles } from '../../../components/offscreen/offscreen.js';

/**
 * Navigation link with an icon and text.
 */
class NavigationLinkIcon extends FocusMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: URL or URL fragment of the link
			 * @type {string}
			 */
			href: { type: String },
			/**
			 * REQUIRED: Preset icon key (e.g. "tier1:gear")
			 * @type {string}
			 */
			icon: { type: String },
			/**
			 * REQUIRED: Text for the link
			 * @type {string}
			 */
			text: { type: String },
			/**
			 * Visually hides the text but still accessible
			 * @type {boolean}
			 */
			textHidden: { attribute: 'text-hidden', type: Boolean },
			/**
			 * Offset of the tooltip
			 * @type {Number}
			 */
			tooltipOffset: { attribute: 'tooltip-offset', type: Number }
		};
	}

	static get styles() {
		return [highlightBorderStyles, highlightLinkStyles, offscreenStyles, css`
			:host {
				display: inline-block;
				height: 100%;
			}
			:host([hidden]) {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.textHidden = false;
		this._linkId = getUniqueId();
		this._missingHrefErrorHasBeenThrown = false;
		this._validatingHrefTimeout = null;
	}

	static get focusElementSelector() {
		return 'a';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._validateHref();
	}

	render() {
		const { ariaLabel, id, text, tooltip } = this._getRenderSettings();
		return html`
			<a id="${ifDefined(id)}" href="${ifDefined(this.href)}" aria-label="${ifDefined(ariaLabel)}">
				<span class="d2l-labs-navigation-highlight-border"></span>
				<d2l-icon icon="${this.icon}"></d2l-icon>
				${text}
			</a>
			${tooltip}
		`;
	}

	updated(changedProperties) {

		super.updated(changedProperties);

		if (changedProperties.has('href')) this._validateHref();

	}

	_getRenderSettings() {
		if (this.textHidden) {
			return {
				ariaLabel: this.text,
				id: this._linkId,
				text: nothing,
				tooltip: html`<d2l-tooltip for="${this._linkId}" for-type="label" position="bottom" offset="${ifDefined(this.tooltipOffset)}" class="vdiff-target">${this.text}</d2l-tooltip>`
			};
		}
		return {
			ariaLabel: undefined,
			id: undefined,
			text: this.text,
			tooltip: nothing
		};
	}

	_validateHref() {
		clearTimeout(this._validatingHrefTimeout);
		// don't error immediately in case it doesn't get set immediately
		this._validatingHrefTimeout = setTimeout(() => {
			this._validatingHrefTimeout = null;
			const hasHref = (typeof this.href === 'string') && this.href.length > 0;
			if (!hasHref && !this._missingHrefErrorHasBeenThrown) {
				this._missingHrefErrorHasBeenThrown = true;
				// we don't want to prevent rendering
				setTimeout(() => { throw new Error('<d2l-labs-navigation-link-icon>: missing required "href" attribute. If this component performs an action and not a navigation, consider using <d2l-labs-navigation-button-icon> instead.'); });
			}
		}, 3000);
	}

}

customElements.define('d2l-labs-navigation-link-icon', NavigationLinkIcon);
