
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
			.container {
				margin-bottom: 10px;
			}
		`];
	}

	render() {
		return html`
			<d2l-form>
				<div class="container">
					<label for="name">Name</label>
					<input  class="d2l-input" type="text" id="name" name="name" required minlength="4" maxlength="8" size="10">
				</div>
				<div class="container">
					<label>Email<input class="d2l-input" name="email" type="email"></label>
				</div>
				<div class="container">
					<d2l-validation-custom for="password" @d2l-validation-custom-validate=${this._validatePassword} failure-text="Expected hunter2 or 12345" ></d2l-validation-custom>
					<label>Password<input class="d2l-input" id="password" name="password" required type="password"></label>
				</div>
				<fieldset class="container">
					<legend>Choose your favorite monster</legend>
					<input type="radio" id="kraken" name="monster" value="kraken">
					<label for="kraken">Kraken</label><br />
					<input type="radio" id="sasquatch" name="monster" value="sasquatch">
					<label for="sasquatch">Sasquatch</label><br />
				</fieldset>
				<div class="container">
					<label for="pet-select">Favorite Pet</label><br />
					<select class="d2l-input-select" name="pets" id="pet-select" required>
						<option value="">--Please choose an option--</option>
						<option value="porpoise">Porpoise</option>
						<option value="house hippo">House Hippo</option>
						<option value="spiker monkey">Spider Monkey</option>
						<option value="capybara">Capybara</option>
					</select>
				</div>
				<div class="container">
					<label for="story">Tell us your story</label>
						<textarea class="d2l-input" minlength="20" id="story" name="story" rows="5" cols="33">It was...</textarea>
					</label>
				</div>
				<div class="container">
					<label for="file">Super Secret File</label><br />
					<input type="file" id="file" name="super-secret-file">
				</div>
				<button name="action" value="save" type="submit">Save</button>
			</d2l-form>
		`;
	}

	_validatePassword(e) {
		e.detail.resolve(e.detail.forElement.value === 'hunter2' || e.detail.forElement.value === '12345');
	}
}
customElements.define('d2l-form-demo', FormDemo);
