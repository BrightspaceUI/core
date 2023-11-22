import '../button/button-icon.js';
import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, nothing } from 'lit';
import { findComposedAncestor, isComposedAncestor } from '../../helpers/dom.js';
import { heading4Styles, labelStyles } from '../typography/styles.js';
import { announce } from '../../helpers/announce.js';
import { classMap } from 'lit/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

const keyCodes = {
	BACKSPACE: 8,
	DELETE: 46,
	ENTER: 13,
	SPACE: 32
};

export const TagListItemMixin = superclass => class extends LocalizeCoreElement(RtlMixin(superclass)) {

	static get properties() {
		return {
			/**
			 * Enables the option to clear a tag list item. The `d2l-tag-list-item-clear` event will be dispatched when the user selects to delete the item. The consumer must handle the actual item deletion.
			 * @type {boolean}
			 */
			clearable: { type: Boolean },
			/**
			 * REQUIRED if clearable. Acts as a unique identifier for the tag
			 * @type {string}
			 */
			key: { type: String },
			/**
			 * @ignore
			 */
			keyboardTooltipItem: { type: Boolean, attribute: 'keyboard-tooltip-item' },
			/**
			 * @ignore
			 */
			keyboardTooltipShown: { type: Boolean, attribute: 'keyboard-tooltip-shown' }
		};
	}

	static get styles() {
		return [labelStyles, heading4Styles, css`
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
				transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out;
				white-space: nowrap;
			}
			.tag-list-item-container.tag-list-item-container-clearable {
				padding-right: 0.2rem;
			}
			:host([dir="rtl"]) .tag-list-item-container.tag-list-item-container-clearable {
				padding-left: 0.2rem;
				padding-right: 0;
			}
			.tag-list-item-content {
				outline: none;
				overflow: hidden;
				padding: 0.25rem 0.6rem;
				text-overflow: ellipsis;
			}
			:host(:focus-within) .tag-list-item-container,
			:host(:focus-within:hover) .tag-list-item-container {
				box-shadow: inset 0 0 0 2px var(--d2l-color-celestine), 0 2px 4px rgba(0, 0, 0, 0.03);
			}
			:host(:hover) .tag-list-item-container,
			:host(:focus-within) .tag-list-item-container {
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
				margin-left: calc(-0.6rem + 3px);
			}
			:host([dir="rtl"]) .d2l-tag-list-item-clear-button {
				margin-left: 0;
				margin-right: calc(-0.6rem + 3px);
			}
			d2l-button-icon {
				--d2l-button-icon-fill-color: var(--d2l-color-chromite);
				--d2l-button-icon-min-height: 1.2rem;
				--d2l-button-icon-min-width: 1.2rem;
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
			.d2l-heading-4 {
				margin: 0 0 0.5rem 0;
			}
		`];
	}

	constructor() {
		super();
		this.clearable = false;
		/** @ignore */
		this.keyboardTooltipItem = false;
		this.keyboardTooltipShown = false;
		this._id = getUniqueId();
		this._plainText = '';
		this._validatingPlainTextTimeout = null;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		const container = this.shadowRoot.querySelector('.tag-list-item-content');

		this.addEventListener('focus', async(e) => {
			// ignore focus events coming from inside the tag content
			if (e.composedPath()[0] !== this) return;
			const tagList = findComposedAncestor(this, elem => elem.tagName === 'D2L-TAG-LIST');
			if (this.keyboardTooltipItem && this.keyboardTooltipShown && !isComposedAncestor(tagList, e.relatedTarget)) {
				const arrows = this.localize('components.tag-list-item.tooltip-arrow-keys');
				const arrowsDescription = this.localize('components.tag-list-item.tooltip-arrow-keys-desc');

				let message = `${arrows} - ${arrowsDescription}`;
				if (this.clearable) {
					const del = this.localize('components.tag-list-item.tooltip-delete-key');
					const delDescription = this.localize('components.tag-list-item.tooltip-delete-key-desc');
					message += `; ${del} - ${delDescription}`;
				}

				announce(message);
			}

			await this.updateComplete;

			container.focus();
		});

		this.addEventListener('keydown', this._handleKeydown);
	}

	_handleClearItem() {
		if (!this.clearable) return;

		announce(this.localize('components.tag-list.cleared-item', { value: this._plainText }));

		/** Dispatched when a user selects to delete an individual tag list item. The consumer must handle the actual element deletion and focus behaviour if there are no remaining list items. */
		this.dispatchEvent(new CustomEvent(
			'd2l-tag-list-item-clear',
			{ bubbles: true, composed: true, detail: { key: this.key } }
		));
	}

	_handleKeyboardTooltipHide() {
		this.keyboardTooltipShown = true;
	}

	_handleKeyboardTooltipShow() {
		/** @ignore */
		this.dispatchEvent(new CustomEvent(
			'd2l-tag-list-item-tooltip-show',
			{ bubbles: true, composed: true }
		));
	}

	_handleKeydown(e) {
		const openKeys = e.keyCode === keyCodes.SPACE || e.keyCode === keyCodes.ENTER;
		if (this.keyboardTooltipItem && !this.keyboardTooltipShown && openKeys) this.keyboardTooltipShown = true;

		const clearKeys = e.keyCode === keyCodes.BACKSPACE || e.keyCode === keyCodes.DELETE;
		if (!this.clearable || !clearKeys) return;
		e.preventDefault();
		this._handleClearItem();
	}

	_renderKeyboardTooltipContent() {
		return html`
			<div class="d2l-tag-list-item-tooltip-title-key">${this.localize('components.tag-list-item.tooltip-title')}</div>
			<ul>
				<li><span class="d2l-tag-list-item-tooltip-title-key">${this.localize('components.tag-list-item.tooltip-arrow-keys')}</span> - ${this.localize('components.tag-list-item.tooltip-arrow-keys-desc')}</li>
				${this.clearable ? html`
					<li><span class="d2l-tag-list-item-tooltip-title-key">${this.localize('components.tag-list-item.tooltip-delete-key')}</span> - ${this.localize('components.tag-list-item.tooltip-delete-key-desc')}</li>
				` : nothing}
			</ul>
		`;
	}

	_renderTag(tagContent, options = {}) {
		this._validatePlainText();
		this._plainText = options.plainText || '';

		const buttonText = this.localize('components.tag-list.clear', { value: this._plainText });

		const hasDescription = !!options.description;

		let tooltip = nothing;
		if (this.keyboardTooltipItem && !this.keyboardTooltipShown) {
			tooltip = html`
				<d2l-tooltip
					class="vdiff-target"
					align="start"
					@d2l-tooltip-hide="${this._handleKeyboardTooltipHide}"
					@d2l-tooltip-show="${this._handleKeyboardTooltipShow}"
					for="${this._id}">
						${this._renderKeyboardTooltipContent()}
				</d2l-tooltip>`;
		} else if (options.hasTruncationTooltip || hasDescription) {
			const tooltipHeader = hasDescription ? html`<div class="d2l-heading-4">${tagContent}</div>` : tagContent;
			tooltip = html`
				<d2l-tooltip class="vdiff-target" for="${this._id}" ?show-truncated-only="${!hasDescription}">
					${tooltipHeader}
					${hasDescription ? options.description : nothing}
				</d2l-tooltip>`;
		}

		const containerClasses = {
			'd2l-label-text': true,
			'tag-list-item-container': true,
			'tag-list-item-container-clearable': this.clearable
		};
		const focusableClasses = {
			'tag-list-item-content': true
		};
		if (options.focusableClass) focusableClasses[options.focusableClass] = true;

		return html`
			${tooltip}
			<div class="${classMap(containerClasses)}">
				<div aria-label="${ifDefined(options.label)}"
					aria-roledescription="${this.localize('components.tag-list-item.role-description')}"
					class="${classMap(focusableClasses)}"
					id="${this._id}"
					role="button"
					tabindex="-1">
					${tagContent}
				</div>
				${this.clearable ? html`
					<d2l-button-icon
						class="d2l-tag-list-item-clear-button"
						@click="${this._handleClearItem}"
						icon="tier1:close-small"
						tabindex="-1"
						text="${buttonText}">
					</d2l-button-icon>` : null}
			</div>
		`;
	}

	_validatePlainText() {
		clearTimeout(this._validatingPlainTextTimeout);
		// don't error immediately in case it doesn't get set immediately
		this._validatingPlainTextTimeout = setTimeout(() => {
			this._validatingPlainTextTimeout = null;
			if (!this.isConnected) return;
			const hasPlainText = (this._plainText?.constructor === String) && this._plainText?.length > 0;
			if (!hasPlainText) {
				throw new Error(`TagListItemMixin: "${this.tagName.toLowerCase()}" called "_render()" with empty "plainText" option`);
			}
		}, 3000);
	}

};
