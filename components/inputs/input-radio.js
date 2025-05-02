import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { InputInlineHelpMixin } from './input-inline-help.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { radioStyles } from './input-radio-styles.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A radio input within a <d2l-input-radio-group>.
 * @slot inline-help - Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
 * @slot supporting - Supporting information which will appear below and be aligned with the input.
 */
class InputRadio extends InputInlineHelpMixin(SkeletonMixin(FocusMixin(PropertyRequiredMixin(LitElement)))) {

	static get properties() {
		return {
			/**
			 * Checked state
			 * @type {boolean}
			 */
			checked: { type: Boolean, reflect: true },
			/**
			 * ACCESSIBILITY: Additional information communicated to screenreader users when focusing on the input
			 * @type {string}
			 */
			description: { type: String },
			/**
			 * Disables the input
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * REQUIRED: Label for the input
			 * @type {string}
			 */
			label: { required: true, type: String },
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
			_checked: { state: true },
			_firstFocusable: { state: true },
			_hasSupporting: { state: true },
			_isHovered: { state: true },
			_invalid: { state: true }
		};
	}

	static get styles() {
		return [super.styles, radioStyles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-input-radio-label {
				cursor: default;
				margin-block-end: 0;
			}
			.d2l-input-inline-help,
			.d2l-input-radio-supporting {
				margin-inline-start: 1.7rem;
			}
			.d2l-input-radio-supporting {
				display: none;
				margin-block-start: 0.6rem;
			}
			.d2l-input-radio-supporting-visible {
				display: block;
			}
		`];
	}

	constructor() {
		super();
		this.disabled = false;
		this.supportingHiddenWhenUnchecked = false;
		this.value = 'on';
		this._checked = false;
		this._firstFocusable = false;
		this._hasSupporting = false;
		this._isHovered = false;
		this._invalid = false;
	}

	get checked() { return this._checked; }
	set checked(value) {
		if (value === this._checked) return;
		this.dispatchEvent(
			new CustomEvent(
				'd2l-input-radio-checked',
				{ bubbles: true, composed: false, detail: { checked: value } }
			)
		);
	}

	static get focusElementSelector() {
		return '.d2l-input-radio';
	}

	render() {
		const disabled = this.disabled || this.skeleton;
		const labelClasses = {
			'd2l-input-radio-label': true,
			'd2l-input-radio-label-disabled': this.disabled && !this.skeleton,
		};
		const radioClasses = {
			'd2l-input-radio': true,
			'd2l-disabled': this.disabled && !this.skeleton,
			'd2l-hovering': this._isHovered && !disabled,
			'd2l-skeletize': true
		};
		const supportingClasses = {
			'd2l-input-radio-supporting': true,
			'd2l-input-radio-supporting-visible': this._hasSupporting && (!this.supportingHiddenWhenUnchecked || this._checked),
		};
		const description = this.description ? html`<div id="${this.#descriptionId}" hidden>${this.description}</div>` : nothing;
		const ariaDescribedByIds = `${this.description ? this.#descriptionId : ''} ${this._hasInlineHelp ? this.#inlineHelpId : ''}`.trim();
		const tabindex = (!disabled && (this._checked || this._firstFocusable)) ? '0' : undefined;
		return html`
			<div class="${classMap(labelClasses)}" @mouseover="${this.#handleMouseOver}" @mouseout="${this.#handleMouseOut}">
				<div
					aria-checked="${this._checked}"
					aria-describedby="${ifDefined(ariaDescribedByIds.length > 0 ? ariaDescribedByIds : undefined)}"
					aria-disabled="${ifDefined(disabled ? 'true' : undefined)}"
					aria-invalid="${ifDefined(this._invalid ? 'true' : undefined)}"
					aria-labelledby="${this.#labelId}"
					class="${classMap(radioClasses)}"
					role="radio"
					tabindex="${ifDefined(tabindex)}"></div>
				<div id="${this.#labelId}" class="d2l-skeletize">${this.label}</div>
			</div>
			${this._renderInlineHelp(this.#inlineHelpId)}
			${description}
			<div class="${classMap(supportingClasses)}" @change="${this.#handleSupportingChange}"><slot name="supporting" @slotchange="${this.#handleSupportingSlotChange}"></slot></div>
		`;
	}

	#descriptionId = getUniqueId();
	#inlineHelpId = getUniqueId();
	#labelId = getUniqueId();

	#handleMouseOut() {
		this._isHovered = false;
	}

	#handleMouseOver() {
		this._isHovered = true;
	}

	#handleSupportingChange(e) {
		e.stopPropagation();
	}

	#handleSupportingSlotChange(e) {
		const content = e.target.assignedNodes({ flatten: true });
		this._hasSupporting = content?.length > 0;
	}

}
customElements.define('d2l-input-radio', InputRadio);
