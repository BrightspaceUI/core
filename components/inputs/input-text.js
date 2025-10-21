import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement, nothing } from 'lit';
import { inputStyles, invalidIcon } from './input-styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { formatNumber } from '@brightspace-ui/intl/lib/number.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { InputInlineHelpMixin } from './input-inline-help.js';
import { inputLabelStyles } from './input-label-styles.js';
import { LabelledMixin } from '../../mixins/labelled/labelled-mixin.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { PerfMonitor } from '../../helpers/perfMonitor.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * This component wraps the native "<input type="text">" tag and is intended primarily for inputting generic text, email addresses and URLs.
 * @slot left - Slot within the input on the left side. Useful for an "icon" or "button-icon".
 * @slot right - Slot within the input on the right side. Useful for an "icon" or "button-icon".
 * @slot after - Slot beside the input on the right side. Useful for an "icon" or "button-icon".
 * @slot inline-help - Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
 * @fires change - Dispatched when an alteration to the value is committed (typically after focus is lost) by the user
 * @fires input - Dispatched immediately after changes by the user
 */
class InputText extends InputInlineHelpMixin(PropertyRequiredMixin(FocusMixin(LabelledMixin(FormElementMixin(SkeletonMixin(RtlMixin(LitElement))))))) {

	static get properties() {
		return {
			/**
			 * ADVANCED: Indicates that the input has a popup menu
			 * @type {string}
			 */
			ariaHaspopup: { type: String, attribute: 'aria-haspopup' },
			/**
			 * ADVANCED: Indicates that the input value is invalid
			 * @type {string}
			 */
			ariaInvalid: { type: String, attribute: 'aria-invalid' },
			/**
			 * ADVANCED: Specifies which types of values can be autofilled by the browser
			 * @type {string}
			 */
			autocomplete: { type: String },
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			autofocus: { type: Boolean },
			/**
			 * Additional information communicated in the aria-describedby on the input
			 * @type {string}
			 */
			description: { type: String, reflect: true },
			/**
			 * Disables the input
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * ADVANCED: Hide the alert icon when input is invalid
			 * @type {boolean}
			 */
			hideInvalidIcon: { attribute: 'hide-invalid-icon', type: Boolean, reflect: true },
			/**
			 * ADVANCED: Hide the tooltip when input is invalid
			 * @type {boolean}
			 */
			hideInvalidTooltip: { attribute: 'hide-invalid-tooltip', type: Boolean, reflect: true },
			/**
			 * Restricts the maximum width of the input box without impacting the width of the label.
			 * @type {string}
			 */
			inputWidth: { attribute: 'input-width', type: String },
			/**
			 * ADVANCED: Additional information relating to how to use the component
			 * @type {string}
			 */
			instructions: { type: String, attribute: 'instructions' },
			/**
			 * Hides the label visually (moves it to the input's "aria-label" attribute)
			 * @type {boolean}
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			/**
			 * For number inputs, maximum value
			 * @type {string}
			 */
			max: { type: String },
			/**
			 * Imposes an upper character limit
			 * @type {number}
			 */
			maxlength: { type: Number },
			/**
			 * For number inputs, minimum value
			 * @type {string}
			 */
			min: { type: String },
			/**
			 * Imposes a lower character limit
			 * @type {number}
			 */
			minlength: { type: Number },
			/**
			 * ADVANCED: Regular expression pattern to validate the value
			 * @type {string}
			 */
			pattern: { type: String },
			/**
			 * ADVANCED: Text to display when input fails validation against the pattern.  If a list of characters is included in the message, use `LocalizeMixin`'s `localizeCharacter`.
			 */
			patternFailureText: { type: String, attribute: 'pattern-failure-text' },
			/**
			 * @ignore
			 */
			placeholder: { type: String },
			/**
			 * Prevents pressing ENTER from submitting forms
			 * @type {boolean}
			 */
			preventSubmit: { type: Boolean, attribute: 'prevent-submit' },
			/**
			 * ADVANCED: Makes the input read-only
			 * @type {boolean}
			 */
			readonly: { type: Boolean },
			/**
			 * Indicates that a value is required
			 * @type {boolean}
			 */
			required: { type: Boolean, reflect: true },
			/**
			 * Size of the input
			 * @type {number}
			 */
			size: { type: Number },
			/**
			 * ADVANCED: For number inputs, sets the step size
			 * @type {string}
			 */
			step: { type: String },
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			title: { type: String },
			/**
			 * The type of the text input
			 * @type {'text'|'email'|'number'|'password'|'search'|'tel'|'url'}
			 */
			type: { type: String },
			/**
			 * Unit associated with the input value, displayed next to input and announced as part of the label
			 * @type {string}
			 */
			unit: { type: String },
			/**
			 * Accessible label for the unit which will not be visually rendered
			 * @type {string}
			 */
			unitLabel: {
				attribute: 'unit-label',
				required: {
					dependentProps: ['unit'],
					message: (_value, elem) => `<d2l-input-text>: missing required attribute "unit-label" for unit "${elem.unit}"`,
					validator: (_value, elem, hasValue) => {
						const hasUnit = (typeof elem.unit === 'string') && elem.unit.length > 0;
						return !(hasUnit && elem.unit !== '%' && !hasValue);
					}
				},
				type: String
			},
			/**
			 * Value of the input
			 * @type {string}
			 */
			value: { type: String },
			/**
			 * ADVANCED: Alignment of the value text within the input
			 * @type {'start'|'end'}
			 */
			valueAlign: { attribute: 'value-align', type: String },
			_firstSlotWidth: { type: Number },
			_hasAfterContent: { type: Boolean, attribute: false },
			_focused: { type: Boolean },
			_hovered: { type: Boolean },
			_lastSlotWidth: { type: Number }
		};
	}

