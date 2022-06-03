import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { getLanguage } from '@brightspace-ui/intl/lib/common.js';
// import { getSeparator } from '@brightspace-ui/intl/lib/list.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { trimWhitespace } from './trimWhitespace.js';

export function getSeparator(nonBreaking) {
	const langTag = getLanguage();
	const nbsp = '\xa0';
	const space = nonBreaking ? nbsp : ' ';

	if (langTag === 'ar') return `${space}،${space}`;
	if (['ja', 'zh-cn', 'zh-tw'].includes(langTag)) return '、';
	return `,${space}`;
}

/**
 * A placeholder.
 */
export class ObjectPropertyListItem extends RtlMixin(LitElement) {
	static get properties() {
		return {
			/**
			 * Name of an optional icon to display
			 * @type {string}
			 */
			icon: { type: String },
			/**
			 * REQUIRED: Text to display on the item
			 * @type {string}
			 */
			text: { type: String },
		};
	}

	static get styles() {
		return [offscreenStyles, css`
			d2l-icon {
				height: 0.9rem;
				width: 0.9rem;
				margin-top: -0.1rem;
			}
			.separator {
				display: var(--d2l-object-property-list-item-separator-display, inline);
			}
			:host(:not([dir="rtl"])) .item-icon {
				margin-right: 0.3rem;
			}
			:host([dir="rtl"]) .item-icon {
				margin-left: 0.3rem;
			}
		`];
	}

	render() {
		return html`${trimWhitespace()}
			${this._renderIcon()}
			<span>${this.text}</span>
			${this._renderSeparator()}
		`;
	}

	_renderIcon() {
		return !this.icon ? null : html`
			<d2l-icon icon="${this.icon}" class="item-icon"></d2l-icon>
		`;
	}

	_renderSeparator() {
		return html`
			<span class="separator">
				<span class="d2l-offscreen">${getSeparator(true)}</span>
				<d2l-icon icon="tier1:bullet" aria-hidden="true"></d2l-icon>
			</span>
		`;
	}
}

customElements.define('d2l-object-property-list-item', ObjectPropertyListItem);
