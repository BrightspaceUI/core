
import { defineCE, expect, fixture, html } from '@brightspace-ui/testing';
import { LitElement } from 'lit';
import { RtlMixin } from '../rtl-mixin.js';

const rtlMixinTag = defineCE(
	class extends RtlMixin(LitElement) {
		render() {
			return html`<p>hello</p>`;
		}
	}
);

describe('RtlMixin', () => {

	afterEach(() => {
		document.documentElement.removeAttribute('dir');
	});

	it('does not get a "dir" attribute if none is set on the document', async() => {
		const elem = await fixture(`<${rtlMixinTag}></${rtlMixinTag}>`);
		expect(elem.hasAttribute('dir')).to.be.false;
	});

	it('does not get a "dir" attribute if document direction is "ltr"', async() => {
		document.documentElement.setAttribute('dir', 'ltr');
		const elem = await fixture(`<${rtlMixinTag}></${rtlMixinTag}>`);
		expect(elem.hasAttribute('dir')).to.be.false;
	});

	it('does get dir="rtl" attribute if document direction is "rtl"', async() => {
		document.documentElement.setAttribute('dir', 'rtl');
		const elem = await fixture(`<${rtlMixinTag}></${rtlMixinTag}>`);
		expect(elem.getAttribute('dir')).to.equal('rtl');
	});

});