	static get styles() {
		return [ super.styles, inputStyles, inputLabelStyles, offscreenStyles,
			css`
				:host {
					display: inline-block;
					width: 100%;
				}
				:host([hidden]) {
					display: none;
				}
				:host([value-align="end"]) {
					--d2l-input-text-align: end;
				}
				.d2l-input-label {
					display: inline-block;
					vertical-align: bottom;
				}
				:host(:not([skeleton]):not([input-width])) .d2l-input-label {
					width: 100%;
				}
				.d2l-input-container {
					display: flex;
				}
				.d2l-input-text-container {
					flex: 1 1 auto;
					position: var(--d2l-input-position, relative); /* overridden by sticky headers in grades */
				}
				.d2l-input {
					-webkit-appearance: textfield;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				#after-slot {
					display: inline-block;
					flex: 0 0 auto;
				}
				.d2l-input-inside-before, .d2l-input-inside-after {
					align-items: center;
					display: flex;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
				}
				.d2l-input-inside-before {
					left: 0;
				}
				.d2l-input-inside-after {
					right: 0;
				}
				.d2l-input-unit {
					color: var(--d2l-color-galena);
					font-size: 0.7rem;
					margin-top: 0.05rem;
				}
				.d2l-input-inside-before .d2l-input-unit {
					margin-left: 12px;
					margin-right: 6px;
				}
				.d2l-input-inside-after .d2l-input-unit {
					display: inline-block;
					margin-left: 6px;
					margin-right: 12px;
				}
				:host([disabled]) .d2l-input-unit {
					opacity: 0.5;
				}
				.d2l-input-text-invalid-icon {
					background-image: ${invalidIcon};
					background-position: center center;
					background-repeat: no-repeat;
					background-size: 0.8rem 0.8rem;
					display: flex;
					height: 22px;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: 22px;
				}
			`
		];
	}

	constructor() {
		super();
		this.autofocus = false;
		this.disabled = false;
		this.hideInvalidIcon = false;
		this.hideInvalidTooltip = false;
		this.labelHidden = false;
		this.preventSubmit = false;
		this.readonly = false;
		this.required = false;
		this.type = 'text';
		this.valueAlign = 'start';
		this._value = '';

		this._descriptionId = getUniqueId();
		this._firstSlotWidth = 0;
		this._focused = false;
		this._hasAfterContent = false;
		this._hovered = false;
		this._inlineHelpId = getUniqueId();
		this._inputId = getUniqueId();
		this._intersectionObserver = null;
		this._isIntersecting = false;
		this._lastSlotWidth = 0;
		this._prevValue = '';

		this._handleBlur = this._handleBlur.bind(this);
		this._handleFocus = this._handleFocus.bind(this);
		this._perfMonitor = new PerfMonitor(this);
	}

	get value() { return this._value; }
	set value(val) {
		this._setValue(val, true);
	}

	static get focusElementSelector() {
		return '.d2l-input';
	}

	/** @ignore */
	get selectionEnd() {
		const elem = this.shadowRoot && this.shadowRoot.querySelector('.d2l-input');
		return elem ? elem.selectionEnd : 0;
	}

	/** @ignore */
	get selectionStart() {
		const elem = this.shadowRoot && this.shadowRoot.querySelector('.d2l-input');
		return elem ? elem.selectionStart : 0;
	}

