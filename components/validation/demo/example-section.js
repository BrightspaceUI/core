import '../../button/button.js';
import '../../inputs/input-text.js';
import '../validation-group.js';
import '../validation-error-summary.js';
import '../validation-custom.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeStaticMixin } from '../../../mixins/localize-static-mixin.js';
import { selectStyles } from '../../inputs/input-select-styles.js';

class ExampleSection extends LocalizeStaticMixin(LitElement) {

	static get styles() {
		return [selectStyles];
	}

	static get resources() {
		return {
			'en': {
				'sectionInput': 'Section Input',
				'otherPetsTitle': 'Other Pets'
			},
		};
	}

	render() {
		return html`
			<d2l-validation-group>
				<h2>Example Section</h2>
				<select class="d2l-input-select" data-subject="${this.localize('otherPetsTitle')}" name="pets" id="pet-select" required>
					<option value="">--Please choose an option--</option>
					<option value="dog">Dog</option>
					<option value="cat">Cat</option>
					<option value="hamster">Hamster</option>
					<option value="parrot">Parrot</option>
					<option value="spider">Spider</option>
					<option value="goldfish">Goldfish</option>
				</select>
				<d2l-input-text label="${this.localize('sectionInput')}" data-subject="${this.localize('sectionInput')}"  name="custom-input" required></d2l-input-text>
			</d2l-validation-group>
		`;
	}
}
customElements.define('d2l-example-section', ExampleSection);
