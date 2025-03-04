import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { InputInlineHelpMixin } from './input-inline-help.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

export const cssSizes = {
	inputBoxSize: 1.2,
	checkboxMargin: 0.5,
};

export const checkboxStyles = css`
	input[type="checkbox"].d2l-input-checkbox {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: ${cssSizes.inputBoxSize}rem ${cssSizes.inputBoxSize}rem;
		border-radius: 0.3rem;
		border-style: solid;
		box-sizing: border-box;
		display: inline-block;
		height: ${cssSizes.inputBoxSize}rem;
		margin: 0;
		outline: none;
		padding: 0;
		vertical-align: middle;
		width: ${cssSizes.inputBoxSize}rem;
	}
	input[type="checkbox"].d2l-input-checkbox:checked {
		background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23494C4E%22%20d%3D%22M8.4%2016.6c.6.6%201.5.6%202.1%200l8-8c.6-.6.6-1.5%200-2.1-.6-.6-1.5-.6-2.1%200l-6.9%207-1.9-1.9c-.6-.6-1.5-.6-2.1%200-.6.6-.6%201.5%200%202.1l2.9%202.9z%22/%3E%3C/svg%3E%0A");
	}
	input[type="checkbox"].d2l-input-checkbox:indeterminate {
		background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23494C4E%22%20d%3D%22M7.5%2C11h9c0.8%2C0%2C1.5%2C0.7%2C1.5%2C1.5l0%2C0c0%2C0.8-0.7%2C1.5-1.5%2C1.5h-9C6.7%2C14%2C6%2C13.3%2C6%2C12.5l0%2C0%0A%09C6%2C11.7%2C6.7%2C11%2C7.5%2C11z%22/%3E%3C/svg%3E%0A");
	}
	input[type="checkbox"].d2l-input-checkbox,
	input[type="checkbox"].d2l-input-checkbox:hover:disabled {
		background-color: var(--d2l-color-regolith);
		border-color: var(--d2l-color-galena);
		border-width: 1px;
	}
	input[type="checkbox"].d2l-input-checkbox:hover,
	input[type="checkbox"].d2l-input-checkbox:focus,
	input[type="checkbox"].d2l-input-checkbox.d2l-input-checkbox-focus,
	:host(.d2l-hovering) input[type="checkbox"]:not(:disabled).d2l-input-checkbox {
		border-color: var(--d2l-color-celestine);
		border-width: 2px;
		outline-width: 0;
	}
	input[type="checkbox"].d2l-input-checkbox:disabled,
	input[type="checkbox"].d2l-input-checkbox[aria-disabled="true"] {
		opacity: 0.5;
	}
`;

/**
 * A component that can be used to show a checkbox and optional visible label.
 * @slot - Checkbox information (e.g., text)
 * @slot inline-help - Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
 * @fires change - Dispatched when the checkbox's state changes
 */
