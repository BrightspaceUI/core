import { dedupeMixin } from '@open-wc/dedupe-mixin';

const TIMEOUT_DURATION = 3000;

export function createDefaultMessage(tagName, propertyName) {
	return `${tagName}: "${propertyName}" attribute is required.`;
}

export function createInvalidPropertyTypeMessage(tagName, propertyName) {
	return `PropertyRequiredMixin: only String properties can be required ("${tagName}" required property "${propertyName}").`;
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
			const doValidate = changedProperties.has(name) ||
			value.dependentProps.includes(name);
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
			throw new Error(createInvalidPropertyTypeMessage(this.tagName.toLowerCase(), name));
		}

		const value = this[name];
		const hasValue = value?.constructor === String && value?.length > 0;
		const success = info.validator(value, this, hasValue);
		if (!success) {
			if (info.thrown) return;
			info.thrown = true;
			const defaultMessage = createDefaultMessage(this.tagName.toLowerCase(), info.attrName);
			throw new TypeError(info.message(value, this, defaultMessage));
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
