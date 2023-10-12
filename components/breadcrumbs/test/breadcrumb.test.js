import '../breadcrumb.js';
import '../breadcrumb-current-page.js';
import { runConstructor } from '@brightspace-ui/testing';

describe('d2l-breadcrumb', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-breadcrumb');
		});

		it('should construct current page', () => {
			runConstructor('d2l-breadcrumb-current-page');
		});

	});

});
