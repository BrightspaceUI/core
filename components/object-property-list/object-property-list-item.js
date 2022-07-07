import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { getSeparator } from '@brightspace-ui/intl/lib/list.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A single object property, to be used within an object-property-list,
 * with an optional icon.
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
			}
			.separator {
				display: var(--d2l-object-property-list-item-separator-display, inline);
				margin: 0 0.05rem;
			}
			.separator d2l-icon {
				color: var(--d2l-color-galena);
			}
			.item-icon {
				margin: -0.1rem 0.3rem 0 0;
			}
			:host([dir="rtl"]) .item-icon {
				margin: -0.1rem 0 0 0.3rem;
			}
		`];
	}

	render() {
		return html`
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
				<span class="d2l-offscreen">${getSeparator({ nonBreaking: true })}</span>
				<d2l-icon icon="tier1:bullet" aria-hidden="true"></d2l-icon>
			</span>
		`;
	}
}

customElements.define('d2l-object-property-list-item', ObjectPropertyListItem);
