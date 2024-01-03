import './input-number.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LabelledMixin } from '../../mixins/labelled/labelled-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * This component wraps the "<d2l-input-number>" tag and is intended for inputting percent values.
 * @slot after - Slot beside the input on the right side. Useful for an "icon" or "button-icon".
 * @fires change - Dispatched when an alteration to the value is committed (typically after focus is lost) by the user. The `value` attribute reflects a JavaScript Number which is parsed from the formatted input value.
 */
class InputPercent extends FocusMixin(LabelledMixin(SkeletonMixin(FormElementMixin(LocalizeCoreElement(RtlMixin(LitElement)))))) {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			autofocus: { type: Boolean },
			/**
			 * Disables the input
			 * @type {boolean}
			 */
			disabled: { type: Boolean },
			/**
			 * Restricts the maximum width of the input box without impacting the width of the label.
			 * @type {string}
			 */
			inputWidth: { attribute: 'input-width', type: String },
			/**
			 * Hides the label visually (moves it to the input's "aria-label" attribute)
			 * @type {boolean}
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			/**
			 * Maximum number of decimal values to show (rounds value up or down).
			 * @type {number}
			 */
			maxFractionDigits: { type: Number, attribute: 'max-fraction-digits' },
			/**
			 * Minimum number of decimal values to show.
			 * @type {number}
			 */
			minFractionDigits: { type: Number, attribute: 'min-fraction-digits' },
			/**
			 * Placeholder text
			 * @type {string}
			 */
			placeholder: { type: String },
			/**
			 * Indicates that a value is required
			 * @type {boolean}
			 */
			required: { type: Boolean },
			/**
			 * Value of the input
			 * @type {number}
			 */
			value: { type: Number }
		};
	}

	static get styles() {
		return [ super.styles,
			css`
				:host {
					display: inline-block;
					position: relative;
					width: 100%;
				}
				:host([hidden]) {
					display: none;
				}
			`
		];
	}

	constructor() {
		super();
		this.autofocus = false;
		this.disabled = false;
		this.labelHidden = false;
		this.required = false;
	}

	get value() { return this._value; }
	set value(val) {
		const oldValue = this.value;
		if (val < 0) val = 0;
		else if (val > 100) val = 100;
		this._value = val;
		this.requestUpdate('value', oldValue);
	}

	static get focusElementSelector() {
		return 'd2l-input-number';
	}

	render() {
		return html`
			<d2l-input-number
				?autofocus="${this.autofocus}"
				@blur="${this._handleBlur}"
				@change="${this._handleChange}"
				class="vdiff-target"
				?disabled="${this.disabled}"
				.forceInvalid="${this.invalid}"
				input-width="${ifDefined(this.inputWidth)}"
				label="${ifDefined(this.label)}"
				?label-hidden="${this.labelHidden || this.labelledBy}"
				.labelRequired="${false}"
				max="100"
				max-fraction-digits="${ifDefined(this.maxFractionDigits)}"
				min="0"
				min-fraction-digits="${ifDefined(this.minFractionDigits)}"
				name="${ifDefined(this.name)}"
				?noValidate="${this.noValidate}"
				placeholder="${ifDefined(this.placeholder)}"
				?required="${this.required}"
				?skeleton="${this.skeleton}"
				unit="%"
				value="${ifDefined(this.value)}"
				value-align="end">
					<slot slot="after" name="after"></slot>
			</d2l-input-number>
		`;
	}

	async validate() {
		if (!this.shadowRoot) return;
		const inputNumberElem = this.shadowRoot.querySelector('d2l-input-number');
		await inputNumberElem.updateComplete;
		const childErrors = await inputNumberElem.validate();
		const errors = await super.validate();
		return [...childErrors, ...errors];
	}

	async _handleChange(e) {
		const oldValue = this.value;
		this.value = e.target.value;
		this.requestUpdate();
		await this.updateComplete;

		if (oldValue !== this.value) {
			this.dispatchEvent(new CustomEvent(
				'change',
				{ bubbles: true, composed: false }
			));
		}
	}

}
customElements.define('d2l-input-percent', InputPercent);
