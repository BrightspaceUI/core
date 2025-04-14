import { css, html, LitElement } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { inputLabelStyles } from './input-label-styles.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

class InputRadioGroup extends PropertyRequiredMixin(LitElement) {

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
			labelHidden: { attribute: 'label-hidden', reflect: true, type: Boolean }
		};
	}

	static get styles() {
		return [inputLabelStyles, css`
			div[role="radiogroup"] {
				display: flex;
				flex-direction: column;
				gap: 0.6rem;
			}
		`];
	}

	constructor() {
		super();
		this.labelHidden = false;
	}

	render() {
		// TODO: handle required validation
		// TODO: handle being in a form
		return html`
			<span class="d2l-input-label" ?hidden="${this.labelHidden}" id="${this.#labelId}">${this.label}</span>
			<div aria-labelledby="${this.#labelId}" @click="${this.#handleClick}" @keydown="${this.#handleKeyDown}" role="radiogroup">	
				<slot></slot>
			</div>
		`;
	}

	#labelId = getUniqueId();

	#getRadios() {
		return this.shadowRoot
			.querySelector('slot')
			.assignedElements()
			.filter(el => el.tagName === 'D2L-INPUT-RADIO');
	}

	#handleClick(e) {
		if (e.target.tagName !== 'D2L-INPUT-RADIO') return;
		const radios = this.#getRadios();
		radios.forEach(el => {
			el.checked = (el === e.target);
			// TODO: possibly dispatch a change event here
		});
		e.preventDefault();
	}

	#handleKeyDown(e) {
		if (e.target.tagName !== 'D2L-INPUT-RADIO') return;
		// TODO: handle space and arrow keys
		e.preventDefault();
	}

}
customElements.define('d2l-input-radio-group', InputRadioGroup);
