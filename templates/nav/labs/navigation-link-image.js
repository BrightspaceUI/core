import '../../../components/tooltip/tooltip.js';
import { css, html, LitElement, nothing } from 'lit';
import { highlightBorderStyles, highlightLinkStyles } from './navigation-styles.js';
import { FocusMixin } from '../../../mixins/focus-mixin.js';
import { getUniqueId } from '../../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';

class NavigationLinkImage extends FocusMixin(LitElement) {

	static get properties() {
		return {
			href: { type: String },
			slim: { reflect: true, type: Boolean },
			src: { type: String },
			text: { type: String },
			tooltipOffset: { attribute: 'tooltip-offset', type: Number }
		};
	}

	static get styles() {
		return [highlightBorderStyles, highlightLinkStyles, css`
			:host {
				display: inline-block;
				height: 100%;
			}
			:host([hidden]) {
				display: none;
			}
			img {
				max-height: 60px;
				max-width: 260px;
				vertical-align: middle;
			}
			:host([slim]) img {
				max-height: 40px;
				max-width: 173px;
			}
			.d2l-labs-navigation-link-image-container {
				align-items: center;
				display: inline-flex;
				height: 100%;
				vertical-align: middle;
			}
		`];
	}

	constructor() {
		super();
		this.slim = false;
		this.text = '';
		this._linkId = getUniqueId();
	}

	static get focusElementSelector() {
		return 'a';
	}

	render() {
		const image = html`<img src="${this.src}" alt="${this.text}">`;
		if (this.href) {
			return html`
				<a href="${this.href}" id="${this._linkId}">
					<span class="d2l-labs-navigation-highlight-border"></span>
					<span class="d2l-labs-navigation-link-image-container">${image}</span>
				</a>
				${this.text ? html`<d2l-tooltip for="${this._linkId}" for-type="label" position="bottom" offset="${ifDefined(this.tooltipOffset)}" class="vdiff-target">${this.text}</d2l-tooltip>` : nothing}
			`;
		}
		return html`<span class="d2l-labs-navigation-link-image-container">${image}</span>`;
	}
}

customElements.define('d2l-labs-navigation-link-image', NavigationLinkImage);
