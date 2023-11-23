import { createElementErrorMessage } from '../../helpers/error.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';

const TIMEOUT_DURATION = 3000;

const defaultMessage = (propertyName) => `"${propertyName}" attribute is required`;

export function createMessage(elem, propertyName, message = defaultMessage(propertyName)) {
	return createElementErrorMessage(
		'PropertyRequiredMixin',
		elem,
		message,
		{ composedPath: true }
	);
}

export function createInvalidPropertyTypeMessage(elem, propertyName) {
	return createMessage(
		elem,
		propertyName,
		`only String properties can be required (property: "${propertyName}")`
	);
}

export const PropertyRequiredMixin = dedupeMixin(superclass => class extends superclass {

	constructor() {
		super();
		this._requiredProperties = new Map();
		this._initProperties(Object.getPrototypeOf(this));
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		for (const name of this._requiredProperties.keys()) {
			this._validateRequiredProperty(name);
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		this._requiredProperties.forEach((value, name) => {
			const doValidate = changedProperties.has(name) || value.dependentProps.includes(name);
			if (doValidate) this._validateRequiredProperty(name);
		});
	}

	flushRequiredPropertyErrors() {
		for (const name of this._requiredProperties.keys()) {
			this._flushRequiredPropertyError(name);
		}
	}

	_addRequiredProperty(name, prop) {

		const opts = {
			...{
				dependentProps: [],
				message: (_value, _elem, defaultMessage) => defaultMessage,
				validator: (_value, _elem, hasValue) => hasValue
			},
			...prop.required
		};

		this._requiredProperties.set(name, {
			attrName: prop.attribute || name,
			dependentProps: opts.dependentProps,
			message: opts.message,
			thrown: false,
			timeout: null,
			type: prop.type,
			validator: opts.validator
		});

	}

	_flushRequiredPropertyError(name) {

		if (!this._requiredProperties.has(name) || !this.isConnected) return;

		const info = this._requiredProperties.get(name);
		clearTimeout(info.timeout);
		info.timeout = null;

		if (info.type !== undefined && info.type !== String) {
			throw new Error(createInvalidPropertyTypeMessage(this, name));
		}

		const value = this[name];
		const hasValue = value?.constructor === String && value?.length > 0;
		const success = info.validator(value, this, hasValue);
		if (!success) {
			if (info.thrown) return;
			info.thrown = true;
			const message = createMessage(this, info.attrName, info.message(value, this, defaultMessage(info.attrName)));
			throw new TypeError(message);
		}

	}

	_initProperties(base) {
		if (base === null) return;
		this._initProperties(Object.getPrototypeOf(base));
		for (const name in base.constructor.properties) {
			const prop = base.constructor.properties[name];
			if (prop.required) {
				this._addRequiredProperty(name, prop);
			}
		}
	}

	_validateRequiredProperty(name) {
		const info = this._requiredProperties.get(name);
		clearTimeout(info.timeout);
		info.timeout = setTimeout(() => this._flushRequiredPropertyError(name), TIMEOUT_DURATION);
	}

});
