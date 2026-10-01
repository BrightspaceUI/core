import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

export const StateMixin = superclass => class extends PropertyRequiredMixin(superclass) {

	focus() {
		if (!this.hasUpdated) {
			return;
		}
		const action = this.shadowRoot?.querySelector('.action-slot').assignedElements().find(
			el => el.isStateActionButton || el.isStateActionLink
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
