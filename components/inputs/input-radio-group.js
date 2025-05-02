import { css, html, LitElement } from 'lit';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inputLabelStyles } from './input-label-styles.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A group of <d2l-input-radio> components.
 * @slot - Radio components
 * @fires change - Dispatched when the radio group's state changes
 */
class InputRadioGroup extends PropertyRequiredMixin(SkeletonMixin(FormElementMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Label for the input
			 * @type {string}
			 */
			label: { required: true, type: String },
			/**
			 * Hides the label visually
			 * @type {boolean}
			 */
			labelHidden: { attribute: 'label-hidden', reflect: true, type: Boolean },
			/**
			 * Indicates that a value is required
			 * @type {boolean}
			 */
			required: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [super.styles, inputLabelStyles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			div[role="radiogroup"] {
				display: flex;
				flex-direction: column;
				gap: 0.6rem;
			}
			.d2l-input-label[hidden] {
				display: none;
			}
			::slotted(:not(d2l-input-radio)) {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.labelHidden = false;
		this.required = false;
		this.setFormValue('');
	}

	render() {
		return html`
			<span class="d2l-input-label" ?hidden="${this.labelHidden}" id="${this.#labelId}"><span class="d2l-skeletize">${this.label}</span></span>
			<div
				aria-invalid="${ifDefined(this.invalid ? 'true' : undefined)}"
				aria-labelledby="${this.#labelId}"
				aria-required="${ifDefined(this.required ? 'true' : undefined)}"
				@click="${this.#handleClick}"
				@d2l-input-radio-checked="${this.#handleRadioChecked}"
				@keydown="${this.#handleKeyDown}"
				role="radiogroup">	
				<slot @slotchange="${this.#handleSlotChange}"></slot>
			</div>
		`;
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('invalid')) {
			const radios = this.#getRadios();
			radios.forEach(el => el._invalid = this.invalid);
		}
		if (changedProperties.has('required')) {
			this.#recalculateState(false);
		}
	}

	focus() {
		const radios = this.#getRadios();
		if (radios.length === 0) return;
		let firstFocusable = null;
		let firstChecked = null;
		radios.forEach(el => {
			if (firstFocusable === null && !el.disabled) firstFocusable = el;
			if (firstChecked === null && el._checked) firstChecked = el;
		});
		const focusElem = firstChecked || firstFocusable;
		focusElem.focus();
		setTimeout(() => focusElem.focus()); // timeout required when following link from form validation
	}

	#labelId = getUniqueId();

	async #doUpdateChecked(newChecked, doFocus, doDispatchEvent) {
		const radios = this.#getRadios();
		let prevChecked = null;
		radios.forEach(el => {
			if (el._checked) prevChecked = el;
		});
		if (prevChecked === newChecked) return;

		newChecked._checked = true;
		if (prevChecked !== null) {
			prevChecked._checked = false;
		}
		this.#recalculateState(false);

		if (doDispatchEvent) {
			this.dispatchEvent(new CustomEvent('change', {
				bubbles: true,
				composed: true,
				detail: {
					value: newChecked.value,
					oldValue: prevChecked?.value
				}
			}));
		}

		if (doFocus) {
			await newChecked.updateComplete; // wait for tabindex to be updated
			newChecked.focus();
		}
	}

	#getRadios() {
		const elems = this.shadowRoot?.querySelector('slot')?.assignedElements();
		if (!elems) return [];
		return elems.filter(el => el.tagName === 'D2L-INPUT-RADIO');
	}

	#handleClick(e) {
		if (e.target.tagName !== 'D2L-INPUT-RADIO') return;
		if (e.target.disabled) return;
		this.#doUpdateChecked(e.target, true, true);
		e.preventDefault();
	}

	#handleKeyDown(e) {
		if (e.target.tagName !== 'D2L-INPUT-RADIO') return;

		const isRtl = (getComputedStyle(this).direction === 'rtl');
		let newOffset = null;
		if (e.key === ' ') {
			newOffset = 0;
		} else if (e.key === 'ArrowUp' || (!isRtl && e.key === 'ArrowLeft') || (isRtl && e.key === 'ArrowRight')) {
			newOffset = -1;
		} else if (e.key === 'ArrowDown' || (!isRtl && e.key === 'ArrowRight') || (isRtl && e.key === 'ArrowLeft')) {
			newOffset = 1;
		}

		if (newOffset === null) return;

		const radios = this.#getRadios().filter(el => !el.disabled || el._checked);
		let checkedIndex = -1;
		let firstFocusableIndex = -1;
		radios.forEach((el, i) => {
			if (el._checked) checkedIndex = i;
			if (firstFocusableIndex < 0 && !el.disabled) firstFocusableIndex = i;
		});
		if (checkedIndex === -1) {
			if (firstFocusableIndex === -1) return;
			checkedIndex = firstFocusableIndex;
		}

		const newIndex = (checkedIndex + newOffset + radios.length) % radios.length;
		this.#doUpdateChecked(radios[newIndex], true, true);

		e.preventDefault();
	}

	#handleRadioChecked(e) {
		if (e.detail.checked) {
			this.#doUpdateChecked(e.target, false, false);
		} else {
			e.target._checked = false;
			this.#recalculateState(false);
		}
	}

	#handleSlotChange() {
		this.#recalculateState(true);
	}

	#recalculateState(fromSlotChange) {
		const radios = this.#getRadios();
		if (radios.length === 0) return;

		let firstFocusable = null;
		const checkedRadios = [];
		radios.forEach(el => {
			if (firstFocusable === null && !el.disabled) firstFocusable = el;
			if (fromSlotChange && el.hasAttribute('checked') || !fromSlotChange && el._checked) checkedRadios.push(el);
			el._firstFocusable = false;
		});

		// let the first non-disabled radio know it's first so it can be focusable
		if (checkedRadios.length === 0 && firstFocusable !== null) {
			firstFocusable._firstFocusable = true;
		}

		// only the last checked radio is actually checked
		for (let i = 0; i < checkedRadios.length - 1; i++) {
			checkedRadios[i]._checked = false;
		}
		if (checkedRadios.length > 0) {
			const lastCheckedRadio = checkedRadios[checkedRadios.length - 1];
			lastCheckedRadio._checked = true;
			this.setFormValue(lastCheckedRadio.value);
			if (this.required) {
				this.setValidity({ valueMissing: false });
			}
		} else {
			this.setFormValue('');
			if (this.required) {
				this.setValidity({ valueMissing: true });
			}
		}
		if (!fromSlotChange && this.required) {
			this.requestValidate(true);
		}
	}

}
customElements.define('d2l-input-radio-group', InputRadioGroup);
