import '../colors/colors.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement, nothing } from 'lit';
import { buttonStyles } from './button-styles.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { labelStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

/**
 * A navigation control for moving sequentially through a set of items.
 */
class ButtonIterator extends FocusMixin(PropertyRequiredMixin(LocalizeCoreElement(LitElement))) {

	static properties = {
		/**
		 * ACCESSIBILITY: An optional description, typically for indicating the current position within the set of items
		 * @type {string}
		 */
		description: { type: String },
		/**
		 * Disables the previous button
		 * @type {boolean}
		 */
		previousDisabled: { attribute: 'previous-disabled', type: Boolean },
		/**
		 * Overrides the default text for the previous button
		 * @type {string}
		 */
		previousText: { attribute: 'previous-text', type: String },
		/**
		 * Disables the next button
		 * @type {boolean}
		 */
		nextDisabled: { attribute: 'next-disabled', type: Boolean },
		/**
		 * Renders only the next button
		 * @type {boolean}
		 */
		nextOnly: { attribute: 'next-only', type: Boolean },
		/**
		 * Overrides the default text for the next button
		 * @type {string}
		 */
		nextText: { attribute: 'next-text', type: String }
	};

	static styles = [buttonStyles, labelStyles, css`
		:host {
			display: inline-block;
			line-height: 0;
		}
		:host([hidden]) {
			display: none;
		}
		.container {
			align-items: center;
			display: flex;
			gap: 6px;
			justify-content: space-between;
		}
		.description {
			margin-inline: 6px;
		}
		@media (max-width: 556px) {
			.description { 
				display: none;
			}
		}
		.next {
			--d2l-button-end-start-radius: 0;
			--d2l-button-start-start-radius: 0;
		}
		.previous {
			--d2l-button-end-end-radius: 0;
			--d2l-button-start-end-radius: 0;
		}
		button {
			background-color: var(--d2l-theme-background-color-interactive-secondary-default);
			padding: 0;
			min-width: calc(2rem + 2px);
		}
		button:not([disabled]):hover,
		button:not([disabled]):focus {
			background-color: var(--d2l-theme-background-color-interactive-secondary-hover);
		}
		button[disabled] {
			cursor: default;
			opacity: var(--d2l-theme-opacity-disabled-control);
		}
	`];

	constructor() {
		super();
		this.description = undefined;
		this.nextDisabled = false;
		this.nextOnly = false;
		this.nextText = undefined;
		this.previousDisabled = false;
		this.previousText = undefined;
	}

	static get focusElementSelector() {
		return 'button:not([disabled])';
	}

	render() {
		const nextText = this.nextText ? this.nextText : this.localizeCommon('navigation:next:title');
		if (this.nextOnly) {
			return this.#renderButton(this.#nextId, 'next-only', 'tier1:chevron-right', nextText, undefined, this.nextDisabled, this.#handleNextClicked);
		}

		const hasDescription = (this.description !== undefined && this.description !== '' && !this.nextOnly);
		const description = hasDescription ? html`<div id="${this.#descriptionId}" class="description d2l-label-text">${this.description}</div>` : nothing;
		const descriptionId = hasDescription ? this.#descriptionId : undefined;

		const previousText = this.previousText ? this.previousText : this.localizeCommon('navigation:previous:title');

		return html`
			<div class="container">
				${this.#renderButton(this.#previousId, 'previous', 'tier1:chevron-left', previousText, descriptionId, this.previousDisabled, this.#handlePreviousClicked)}
				${description}
				${this.#renderButton(this.#nextId, 'next', 'tier1:chevron-right', nextText, descriptionId, this.nextDisabled, this.#handleNextClicked)}
			</div>
		`;
	}

	#descriptionId = getUniqueId();
	#previousId = getUniqueId();
	#nextId = getUniqueId();

	#handleNextClicked(e) {
		if (this.nextDisabled) {
			return;
		}
		e.stopPropagation();
		/** Dispatched when the next button is clicked. */
		this.dispatchEvent(new CustomEvent('d2l-button-iterator-next-click'));
	}

	#handlePreviousClicked(e) {
		if (this.previousDisabled) {
			return;
		}
		e.stopPropagation();
		/** Dispatched when the previous button is clicked. */
		this.dispatchEvent(new CustomEvent('d2l-button-iterator-previous-click'));
	}

	#renderButton(id, className, icon, text, descriptionId, disabled, clickHandler) {
		const ariaLabel = disabled ? text : undefined;
		const tooltip = !disabled ? html`
			<d2l-tooltip
				class="vdiff-target"
				for="${id}"
				for-type="label"
				position="bottom">${text}</d2l-tooltip>` : nothing;
		return html`
			<button
				aria-describedby="${ifDefined(descriptionId)}"
				aria-label="${ifDefined(ariaLabel)}"
				class="${className}"
				@click="${clickHandler}"
				?disabled="${disabled}"
				id="${id}"
				type="button">
				<d2l-icon icon="${icon}"></d2l-icon>
			</button>
			${tooltip}
		`;
	}
}

window.customElements.define('d2l-button-iterator', ButtonIterator);
