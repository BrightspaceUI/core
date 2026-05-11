import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement, nothing } from 'lit';
import { highlightBorderStyles, highlightLinkStyles } from './page-header-styles.js';
import { FocusMixin } from '../../mixins/focus-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

/**
 * Page header link with an icon and text.
 */
class PageHeaderLink extends PropertyRequiredMixin(FocusMixin(LitElement)) {

	static properties = {
		/**
		 * REQUIRED: URL or URL fragment of the link
		 * @type {string}
		 */
		href: { required: true, type: String },
		/**
		 * REQUIRED: Preset icon key (e.g. "tier1:gear")
		 * @type {string}
		 */
		icon: { required: true, type: String },
		/**
		 * REQUIRED: Text for the link
		 * @type {string}
		 */
		text: { required: true, type: String },
		/**
		 * Visually hides the text but remains accessible
		 * @type {boolean}
		 */
		textHidden: { attribute: 'text-hidden', type: Boolean },
		/**
		 * Offset of the tooltip
		 * @type {Number}
		 */
		tooltipOffset: { attribute: 'tooltip-offset', type: Number }
	};

	static styles = [highlightBorderStyles, highlightLinkStyles, css`
		:host {
			display: inline-block;
			height: 100%;
		}
		:host([hidden]) {
			display: none;
		}
	`];

	static focusElementSelector = 'a';

	constructor() {
		super();
		this.textHidden = false;
	}

	render() {
		const { ariaLabel, id, text, tooltip } = this.#getRenderSettings();
		return html`
			<a id="${ifDefined(id)}" href="${ifDefined(this.href)}" aria-label="${ifDefined(ariaLabel)}">
				<span class="d2l-page-header-highlight-border"></span>
				<d2l-icon icon="${this.icon}"></d2l-icon>
				${text}
			</a>
			${tooltip}
		`;
	}

	#linkId = getUniqueId();

	#getRenderSettings() {
		if (this.textHidden) {
			return {
				ariaLabel: this.text,
				id: this.#linkId,
				text: nothing,
				tooltip: html`<d2l-tooltip for="${this.#linkId}" for-type="label" position="bottom" offset="${ifDefined(this.tooltipOffset)}" class="vdiff-target">${this.text}</d2l-tooltip>`
			};
		}
		return {
			ariaLabel: undefined,
			id: undefined,
			text: this.text,
			tooltip: nothing
		};
	}

}

customElements.define('d2l-page-header-link', PageHeaderLink);
