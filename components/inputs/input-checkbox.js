import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inlineHelpStyles } from './input-styles.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

export const checkboxStyles = css`
	input[type="checkbox"].d2l-input-checkbox {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: 1.2rem 1.2rem;
		border-radius: 0.3rem;
		border-style: solid;
		box-sizing: border-box;
		display: inline-block;
		height: 1.2rem;
		margin: 0;
		outline: none;
		padding: 0;
		vertical-align: middle;
		width: 1.2rem;
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
	input[type="checkbox"].d2l-input-checkbox:disabled {
		opacity: 0.5;
	}
`;

/**
 * A component that can be used to show a checkbox and optional visible label.
 * @slot - Checkbox information (e.g., text)
 * @fires change - Dispatched when the checkbox's state changes
 */
class InputCheckbox extends FocusMixin(SkeletonMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Use when text on checkbox does not provide enough context
			 * @type {string}
			 */
			ariaLabel: { type: String, attribute: 'aria-label' },
			/**
			 * Checked state
			 * @type {boolean}
			 */
			checked: { type: Boolean },
			/**
			 * Additional information communicated in the aria-describedby on the input
			 * @type {string}
			 */
			description: { type: String },
			/**
			 * Disables the input
			 * @type {boolean}
			 */
			disabled: { type: Boolean },
			/**
			 * Sets checkbox to an indeterminate state
			 * @type {boolean}
			 */
			indeterminate: { type: Boolean },
			/**
			 * Name of the input
			 * @type {string}
			 */
			name: { type: String },
			/**
			 * Sets "tabindex="-1"" on the checkbox
			 * @type {boolean}
			 */
			notTabbable: { type: Boolean, attribute: 'not-tabbable' },
			/**
			 * Value of the input
			 * @type {string}
			 */
			value: { type: String },
			_inlineHelpDefined: { type: Boolean }
		};
	}

	static get styles() {
		return [ super.styles, checkboxStyles, offscreenStyles,
			css`
				:host {
					display: block;
					line-height: 1.2rem;
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
					margin-left: 0.5rem;
					vertical-align: top;
					white-space: normal;
				}
				:host([dir="rtl"]) .d2l-input-checkbox-text {
					margin-left: 0;
					margin-right: 0.5rem;
				}
				:host([aria-label]) .d2l-input-checkbox-text {
					margin-left: 0;
					margin-right: 0;
				}
				:host([dir="rtl"][aria-label]) .d2l-input-checkbox-text {
					margin-left: 0;
					margin-right: 0;
				}
				:host([skeleton]) .d2l-input-checkbox-text.d2l-skeletize::before {
					bottom: 0.3rem;
					top: 0.3rem;
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
		this.name = '';
		this.notTabbable = false;
		this.value = 'on';
		this._descriptionId = getUniqueId();
		this._inlinehelpId = getUniqueId();
		this._inlineHelpDefined = false;
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
		const offscreenContainer = this.description ? html`<div class="d2l-offscreen" id="${this._descriptionId}">${this.description}</div>` : null;
		const ariaDescribeById = ifDefined(this.description ? `${this._inlinehelpId} ${this._descriptionId}` : this._inlinehelpId);
		return html`
			<label>
				<span class="d2l-input-checkbox-wrapper d2l-skeletize"><input
					aria-checked="${ifDefined(ariaChecked)}"
					aria-describedby="${ariaDescribeById}"
					aria-label="${ifDefined(this.ariaLabel)}"
					@change="${this._handleChange}"
					class="d2l-input-checkbox"
					@click="${this._handleClick}"
					.checked="${this.checked}"
					?disabled="${disabled}"
					.indeterminate="${this.indeterminate}"
					name="${ifDefined(this.name)}"
					tabindex="${ifDefined(tabindex)}"
					type="checkbox"
					.value="${this.value}"></span><span class="${classMap(textClasses)}"><slot></slot></span>
			</label>
			<div
				class="d2l-body-small"
				style="${this._handleInlineHelpStyles()}"
			>
				<slot name="inline-help" @slotchange="${this._hasInlineHelpContent}"></slot>
			</div>
		  	${offscreenContainer}
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

	_handleChange(e) {
		this.checked = e.target.checked;
		this.indeterminate = false;
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	/**
	 * This is needed only for Legacy-Edge AND going from indeterminate to checked/unchecked.
	 * When the indeterminate state is set, and the checkbox is clicked, the _handleChange
	 * function is NOT triggered, therefore we have to detect the click and handle it ourselves.
	 */
	_handleClick() {
		const browserType = window.navigator.userAgent;
		if (this.indeterminate && (browserType.indexOf('Edge') > -1)) {
			this.simulateClick();
		}
	}

	_handleInlineHelpStyles() {
		const styles = { ...inlineHelpStyles };
		styles.marginLeft = '1.7rem'; // Check box has width 1.2rem, text has margin-left 0.5rem
		return this._inlineHelpDefined ? styleMap(styles) : '';
	}

	_hasInlineHelpContent(e) {
		const content = e.target.assignedNodes({ flatten: true });

		this._inlineHelpDefined = content?.length > 0;
	}
}
customElements.define('d2l-input-checkbox', InputCheckbox);
