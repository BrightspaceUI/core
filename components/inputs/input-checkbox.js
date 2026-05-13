import '../expand-collapse/expand-collapse-content.js';
import '../tooltip/tooltip.js';
import { _generateInputCheckboxStyles, cssSizes } from './input-checkbox-styles.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { InputInlineHelpMixin } from './input-inline-help.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

export const checkboxStyles = _generateInputCheckboxStyles('input[type="checkbox"].d2l-input-checkbox');

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
			 * Hides the supporting slot when unchecked
			 * @type {boolean}
			 */
			supportingHiddenWhenUnchecked: { type: Boolean, attribute: 'supporting-hidden-when-unchecked', reflect: true },
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
					color: var(--d2l-theme-text-color-static-standard);
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
				:host(:not([skeleton])) .d2l-input-checkbox-text-disabled {
					opacity: 0.5;
				}
				input[type="checkbox"].d2l-input-checkbox {
					vertical-align: top;
				}
				.d2l-input-checkbox-supporting {
					margin-block-start: 0.6rem;
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
		this.supportingHiddenWhenUnchecked = false;
		this.value = 'on';
		this._hasSupporting = false;
		this._isHovered = false;
	}

	static get focusElementSelector() {
		return 'input.d2l-input-checkbox';
	}

	render() {
		const supportingContentVisible = this._hasSupporting && (this.checked || !this.supportingHiddenWhenUnchecked);
		const textClasses = {
			'd2l-input-checkbox-text': true,
			'd2l-skeletize': true,
			'd2l-input-checkbox-text-disabled': this.disabled
		};
		const ariaChecked = this.indeterminate ? 'mixed' : undefined;
		const ariaExpanded = this._hasSupporting && this.supportingHiddenWhenUnchecked ? (supportingContentVisible ? 'true' : 'false') : undefined;
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
					aria-expanded="${ifDefined(ariaExpanded)}"
					aria-label="${ifDefined(ariaLabel)}"
					@change="${this.#handleChange}"
					class="d2l-input-checkbox"
					@click="${this.#handleClick}"
					.checked="${this.checked}"
					?disabled="${disabled && !this.disabledTooltip}"
					id="${this.#inputId}"
					.indeterminate="${this.indeterminate}"
					name="${ifDefined(this.name)}"
					type="checkbox"
					.value="${this.value}"></span><span class="${classMap(textClasses)}">${label}<slot></slot></span>
			</label>
			${this._renderInlineHelp(this.#inlineHelpId)}
			${offscreenContainer}
			${disabledTooltip}
			<d2l-expand-collapse-content ?expanded="${supportingContentVisible}">
				<div class="d2l-input-checkbox-supporting" @change="${this.#handleSupportingChange}"><slot name="supporting" @slotchange="${this.#handleSupportingSlotChange}"></slot></div>
			</d2l-expand-collapse-content>
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
			console.error('d2l-input-checkbox: the ariaLabel property is no longer supported. Use the label property with label-hidden instead.');
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
