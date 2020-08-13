
import '../../button/button.js';
import '../../inputs/input-text.js';
import '../../validation/validation-custom.js';
import '../form-native.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { inputStyles } from '../../inputs/input-styles.js';
import { selectStyles } from '../../inputs/input-select-styles.js';

class FormNativeDemo extends LitElement {

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
			<d2l-form-native>
				<div class="d2l-form-demo-container">
					<d2l-input-text label="Name" type="text" name="name" required minlength="4" maxlength="8"></d2l-input-text>
				</div>
				<div class="d2l-form-demo-container">
					<d2l-input-text label="Email" name="email" type="email"></d2l-input-text>
				</div>
				<div class="d2l-form-demo-container">
					<d2l-validation-custom for="password" @d2l-validation-custom-validate=${this._validatePassword} failure-text="Expected hunter2 or 12345" ></d2l-validation-custom>
					<d2l-input-text label="Password" id="password" name="password" required type="password"></d2l-input-text>
				</div>
				<fieldset class="d2l-form-demo-container">
					<legend>Choose your favorite monster</legend>
					<input type="radio" id="kraken" name="monster" value="kraken">
					<label for="kraken">Kraken</label><br />
					<input type="radio" id="sasquatch" name="monster" value="sasquatch">
					<label for="sasquatch">Sasquatch</label><br />
				</fieldset>
				<div class="d2l-form-demo-container">
					<label for="pet-select">Favorite Pet</label><br />
					<select class="d2l-input-select" name="pets" id="pet-select" required>
						<option value="">--Please choose an option--</option>
						<option value="porpoise">Porpoise</option>
						<option value="house hippo">House Hippo</option>
						<option value="spiker monkey">Spider Monkey</option>
						<option value="capybara">Capybara</option>
					</select>
				</div>
				<div class="d2l-form-demo-container">
					<label for="story">Tell us your story</label>
						<textarea class="d2l-input" minlength="20" id="story" name="story" rows="5" cols="33">It was...</textarea>
					</label>
				</div>
				<div class="d2l-form-demo-container">
					<label for="file">Super Secret File</label><br />
					<input type="file" id="file" name="super-secret-file">
				</div>
				<button name="action" value="save" type="submit" @click=${this._onClick}>Save</button>
			</d2l-form-native>
		`;
	}

	_onClick(e) {
		this.shadowRoot.querySelector('d2l-form-native').requestSubmit(e.target);
	}

	_validatePassword(e) {
		e.detail.resolve(e.detail.forElement.value === 'hunter2' || e.detail.forElement.value === '12345');
	}

}
customElements.define('d2l-form-native-demo', FormNativeDemo);
