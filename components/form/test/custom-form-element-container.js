import '../../inputs/input-text.js';
import { html, LitElement } from 'lit';
import { FormElementContainerMixin } from '../form-element-container-mixin.js';

class CustomTestFormElementContainer extends FormElementContainerMixin(LitElement) {
	render() {
		return html`
			<label for="nested-native-input">Name</label>
			<input id="nested-native-input"
				type="text"
				name="name"
				minlength="4"
				maxlength="15"
				required
			>
			<d2l-input-text
				id="nested-telephone-input"
				label="Telephone Number"
				type="tel"
				name="phone"
				pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
				required
			></d2l-input-text>
		`;
	}
}

customElements.define('d2l-test-custom-form-element-container', CustomTestFormElementContainer);
