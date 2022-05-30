import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { getLanguage } from '@brightspace-ui/intl/lib/common.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
// import { getSeparator } from '@brightspace-ui/intl/lib/list.js';

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
export class MetadataItem extends LitElement {
	static properties = {
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

	static styles = [offscreenStyles, css`
		:host {
			display: flex;
			align-items: center;
		}
		d2l-icon {
			height: 0.9rem;
			width: 0.9rem;
		}
		.separator {
			display: var(--d2l-metadata-item-separator-display, inline);
			margin: 0 0.3rem;
		}
		.item-icon {
			margin-right: 0.3rem;
		}
	`];

	render() {
		return html`
			${this.renderIcon()}
			${this.text}
			${this.renderSeparator()}
		`;
	}

	renderIcon() {
		return !this.icon ? null : html`
			<d2l-icon icon="${this.icon}" class="item-icon"></d2l-icon>
		`;
	}

	renderSeparator() {
		// TODO: Styling the icon to resize properly with font size.
		return html`
			<span class="separator">
				<span class="d2l-offscreen">${getSeparator(true)}</span>
				<d2l-icon icon="tier1:bullet" aria-hidden="true"></d2l-icon>
			</span>
		`;
	}

}

customElements.define('d2l-metadata-item', MetadataItem);
