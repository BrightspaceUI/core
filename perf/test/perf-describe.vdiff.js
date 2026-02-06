import { test } from './shared.js';

function setVdiffAlternativeTests(tests = {}) {
	beforeEach(function() {
		this.currentTest.vdiffAlternativeTests = tests
	});
}

describe('perf-describe', () => {
	setVdiffAlternativeTests(['dark']);

	[true, false].forEach(rtl => {
		test(rtl);
	});
});
