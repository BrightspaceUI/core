import '../../../components/button/button.js';
import '../../../components/demo/demo-page.js';
import '../../../components/inputs/input-group.js';
import '../../../components/inputs/input-radio-group.js';
import '../../../components/inputs/input-radio.js';
import '../../../components/inputs/input-text.js';
import '../../../components/inputs/input-textarea.js';
import '../../../components/form/form.js';
import '../../../components/form/form-error-summary.js';
import '../../../components/alert/alert-toast.js';
import '../primary-secondary.js';
import { css, html, LitElement } from 'lit';

class FormDemo extends LitElement {
	static get properties() {
		return {
			_formErrorSummary: { type: Array },
			_formSubmittedAlert: { type: Boolean }
		};
	}

	static get styles() {
		return css`
			div[slot="primary"] {
				padding: 20px;
			}
			div[slot="secondary"] {
				padding: 10px;
			}
		`;
	}
	constructor() {
		super();
		this._formErrorSummary = [];
	}

	render() {
		return html`<d2l-form hide-error-summary @d2l-form-invalid=${this.#handleInvalidForm} @d2l-form-submit=${this.#handleFormSubmit}>
			<d2l-template-primary-secondary background-shading="secondary" width-type="normal">
				<div slot="primary">
					<d2l-form-error-summary _has-bottom-margin .errors=${this._formErrorSummary}></d2l-form-error-summary>
					<d2l-input-group>
						<d2l-input-text name="name" label="Name" required></d2l-input-text>
						<d2l-input-textarea name="description" label="Description"></d2l-input-textarea>
					</d2l-input-group>
					<d2l-alert-toast ?open=${this._formSubmittedAlert} @d2l-alert-toast-close=${this.#hideSubmitAlert}>Submitted!</d2l-alert-toast>
				</div>
				<div slot="secondary">
					<d2l-input-radio-group name="band" label="Band" required>
						<d2l-input-radio label="FM" value="fm"></d2l-input-radio>
						<d2l-input-radio label="AM" value="am"></d2l-input-radio>
					</d2l-input-radio-group>
				</div>
				<div slot="footer">
					<d2l-button primary @click=${this.#submitForm}>Save</d2l-button>
				</div>
			</d2l-template-primary-secondary>
		</d2l-form>`;
	}

	#handleFormSubmit() {
		this._formSubmittedAlert = true;
		this._formErrorSummary = [];
	}

	#handleInvalidForm() {
		this._formErrorSummary = this.shadowRoot.querySelector('d2l-form').errorSummary;
	}

	#hideSubmitAlert() {
		this._formSubmittedAlert = false;
	}

	#submitForm() {
		this.shadowRoot.querySelector('d2l-form').submit();
	}
}

customElements.define('d2l-primary-secondary-form-demo', FormDemo);
