import '../switch-visibility.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-switch-visibility', () => {

	it('should construct', () => {
		runConstructor('d2l-switch-visibility');
	});

	it('should have conditions if conditions are passed in', async() => {
		const switchFixture = await fixture(html`<d2l-switch-visibility on>Conditions</d2l-switch-visibility>`);
		expect(switchFixture._hasConditions).to.be.true;
	});

});
