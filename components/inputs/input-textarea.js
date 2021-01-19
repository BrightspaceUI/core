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

class InputTextArea extends FormElementMixin(SkeletonMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Indicates that the input value is invalid.
			 */
			ariaInvalid: { type: String, attribute: 'aria-invalid' },
			/**
			 * Additional information communicated in the aria-describedby on the input.
			 */
			description: { type: String, reflect: true },
			/**
			 * Disables the input.
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * REQUIRED: Label for the input.
			 */
			label: { type: String },
			/**
			 * Hides the label visually (moves it to the input's "aria-label" attribute).
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			/**
			 * Maximum height of the input before scrolling.
			 */
			maxHeight: { type: String, attribute: 'max-height' },
			/**
			 * Imposes an upper character limit.
			 */
			maxlength: { type: Number, attribute: 'max-length' },
			/**
			 * Minimum height of the input.
			 */
			minHeight: { type: String, attribute: 'min-height' },
			/**
			 * Imposes a lower character limit.
			 */
			minlength: { type: Number, attribute: 'min-length' },
			/**
			 * Placeholder text.
			 */
			placeholder: { type: String },
			/**
			 * Indicates that a value is required.
			 */
			required: { type: Boolean, reflect: true },
			/**
			 * Value of the input.
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
			:host .d2l-input-textarea-container {
				max-width: 100%;
				position: relative;
			}
			:host textarea {
				height: 100%;
				left: 0;
				position: absolute;
				resize: none;
				top: 0;
				z-index: 2;
			}
			/* mirror dimensions must match textarea - match border + padding */
			:host .d2l-input-textarea-mirror {
				line-height: normal;
				max-height: 12rem;
				padding-bottom: 0.5rem;
				padding-top: 0.5rem;
				visibility: hidden;
				word-break: break-word; /* prevent width from growing */
			}
			:host .d2l-input-textarea-mirror[aria-invalid="true"] {
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
		this.required = false;
		this.value = '';

		this._descriptionId = getUniqueId();
		this._textareaId = getUniqueId();
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
		if (this.minHeight) mirrorStyles.minHeight = this.minHeight;
		if (this.maxHeight) mirrorStyles.maxHeight = this.maxHeight;

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
					?required="${this.required}">${this.value}</textarea>
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

	get validationMessage() {
		if (this.validity.tooShort) {
			return this.localize('components.form-element.input.text.tooShort', { label: this.label, minlength: formatNumber(this.minlength) });
		}
		return super.validationMessage;
	}

	get validity() {
		const elem = this.shadowRoot.querySelector('textarea');
		if (!elem.validity.valid) {
			return elem.validity;
		}
		return super.validity;
	}

	_getAriaLabel() {
		if (this.label && this.labelHidden) {
			return this.label;
		}
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
