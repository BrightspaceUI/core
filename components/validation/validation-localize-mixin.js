import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';

export const ValidationLocalizeMixin = superclass => class extends LocalizeStaticMixin(superclass) {

	static get resources() {
		return {
			'en': {
				'valueMissingMessage': '{subject} is required',
				'tooLongMessage': '{subject} must be at most {maxlength} characters',
				'tooShortMessage': '{subject} must be at least {minlength} characters',
				'badInputMessage': '{subject} has bad input',
				'patternMismatchMessage': '{subject} has malformed input',
				'rangeOverflowMessage': '{subject} must be less than {max}',
				'rangeUnderflowMessage': '{subject} must be greater than {min}',
				'typeMismatchMessage': '{subject} has an invalid type'
			},
		};
	}

	localizeValidity(ele) {
		ele = ele || this;
		const subject = ele.getAttribute('data-subject');
		if (ele.validity.valueMissing) {
			return this.localize('valueMissingMessage', { subject });
		}
		if (ele.validity.tooLong) {
			const maxlength = ele.getAttribute('maxlength');
			return this.localize('tooLongMessage', { subject, maxlength });
		}
		if (ele.validity.tooShort) {
			const minlength = ele.getAttribute('minlength');
			return this.localize('tooShortMessage', { subject, minlength });
		}
		if (ele.validity.badInput) {
			return this.localize('badInputMessage', { subject });
		}
		if (ele.validity.patternMismatch) {
			return this.localize('patternMismatchMessage', { subject });
		}
		if (ele.validity.rangeOverflow) {
			const max = ele.getAttribute('max');
			return this.localize('rangeOverflowMessage', { subject, max });
		}
		if (ele.validity.rangeUnderflow) {
			const min = ele.getAttribute('min');
			return this.localize('rangeUnderflowMessage', { subject, min });
		}
		if (ele.validity.typeMismatch) {
			return this.localize('typeMismatchMessage', { subject });
		}
		return ele.validationMessage;
	}

};
