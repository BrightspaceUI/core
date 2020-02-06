import '../status-indicator.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-status-indicator', () => {

	let elem;
	beforeEach(async() => {
		elem = await fixture(html`<d2l-status-indicator text="test subtle"></d2l-status-indicator>`);
	});

	describe('accessibility', () => {

		[
			'default',
			'none',
			'alert',
			'success'
		].forEach((state) => {
			[true, false].forEach((bold) => {
				it(`passes aXe tests for state "${state}" and bold ${bold}`, async() => {
					elem.state = state;
					elem.bold = bold;
					await elem.updateComplete;
					await expect(elem).to.be.accessible();
				});
			});
		});

	});

	describe('default property values', () => {

		it('should default "state" property to "default" when unset', () => {
			expect(elem.state).to.equal('default');
		});

		it('should default "bold" property to "false" when unset', () => {
			expect(elem.bold).to.be.false;
		});

	});

	describe('attribute reflection', () => {

		it('should reflect "state" property to attribute', async() => {
			elem.state = 'success';
			await elem.updateComplete;
			expect(elem.getAttribute('state')).to.equal('success');
		});

		it('should reflect "bold" property to attribute', async() => {
			elem.bold = true;
			await elem.updateComplete;
			expect(elem.hasAttribute('bold')).to.be.true;
		});

	});

});
