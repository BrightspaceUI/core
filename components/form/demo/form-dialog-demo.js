
import '../../button/button.js';
import '../../button/floating-buttons.js';
import '../../dialog/dialog.js';
import '../../inputs/input-text.js';
import '../../validation/validation-custom.js';
import '../form.js';
import './form-panel-demo.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { inputStyles } from '../../inputs/input-styles.js';
import { selectStyles } from '../../inputs/input-select-styles.js';

class FormDialogDemo extends LitElement {

	static get styles() {
		return [inputStyles, selectStyles, css`

			.d2l-form-dialog-demo-container {
				margin-bottom: 10px;
			}
		`];
	}

	render() {
		return html`
			<d2l-form id="dialog-main-form">
				<div class="d2l-form-dialog-demo-container">
					<label>Email<input class="d2l-input" name="email" type="email"></label>
				</div>
				<div class="d2l-form-dialog-demo-container">
					<d2l-validation-custom for="password-dialog" @d2l-validation-custom-validate=${this._validatePassword} failure-text="Expected hunter2" ></d2l-validation-custom>
					<label>Password<input class="d2l-input" id="password-dialog" name="password" required type="password"></label>
				</div>
				<d2l-dialog id="dialog" title-text="My Favorites">
					<d2l-form id="dialog-secondary-form" async-submit no-nesting @d2l-form-submit=${this._onDialogSubmit}>
						<fieldset class="d2l-form-dialog-demo-container">
							<legend>Choose your favorite monster</legend>
							<label><input type="radio" name="monster" value="kraken">&nbsp;Kraken</label>
							<label><input type="radio" name="monster" value="sasquatch">&nbsp;Sasquatch</label>
						</fieldset>
						<div class="d2l-form-dialog-demo-container">
							<label>Favorite Pet<br/>
								<select class="d2l-input-select" name="pets" required>
									<option value="">--Please choose an option--</option>
									<option value="porpoise">Porpoise</option>
									<option value="house hippo">House Hippo</option>
									<option value="spiker monkey">Spider Monkey</option>
									<option value="capybara">Capybara</option>
								</select>
							</label>
						</div>
					</d2l-form>
					<d2l-button slot="footer" primary @click=${this._onDialogSubmitClicked}>Save</d2l-button>
					<d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
				</d2l-dialog>
				<div class="d2l-form-dialog-demo-container">
					<d2l-button @click=${this._openDialog}>Show Favorites Dialog</d2l-button>
				</div>
				<d2l-button primary @click=${this._onSubmitClicked}>Save</d2l-button>
			</d2l-form>
		`;
	}

	_onDialogSubmit() {
		this.shadowRoot.querySelector('#dialog').opened = false;
	}

	_onDialogSubmitClicked() {
		this.shadowRoot.querySelector('#dialog-secondary-form').submit();
	}

	_onSubmitClicked() {
		this.shadowRoot.querySelector('#dialog-main-form').submit();
	}

	_openDialog() {
		this.shadowRoot.querySelector('#dialog').opened = true;
	}

	_validatePassword(e) {
		e.detail.resolve(e.detail.forElement.value === 'hunter2');
	}
}

customElements.define('d2l-form-dialog-demo', FormDialogDemo);
