import '../../inputs/input-checkbox.js';
import '../../inputs/input-text.js';
import '../validation-container.js';
import '../../typography/typography.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { selectStyles } from '../../inputs/input-select-styles.js';

class MockApp extends LitElement {

	static get properties() {
		return {
			action: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [selectStyles, css`
			:host {
				display: block;
				margin: 100px 200px 100px 200px;
			}
			.d2l-dirty:invalid {
				border-color: var(--d2l-color-cinnabar);
			}
		`];
	}
	render() {
		return html`
			<d2l-validation-container form='my-form'>
				<form id='my-form' action="/action" @submit=${this.validate}>
					<d2l-input-text label="First name" type="text" required id="fname" name="fname"></d2l-input-text><br>
					<label for="mname">Optional middle name:</label><br>
					<input type="text" id="mname" name="mname"><br><br>
					<label for="lname">Last name:</label><br>
					<input required type="text" id="lname" name="lname"><br><br>
					<select class="d2l-input-select" required name="pets" id="pet-select">
						<option value="">--Please choose an option--</option>
						<option value="dog">Dog</option>
						<option value="cat">Cat</option>
						<option value="hamster">Hamster</option>
						<option value="parrot">Parrot</option>
						<option value="spider">Spider</option>
						<option value="goldfish">Goldfish</option>
					</select>
					<d2l-input-checkbox checked name="chcke">Optional check item</d2l-input-checkbox>
					<d2l-input-checkbox required name="chbox2">Unchecked item</d2l-input-checkbox>
					<button type="submit">Submit</button>
				</form>
			</d2l-validation-container>
		`;
	}

	getFormElement() {
		return this.shadowRoot.querySelector('form');
	}
}
customElements.define('d2l-mock-app', MockApp);
