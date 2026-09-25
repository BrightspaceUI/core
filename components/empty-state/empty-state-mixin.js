import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

export const EmptyStateMixin = superclass => class extends PropertyRequiredMixin(superclass) {

	focus() {
		if (!this.hasUpdated) {
			return;
		}
		const action = this.shadowRoot?.querySelector('.action-slot').assignedElements().find(
			el => el.tagName === 'D2L-EMPTY-STATE-ACTION-BUTTON' || el.tagName === 'D2L-EMPTY-STATE-ACTION-LINK'
		);
		if (action !== undefined) {
			action.focus();
			return;
		}
		const title = this.shadowRoot?.querySelector('.d2l-empty-state-description');
		if (title !== null) {
			title.focus();
		}
	}

};
