import '../button/button-icon.js';
import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html } from 'lit';
import { announce } from '../../helpers/announce.js';
import { classMap } from 'lit/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { labelStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

export const TagListItemMixin = superclass => class extends LocalizeCoreElement(RtlMixin(superclass)) {

	static get properties() {
		return {
			/**
			 * Enables the option to clear a tag list item. The `d2l-tag-list-item-clear` event will be dispatched when the user selects to delete the item. The consumer must handle the actual item deletion.
			 * @type {boolean}
			 */
			clearable: { type: Boolean },
			/**
			 * @ignore
			 */
			keyboardTooltipItem: { type: Boolean, attribute: 'keyboard-tooltip-item' },
			/**
			 * @ignore
			 */
			role: { type: String, reflect: true },
			_displayKeyboardTooltip: { type: Boolean }
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
				align-items: center;
				background-color: var(--d2l-color-regolith);
				border-radius: 6px;
				box-shadow: inset 0 0 0 1px var(--d2l-color-gypsum), 0 2px 4px rgba(0, 0, 0, 0.03);
				box-sizing: border-box;
				color: var(--d2l-color-ferrite);
				cursor: pointer;
				display: flex;
				max-width: 320px;
				min-width: 0;
				outline: none;
				padding: 0.25rem 0.6rem;
				transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out;
				white-space: nowrap;
			}
			.tag-list-item-container.tag-list-item-container-clearable {
				padding-right: 0.25rem;
			}
			:host([dir="rtl"]) .tag-list-item-container.tag-list-item-container-clearable {
				padding-left: 0.25rem;
				padding-right: 0.6rem;
			}
			.tag-list-item-content {
				outline: none;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			:host(:focus-visible) .tag-list-item-container,
			:host(:focus-visible:hover) .tag-list-item-container {
				box-shadow: inset 0 0 0 2px var(--d2l-color-celestine), 0 2px 4px rgba(0, 0, 0, 0.03);
			}
			:host(:hover) .tag-list-item-container,
			:host(:focus-visible) .tag-list-item-container {
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
			.d2l-tag-list-item-clear-button {
				padding-left: 3px;
			}
			:host([dir="rtl"]) .d2l-tag-list-item-clear-button {
				padding-left: 0;
				padding-right: 3px;
			}
			d2l-button-icon {
				--d2l-button-icon-fill-color: var(--d2l-color-chromite);
				--d2l-button-icon-min-height: 1.1rem;
				--d2l-button-icon-min-width: 1.1rem;
			}
			d2l-button-icon:hover {
				--d2l-button-icon-fill-color: var(--d2l-color-tungsten);
			}
			d2l-tooltip ul {
				list-style: none;
				margin-bottom: 0;
				margin-top: 0.2rem;
				padding: 0;
			}
			.d2l-tag-list-item-tooltip-title-key {
				font-weight: 600;
			}
		`];
	}

	constructor() {
		super();
		this.clearable = false;
		/** @ignore */
		this.keyboardTooltipItem = false;
		/** @ignore */
		this.role = 'listitem';
		this._displayKeyboardTooltip = false;
		this._id = getUniqueId();
		this._tooltipShown = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		const container = this.shadowRoot.querySelector('.tag-list-item-content');
		this.addEventListener('focus', async(e) => {
			// ignore focus events coming from inside the tag content
			if (e.composedPath()[0] !== this) return;

			this._displayKeyboardTooltip = (this.keyboardTooltipItem && !this._tooltipShown);
			await this.updateComplete;

			/** @ignore */
			container.dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: true }));
		});
		this.addEventListener('blur', () => {
			this._displayKeyboardTooltip = false;
			/** @ignore */
			container.dispatchEvent(new FocusEvent('blur', { bubbles: false, cancelable: true }));
		});
		this.addEventListener('keydown', this._handleKeydown);
	}

	handleClearItem(e, clearAll) {
		if (!this.clearable) return;

		let handleFocus = false;
		if (e) {
			const listItemParent = findComposedAncestor(e.composedPath()[0], (node) => node.role === 'listitem');
			handleFocus = listItemParent ? true : false;
		}

		if (!clearAll) announce(this.localize('components.tag-list.cleared-item', { value: this.text }));

		/** Dispatched when a user selects to delete a tag list item. The consumer must handle the actual element deletion and focus behaviour if there are no remaining list items. */
		this.dispatchEvent(new CustomEvent(
			'd2l-tag-list-item-clear',
			{ bubbles: true, composed: true, detail: { value: this.text, handleFocus } }
		));
	}

	_handleKeydown(e) {
		const expectedKey = e.keyCode === 8 || e.keyCode === 46; // backspace or delete
		if (!this.clearable || !expectedKey) return;
		e.preventDefault();
		this.handleClearItem(e);
	}

	_handleTooltipHide() {
		if (this._tooltipShown) this._displayKeyboardTooltip = false;
	}

	_handleTooltipShow() {
		this._tooltipShown = true;
		/** @ignore */
		this.dispatchEvent(new CustomEvent(
			'd2l-tag-list-item-tooltip-show',
			{ bubbles: true, composed: true }
		));
	}

	_renderTag(tagContent, hasTruncationTooltip) {
		const buttonText = typeof tagContent === 'object'
			? this.localize('components.tag-list.clear', { value: '' })
			: this.localize('components.tag-list.clear', { value: tagContent });
		const tooltipTagOverflow = hasTruncationTooltip ? html`
				<d2l-tooltip for="${this._id}" offset="20" show-truncated-only>
					${tagContent}
				</d2l-tooltip>
			` : null;
		const tooltipKeyboardInstructions = this._displayKeyboardTooltip ? html`
			<d2l-tooltip
				align="start"
				@d2l-tooltip-hide="${this._handleTooltipHide}"
				@d2l-tooltip-show="${this._handleTooltipShow}"
				for="${this._id}"
				for-type="descriptor"
				offset="20">
					${this._renderTooltipContent()}
			</d2l-tooltip>` : null;
		const containerClasses = {
			'd2l-label-text': true,
			'tag-list-item-container': true,
			'tag-list-item-container-clearable': this.clearable
		};
		return html`
			${tooltipKeyboardInstructions || tooltipTagOverflow}
			<div class="${classMap(containerClasses)}">
				<div class="tag-list-item-content" id="${this._id}" tabindex="-1">${tagContent}</div>
				${this.clearable ? html`
					<d2l-button-icon
						class="d2l-tag-list-item-clear-button"
						@click="${this.handleClearItem}"
						icon="tier1:close-small"
						tabindex="-1"
						text="${buttonText}">
					</d2l-button-icon>` : null}
			</div>
		`;
	}

	_renderTooltipContent() {
		return html`
			<div class="d2l-tag-list-item-tooltip-title-key">${this.localize('components.tag-list-item.tooltip-title')}</div>
			<ul>
				<li><span class="d2l-tag-list-item-tooltip-title-key">${this.localize('components.tag-list-item.tooltip-arrow-keys')}</span> - ${this.localize('components.tag-list-item.tooltip-arrow-keys-desc')}</li>
				<li><span class="d2l-tag-list-item-tooltip-title-key">${this.localize('components.tag-list-item.tooltip-delete-key')}</span> - ${this.localize('components.tag-list-item.tooltip-delete-key-desc')}</li>
			</ul>
		`;
	}

};
