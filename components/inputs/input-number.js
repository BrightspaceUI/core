import './input-text.js';
import { css, html, LitElement } from 'lit';
import { formatNumber, getNumberDescriptor, parseNumber } from '@brightspace-ui/intl/lib/number.js';
import { InputInlineHelpMixin } from './input-inline-help-mixin.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LabelledMixin } from '../../mixins/labelled/labelled-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

const HINT_TYPES = {
	NONE: 0,
	DECIMAL_DUPLICATE: 1,
	DECIMAL_INCORRECT_COMMA: 2,
	DECIMAL_INCORRECT_PERIOD: 3,
	INTEGER: 4
};

// US137000 - prevent Lit default converter from converting undefined to 0
const numberConverter = {
	fromAttribute: (attr) => { return !attr ? undefined : Number(attr); },
	toAttribute:  (prop) => { return String(prop); }
};

function formatValue(value, options, numDecimalDigits) {
	if (value === undefined) return '';
	if (numDecimalDigits > 0) {
		options.minimumFractionDigits = Math.min(
			Math.max(options.minimumFractionDigits, numDecimalDigits),
			options.maximumFractionDigits
		);
	}
	return formatNumber(value, options);
}

function countDecimalDigits(value, useLocaleDecimal) {

	if (value === undefined || value === null) {
		return 0;
	}

	const decimalSymbol = useLocaleDecimal ? getNumberDescriptor().symbols.decimal : '.';

	let numDecimalDigits = 0;
	for (let i = value.length - 1; i > -1; i--) {
		const c = value.charAt(i);
		if (c === decimalSymbol) {
			return numDecimalDigits;
		} else {
			numDecimalDigits++;
		}
	}

	return 0;

}

function roundPrecisely(val, maxFractionDigits) {
	const strValue = new Intl.NumberFormat(
		'en-US',
		{
			maximumFractionDigits: maxFractionDigits,
			minimumFractionDigits: 0,
			useGrouping: false
		}
	).format(val);
	return parseFloat(strValue);
}

/**
 * The `<d2l-input-number>` element is similar to `<d2l-input-text>`, except it's intended for inputting numbers only.
 * @slot after - Slot beside the input on the right side. Useful for an "icon" or "button-icon".
 * @slot left - Slot within the input on the left side. Useful for an "icon" or "button-icon".
 * @slot right - Slot within the input on the right side. Useful for an "icon" or "button-icon".
 * @fires change - Dispatched when an alteration to the value is committed (typically after focus is lost) by the user. The `value` attribute reflects a JavaScript Number which is parsed from the formatted input value.
 */
class InputNumber extends InputInlineHelpMixin(FocusMixin(LabelledMixin(SkeletonMixin(FormElementMixin(LocalizeCoreElement(LitElement)))))) {

	static get properties() {
		return {
			/**
			 * Specifies which types of values [can be autofilled](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) by the browser.
			 * @type {string}
			 */
			autocomplete: { type: String },
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
			 * ADVANCED: Hide the alert icon when input is invalid
			 * @type {boolean}
			 */
			hideInvalidIcon: { attribute: 'hide-invalid-icon', type: Boolean, reflect: true },
			/**
			 * Restricts the maximum width of the input box without impacting the width of the label
			 * @type {string}
			 */
			inputWidth: { attribute: 'input-width', type: String },
			/**
			 * Hides the label visually (moves it to the input's `aria-label` attribute)
			 * @type {boolean}
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			/**
			 * Maximum value allowed
			 * @type {number}
			 */
			max: { type: Number },
			/**
			 * Indicates whether the max value is exclusive
			 * @type {boolean}
			 */
			maxExclusive: { type: Boolean, attribute: 'max-exclusive' },
			/**
			 * Maximum number of digits allowed after the decimal place. Must be between 0 and 20 and greater than or equal to `minFractionDigits`. Default is Greater of `minFractionDigits` or `3`.
			 * @type {number}
			 */
			maxFractionDigits: { type: Number, attribute: 'max-fraction-digits' },
			/**
			 * Minimum value allowed
			 * @type {number}
			 */
			min: { type: Number },
			/**
			 * Indicates whether the min value is exclusive
			 * @type {boolean}
			 */
			minExclusive: { type: Boolean, attribute: 'min-exclusive' },
			/**
			 * Minimum number of digits allowed after the decimal place. Must be between 0 and 20 and less than or equal to `maxFractionDigits`. Default is `0`.
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
			 * @ignore
			 */
			trailingZeroes: { type: Boolean, attribute: 'trailing-zeroes' },
			/**
			 * Unit associated with the input value, displayed next to input and announced as part of the label
			 * @type {string}
			 */
			unit: { type: String },
			/**
			 * Accessible label for the unit which will not be visually rendered
			 * @type {string}
			 */
			unitLabel: { attribute: 'unit-label', type: String },
			/**
			 * Value of the input
			 * @type {number}
			 */
			value: { type: Number, converter: numberConverter },
			/**
			 * Alignment of the value text within the input
			 * @type {'start'|'end'}
			 */
			valueAlign: { attribute: 'value-align', type: String },
			/**
			 * @ignore
			 */
			valueTrailingZeroes: { type: String, attribute: 'value-trailing-zeroes' },
			_hintType: { type: Number },
			_formattedValue: { type: String }
		};
	}

