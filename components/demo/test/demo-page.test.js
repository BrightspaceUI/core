import '../demo-page.js';

import { expect, runConstructor } from '@brightspace-ui/testing';

describe('d2l-demo-page', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-demo-page');
		});
	});

	it('should set isD2LDemoPage', () => {
		expect(window.isD2LDemoPage).to.be.true;
	});

});
