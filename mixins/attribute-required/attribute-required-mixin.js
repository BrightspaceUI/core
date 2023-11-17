import { dedupeMixin } from '@open-wc/dedupe-mixin';

export const TIMEOUT_DURATION = 3000;

export const AttributeRequiredMixin = dedupeMixin(superclass => class extends superclass {

	constructor() {
		super();
		this._requiredAttributes = new Map();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._requiredAttributes.keys().forEach(name => this._validateRequiredAttribute(name));
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		changedProperties.forEach((_oldValue, propName) => {
			if (this._requiredAttributes.has(propName)) {
				this._validateRequiredAttributeName(propName);
			}
		});
	}

	addRequiredAttribute(name, validator, message) {
		this._requiredAttributes.set(name, { validator, message, timeout: null });
	}

	flushRequiredAttributeError(name) {

		if (!this._requiredAttributes.has(name) || !this.isConnected) return;

		const info = this._requiredAttributes.get(name);
		info.timeout = null;

		const success = info.validator();
		if (!success) {
			throw new Error(info.message);
		}

	}

	flushRequiredAttributeErrors() {
		this._requiredAttributes.keys().forEach(name => this.flushRequiredAttributeError(name));
	}

	_validateRequiredAttribute(name) {
		const info = this._requiredAttributes.get(name);
		clearTimeout(info.timeout);
		info.timeout = setTimeout(() => this.flushRequiredAttributeError(name), TIMEOUT_DURATION);
	}

});