	static get styles() {
		return [ super.styles,
			css`
				:host {
					display: inline-block;
					position: var(--d2l-input-position, relative); /* overridden by sticky headers in grades */
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
		this.inputWidth = '4rem';
		this.labelHidden = false;
		this.maxExclusive = false;
		this.minExclusive = false;
		this.required = false;
		this.valueAlign = 'start';

		this._formattedValue = '';
		this._hintType = HINT_TYPES.NONE;
		this._inlineHelpId = getUniqueId();
		this._inputId = getUniqueId();
		this._trailingZeroes = false;
		this._valueTrailingZeroes = '';
		this._descriptor = getNumberDescriptor();
	}

	get maxFractionDigits() {
		// emulate Intl's default maxFractionDigits behaviour
		if (this._maxFractionDigits === null || this._maxFractionDigits === undefined) {
			return Math.max(this.minFractionDigits, 3);
		}

		return this._maxFractionDigits;
	}
	set maxFractionDigits(val) {
		if (isNaN(val) || val < 0 || val > 20 || val < this.minFractionDigits) {
			throw new RangeError('maxFractionDigits must be between 0 and 20 and >= minFractionDigits');
		}
		this._maxFractionDigits = val;
		this._updateFormattedValue();
	}

	get minFractionDigits() {
		if (this._minFractionDigits === null || this._minFractionDigits === undefined) {
			return 0;
		}

		return this._minFractionDigits;
	}
	set minFractionDigits(val) {
		if (isNaN(val) || val < 0 || val > 20 || val < this.minFractionDigits) {
			throw new RangeError('minFractionDigits must be between 0 and 20 and <= maxFractionDigits');
		}
		this._minFractionDigits = val;
		this._updateFormattedValue();
	}

	/** @ignore */
	get trailingZeroes() { return this._trailingZeroes; }
	set trailingZeroes(val) {
		this._trailingZeroes = val;
		this._updateFormattedValue();
	}

	get value() {
		if (this._value === undefined) return undefined;
		return roundPrecisely(this._value, this.maxFractionDigits);
	}
	set value(val) {
		const oldValue = this.value;
		if (val === null || val === '' || isNaN(val)) {
			val = undefined;
		}
		this._value = val;
		this._updateFormattedValue();
		this.requestUpdate('value', oldValue);
	}

	/** @ignore */
	get valueTrailingZeroes() {
		if (this._valueTrailingZeroes === '') {
			return '';
		}
		const numDecimals = Math.min(
			countDecimalDigits(this._valueTrailingZeroes, false),
			this.maxFractionDigits
		);
		const valueTrailingZeroes = new Intl.NumberFormat(
			'en-US',
			{
				minimumFractionDigits: numDecimals,
				useGrouping: false
			}
		).format(this.value);
		return valueTrailingZeroes;
	}
	set valueTrailingZeroes(val) {
		this.value = parseFloat(val);
		this._valueTrailingZeroes = this.value === undefined ? '' : val;
		this._updateFormattedValue();
	}

	static get focusElementSelector() {
		return 'd2l-input-text';
	}

	/** @ignore */
	get validationMessage() {
		if (this.validity.rangeOverflow || this.validity.rangeUnderflow) {
			const minNumber = typeof(this.min) === 'number' ? formatValue(this.min, { minimumFractionDigits: this.minFractionDigits, maximumFractionDigits: this.maxFractionDigits }) : null;
			const maxNumber = typeof(this.max) === 'number' ? formatValue(this.max, { minimumFractionDigits: this.minFractionDigits, maximumFractionDigits: this.maxFractionDigits }) : null;
			if (minNumber && maxNumber) {
				return this.localize('components.form-element.input.number.rangeError', { min: minNumber, max: maxNumber, minExclusive: this.minExclusive, maxExclusive: this.maxExclusive });
			} else if (maxNumber) {
				return this.localize('components.form-element.input.number.rangeOverflow', { max: maxNumber, maxExclusive: this.maxExclusive });
			} else if (minNumber) {
				return this.localize('components.form-element.input.number.rangeUnderflow', { min: minNumber, minExclusive: this.minExclusive });
			}
		}
		return super.validationMessage;
	}

	/** @ignore */
	get validity() {
		const elem = this.shadowRoot && this.shadowRoot.querySelector('d2l-input-text');
		if (elem && !elem.validity.valid) {
			return elem.validity;
		}
		return super.validity;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('d2l-localize-resources-change', () => {
			this._descriptor = getNumberDescriptor();
			if (this._formattedValue.length > 0) {
				this._updateFormattedValue();
			}
		});
	}

	render() {
		const valueAlign = (this.valueAlign === 'end') ? 'end' : 'start';
		return html`
			<d2l-input-text
				autocomplete="${ifDefined(this.autocomplete)}"
				?noValidate="${this.noValidate}"
				?autofocus="${this.autofocus}"
				@blur="${this._handleBlur}"
				@change="${this._handleChange}"
				class="vdiff-target"
				@input="${this._handleInput}"
				@keypress="${this._handleKeyPress}"
				?disabled="${this.disabled}"
				.forceInvalid="${this.invalid}"
				?hide-invalid-icon="${this.hideInvalidIcon}"
				id="${this._inputId}"
				input-width="${this.inputWidth}"
				@invalid-change="${this._handleInvalidChange}"
				label="${ifDefined(this.label)}"
				?label-hidden="${this.labelHidden || this.labelledBy}"
				.labelRequired="${false}"
				name="${ifDefined(this.name)}"
				placeholder="${ifDefined(this.placeholder)}"
				?required="${this.required}"
				?skeleton="${this.skeleton}"
				unit="${ifDefined(this.unit)}"
				unit-label="${ifDefined(this.unitLabel)}"
				.value="${this._formattedValue}"
				value-align="${valueAlign}">
					<slot slot="left" name="left"></slot>
					<slot slot="right" name="right"></slot>
					<slot slot="after" name="after"></slot>
					${this._renderInlineHelpNested(this._inlineHelpId)}
			</d2l-input-text>
			${this._getTooltip()}
		`;
	}

	async updated(changedProperties) {
		super.updated(changedProperties);

		let checkValidity = false;
		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'value') {
				this.setFormValue(this.value);
				checkValidity = true;
			} else if ((prop === 'min' && oldVal !== undefined)
				|| (prop === 'max' && oldVal !== undefined)
				|| (prop === 'minExclusive' && oldVal !== undefined)
				|| (prop === 'maxExclusive' && oldVal !== undefined)) {
				checkValidity = true;
			}
		});

		if (checkValidity) {
			const inputTextElem = this.shadowRoot.querySelector('d2l-input-text');
			await inputTextElem.updateComplete;

			let rangeUnderflowCondition = false;
			if (typeof(this.min) === 'number') {
				rangeUnderflowCondition = this.minExclusive ? this.value <= this.min : this.value < this.min;
			}
			let rangeOverflowCondition = false;
			if (typeof(this.max) === 'number') {
				rangeOverflowCondition = this.maxExclusive ? this.value >= this.max : this.value > this.max;
			}

			this.setValidity({
				rangeUnderflow: rangeUnderflowCondition,
				rangeOverflow: rangeOverflowCondition
			});
			this.requestValidate(true);
		}
	}

	async validate() {
		if (!this.shadowRoot) return;
		const inputTextElem = this.shadowRoot.querySelector('d2l-input-text');
		await inputTextElem.updateComplete;
		const childErrors = await inputTextElem.validate();
		const errors = await super.validate();
		return [...childErrors, ...errors];
	}

	_getTooltip() {
		if (this.disabled) return null;
		if (this.validationError && this.childErrors.size === 0 && !this.noValidate) {
			return html`<d2l-tooltip announced for="${this._inputId}" state="error" align="start" class="vdiff-target">${this.validationError}</d2l-tooltip>`;
		}
		let lang = '';
		if (this._hintType === HINT_TYPES.INTEGER) {
			lang = 'components.input-number.hintInteger';
		} else if (this._hintType === HINT_TYPES.DECIMAL_DUPLICATE) {
			lang = 'components.input-number.hintDecimalDuplicate';
		} else if (this._hintType === HINT_TYPES.DECIMAL_INCORRECT_COMMA) {
			lang = 'components.input-number.hintDecimalIncorrectComma';
		} else if (this._hintType === HINT_TYPES.DECIMAL_INCORRECT_PERIOD) {
			lang = 'components.input-number.hintDecimalIncorrectPeriod';
		}
		if (lang !== '') {
			return html`<d2l-tooltip announced for="${this._inputId}" state="info" align="start" class="vdiff-target">${this.localize(lang)}</d2l-tooltip>`;
		}
	}

	_handleBlur() {
		this._hintType = HINT_TYPES.NONE;
	}

	async _handleChange(e) {

		const value = e.target.value;
		this._formattedValue = value;
		await this.updateComplete;

		let dispatchEvent = false;
		if (this.trailingZeroes) {
			const oldValueTrailingZeroes = this.valueTrailingZeroes;

			const parsedValue = parseNumber(value);
			if (value.trim() === '' || isNaN(parsedValue)) {
				this.valueTrailingZeroes = '';
			} else {
				this.valueTrailingZeroes = new Intl.NumberFormat(
					'en-US',
					{
						minimumFractionDigits: countDecimalDigits(value, true),
						useGrouping: false
					}
				).format(parsedValue);
			}
			dispatchEvent = (oldValueTrailingZeroes !== this.valueTrailingZeroes);
		} else {
			const oldValue = this.value;
			this.value = value.trim() === '' ? NaN : parseNumber(value);
			dispatchEvent = (oldValue !== this.value);
		}

		if (dispatchEvent) {
			await this.requestValidate(true); // wait for validity logic to re-run
			this.dispatchEvent(new CustomEvent(
				'change',
				{ bubbles: true, composed: false }
			));
		}

	}

	_handleInput(e) {
		if (e.inputType === 'insertFromPaste') {
			this._handleChange(e);
		}
		if (e.inputType !== 'insertText') {
			this._hintType = HINT_TYPES.NONE;
		}
	}

	_handleInvalidChange() {
		this.requestValidate(true);
	}

	_handleKeyPress(e) {
		// NOTE: keypress event is deprecated, but keydown fires for ALL keys (including Shift/Tab/etc.)
		// which makes it hard to selectively supress "not numbers". The "beforeinput" event is
		// actually what we want, but it's not supported in legacy-Edge. When it's gone we should switch.
		const key = e.key;
		let prevent = false;
		let hintType = HINT_TYPES.NONE;
		const decimalIndex = e.target.value.indexOf(this._descriptor.symbols.decimal);
		const hasDecimal = decimalIndex > -1 &&
			(decimalIndex >= e.target.selectionEnd || decimalIndex < e.target.selectionStart);
		if (key === this._descriptor.symbols.negative) {
			// negative symbol must be at the end
			if (this._descriptor.patterns.decimal.negativePattern === '{number}-') {
				if (e.target.selectionStart !== e.target.value.length) {
					prevent = true;
				}
			} else {
				// negative symbol must be at the start
				if (e.target.selectionStart !== 0) {
					prevent = true;
				}
			}
		} else if (key === this._descriptor.symbols.decimal) {
			// already has a decimal symbol
			if (hasDecimal) {
				hintType = HINT_TYPES.DECIMAL_DUPLICATE;
				prevent = true;
			// looking for an integer only
			} else if (this.maxFractionDigits === 0) {
				hintType = HINT_TYPES.INTEGER;
				prevent = true;
			}
		} else if ((key === '.' || key === ',') && !hasDecimal && this.maxFractionDigits > 0) {
			// incorrect decimal
			hintType = key === ',' ? HINT_TYPES.DECIMAL_INCORRECT_PERIOD : HINT_TYPES.DECIMAL_INCORRECT_COMMA;
			prevent = true;
		} else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Enter'].indexOf(key) === -1) {
			// not a number
			prevent = true;
		}
		this._hintType = hintType;
		if (prevent) {
			e.preventDefault();
		}
	}

	_updateFormattedValue() {
		this._formattedValue = formatValue(
			this.value,
			{
				minimumFractionDigits: this.minFractionDigits,
				maximumFractionDigits: this.maxFractionDigits,
				useGrouping: false
			},
			this.trailingZeroes ? countDecimalDigits(this._valueTrailingZeroes, false) : 0
		);
	}

}
customElements.define('d2l-input-number', InputNumber);
