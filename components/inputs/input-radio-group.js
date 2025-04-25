import { css, html, LitElement } from 'lit';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inputLabelStyles } from './input-label-styles.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

class InputRadioGroup extends PropertyRequiredMixin(FormElementMixin(LitElement)) {

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
		return [inputLabelStyles, css`
			div[role="radiogroup"] {
				display: flex;
				flex-direction: column;
				gap: 0.6rem;
			}
			.d2l-input-label[hidden] {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.labelHidden = false;
		this.required = false;
	}

	render() {
		// TODO: handle required validation
		// TODO: handle being in a form
		return html`
			<span class="d2l-input-label" ?hidden="${this.labelHidden}" id="${this.#labelId}">${this.label}</span>
			<div
				aria-labelledby="${this.#labelId}"
				aria-required="${ifDefined(this.required ? 'true' : undefined)}"
				@click="${this.#handleClick}"
				@keydown="${this.#handleKeyDown}"
				role="radiogroup">	
				<slot @slotchange="${this.#handleSlotChange}"></slot>
			</div>
		`;
	}

	focus() {
		const radios = this.#getRadios();
		if (radios.length === 0) return;
		let firstFocusable = null;
		let firstChecked = null;
		radios.forEach(el => {
			if (firstFocusable === null && !el.disabled) firstFocusable = el;
			if (firstChecked === null && el.checked) firstChecked = el;
		});
		if (firstChecked !== null) {
			firstChecked.focus();
		} else {
			firstFocusable.focus();
		}
	}

	#labelId = getUniqueId();

	async #doUpdateChecked(newChecked) {
		const radios = this.#getRadios();
		let prevChecked = null;
		radios.forEach(el => {
			if (el.checked) prevChecked = el;
			el._firstFocusable = false;
		});
		if (prevChecked === newChecked) return;

		newChecked.checked = true;
		await newChecked.updateComplete;
		newChecked.focus();

		if (prevChecked !== null) {
			prevChecked.checked = false;
			await prevChecked.updateComplete;
		}
		if (prevChecked !== newChecked) {
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

	#getRadios() {
		return this.shadowRoot
			.querySelector('slot')
			.assignedElements()
			.filter(el => el.tagName === 'D2L-INPUT-RADIO');
	}

	#handleClick(e) {
		if (e.target.tagName !== 'D2L-INPUT-RADIO') return;
		if (e.target.disabled) return;
		this.#doUpdateChecked(e.target);
		e.preventDefault();
	}

	#handleKeyDown(e) {
		if (e.target.tagName !== 'D2L-INPUT-RADIO') return;

		// TODO: handle RTL
		let newOffset = null;
		if (e.key === ' ') {
			newOffset = 0;
		} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
			newOffset = -1;
		} else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
			newOffset = 1;
		}

		if (newOffset === null) return;

		const radios = this.#getRadios().filter(el => !el.disabled || el.checked);
		let checkedIndex = -1;
		let firstFocusableIndex = -1;
		radios.forEach((el, i) => {
			if (el.checked) checkedIndex = i;
			if (firstFocusableIndex < 0 && !el.disabled) firstFocusableIndex = i;
		});
		if (checkedIndex === -1) {
			if (firstFocusableIndex === -1) return;
			checkedIndex = firstFocusableIndex;
		}

		const newIndex = (checkedIndex + newOffset + radios.length) % radios.length;
		this.#doUpdateChecked(radios[newIndex]);

		e.preventDefault();
	}

	#handleSlotChange() {
		const radios = this.#getRadios();
		let firstFocusable = null;
		const checkedRadios = [];
		radios.forEach(el => {
			if (firstFocusable === null && !el.disabled) firstFocusable = el;
			if (el.checked) checkedRadios.push(el);
			el._firstFocusable = false;
		});
		// let the first non-disabled radio know it's first so it can be focusable
		if (checkedRadios.length === 0 && firstFocusable !== null) {
			firstFocusable._firstFocusable = true;
		}
		// only the last checked radio is actually checked
		for (let i = 0; i < checkedRadios.length - 1; i++) {
			checkedRadios[i].checked = false;
		}
	}

}
customElements.define('d2l-input-radio-group', InputRadioGroup);
