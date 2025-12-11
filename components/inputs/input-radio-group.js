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
			 * Display the radio buttons horizontally
			 * @type {boolean}
			 */
			horizontal: { type: Boolean, reflect: true },
			/**
			 * REQUIRED: Label for the group of radio inputs
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
			:host([horizontal]) div[role="radiogroup"] {
				flex-direction: row;
				flex-wrap: wrap;
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
		this.horizontal = false;
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
				@focusout="${this.#handleFocusout}"
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
			this.#recalculateState(true);
		}
		if (changedProperties.has('horizontal')) {
			const radios = this.#getRadios();
			radios.forEach(el => el._horizontal = this.horizontal);
		}
	}

	focus() {
		const focusElem = this.#getFirstFocusableRadio();
		if (!focusElem) return;
		focusElem.focus();
		setTimeout(() => focusElem.focus()); // timeout required when following link from form validation
	}

	#labelId = getUniqueId();

	async #doUpdateChecked(newChecked, doDispatchEvent) {
		if (newChecked._checked || newChecked.disabled) return;

		const radios = this.#getRadios();
		let prevChecked = null;
		radios.forEach(el => {
			if (el._checked) prevChecked = el;
		});
		newChecked._checked = true;
		if (prevChecked !== null) {
			prevChecked._checked = false;
		}
		this.#recalculateState(true);

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

	}

	async #focusOption(option) {
		this.#doUpdateChecked(option, true);
		const active = this.#getActiveRadio();
		if (active === option) return;
		option._focusable = true;
		await option.updateComplete;
		option.focus();
		if (active) active._focusable = false;
	}

	#getActiveRadio() {
		const activeElem = this.getRootNode().activeElement;
		if (activeElem?.tagName === 'D2L-INPUT-RADIO' && this.contains(activeElem)) {
			return activeElem;
		}
		return null;
	}

	#getFirstFocusableRadio() {
		let firstFocusable = null;
		for (const radio of this.#getRadios()) {
			if (radio.focusDisabled) continue;
			if (radio._checked) return radio;
			if (!firstFocusable) firstFocusable = radio;
		}
		return firstFocusable;
	}

	#getRadios() {
		const elems = this.shadowRoot?.querySelector('slot')?.assignedElements();
		if (!elems) return [];
		return elems.filter(el => el.tagName === 'D2L-INPUT-RADIO');
	}

	#handleClick(e) {
		if (e.target.tagName !== 'D2L-INPUT-RADIO') return;
		this.#focusOption(e.target);
		if (!e.target.disabled) e.preventDefault();
	}

	#handleFocusout(e) {
		if (this.contains(e.relatedTarget)) return;
		this.#recalculateState(false);
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

		const radios = this.#getRadios().filter(el => !el.focusDisabled);
		const activeRadio = this.#getActiveRadio();
		const currentIndex = radios.findIndex(el => el === activeRadio);

		const newIndex = (currentIndex + newOffset + radios.length) % radios.length;
		this.#focusOption(radios[newIndex]);

		e.preventDefault();
	}

	#handleRadioChecked(e) {
		if (e.detail.checked) {
			this.#doUpdateChecked(e.target, false);
		} else {
			e.target._checked = false;
			this.#recalculateState(true);
		}
	}

	#handleSlotChange() {
		this.#recalculateState(false);
	}

	#recalculateState(doValidate = false) {
		const radios = this.#getRadios();
		if (radios.length === 0) return;

		const checkedRadios = [];
		radios.forEach(el => {
			if (el._checked) checkedRadios.push(el);
			el._isInitFromGroup = true;
			el._focusable = false;
			el._horizontal = this.horizontal;
		});

		// only the last checked radio is actually checked
		for (let i = 0; i < checkedRadios.length - 1; i++) {
			checkedRadios[i]._checked = false;
		}
		if (checkedRadios.length > 0) {
			const lastCheckedRadio = checkedRadios[checkedRadios.length - 1];
			lastCheckedRadio._checked = true;
			lastCheckedRadio._focusable = true;
			this.setFormValue(lastCheckedRadio.value);
			if (this.required) {
				this.setValidity({ valueMissing: false });
			}
		} else {
			// let the first non-focus-disabled radio know it's first so it can be focusable
			const firstFocusable = this.#getFirstFocusableRadio();
			if (firstFocusable) firstFocusable._focusable = true;
			this.setFormValue('');
			if (this.required) {
				this.setValidity({ valueMissing: true });
			}
		}
		if (doValidate && this.required) {
			this.requestValidate(true);
		}
	}

}
customElements.define('d2l-input-radio-group', InputRadioGroup);
