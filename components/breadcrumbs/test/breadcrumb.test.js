import '../breadcrumb.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-breadcrumb', () => {

	let elem;
	beforeEach(async() => {
		elem = await fixture(html`
			<d2l-breadcrumb></d2l-breadcrumb>
		`);
	});

	describe('attribute reflection', () => {
		it('should reflect "href" property to attribute', async() => {
			elem.href = '/someurl';
			await elem.updateComplete;
			expect(elem.getAttribute('href')).to.equal('/someurl');
		});

		it('should reflect "text" property to attribute', async() => {
			elem.text = 'Awesome Url';
			await elem.updateComplete;
			expect(elem.getAttribute('text')).to.equal('Awesome Url');
		});

		it('should reflect "target" property to attribute', async() => {
			elem.target = 'Awesome Target';
			await elem.updateComplete;
			expect(elem.getAttribute('target')).to.equal('Awesome Target');
		});

		it('should reflect "ariaLabel" property to attribute', async() => {
			elem.ariaLabel = 'Awesome Label';
			await elem.updateComplete;
			expect(elem.getAttribute('aria-label')).to.equal('Awesome Label');
		});

		it('should reflect "_compact" property to attribute', async() => {
			elem._compact = true;
			await elem.updateComplete;
			expect(elem.hasAttribute('compact')).to.be.true;
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-breadcrumb');
		});
	});

	describe('default property values', () => {
		it('should default "href" property to "#" when unset', () => {
			expect(elem.href).to.equal('#');
		});

		it('should default "text" property to "" when unset', () => {
			expect(elem.text).to.equal('');
		});

		it('should default "_compact" property to "false" when unset', () => {
			expect(elem._compact).to.be.false;
		});
	});

});
