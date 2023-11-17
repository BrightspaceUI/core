import { AttributeRequiredMixin } from '../attribute-required-mixin.js';
import { defineCE, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { LitElement, render } from 'lit';
import { restore, stub } from 'sinon';

const tag = defineCE(
	class extends AttributeRequiredMixin(LitElement) {
		static get properties() {
			return {
				foo: { type: String }
			};
		}
		constructor() {
			super();
			this.addRequiredAttribute(
				'foo',
				() => typeof(this.foo) === 'string' && this.foo.length > 0,
				`The 'foo' attribute is required.`
			);
		}
		render() { return html`<div>hello</div>`; }
	}
);

describe('AttributeRequiredMixin', () => {

	it('should test things', async() => {
		const elem = await fixture(`<${tag}></${tag}>`);
		expect(() => {
			elem.flushRequiredAttributeErrors();
		}).to.throw(TypeError, 'The \'foo\' attribute is required.');
	});

});
