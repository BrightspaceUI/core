
import '../../button/button.js';
import '../../inputs/input-text.js';
import '../../validation/validation-custom.js';
import '../form.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { inputStyles } from '../../inputs/input-styles.js';
import { selectStyles } from '../../inputs/input-select-styles.js';

class FormDemo extends LitElement {

	static get styles() {
		return [inputStyles, selectStyles, css`
			:first-child.d2l-form-demo-container {
				margin-top: 18px;
			}
			.d2l-form-demo-container {
				margin-bottom: 10px;
			}
		`];
	}

	render() {
		return html`
			<d2l-form>
				<div class="d2l-form-demo-container">
					<label>Name
						<input  class="d2l-input" type="text" name="name" required minlength="4" maxlength="8" size="10">
					</label>
				</div>
				<div class="d2l-form-demo-container">
					<label>Email
						<input class="d2l-input" name="email" type="email">
					</label>
				</div>
				<div class="d2l-form-demo-container">
					<d2l-validation-custom for="password" @d2l-validation-custom-validate=${this._validatePassword} failure-text="Expected hunter2" ></d2l-validation-custom>
					<label>Password
						<input class="d2l-input" id="password" name="password" required type="password">
					</label>
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
					<label>Tell us your story
						<textarea class="d2l-input" minlength="20" name="story" rows="5" cols="33">It was...</textarea>
					</label>
				</div>
				<div class="d2l-form-demo-container">
					<label for="file">Super Secret File<br/>
						<input type="file" name="super-secret-file">
					</label>
				</div>
				<button name="action" value="save">Save</button>
			</d2l-form>
		`;
	}

	_validatePassword(e) {
		e.detail.resolve(e.detail.forElement.value === 'hunter2');
	}
}
customElements.define('d2l-form-demo', FormDemo);
