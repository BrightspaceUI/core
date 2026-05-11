import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { highlightBorderStyles, highlightLinkStyles } from './page-header-styles.js';
import { FocusMixin } from '../../mixins/focus-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * Page header back link with built-in icon and text.
 */
class PageHeaderLinkBack extends LocalizeCoreElement(FocusMixin(LitElement)) {

	static properties = {
		/**
		 * Optional text for the back link
		 * @type {string}
		 */
		text: { type: String },
		/**
		 * REQUIRED: URL or URL fragment of the back link
		 * @type {string}
		 */
		href: { type: String }
	};

	static styles = [highlightBorderStyles, highlightLinkStyles, css`
		:host {
			display: inline-block;
			height: 100%;
		}
		:host([hidden]) {
			display: none;
		}
		.text-short {
			display: none;
		}
		@media (max-width: 615px) {
			.text-long {
				display: none;
			}
			.text-short {
				display: inline;
			}
		}
	`];

	static focusElementSelector = 'a';

	render() {
		const href = this.href ? this.href : 'javascript:void(0);'; // backwards-compatible for uses before missing "href" threw exception
		const commonText = this.localizeCommon('navigation:back:title');
		const longText = this.text || commonText;
		return html`
			<a href="${href}" aria-label="${longText}">
				<span class="d2l-page-header-highlight-border"></span>
				<d2l-icon icon="tier1:chevron-left"></d2l-icon>
				<span class="text-long">${longText}</span>
				<span class="text-short">${commonText}</span>
			</a>
		`;
	}

}

customElements.define('d2l-page-header-link-back', PageHeaderLinkBack);
