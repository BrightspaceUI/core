import '../description-list-wrapper.js';

import { expect, fixture, html } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-dl-wrapper', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-dl-wrapper');
		});
	});

	describe('layout breakpoint', () => {
		it('has a default value of 240', async() => {
			const elem = await fixture(html`
				<d2l-dl-wrapper>
					<dl>
						<dt>Title</dt>
						<dd>Details</dd>
					</dl>
				</d2l-dl-wrapper>
			`);

			expect(elem.breakpoint).to.equal(240);
		});

		it('can be overridden by consumers', async() => {
			const elem = await fixture(html`
				<d2l-dl-wrapper breakpoint="300">
					<dl>
						<dt>Title</dt>
						<dd>Details</dd>
					</dl>
				</d2l-dl-wrapper>
			`);

			expect(elem.breakpoint).to.equal(300);
		});
	});

});
