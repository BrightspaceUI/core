import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatNumber } from '@brightspace-ui/intl/lib/number.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputLabelStyles } from './input-label-styles.js';
import { inputStyles } from './input-styles.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

/**
 * A wrapper around the native `<textarea>` element that provides auto-grow and validation behaviours intended for inputting unformatted multi-line text.
 * @fires change - Dispatched when an alteration to the value is committed (typically after focus is lost) by the user
 * @fires input - Dispatched immediately after changes by the user
 */
class InputTextArea extends FormElementMixin(SkeletonMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Indicates that the input value is invalid
			 * @type {string}
			 */
			ariaInvalid: { type: String, attribute: 'aria-invalid' },
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
			 * REQUIRED: Label for the input
			 * @type {string}
			 */
			label: { type: String },
			/**
			 * Hides the label visually (moves it to the input's "aria-label" attribute)
			 * @type {boolean}
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			/**
			 * Imposes an upper character limit
			 * @type {number}
			 */
			maxlength: { type: Number },
			/**
			 * Maximum number of rows before scrolling
			 * @type {number}
			 */
			maxRows: { type: Number, attribute: 'max-rows' },
			/**
			 * Imposes a lower character limit
			 * @type {number}
			 */
			minlength: { type: Number },
			/**
			 * Hides the border
			 * @type {boolean}
			 */
			noBorder: { type: Boolean, attribute: 'no-border' },
			/**
			 * Removes default left/right padding
			 * @type {boolean}
			 */
			noPadding: { type: Boolean, attribute: 'no-padding' },
			/**
			 * Placeholder text
			 * @type {string}
			 */
			placeholder: { type: String },
			/**
			 * Indicates that a value is required
			 * @type {boolean}
			 */
			required: { type: Boolean, reflect: true },
			/**
			 * Minimum number of rows
			 * @type {number}
			 */
			rows: { type: Number },
			/**
			 * Value of the input
			 * @type {string}
			 */
			value: { type: String }
		};
	}

	static get styles() {
		return [ super.styles, inputStyles, inputLabelStyles, offscreenStyles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-input-label {
				display: inline-block;
				vertical-align: bottom;
			}
			.d2l-input-textarea-container {
				height: 100%;
				max-width: 100%;
				position: relative;
			}
			textarea.d2l-input {
				height: 100%;
				left: 0;
				line-height: 1rem;
				position: absolute;
				resize: none;
				top: 0;
				z-index: 2;
			}
			:host([no-border]) textarea.d2l-input {
				border-color: transparent;
				box-shadow: none;
			}
			/* mirror dimensions must match textarea - match border + padding */
			.d2l-input-textarea-mirror {
				line-height: 1rem;
				padding-bottom: 0.5rem;
				padding-top: 0.5rem;
				visibility: hidden;
				word-break: break-word; /* prevent width from growing */
			}
			:host([no-padding]) .d2l-input {
				padding-left: 0;
				padding-right: 0;
			}
			:host([no-border][no-padding]) textarea.d2l-input:hover,
			:host([no-border][no-padding]) textarea.d2l-input:focus {
				border-left-width: 1px;
				border-right-width: 1px;
			}
			.d2l-input-textarea-mirror[aria-invalid="true"] {
				padding-right: calc(18px + 0.8rem);
			}
			:host([dir='rtl']) .d2l-input-textarea-mirror[aria-invalid="true"] {
				padding-left: calc(18px + 0.8rem);
				padding-right: 0.75rem;
			}
			:host([skeleton]) .d2l-skeletize::before {
				z-index: 3;
			}
		`];
	}

	constructor() {
		super();
		this.disabled = false;
		this.labelHidden = false;
		this.maxRows = 11;
		this.rows = 5;
		this.required = false;
		this.value = '';

		this._descriptionId = getUniqueId();
		this._textareaId = getUniqueId();
	}

	/** @ignore */
	get textarea() {
		// temporary until consumers are updated
		return this.shadowRoot.querySelector('textarea');
	}

	/** @ignore */
	get validationMessage() {
		if (this.validity.tooShort) {
			return this.localize('components.form-element.input.text.tooShort', { label: this.label, minlength: formatNumber(this.minlength) });
		}
		return super.validationMessage;
	}

	/** @ignore */
	get validity() {
		const elem = this.shadowRoot.querySelector('textarea');
		if (!elem.validity.valid) {
			return elem.validity;
		}
		return super.validity;
	}

	render() {

		// convert \n to <br> for html mirror
		const lines = ((this.value && this.value !== '') ? this.value.split('\n')
			: (this.placeholder ? this.placeholder.split('\n') : []));

		const ariaRequired = this.required ? 'true' : undefined;
		const ariaInvalid = this.invalid ? 'true' : this.ariaInvalid;
		const offscreenContainer = this.description ? html`<div class="d2l-offscreen" id="${this._descriptionId}">${this.description}</div>` : null;
		const disabled = this.disabled || this.skeleton;

		const mirrorStyles = {};

		// lines + padding + border; if < 1 it will fallback to min single and/or max infinite
		if (this.rows > 0) mirrorStyles.minHeight = `calc(${this.rows + 1}rem + 2px)`;
		if (this.maxRows > 0) mirrorStyles.maxHeight = `calc(${this.maxRows + 1}rem + 2px)`;

		const textarea = html`
			<div class="d2l-input-textarea-container d2l-skeletize">
				<div class="d2l-input d2l-input-textarea-mirror" style="${styleMap(mirrorStyles)}" aria-invalid="${ifDefined(ariaInvalid)}">
					${lines.map(line => html`${line}<br />`)}
				</div>
				<textarea aria-describedby="${ifDefined(this.description ? this._descriptionId : undefined)}"
					aria-invalid="${ifDefined(ariaInvalid)}"
					aria-label="${ifDefined(this._getAriaLabel())}"
					aria-required="${ifDefined(ariaRequired)}"
					@blur="${this._handleBlur}"
					@change="${this._handleChange}"
					class="d2l-input"
					?disabled="${disabled}"
					id="${this._textareaId}"
					@input="${this._handleInput}"
					@invalid="${this._handleInvalid}"
					maxlength="${ifDefined(this.maxlength)}"
					minlength="${ifDefined(this.minlength)}"
					placeholder="${ifDefined(this.placeholder)}"
					?required="${this.required}"
					.value="${this.value}">${this.value}</textarea>
				${this.validationError ? html`<d2l-tooltip for=${this._textareaId} state="error" align="start">${this.validationError}</d2l-tooltip>` : null}
			</div>
			${offscreenContainer}
		`;

		if (this.label && !this.labelHidden) {
			return html`
				<label class="d2l-input-label d2l-skeletize" for="${this._textareaId}">${this.label}</label>
				${textarea}`;
		}

		return textarea;

	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'value') {
				this.setValidity({ tooShort: this.minlength && this.value.length > 0 && this.value.length < this.minlength });
				this.requestValidate(false);
				this.setFormValue(this.value);
				this._prevValue = (oldVal === undefined) ? '' : oldVal;
			} else if (prop === 'validationError') {
				if (oldVal && this.validationError) {
					const tooltip = this.shadowRoot.querySelector('d2l-tooltip');
					tooltip.updatePosition();
				}
			}
		});
	}

	async focus() {
		const elem = this.shadowRoot.querySelector('textarea');
		if (elem) {
			elem.focus();
		} else {
			await this.updateComplete;
			this.focus();
		}
	}

	async select() {
		const elem = this.shadowRoot.querySelector('textarea');
		if (elem) {
			elem.select();
		} else {
			await this.updateComplete;
			this.select();
		}
	}

	_getAriaLabel() {
		if (this.label && this.labelHidden) {
			return this.label;
		}
		// check aria-label for backwards compatibility in order to replace old Polymer impl
		if (this.hasAttribute('aria-label')) {
			return this.getAttribute('aria-label');
		}
		return undefined;
	}

	async _handleBlur(e) {
		this.requestValidate(true);

		/**
		 * This is needed only for legacy Edge since the _handleChange function is NOT
		 * triggered, therefore we have to detect the blur and handle it ourselves.
		 */
		const browserType = window.navigator.userAgent;
		if (this._prevValue !== e.target.value && (browserType.indexOf('Trident') > -1 || browserType.indexOf('Edge') > -1)) {
			this._handleChange();
		}
	}

	_handleChange() {
		// change events aren't composed, so we need to re-dispatch
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	_handleInput(e) {
		this.value = e.target.value;
		return true;
	}

	_handleInvalid(e) {
		e.preventDefault();
	}

}

customElements.define('d2l-input-textarea', InputTextArea);
