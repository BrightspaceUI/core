import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { labelStyles } from '../typography/styles.js';

export const TagListItemMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			role: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [labelStyles, css`
			:host {
				display: grid;
				max-width: 100%;
				outline: none;
			}
			:host([hidden]) {
				display: none;
			}
			.tag-list-item-container {
				background-color: var(--d2l-color-regolith);
				border-radius: 6px;
				box-shadow: inset 0 0 0 1px var(--d2l-color-gypsum), 0 2px 4px rgba(0, 0, 0, 0.03);
				box-sizing: border-box;
				color: var(--d2l-color-ferrite);
				cursor: pointer;
				max-width: 320px;
				min-width: 0;
				outline: none;
				overflow: hidden;
				padding: 0.25rem 0.6rem;
				text-overflow: ellipsis;
				transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out;
				white-space: nowrap;
			}
			.tag-list-item-container:focus {
				box-shadow: inset 0 0 0 2px var(--d2l-color-celestine), 0 2px 4px rgba(0, 0, 0, 0.03);
			}
			:host(:hover) .tag-list-item-container,
			.tag-list-item-container:focus {
				background-color: var(--d2l-color-sylvite);
			}
			:host(:hover) .tag-list-item-container {
				box-shadow: inset 0 0 0 1px var(--d2l-color-mica), 0 2px 4px rgba(0, 0, 0, 0.03);
			}

			@media (prefers-reduced-motion: reduce) {
				.tag-list-item-container {
					transition: none;
				}
			}
		`];
	}

	constructor() {
		super();
		/** @ignore */
		this.role = 'listitem';
		this._id = getUniqueId();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		const container = this.shadowRoot.querySelector('.tag-list-item-container');
		this.addEventListener('focus', () => container.focus());
		this.addEventListener('blur', () => container.blur());
	}

	_renderTag(tagContent, hasTruncationTooltip) {
		const tooltip = hasTruncationTooltip ? html`
				<d2l-tooltip for="${this._id}" show-truncated-only>
					${tagContent}
				</d2l-tooltip>
			` : null;
		return html`
			${tooltip}
			<div class="tag-list-item-container d2l-label-text" id="${this._id}" tabindex="-1">
				${tagContent}
			</div>
		`;
	}

};
