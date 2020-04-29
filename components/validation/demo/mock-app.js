import '../../inputs/input-checkbox.js';
import '../../inputs/input-text.js';
import '../../typography/typography.js';
import '../../button/button.js';
import '../../colors/colors.js';
import { html, LitElement } from 'lit-element/lit-element.js';

class MockApp extends LitElement {

	static get properties() {
		return {
			action: { type: String, reflect: true }
		};
	}
	render() {
		return html`
			<form action="/action" @submit=${this.validate}>
				<label for="fname">First name:</label><br>
				<d2l-input-text type="text" required id="fname" name="fname" value="John"></d2l-input-text><br>
				<label for="lname">Last name:</label><br>
				<input type="text" id="lname" name="lname" value="Doe"><br><br>
				<d2l-input-checkbox checked name="chcke">Checked item</d2l-input-checkbox>
				<d2l-input-checkbox name="chbox2">Unchecked item</d2l-input-checkbox>
				<button type="submit">Submit</button>
			</form>
		`;
	}

	validate(e) {
		/*if (!performSynchronousValidation()) {
			e.preventDefault();
		}*/
	}
}
customElements.define('d2l-mock-app', MockApp);
