import { formatNumber } from '@brightspace-ui/intl/lib/number.js';
import { tryGetLabelText } from './form-helper.js';

export const localizeFormElement = (localize, ele) => {
	if (ele.validity.valid) {
		return null;
	}
	const tagName = ele.tagName.toLowerCase();
	const labelText = tryGetLabelText(ele) || localize('components.form-element.defaultFieldLabel');
	switch (tagName) {
		case 'input':
			return _localizeInputElement(localize, ele, labelText);
		default:
			return _localizeGenericElement(localize, ele, labelText);
	}
};

const _localizeInputElement = (localize, ele, labelText) => {

	const type = ele.type;
	switch (type) {
		case 'number':
			return _localizeInputNumberElement(localize, ele, labelText);
		case 'url':
			return _localizeInputUrlElement(localize, ele, labelText);
		case 'email':
			return _localizeInputEmailElement(localize, ele, labelText);
		case 'text':
			return _localizeInputTextElement(localize, ele, labelText);
		default:
			return _localizeGenericElement(localize, ele, labelText);
	}
};

const _localizeInputNumberElement = (localize, ele, labelText) => {
	switch (true) {
		case ele.validity.rangeUnderflow:
			return localize('components.form-element.input.number.rangeUnderflow', { min: formatNumber(parseFloat(ele.min)) });
		case ele.validity.rangeOverflow:
			return localize('components.form-element.input.number.rangeOverflow', { max: formatNumber(parseFloat(ele.max)) });
		default:
			return _localizeGenericElement(localize, ele, labelText);
	}
};

const _localizeInputUrlElement = (localize, ele, labelText) => {
	switch (true) {
		case ele.validity.typeMismatch:
			return localize('components.form-element.input.url.typeMismatch');
		default:
			return _localizeGenericElement(localize, ele, labelText);
	}
};

const _localizeInputEmailElement = (localize, ele, labelText) => {
	switch (true) {
		case ele.validity.typeMismatch:
			return localize('components.form-element.input.email.typeMismatch');
		default:
			return _localizeGenericElement(localize, ele, labelText);
	}
};

const _localizeInputTextElement = (localize, ele, labelText) => {
	switch (true) {
		case ele.validity.tooShort:
			return localize('components.form-element.input.text.tooShort', { label: labelText, minlength: formatNumber(ele.minLength) });
		default:
			return _localizeGenericElement(localize, ele, labelText);
	}
};

const _localizeGenericElement = (localize, ele, labelText) => {
	switch (true) {
		case ele.validity.valueMissing:
			return localize('components.form-element.valueMissing', { label: labelText });
		default:
			return localize('components.form-element.defaultError', { label: labelText });
	}
};
