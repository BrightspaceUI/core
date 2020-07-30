
import '../../button/button.js';
import '../../button/floating-buttons.js';
import '../../inputs/input-text.js';
import '../../validation/validation-custom.js';
import '../form.js';
import './form-panel-demo.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { inputStyles } from '../../inputs/input-styles.js';
import { selectStyles } from '../../inputs/input-select-styles.js';

class FormNestedDemo extends LitElement {

	static get styles() {
		return [inputStyles, selectStyles, css`

			.d2l-form-nested-demo-split-container {
				display: flex;
				margin-top: 18px;
			}

			.d2l-form-nested-demo-container {
				margin-bottom: 10px;
			}

			.d2l-form-nested-demo-main {
				flex-grow: 1;
				padding: 0 20px 20px 0;
			}
		`];
	}

	render() {
		return html`
			<d2l-form id="root" @d2l-form-submit=${this._onRootSubmit}>
				<div class="d2l-form-nested-demo-split-container">
					<d2l-form class="d2l-form-nested-demo-main">
						<div class="d2l-form-nested-demo-container">
							<label>Email<input class="d2l-input" name="email" type="email"></label>
						</div>
						<div class="d2l-form-nested-demo-container">
							<d2l-validation-custom for="password-nested" @d2l-validation-custom-validate=${this._validatePassword} failure-text="Expected hunter2" ></d2l-validation-custom>
							<label>Password<input class="d2l-input" id="password-nested" name="password" required type="password"></label>
						</div>
						<fieldset class="d2l-form-nested-demo-container">
							<legend>Choose your favorite monster</legend>
							<label><input type="radio" name="monster" value="kraken">&nbsp;Kraken</label>
							<label><input type="radio" name="monster" value="sasquatch">&nbsp;Sasquatch</label>
						</fieldset>
						<div class="d2l-form-nested-demo-container">
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
					<d2l-form-panel-demo></d2l-form-panel-demo>
				</div>
				<d2l-floating-buttons always-float>
					<d2l-button primary @click=${this._submit}>Save</d2l-button>
				</d2l-floating-buttons>
			</d2l-form>
		`;
	}

	_onRootSubmit(e) {
		e.preventDefault();
	}

	_submit() {
		this.shadowRoot.querySelector('#root').submit();
	}

	_validatePassword(e) {
		e.detail.resolve(e.detail.forElement.value === 'hunter2');
	}
}
customElements.define('d2l-form-nested-demo', FormNestedDemo);
