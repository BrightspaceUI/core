
import '../../button/button.js';
import '../../button/floating-buttons.js';
import '../../inputs/input-percent.js';
import '../../inputs/input-text.js';
import '../../inputs/input-textarea.js';
import '../../validation/validation-custom.js';
import '../form.js';
import './form-panel-demo.js';
import { css, html, LitElement } from 'lit';
import { inputStyles } from '../../inputs/input-styles.js';
import { selectStyles } from '../../inputs/input-select-styles.js';

class FormNestedDemo extends LitElement {

	static get styles() {
		return [inputStyles, selectStyles, css`

			.d2l-form-demo-split-container {
				display: flex;
				margin-top: 18px;
			}

			.d2l-form-demo-container {
				margin-bottom: 10px;
			}

			.d2l-form-demo-main {
				flex-grow: 1;
				padding: 0 20px 20px 0;
			}
		`];
	}

	render() {
		return html`
			<d2l-form id="root" @d2l-form-submit=${this._onRootSubmit}>
				<div class="d2l-form-demo-split-container">
					<d2l-form class="d2l-form-demo-main" @d2l-form-submit=${this._onMainSubmit}>
						<div class="d2l-form-demo-container">
							<d2l-input-text label="Email" name="email" type="email"></d2l-input-text>
						</div>
						<div class="d2l-form-demo-container">
							<d2l-validation-custom for="password" @d2l-validation-custom-validate=${this._validatePassword} failure-text="Expected hunter2" ></d2l-validation-custom>
							<d2l-input-text id="password" label="Password" name="password" required type="password"></d2l-input-text>
						</div>
						<div class="d2l-form-demo-container">
							<d2l-input-textarea label="Description" name="description" rows="2" required></d2l-input-textarea>
						</div>
						<div class="d2l-form-demo-container">
							<d2l-input-percent label="Awesome" name="grade"></d2l-input-percent>
						</div>
						<fieldset class="d2l-form-demo-container">
							<legend>Choose your favorite monster</legend>
							<label><input type="radio" name="monster" value="kraken">&nbsp;Kraken</label>
							<label><input type="radio" name="monster" value="sasquatch">&nbsp;Sasquatch</label>
						</fieldset>
						<div class="d2l-form-demo-container">
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
						<div class="d2l-form-demo-container">
							<label for="native">Magic Word</label>
							<d2l-validation-custom for="native" @d2l-validation-custom-validate=${this._validateMagicWord} failure-text="Expected please" ></d2l-validation-custom>
							<input id="native" name="native" required type="text"></d2l-input-text>
							
						</div>
					</d2l-form>
					<d2l-form-panel-demo></d2l-form-panel-demo>
				</div>
				<d2l-floating-buttons always-float>
					<d2l-button primary @click=${this._submit}>Save</d2l-button>
				</d2l-floating-buttons>
			</d2l-form>
		`;
	}

	_onMainSubmit(e) {
		// eslint-disable-next-line no-console
		console.log(e.detail.formData);
	}

	_onRootSubmit(e) {
		e.preventDefault();
	}

	_submit() {
		if (this.shadowRoot) this.shadowRoot.querySelector('#root').submit();
	}

	_validatePassword(e) {
		e.detail.resolve(e.detail.forElement.value === 'hunter2');
	}

	_validateMagicWord(e) {
		e.detail.resolve(e.detail.forElement.value === 'please');
	}
}
customElements.define('d2l-form-demo', FormNestedDemo);
