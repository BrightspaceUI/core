import { createDefaultMessage, createInvalidPropertyTypeMessage, ERROR_CODE, PropertyRequiredMixin } from '../property-required-mixin.js';
import { defineCE, expect, fixture } from '@brightspace-ui/testing';
import { LitElement } from 'lit';

const tagString = defineCE(
	class extends PropertyRequiredMixin(LitElement) {
		static properties = {
			attr: { type: String, required: true }
		};
	}
);

describe('PropertyRequiredMixin', () => {

	it('should not throw if value is initially provided', async() => {
		const elem = await fixture(`<${tagString} attr="value"></${tagString}>`);
		expect(() => elem.flushRequiredPropertyErrors()).to.not.throw();
	});

	it('should not throw if value is provided before timeout', async() => {
		const elem = await fixture(`<${tagString}></${tagString}>`);
		elem.setAttribute('attr', 'value');
		await elem.updateComplete;
		expect(() => elem.flushRequiredPropertyErrors()).to.not.throw();
	});

	it('should not throw if element is removed from the DOM', async() => {
		const elem = await fixture(`<${tagString}></${tagString}>`);
		elem.parentNode.removeChild(elem);
		expect(() => elem.flushRequiredPropertyErrors()).to.not.throw();
	});

	it('should throw if value is initially missing', async() => {
		const elem = await fixture(`<${tagString}></${tagString}>`);
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(TypeError, createDefaultMessage(tagString, 'attr'));
	});

	it('should throw if value is initially empty', async() => {
		const elem = await fixture(`<${tagString} attr=""></${tagString}>`);
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(TypeError, createDefaultMessage(tagString, 'attr'));
	});

	it('should throw if value is later removed', async() => {
		const elem = await fixture(`<${tagString} attr="value"></${tagString}>`);
		elem.removeAttribute('attr');
		await elem.updateComplete;
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(TypeError, createDefaultMessage(tagString, 'attr'));
	});

	it('should throw if value is later set to empty', async() => {
		const elem = await fixture(`<${tagString} attr="value"></${tagString}>`);
		elem.setAttribute('attr', '');
		await elem.updateComplete;
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(TypeError, createDefaultMessage(tagString, 'attr'));
	});

	it('should only throw once', async() => {
		const elem = await fixture(`<${tagString} attr=""></${tagString}>`);
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(TypeError, createDefaultMessage(tagString, 'attr'));
		elem.setAttribute('attr', 'value');
		await elem.updateComplete;
		elem.removeAttribute('attr');
		await elem.updateComplete;
		expect(() => elem.flushRequiredPropertyErrors()).to.not.throw();
	});

	it('should use camel-case name for multi-word attribute', async() => {
		const tag = defineCE(
			class extends PropertyRequiredMixin(LitElement) {
				static properties = {
					requiredAttr: { attribute: 'required-attr', type: String, required: true }
				};
			}
		);
		const elem = await fixture(`<${tag}></${tag}>`);
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(TypeError, createDefaultMessage(tag, 'required-attr'));
	});

	it('should throw if type is non-String', async() => {
		const tag = defineCE(
			class extends PropertyRequiredMixin(LitElement) {
				static properties = {
					attr: { type: Boolean, required: true }
				};
			}
		);
		const elem = await fixture(`<${tag} attr="value"></${tag}>`);
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(createInvalidPropertyTypeMessage(tag, 'attr'));
	});

	it('should not throw if type is undefined (defaults to String)', async() => {
		const tag = defineCE(
			class extends PropertyRequiredMixin(LitElement) {
				static properties = {
					attr: { required: true }
				};
			}
		);
		const elem = await fixture(`<${tag} attr="value"></${tag}>`);
		expect(() => elem.flushRequiredPropertyErrors()).to.not.throw();
	});

	it('should use custom validator and message', async() => {
		const tag = defineCE(
			class extends PropertyRequiredMixin(LitElement) {
				static properties = {
					attr: {
						type: String,
						required: {
							message: (value, elem) => `${elem.tagName.toLowerCase()}: custom message! "${value}"`,
							validator: (value) => value === 'valid'
						}
					}
				};
			}
		);
		const elem = await fixture(`<${tag} attr="oh no"></${tag}>`);
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(TypeError, `${tag.toLowerCase()}: custom message! "oh no" ${ERROR_CODE}`);
	});

	it('should pass hasValue to custom validator', async() => {
		const tag = defineCE(
			class extends PropertyRequiredMixin(LitElement) {
				static properties = {
					attr: {
						type: String,
						required: {
							validator: (_value, _elem, hasValue) => hasValue
						}
					}
				};
			}
		);
		const elem = await fixture(`<${tag}></${tag}>`);
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(TypeError, createDefaultMessage(tag, 'attr'));
	});

	it('should validate when dependent property changes', async() => {
		const tag = defineCE(
			class extends PropertyRequiredMixin(LitElement) {
				static properties = {
					attr1: {
						type: String,
						required: {
							dependentProps: ['attr2'],
							validator: (_value, elem) => elem.attr2 === 'valid'
						}
					},
					attr2: { type: String }
				};
			}
		);
		const elem = await fixture(`<${tag} attr1="value" attr2="valid"></${tag}>`);
		expect(() => elem.flushRequiredPropertyErrors()).to.not.throw();
		elem.removeAttribute('attr2');
		await elem.updateComplete;
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(TypeError, createDefaultMessage(tag, 'attr1'));
	});

	it('should work in a subclass/mixin', async() => {
		const TestMixin = superclass => class extends PropertyRequiredMixin(superclass) {
			static properties = {
				attr1: { type: String, required: true }
			};
		};
		const tagMixin = defineCE(
			class extends TestMixin(LitElement) {
				static properties = {
					attr2: { type: String }
				};
			}
		);
		const elem = await fixture(`<${tagMixin}></${tagMixin}>`);
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(TypeError, createDefaultMessage(tagMixin, 'attr1'));
	});

});
