import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

export const StateMixin = superclass => class extends PropertyRequiredMixin(superclass) {

	static properties = {
		/**
		 * REQUIRED: A description giving details about the state
		 * @type {string}
		 */
		description: { type: String, required: true },
	};

	focus() {
		if (!this.hasUpdated) {
			return;
		}
		const action = this.shadowRoot?.querySelector('.action-slot').assignedElements().find(
			el => el.tagName === 'D2L-STATE-ACTION-BUTTON' || el.tagName === 'D2L-STATE-ACTION-LINK'
		);
		if (action !== undefined) {
			action.focus();
			return;
		}
		const title = this.shadowRoot?.querySelector('.d2l-state-description');
		if (title !== null) {
			title.focus();
		}
	}

};
