import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { checkboxStyles } from './input-checkbox-styles.js';
import { classMap} from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

class InputCheckbox extends LitElement {

	static get properties() {
		return {
			ariaLabel: { type: String, attribute: 'aria-label' },
			checked: { type: Boolean },
			disabled: { type: Boolean },
			indeterminate: { type: Boolean },
			name: { type: String },
			notTabbable: { type: Boolean, attribute: 'not-tabbable' },
			value: { type: String }
		};
	}

	static get styles() {
		return [ checkboxStyles,
			css`
				:host {
					display: block;
					margin-bottom: 0.9rem;
				}
				:host([hidden]) {
					display: none;
				}
				:host([aria-label]) {
					display: inline-block;
					margin-bottom: 0;
				}
				label {
					display: inline-block;
					white-space: nowrap;
				}
				.d2l-input-checkbox-text {
					color: var(--d2l-color-ferrite);
					display: inline-block;
					font-size: 0.8rem;
					font-weight: 400;
					line-height: 1.2rem;
					margin-left: 0.5rem;
					vertical-align: middle;
					white-space: normal;
				}
				:host([dir="rtl"]) .d2l-input-checkbox-text {
					margin-right: 0.5rem;
					margin-left: 0;
				}
				:host([aria-label]) .d2l-input-checkbox-text {
					margin-left: 0;
					margin-right: 0;
				}
				:host([dir="rtl"][aria-label]) .d2l-input-checkbox-text {
					margin-left: 0;
					margin-right: 0;
				}
				.d2l-input-checkbox-text-disabled {
					opacity: 0.5;
				}
			`
		];
	}

	constructor() {
		super();
		this.checked = false;
		this.disabled = false;
		this.indeterminate = false;
		this.name = '';
		this.notTabbable = false;
		this.value = 'on';
	}

	render() {
		const tabindex = this.notTabbable ? -1 : undefined;
		const textClasses = {
			'd2l-input-checkbox-text': true,
			'd2l-input-checkbox-text-disabled': this.disabled
		};
		const ariaChecked = this.indeterminate ? 'mixed' : undefined;
		return html`
			<label>
				<input
					aria-checked="${ifDefined(ariaChecked)}"
					aria-label="${ifDefined(this.ariaLabel)}"
					@change="${this._handleChange}"
					class="d2l-input-checkbox"
					@click="${this._handleClick}"
					?checked="${this.checked}"
					?disabled="${this.disabled}"
					.indeterminate="${this.indeterminate}"
					name="${ifDefined(this.name)}"
					tabindex="${ifDefined(tabindex)}"
					type="checkbox"
					.value="${this.value}"><span class="${classMap(textClasses)}"><slot></slot></span>
			</label>
		`;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('input.d2l-input-checkbox');
		if (elem) elem.focus();
	}

	_handleChange(e) {
		this.checked = e.target.checked;
		this.indeterminate = false;
		this.dispatchEvent(new CustomEvent(
			'change',
			{bubbles: true, composed: false}
		));
	}

	/**
	 * This is needed only for IE11 and Edge AND going from indeterminate to checked/unchecked.
	 * When the indeterminate state is set, and the checkbox is clicked, the _handleChange
	 * function is NOT triggered, therefore we have to detect the click and handle it ourselves.
	 */
	_handleClick() {
		const browserType = window.navigator.userAgent;
		if (this.indeterminate && (browserType.indexOf('Trident') > -1 || browserType.indexOf('Edge') > -1)) {
			this.checked = !this.checked;
			this.indeterminate = false;
			this.dispatchEvent(new CustomEvent(
				'change',
				{bubbles: true, composed: false}
			));
		}
	}

}
customElements.define('d2l-input-checkbox', InputCheckbox);
