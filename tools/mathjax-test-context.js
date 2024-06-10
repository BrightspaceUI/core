import { addContext } from '@brightspace-ui/lms-context-provider/test-helpers/test-host.js';

console.warn('Using mathjax test context, this is intended for demo pages and tests only');

addContext('d2l-mathjax', {
	outputScale: 1.1,
	renderLatex: !(window.location.search.indexOf('latex=false') !== -1),
	enableMML3Support: true
});
