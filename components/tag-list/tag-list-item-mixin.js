import '../button/button-icon.js';
import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, nothing, unsafeCSS } from 'lit';
import { findComposedAncestor, isComposedAncestor } from '../../helpers/dom.js';
import { getFocusRingStyles, isFocusVisibleSupported, isHasSelectorSupported } from '../../helpers/focus.js';
import { heading4Styles, labelStyles } from '../typography/styles.js';
import { announce } from '../../helpers/announce.js';
import { classMap } from 'lit/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

const keyCodes = {
	BACKSPACE: 8,
	DELETE: 46,
	ENTER: 13,
	SPACE: 32
};
let hasDisplayedKeyboardTooltip = false;
let tabPressed = false;
let tabListenerAdded = false;
function addTabListener() {
	if (tabListenerAdded) return;
	tabListenerAdded = true;
	document.addEventListener('keydown', e => {
		if (e.keyCode !== 9) return;
		tabPressed = true;
	});
	document.addEventListener('keyup', e => {
		if (e.keyCode !== 9) return;
		tabPressed = false;
	});
}

export function resetHasDisplayedKeyboardTooltip() {
	hasDisplayedKeyboardTooltip = false;
}

const focusSelector = isHasSelectorSupported() && isFocusVisibleSupported() ?
	'.tag-list-item-container:has(:focus-visible)' :
	':host(:focus-within) .tag-list-item-container';

export const TagListItemMixin = superclass => class extends LocalizeCoreElement(PropertyRequiredMixin(superclass)) {

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
			_plainText: {
				state: true,
				required: {
					message: (_value, elem) => `TagListItemMixin: "${elem.tagName.toLowerCase()}" called "_renderTag()" with empty "plainText" option`
				}
			},
			_displayKeyboardTooltip: { state: true }
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
				--d2l-focus-ring-offset: -2px;
				align-items: center;
				background-color: var(--d2l-color-regolith);
				border-radius: 6px;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
				box-sizing: border-box;
				color: var(--d2l-color-ferrite);
				cursor: pointer;
				display: flex;
				line-height: 1rem;
				max-width: 320px;
				min-width: 0;
				outline: 1px solid var(--d2l-color-gypsum);
				outline-offset: -1px;
				transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out;
				white-space: nowrap;
			}
			.tag-list-item-container.tag-list-item-container-clearable {
				padding-inline-end: 0.2rem;
			}
			.tag-list-item-content {
				outline: none;
				overflow: hidden;
				padding: 0.25rem 0.6rem;
				text-overflow: ellipsis;
			}
			${getFocusRingStyles(() => focusSelector)}
			:host(:hover) .tag-list-item-container,
			${unsafeCSS(focusSelector)} {
				background-color: var(--d2l-color-sylvite);
			}
			:host(:hover) .tag-list-item-container:not(${unsafeCSS(focusSelector)}) {
				outline-color: var(--d2l-color-mica);
			}

			@media (prefers-reduced-motion: reduce) {
				.tag-list-item-container {
					transition: none;
				}
			}
			.d2l-tag-list-item-clear-button {
				margin-inline-start: calc(-0.6rem + 3px);
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
			@media (prefers-contrast: more) {
				:host(:hover) .tag-list-item-container {
					outline-offset: -2px;
					outline-width: 2px;
				}
			}
		`];
	}

	constructor() {
		super();
		this.clearable = false;
		/** @ignore */
		this.keyboardTooltipItem = false;
		this._displayKeyboardTooltip = false;
		this._id = getUniqueId();
		this._plainText = '';
	}

	connectedCallback() {
		super.connectedCallback();
		addTabListener();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('focus', async(e) => {
			// ignore focus events coming from inside the tag content
			if (e.composedPath()[0] !== this) return;
			const tagList = findComposedAncestor(this, elem => elem.tagName === 'D2L-TAG-LIST');
			if (this.keyboardTooltipItem && hasDisplayedKeyboardTooltip && !isComposedAncestor(tagList, e.relatedTarget)) {
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
			this._onFocusIn();

			await this.updateComplete;
			// delay the focus to allow focusin to fire
			setTimeout(() => {
				this.shadowRoot.querySelector('.tag-list-item-content').focus();
			});
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
		this._displayKeyboardTooltip = false;
	}

	_handleKeydown(e) {
		const clearKeys = e.keyCode === keyCodes.BACKSPACE || e.keyCode === keyCodes.DELETE;
		if (!this.clearable || !clearKeys) return;
		e.preventDefault();
		this._handleClearItem();
	}

	_onFocusIn() {
		if (!tabPressed || hasDisplayedKeyboardTooltip || !this.keyboardTooltipItem) return;
		this._displayKeyboardTooltip = true;
		hasDisplayedKeyboardTooltip = true;
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
		this._plainText = options.plainText || '';

		const buttonText = this.localize('components.tag-list.clear', { value: this._plainText });

		const hasDescription = !!options.description;

		let tooltip = nothing;
		if (this._displayKeyboardTooltip) {
			tooltip = html`
				<d2l-tooltip
					class="vdiff-target"
					align="start"
					@d2l-tooltip-hide="${this._handleKeyboardTooltipHide}"
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

};
