import '../status-indicator.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-status-indicator', () => {

	let elem;
	beforeEach(async() => {
		elem = await fixture(html`<d2l-status-indicator text="test subtle"></d2l-status-indicator>`);
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

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-status-indicator');
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

});
