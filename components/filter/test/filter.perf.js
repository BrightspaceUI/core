// component.performance.js
import { expect } from '@esm-bundle/chai';
import { testBundleSize } from 'web-test-runner-performance/browser.js';

describe('performance', () => {
	it('should meet maximum css bundle size limits (0.2kb brotli)', async() => {
		expect((await testBundleSize('./filter.js')).kb).to.below(0.2);
	});
});
