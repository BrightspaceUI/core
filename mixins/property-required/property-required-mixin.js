import { dedupeMixin } from '@open-wc/dedupe-mixin';

const TIMEOUT_DURATION = 3000;

export function createDefaultMessage(tagName, propertyName) {
	return `${tagName}: "${propertyName}" attribute is required.`;
}

export function createUndefinedPropertyMessage(tagName, propertyName) {
	return `PropertyRequiredMixin: "${tagName.toLowerCase()}" has no property "${propertyName}".`;
}

export function createInvalidPropertyTypeMessage(tagName, propertyName) {
	return `PropertyRequiredMixin: only String properties can be required ("${tagName}" required property "${propertyName}".`;
}

export const PropertyRequiredMixin = dedupeMixin(superclass => class extends superclass {

	constructor() {
		super();
		this._allProperties = new Map();
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

	addRequiredProperty(name, opts) {

		const prop = this._allProperties.get(name);
		if (prop === undefined) {
			throw new Error(createUndefinedPropertyMessage(this.tagName.toLowerCase(), name));
		}

		if (prop.type !== String) {
			throw new Error(createInvalidPropertyTypeMessage(this.tagName.toLowerCase(), name));
		}

		opts = {
			...{ dependentProps: [], message: defaultMessage => defaultMessage, validator: hasValue => hasValue },
			...opts
		};

		this._requiredProperties.set(name, {
			attrName: prop.attribute || name,
			dependentProps: opts.dependentProps,
			message: opts.message,
			thrown: false,
			timeout: null,
			validator: opts.validator
		});

	}

	flushRequiredPropertyErrors() {
		for (const name of this._requiredProperties.keys()) {
			this._flushRequiredPropertyError(name);
		}
	}

	_flushRequiredPropertyError(name) {

		if (!this._requiredProperties.has(name) || !this.isConnected) return;

		const info = this._requiredProperties.get(name);
		clearTimeout(info.timeout);
		info.timeout = null;

		const hasValue = this[name]?.constructor === String && this[name]?.length > 0;
		const success = info.validator(hasValue);
		if (!success) {
			if (info.thrown) return;
			info.thrown = true;
			const defaultMessage = createDefaultMessage(this.tagName.toLowerCase(), info.attrName);
			throw new TypeError(info.message(defaultMessage));
		}

	}

	_initProperties(base) {
		if (base === null) return;
		this._initProperties(Object.getPrototypeOf(base));
		for (const name in base.constructor.properties) {
			this._allProperties.set(name, base.constructor.properties[name]);
		}
	}

	_validateRequiredProperty(name) {
		const info = this._requiredProperties.get(name);
		clearTimeout(info.timeout);
		info.timeout = setTimeout(() => this._flushRequiredPropertyError(name), TIMEOUT_DURATION);
	}

});
