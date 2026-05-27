import '../../inputs/input-group.js';
import '../../inputs/input-number.js';
import '../../inputs/input-text.js';
import { html, LitElement } from 'lit';
import { FormElementContainerMixin } from '../form-element-container-mixin.js';
import { inputLabelStyles } from '../../inputs/input-label-styles.js';
import { inputStyles } from '../../inputs/input-styles.js';

class CustomFormElementContainer extends FormElementContainerMixin(LitElement) {

	static styles = [inputStyles, inputLabelStyles];

	render() {
		return html`
			<d2l-input-group>
				<div>
					<label for="native-input" class="d2l-input-label d2l-input-label-required">First Name</label>
					<input id="native-input"
						type="text"
						name="first-name"
						minlength="4"
						maxlength="15"
						required
						class="d2l-input">
				</div>
				<d2l-input-text label="Middle Name" name="middle-name" minlength="4" maxlength="8"></d2l-input-text>
				<d2l-input-text label="Last Name" name="last-name" required minlength="4" maxlength="15"></d2l-input-text>
				<d2l-input-text
					label="Telephone Number"
					type="tel"
					name="phone-number"
					pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
					required
				></d2l-input-text>
				<d2l-input-number label="Age" name="age" required min="18" max="23"></d2l-input-number>
			</d2l-input-group>
		`;
	}
}

customElements.define('d2l-custom-form-element-container', CustomFormElementContainer);
