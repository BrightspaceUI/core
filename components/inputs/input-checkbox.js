import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { InputInlineHelpMixin } from './input-inline-help.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { svgToCSS } from '../../helpers/svg-to-css.js';

export const inputCheck = svgToCSS(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="#494C4E" d="M8.4 16.6c.6.6 1.5.6 2.1 0l8-8c.6-.6.6-1.5 0-2.1-.6-.6-1.5-.6-2.1 0l-6.9 7-1.9-1.9c-.6-.6-1.5-.6-2.1 0-.6.6-.6 1.5 0 2.1l2.9 2.9z"/>\
</svg>`);
export const inputCheckIndeterminate = svgToCSS(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="#494C4E" d="M7.5,11h9c0.8,0,1.5,0.7,1.5,1.5l0,0c0,0.8-0.7,1.5-1.5,1.5h-9C6.7,14,6,13.3,6,12.5l0,0C6,11.7,6.7,11,7.5,11z"/>
</svg>`);

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
		background-image: ${inputCheck};
	}
	input[type="checkbox"].d2l-input-checkbox:indeterminate {
		background-image: ${inputCheckIndeterminate};
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
	@media (prefers-contrast: more) {
		input[type="checkbox"].d2l-input-checkbox:checked,
		input[type="checkbox"].d2l-input-checkbox:indeterminate {
			background-image: none;
			position: relative;
		}
		input[type="checkbox"].d2l-input-checkbox:checked::after,
		input[type="checkbox"].d2l-input-checkbox:indeterminate::after {
			background-color: FieldText;
			content: "";
			display: block;
			height: ${cssSizes.inputBoxSize}rem;
			left: 50%;
			position: absolute;
			top: 50%;
			transform: translate(-50%, -50%);
			width: ${cssSizes.inputBoxSize}rem;
		}

		input[type="checkbox"].d2l-input-checkbox:checked::after {
			mask-image: ${inputCheck};
		}

		input[type="checkbox"].d2l-input-checkbox:indeterminate::after {
			mask-image: ${inputCheckIndeterminate};
		}
	}
`;

/**
 * A component that can be used to show a checkbox and optional visible label.
 * @slot inline-help - Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
 * @slot supporting - Supporting information which will appear below and be aligned with the checkbox.
 * @fires change - Dispatched when the checkbox's state changes
 */
class InputCheckbox extends FormElementMixin(InputInlineHelpMixin(FocusMixin(SkeletonMixin(LitElement)))) {

	static get properties() {
		return {
			/**
			 * @ignore
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
			/**
			 * REQUIRED: Label for the input
			 * @type {string}
			 */
			label: { type: String },
			/**
			 * Hides the label visually
			 * @type {boolean}
			 */
			labelHidden: { attribute: 'label-hidden', reflect: true, type: Boolean },
			/**
			 * ACCESSIBILITY: ADVANCED: Sets "tabindex="-1"" on the checkbox. Note that an alternative method of focusing is necessary to implement if using this property.
			 * @type {boolean}
			 */
			notTabbable: { type: Boolean, attribute: 'not-tabbable' },
			/**
			 * Value of the input
			 * @type {string}
			 */
			value: { type: String },
			_hasSupporting: { state: true },
			_isHovered: { state: true },
		};
	}

	static get styles() {
		return [ super.styles, checkboxStyles, offscreenStyles,
			css`
				:host {
					display: block;
					margin-block-end: 0.6rem;
				}
				:host([hidden]) {
					display: none;
				}
				:host([label-hidden]) {
					display: inline-block;
					margin-block-end: 0;
				}
				label {
					display: flex;
					line-height: ${cssSizes.inputBoxSize}rem;
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
				:host([label-hidden]) .d2l-input-checkbox-text {
					margin-inline-start: 0;
				}
				:host([skeleton]) .d2l-input-checkbox-text.d2l-skeletize::before {
					bottom: 0.3rem;
					top: 0.3rem;
				}
				.d2l-input-inline-help,
				.d2l-input-checkbox-supporting {
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
				.d2l-input-checkbox-supporting {
					display: none;
					margin-block-start: 0.6rem;
				}
				.d2l-input-checkbox-supporting-visible {
					display: block;
				}
			`
		];
	}

	constructor() {
		super();
		this.checked = false;
		this.disabled = false;
		this.indeterminate = false;
		this.label = '';
		this.labelHidden = false;
		this.name = '';
		this.notTabbable = false;
		this.value = 'on';
		this._hasSupporting = false;
		this._isHovered = false;
	}

	static get focusElementSelector() {
		return 'input.d2l-input-checkbox';
	}

	render() {
		const tabindex = this.notTabbable ? -1 : undefined;
		const supportingClasses = {
			'd2l-input-checkbox-supporting': true,
			'd2l-input-checkbox-supporting-visible': this._hasSupporting
		};
		const textClasses = {
			'd2l-input-checkbox-text': true,
			'd2l-skeletize': true,
			'd2l-input-checkbox-text-disabled': this.disabled
		};
		const ariaChecked = this.indeterminate ? 'mixed' : undefined;
		const ariaLabel = (this.label && this.labelHidden) ? this.label : undefined;
		const label = (this.label && !this.labelHidden) ? this.label : nothing;
		const disabled = this.disabled || this.skeleton;
		const offscreenContainer = this.description ? html`<div class="d2l-offscreen" id="${this.#descriptionId}">${this.description}</div>` : null;
		const ariaDescribedByIds = `${this.description ? this.#descriptionId : ''} ${this._hasInlineHelp ? this.#inlineHelpId : ''}`.trim();
		const disabledTooltip = disabled && this.disabledTooltip ?
			html`<d2l-tooltip align="start" class="vdiff-target" for="${this.#inputId}" ?force-show="${this._isHovered}" position="top">${this.disabledTooltip}</d2l-tooltip>` :
			nothing;
		return html`
			<label @mouseleave="${this.#handleMouseLeave}" @mouseenter="${this.#handleMouseEnter}">
				<span class="d2l-input-checkbox-wrapper d2l-skeletize"><input
					aria-checked="${ifDefined(ariaChecked)}"
					aria-describedby="${ifDefined(ariaDescribedByIds.length > 0 ? ariaDescribedByIds : undefined)}"
					aria-disabled="${ifDefined(disabled && this.disabledTooltip ? 'true' : undefined)}"
					aria-label="${ifDefined(ariaLabel)}"
					@change="${this.#handleChange}"
					class="d2l-input-checkbox"
					@click="${this.#handleClick}"
					.checked="${this.checked}"
					?disabled="${disabled && !this.disabledTooltip}"
					id="${this.#inputId}"
					.indeterminate="${this.indeterminate}"
					name="${ifDefined(this.name)}"
					tabindex="${ifDefined(tabindex)}"
					type="checkbox"
					.value="${this.value}"></span><span class="${classMap(textClasses)}">${label}<slot></slot></span>
			</label>
			${this._renderInlineHelp(this.#inlineHelpId)}
			${offscreenContainer}
			${disabledTooltip}
			<div class="${classMap(supportingClasses)}" @change="${this.#handleSupportingChange}"><slot name="supporting" @slotchange="${this.#handleSupportingSlotChange}"></slot></div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('value')) {
			this.setFormValue(this.value); // d2l-form handles not using value when unchecked
		}
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('ariaLabel') && this.ariaLabel !== undefined) {
			this.label = this.ariaLabel;
			this.labelHidden = true;
		}
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

	#handleClick(e) {
		if (this.disabled) e.preventDefault();
	}

	#handleMouseEnter() {
		this._isHovered = true;
	}

	#handleMouseLeave() {
		this._isHovered = false;
	}

	#handleSupportingChange(e) {
		e.stopPropagation();
	}

	#handleSupportingSlotChange(e) {
		const content = e.target.assignedNodes({ flatten: true });
		this._hasSupporting = content?.length > 0;
	}

}
customElements.define('d2l-input-checkbox', InputCheckbox);