class InputCheckbox extends InputInlineHelpMixin(FocusMixin(SkeletonMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * ACCESSIBILITY: Overrides the text in the `Default` slot for screenreader users
			 * @type {string}
			 */
			ariaLabel: { type: String, attribute: 'aria-label' },
			/**
			 * Checked state
			 * @type {boolean}
			 */
			checked: { type: Boolean },
			/**
			 * ACCESSIBILITY: Additional information communicated to screenreader users when focusing on the input
			 * @type {string}
			 */
			description: { type: String },
			/**
			 * Disables the input
			 * @type {boolean}
			 */
			disabled: { type: Boolean },
			/**
			 * Tooltip text when disabled
			 * @type {string}
			 */
			disabledTooltip: { type: String, attribute: 'disabled-tooltip' },
			/**
			 * Sets checkbox to an indeterminate state
			 * @type {boolean}
			 */
			indeterminate: { type: Boolean },
			isHovered: { state: true },
			/**
			 * Name of the input
			 * @type {string}
			 */
			name: { type: String },
			/**
			 * ACCESSIBILITY: ADVANCED: Sets "tabindex="-1"" on the checkbox. Note that an alternative method of focusing is necessary to implement if using this property.
			 * @type {boolean}
			 */
			notTabbable: { type: Boolean, attribute: 'not-tabbable' },
			/**
			 * Value of the input
			 * @type {string}
			 */
			value: { type: String }
		};
	}

	static get styles() {
		return [ super.styles, checkboxStyles, offscreenStyles,
			css`
				:host {
					display: block;
					line-height: ${cssSizes.inputBoxSize}rem;
					margin-bottom: 0.9rem;
				}
				:host([hidden]) {
					display: none;
				}
				:host([aria-label]) {
					display: inline-block;
					margin-bottom: 0;
				}
				label {
					display: flex;
					overflow-wrap: anywhere;
				}
				.d2l-input-checkbox-wrapper {
					display: inline-block;
				}
				.d2l-input-checkbox-text {
					color: var(--d2l-color-ferrite);
					display: inline-block;
					font-size: 0.8rem;
					font-weight: 400;
					margin-inline-start: ${cssSizes.checkboxMargin}rem;
					vertical-align: top;
					white-space: normal;
				}
				:host([aria-label]) .d2l-input-checkbox-text {
					margin-inline-start: 0;
				}
				:host([skeleton]) .d2l-input-checkbox-text.d2l-skeletize::before {
					bottom: 0.3rem;
					top: 0.3rem;
				}
				.d2l-input-inline-help {
					margin-inline-start: ${cssSizes.inputBoxSize + cssSizes.checkboxMargin}rem;
				}
				.d2l-input-checkbox-text-disabled {
					opacity: 0.5;
				}
				:host([skeleton]) .d2l-input-checkbox-text-disabled {
					opacity: 1;
				}
				input[type="checkbox"].d2l-input-checkbox {
					vertical-align: top;
				}
			`
		];
	}

	constructor() {
		super();
		this.checked = false;
		this.disabled = false;
		this.indeterminate = false;
		this.isHovered = false;
		this.name = '';
		this.notTabbable = false;
		this.value = 'on';
	}

	static get focusElementSelector() {
		return 'input.d2l-input-checkbox';
	}

	render() {
		const tabindex = this.notTabbable ? -1 : undefined;
		const textClasses = {
			'd2l-input-checkbox-text': true,
			'd2l-skeletize': true,
			'd2l-input-checkbox-text-disabled': this.disabled
		};
		const ariaChecked = this.indeterminate ? 'mixed' : undefined;
		const disabled = this.disabled || this.skeleton;
		const offscreenContainer = this.description ? html`<div class="d2l-offscreen" id="${this.#descriptionId}">${this.description}</div>` : null;
		const ariaDescribedByIds = `${this.description ? this.#descriptionId : ''} ${this._hasInlineHelp ? this.#inlineHelpId : ''}`.trim();
		const disabledTooltip = disabled && this.disabledTooltip ?
			html`<d2l-tooltip align="start" class="vdiff-target" for="${this.#inputId}" ?force-show="${this.isHovered}" position="top">${this.disabledTooltip}</d2l-tooltip>` :
			nothing;
		return html`
			<label>
				<span @mouseleave="${this.#handleMouseLeave}" @mouseenter="${this.#handleMouseEnter}"><span class="d2l-input-checkbox-wrapper d2l-skeletize"><input
					aria-checked="${ifDefined(ariaChecked)}"
					aria-describedby="${ifDefined(ariaDescribedByIds.length > 0 ? ariaDescribedByIds : undefined)}"
					aria-disabled="${ifDefined(disabled && this.disabledTooltip ? 'true' : undefined)}"
					aria-label="${ifDefined(this.ariaLabel)}"
					@change="${this.#handleChange}"
					class="d2l-input-checkbox"
					@click="${this._handleClick}"
					.checked="${this.checked}"
					?disabled="${disabled && !this.disabledTooltip}"
					id="${this.#inputId}"
					.indeterminate="${this.indeterminate}"
					name="${ifDefined(this.name)}"
					tabindex="${ifDefined(tabindex)}"
					type="checkbox"
					.value="${this.value}"></span><span class="${classMap(textClasses)}"><slot></slot></span></span>
			</label>
			${this._renderInlineHelp(this.#inlineHelpId)}
		  	${offscreenContainer}
			${disabledTooltip}
		`;
	}

	simulateClick() {
		this.checked = !this.checked;
		this.indeterminate = false;
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	#descriptionId = getUniqueId();
	#inlineHelpId = getUniqueId();
	#inputId = getUniqueId();

	#handleChange(e) {
		this.checked = e.target.checked;
		this.indeterminate = false;
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	#handleMouseEnter() {
		this.isHovered = true;
	}

	#handleMouseLeave() {
		this.isHovered = false;
	}

}
customElements.define('d2l-input-checkbox', InputCheckbox);
