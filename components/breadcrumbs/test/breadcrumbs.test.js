import '../breadcrumbs.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-breadcrumbs', () => {

	let elem;
	beforeEach(async() => {
		elem = await fixture(html`
			<d2l-breadcrumbs>
				<d2l-breadcrumb href="#" text="Basic Item 1"></d2l-breadcrumb>
				<d2l-breadcrumb href="#" text="Basic Item 2"></d2l-breadcrumb>
				<d2l-breadcrumb href="#" text="Basic Item 3" aria-label="Aria for Item 3"></d2l-breadcrumb>
			</d2l-breadcrumbs>
		`);
	});

	describe('attribute reflection', () => {
		it('should reflect "compact" property to attribute', async() => {
			elem.compact = true;
			await elem.updateComplete;
			expect(elem.hasAttribute('compact')).to.be.true;
		});

	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-breadcrumbs');
		});
	});

	describe('default property values', () => {
		it('should default "compact" property to "false" when unset', () => {
			expect(elem.compact).to.be.false;
		});
	});

});
