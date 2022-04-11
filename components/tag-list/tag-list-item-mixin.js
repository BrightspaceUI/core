import '../button/button-icon.js';
import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { labelStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

// TODO: focus management in tag-list
export const TagListItemMixin = superclass => class extends LocalizeCoreElement(RtlMixin(superclass)) {

	static get properties() {
		return {
			/**
			 * Enables the option to clear a tag list item. The `d2l-tag-list-item-cleared` event will be dispatched when the user selects to delete the item. The consumer must handle the actual item deletion.
			 */
			clearable: { type: Boolean },
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
			.tag-list-item-container:focus,
			:host(:hover) .tag-list-item-container:focus {
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
			.tag-list-item-content + d2l-button-icon {
				padding-left: 3px;
			}
			:host([dir="rtl"]) .tag-list-item-content + d2l-button-icon {
				padding-left: 0;
				padding-right: 3px;
			}
			d2l-button-icon {
				--d2l-button-icon-min-height: 1.1rem;
				--d2l-button-icon-min-width: 1.1rem;
				--d2l-button-icon-fill-color: var(--d2l-color-chromite);
				margin-right: -7px;
			}
			:host([dir="rtl"]) d2l-button-icon {
				margin-right: 0;
				margin-left: -7px;
			}
			d2l-button-icon:hover {
				--d2l-button-icon-fill-color: var(--d2l-color-tungsten);
			}
		`];
	}

	constructor() {
		super();
		this.clearable = false;
		/** @ignore */
		this.role = 'listitem';
		this._id = getUniqueId();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		const container = this.shadowRoot.querySelector('.tag-list-item-container');
		this.addEventListener('focus', () => container.focus());
		this.addEventListener('blur', () => container.blur());
		this.addEventListener('keydown', this._handleKeydown);
	}

	deleteItem() {
		this.parentNode.removeChild(this);
	}

	handleClearItem(e) {
		if (!this.clearable) return;

		let handleFocus = false;
		if (e) {
			const tagName = e.composedPath()[0].tagName;
			handleFocus = (tagName === 'D2L-BUTTON-ICON' || tagName === 'D2L-ICON' || tagName === 'D2L-TAG-LIST-ITEM');
		}
		/** Dispatched when a user selects to delete a tag list item. The consumer must handle the actual element deletion. */
		this.dispatchEvent(new CustomEvent(
			'd2l-tag-list-item-cleared',
			{ bubbles: true, composed: true, detail: { value: this.text, handleFocus: handleFocus || false } }
		));
	}

	_handleKeydown(e) {
		const expectedKey = e.keyCode === 8 || e.keyCode === 46; // backspace or delete
		if (!this.clearable || !expectedKey) return;
		this.handleClearItem(e);
	}

	_renderTag(tagContent) {
		const buttonText = typeof tagContent === 'object'
			? this.localize('components.tag-list.clear', { value: '' })
			: this.localize('components.tag-list.clear', { value: tagContent });
		const tooltip = hasTruncationTooltip ? html`
				<d2l-tooltip for="${this._id}" show-truncated-only>
					${tagContent}
				</d2l-tooltip>
			` : null;
		return html`
			${tooltip}
			<div class="tag-list-item-container d2l-label-text">
				<div class="tag-list-item-content">${tagContent}</div>
				${this.clearable ? html`
					<d2l-button-icon
						@click="${this.handleClearItem}"
						icon="tier1:close-small"
						tabindex="-1"
						text="${buttonText}">
					</d2l-button-icon>` : null}
			</div>
		`;
	}

};
