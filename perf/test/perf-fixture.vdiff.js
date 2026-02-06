import { test } from './shared.js';


describe('perf-fixture', () => {
	[true, false].forEach(dark => {
		[true, false].forEach(rtl => {
			test(rtl, dark)
		});
	});
});