	/** @ignore */
	get validationMessage() {
		if (this.validity.rangeOverflow) {
			return this.localize('components.form-element.input.number.rangeOverflow', { max: formatNumber(parseFloat(this.max)), maxExclusive: false });
		} else if (this.validity.rangeUnderflow) {
			return this.localize('components.form-element.input.number.rangeUnderflow', { min: formatNumber(parseFloat(this.min)), minExclusive: false });
		} else if (this.validity.tooShort) {
			return this.localize('components.form-element.input.text.tooShort', { label: this.label, minlength: formatNumber(this.minlength) });
		} else if (this.validity.typeMismatch) {
			if (this.type === 'email') {
				return this.localize('components.form-element.input.email.typeMismatch');
			} else if (this.type === 'url') {
				return this.localize('components.form-element.input.url.typeMismatch');
			}
		} else if (this.validity.patternMismatch && (typeof this.patternFailureText === 'string')) {
			return this.patternFailureText;
		}
		return super.validationMessage;
	}

	/** @ignore */
	get validity() {
		const elem = this.shadowRoot && this.shadowRoot.querySelector('.d2l-input');
		if (elem && !elem.validity.valid) {
			return elem.validity;
		}
		return super.validity;
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.hasAttribute('aria-label')) {
			this.labelRequired = false;
		}
		this.addEventListener('click', this._handleClick);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._intersectionObserver) this._intersectionObserver.disconnect();
		const container = this.shadowRoot && this.shadowRoot.querySelector('.d2l-input-text-container');
		this.removeEventListener('click', this._handleClick);
		if (!container) return;
		container.removeEventListener('blur', this._handleBlur, true);
		container.removeEventListener('focus', this._handleFocus, true);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._setValue(this.value, true);

		const container = this.shadowRoot && this.shadowRoot.querySelector('.d2l-input-text-container');
		if (!container) return;
		container.addEventListener('blur', this._handleBlur, true);
		container.addEventListener('focus', this._handleFocus, true);

		// if initially hidden then update layout when it becomes visible
		if (typeof(IntersectionObserver) === 'function') {
			this._intersectionObserver = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						this._isIntersecting = true;
						this._updateInputLayout();
					}
				});
			});
			this._intersectionObserver.observe(container);
		} else {
			this._isIntersecting = true;
		}

	}

	render() {

		this._perfMonitor.hostUpdated();

		const isFocusedOrHovered = !this.disabled && (this._focused || this._hovered);
		const inputClasses = {
			'd2l-input': true,
			'd2l-input-focus': isFocusedOrHovered
		};
		const ariaRequired = this.required ? 'true' : undefined;
		const ariaInvalid = this.invalid ? 'true' : this.ariaInvalid;
		const offscreenContainer = this.description ? html`<div class="d2l-offscreen" id="${this._descriptionId}">${this.description}</div>` : null;
		const disabled = this.disabled || this.skeleton;

		const inputStyles = {};
		if (this._firstSlotWidth > 0) {
			inputStyles.paddingLeft = isFocusedOrHovered ? `${this._firstSlotWidth - 1}px` : `${this._firstSlotWidth}px`;
		}
		if (this._lastSlotWidth > 0) {
			inputStyles.paddingRight = isFocusedOrHovered ? `${this._lastSlotWidth - 1}px` : `${this._lastSlotWidth}px`;
		}

		const inputContainerStyles = {
			maxWidth: this.inputWidth
		};
		const labelStyles = {
			minWidth: this.skeleton ? undefined : this.inputWidth
		};

		const firstSlotName = (this.dir === 'rtl') ? 'right' : 'left';
		const lastSlotName = (this.dir === 'rtl') ? 'left' : 'right';

		const isValid = ariaInvalid !== 'true' || this.disabled;
		const invalidIconSide = ((this.dir === 'rtl' && this.valueAlign === 'start') || (this.dir !== 'rtl' && this.valueAlign === 'end')) ? 'left' : 'right';
		const invalidIconOffset = Math.max((invalidIconSide === 'left') ? this._firstSlotWidth : this._lastSlotWidth, 12);
		const invalidIconStyles = {
			[invalidIconSide]: `${invalidIconOffset}px`
		};
		const showInvalidIcon = !isValid && !this.hideInvalidIcon && !this._focused;
		if (showInvalidIcon) {
			const paddingProperty = invalidIconSide === 'left' ? 'paddingLeft' : 'paddingRight';
			inputStyles[paddingProperty] = `${invalidIconOffset + 22 - (isFocusedOrHovered ? 1 : 0)}px`;
		}

		const unit = this.unit
			? html`<span aria-hidden="true" class="d2l-input-unit" @click="${this._handleUnitClick}">${this.unit}</span>`
			: null;
		const ariaDescribedByIds = `${this.description ? this._descriptionId : ''} ${this._hasInlineHelp ? this._inlineHelpId : ''}`.trim();

		const input = html`
			<div class="d2l-input-container">
				<div class="d2l-input-text-container d2l-skeletize" style="${styleMap(inputContainerStyles)}">
					<input
						aria-describedby="${ifDefined(ariaDescribedByIds.length > 0 ? ariaDescribedByIds : undefined)}"
						aria-haspopup="${ifDefined(this.ariaHaspopup)}"
						aria-invalid="${ifDefined(ariaInvalid)}"
						aria-label="${ifDefined(this._getAriaLabel())}"
						aria-required="${ifDefined(ariaRequired)}"
						?required="${this.required}"
						autocomplete="${ifDefined(this.autocomplete)}"
						?autofocus="${this.autofocus}"
						@change="${this._handleChange}"
						class="${classMap(inputClasses)}"
						?disabled="${disabled}"
						id="${this._inputId}"
						@input="${this._handleInput}"
						@invalid="${this._handleInvalid}"
						@keypress="${this._handleKeypress}"
						@mouseover="${this._handleMouseEnter}"
						@mouseout="${this._handleMouseLeave}"
						max="${ifDefined(this.max)}"
						maxlength="${ifDefined(this.maxlength)}"
						min="${ifDefined(this.min)}"
						minlength="${ifDefined(this.minlength)}"
						name="${ifDefined(this.name)}"
						pattern="${ifDefined(this.pattern)}"
						placeholder="${ifDefined(this.placeholder)}"
						?readonly="${this.readonly}"
						size="${ifDefined(this.size)}"
						step="${ifDefined(this.step)}"
						style="${styleMap(inputStyles)}"
						tabindex="${ifDefined(this.tabindex)}"
						title="${ifDefined(this.title)}"
						type="${this._getType()}">
					<div class="d2l-input-inside-before" @keypress="${this._suppressEvent}">${this.dir === 'rtl' ? unit : ''}<slot name="${firstSlotName}" @slotchange="${this._handleSlotChange}"></slot></div>
					<div class="d2l-input-inside-after" @keypress="${this._suppressEvent}">${this.dir !== 'rtl' ? unit : ''}<slot name="${lastSlotName}" @slotchange="${this._handleSlotChange}"></slot></div>
					${showInvalidIcon ? html`<div class="d2l-input-text-invalid-icon" style="${styleMap(invalidIconStyles)}" @click="${this._handleInvalidIconClick}"></div>` : null}
				</div><div id="after-slot" class="d2l-skeletize" ?hidden="${!this._hasAfterContent}"><slot name="after" @slotchange="${this._handleAfterSlotChange}"></slot></div>
			</div>
			${this._renderInlineHelp(this._inlineHelpId)}
			${offscreenContainer}
		`;

		let label = nothing;
		if (this.label && !this.labelHidden && !this.labelledBy) {
			const unitLabel = this._getUnitLabel();
			label = html`<label
				class="d2l-input-label d2l-skeletize"
				for="${this._inputId}"
				@mouseover="${this._handleMouseEnter}"
				@mouseout="${this._handleMouseLeave}"
				style="${styleMap(labelStyles)}">${this.label}${unitLabel ? html`<span class="d2l-offscreen">${unitLabel}</span>` : ''}</label>`;
		}

		let tooltip = nothing;
		if (!this.skeleton && !this.disabled) {
			if (this.validationError && !this.noValidate && !this.hideInvalidTooltip) {
				// this tooltip is using "announced" since we don't want aria-describedby wire-up - VoiceOver ignores our message when the input is invalid
				tooltip = html`<d2l-tooltip state="error" announced align="start" class="vdiff-target">${this.validationError} <span class="d2l-offscreen">${this.description}</span></d2l-tooltip>`;
			} else if (this.instructions) {
				tooltip = html`<d2l-tooltip align="start" for="${this._inputId}" delay="1000" class="vdiff-target">${this.instructions}</d2l-tooltip>`;
			}
		}

		return html`${tooltip}${label}${input}`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'unit' || prop === 'unitLabel') {
				this._updateInputLayout();
			} else if (prop === 'validationError') {
				if (oldVal && this.validationError) {
					const tooltip = this.shadowRoot.querySelector('d2l-tooltip');
					tooltip.updatePosition();
				}
			} else if (prop === 'type') {
				const input = this.shadowRoot?.querySelector('.d2l-input');
				setTimeout(() => {
					if (input && this.value !== input.value) {
						this._setValue(input.value, false);
					}
				}, 0);
			}
		});
	}

	_getAriaLabel() {
		let label;
		if (this.label && (this.labelHidden || this.labelledBy)) {
			label = this.label;
		} else if (this.hasAttribute('aria-label')) {
			label = this.getAttribute('aria-label');
		}
		if (label) {
			return `${label}${this._getUnitLabel()}`;
		}
		return undefined;
	}

	_getType() {
		if (this.type === 'email' || this.type === 'number' || this.type === 'password' || this.type === 'tel' || this.type === 'text' || this.type === 'search' || this.type === 'url') {
			return this.type;
		}
		return 'text';
	}

	_getUnitLabel() {
		if (!this.unit) return '';
		const unitLabel = this.unitLabel || this.unit;
		return ` ${unitLabel}`;
	}

	_handleAfterSlotChange(e) {
		const afterContent = e.target.assignedNodes({ flatten: true });
		this._hasAfterContent = (afterContent && afterContent.length > 0);
	}

	async _handleBlur(e) {
		this._focused = false;
		this.requestValidate(true);

		/**
		 * This is needed only for Legacy-Edge
		 * the _handleChange function is NOT triggered, therefore we have to detect the blur and handle it ourselves.
		 */
		const browserType = window.navigator.userAgent;
		if (this._prevValue !== e.target.value && (browserType.indexOf('Edge') > -1)) {
			this._handleChange();
		}
	}

	_handleChange() {
		// Change events aren't composed, so we need to re-dispatch
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	_handleClick(e) {
		const input = this.shadowRoot?.querySelector('.d2l-input');
		if (!input || e.composedPath()[0] !== this) return;
		input.focus();
	}

	_handleFocus() {
		this._focused = true;
	}

	_handleInput(e) {
		this._setValue(e.target.value, false);
		return true;
	}

	_handleInvalid(e) {
		e.preventDefault();
	}

	_handleInvalidIconClick() {
		this.focus();
	}

	_handleKeypress(e) {
		if (this.preventSubmit && e.keyCode === 13) {
			e.preventDefault();
			return false;
		}
		return true;
	}

	_handleMouseEnter() {
		this._hovered = true;
	}

	_handleMouseLeave() {
		this._hovered = false;
	}

	_handleSlotChange() {
		this._updateInputLayout();
	}

	_handleUnitClick() {
		this.focus();
	}

	async _setValue(val, updateInput) {

		const oldVal = this.value;
		this._prevValue = (oldVal === undefined) ? '' : oldVal;
		this._value = val;

		const input = this.shadowRoot && this.shadowRoot.querySelector('.d2l-input');
		if (!input) return;

		this.setValidity({ tooShort: this.minlength && this.value.length > 0 && this.value.length < this.minlength });
		this.setFormValue(this.value);

		// Can't bind to input's value as Safari moves the cursor each time an
		// input's value gets set from render(). So we manually reach in
		// and update it when source of the change isn't the input itself.
		if (updateInput) {
			await this.updateComplete;
			input.value = this.value;
		}

		this.requestValidate(false);
	}

	_suppressEvent(e) {
		e.stopPropagation();
	}

	_updateInputLayout() {

		// defer until we're visible
		if (!this.shadowRoot || !this._isIntersecting) return;

		const firstContainer = this.shadowRoot.querySelector('.d2l-input-inside-before');
		const firstSlotHasNodes = firstContainer.querySelector('slot').assignedNodes({ flatten: true }).length > 0
			|| (this.unit && this.dir === 'rtl');
		const lastContainer = this.shadowRoot.querySelector('.d2l-input-inside-after');
		const lastSlotHasNodes = lastContainer.querySelector('slot').assignedNodes({ flatten: true }).length > 0
			|| (this.unit && this.dir !== 'rtl');

		if (firstSlotHasNodes) {
			// Firefox can have trouble rendering the cursor if the padding is a decimal
			requestAnimationFrame(() => this._firstSlotWidth = Math.ceil(firstContainer.getBoundingClientRect().width));
		} else {
			this._firstSlotWidth = 0;
		}
		if (lastSlotHasNodes) {
			// Firefox can have trouble rendering the cursor if the padding is a decimal
			requestAnimationFrame(() => this._lastSlotWidth = Math.ceil(lastContainer.getBoundingClientRect().width));
		} else {
			this._lastSlotWidth = 0;
		}

		requestAnimationFrame(() => {
			/** @ignore */
			this.dispatchEvent(new CustomEvent(
				'd2l-input-text-layout-updated',
				{ bubbles: false, composed: false }
			));
		});

	}

}
customElements.define('d2l-input-text', InputText);
