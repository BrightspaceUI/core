import '../page-main.js';
import '../page-side-nav.js';
import '../page-supporting.js';
import { runConstructor } from '@brightspace-ui/testing';

describe('panels', () => {

	describe('page-main', () => {
		it('should construct', () => {
			runConstructor('d2l-page-main');
		});
	});

	describe('page-side-nav', () => {
		it('should construct', () => {
			runConstructor('d2l-page-side-nav');
		});
	});

	describe('page-supporting', () => {
		it('should construct', () => {
			runConstructor('d2l-page-supporting');
		});
	});

});
