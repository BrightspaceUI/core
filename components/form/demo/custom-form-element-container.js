import { css, html, LitElement } from 'lit';
import { FormElementContainerMixin } from '../form-element-container-mixin.js';

class CustomFormElementContainer extends FormElementContainerMixin(LitElement) {

	static get styles() {
		return css`
			:host {
				display: block;
				width: 100%;
			}
			label {
				display: block;
				padding-block-end: 0.4rem;
				font-size: 0.7rem;
				font-weight: 700;
				line-height: 0.9rem;
			}
			label[required]::after {
				content: " *";
			}
			input {
				width: 100%;
				box-sizing: border-box;
				border-radius: 0.3rem;
				border-width: 1px;
				border-style: solid;
				min-height: calc(2rem + 2px);
				min-width: calc(2rem + 1em);
				margin-block-end: 0.5rem;
				padding: 0.4rem 0.75rem;
			}
			input:focus,
			input:hover {
				border-width: 2px;
				border-color: var(--d2l-theme-border-color-focus);
				outline: none;
				padding: calc(0.4rem - 1px) calc(0.75rem - 1px);
			}
			input:user-invalid {
				border-color: var(--d2l-theme-status-color-error);
			}
		`;
	}

	render() {
		return html`
			<label for="native-input" required>Name</label>
			<input id="native-input"
				type="text"
				name="name"
				minlength="4"
				maxlength="15"
				required
			>
			<d2l-input-text
				label="Telephone Number"
				type="tel"
				name="phone"
				pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
				required
			></d2l-input-text>
		`;
	}
}

customElements.define('d2l-custom-form-element-container', CustomFormElementContainer);
