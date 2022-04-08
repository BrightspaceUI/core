import '../button/button-icon.js';
import '../colors/colors.js';
import { css, html } from 'lit';
import { labelStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

// TODO: focus management in tag-list, keyboard behaviour
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
				outline: none;
			}
			:host([hidden]) {
				display: none;
			}
			.tag-list-item-content {
				height: 1rem;
				margin: auto;
				min-width: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.tag-list-item-container {
				background-color: var(--d2l-color-regolith);
				border-radius: 6px;
				box-shadow: inset 0 0 0 1px var(--d2l-color-gypsum), 0 2px 4px rgba(0, 0, 0, 0.03);
				box-sizing: border-box;
				color: var(--d2l-color-ferrite);
				cursor: pointer;
				display: flex;
				min-width: 0;
				padding: 0.25rem 0.6rem;
				transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out;
			}
			:host(:hover) .tag-list-item-container,
			:host(:focus) .tag-list-item-container {
				background-color: var(--d2l-color-sylvite);
			}
			:host(:hover) .tag-list-item-container {
				box-shadow: inset 0 0 0 1px var(--d2l-color-mica), 0 2px 4px rgba(0, 0, 0, 0.03);
			}
			:host(:focus) .tag-list-item-container {
				box-shadow: inset 0 0 0 2px var(--d2l-color-celestine), 0 2px 4px rgba(0, 0, 0, 0.03);
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
	}

	deleteItem() {
		this.parentNode.removeChild(this);
	}

	handleClearItem(e) {
		const handleFocus = e && (e.composedPath()[0].tagName === 'D2L-BUTTON-ICON' || e.composedPath()[0].tagName === 'D2L-ICON');
		/** Dispatched when a user selects to delete a tag list item. The consumer must handle the actual element deletion. */
		this.dispatchEvent(new CustomEvent(
			'd2l-tag-list-item-cleared',
			{ bubbles: true, composed: true, detail: { value: this.text, handleFocus: handleFocus || false } }
		));
	}
	_renderTag(tagContent) {
		const buttonText = typeof tagContent === 'object'
			? this.localize('components.tag-list.clear', { value: '' })
			: this.localize('components.tag-list.clear', { value: tagContent });
		return html`
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
