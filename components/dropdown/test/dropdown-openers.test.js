import '../dropdown-button-subtle.js';
import '../dropdown-button.js';
import '../dropdown-context-menu.js';
import '../dropdown-more.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-dropdown-openers', () => {

	describe('constructor', () => {

		it('should construct dropdown-button-subtle', () => {
			runConstructor('d2l-dropdown-button-subtle');
		});

		it('should construct dropdown-button', () => {
			runConstructor('d2l-dropdown-button');
		});

		it('should construct dropdown-context-menu', () => {
			runConstructor('d2l-dropdown-context-menu');
		});

		it('should construct dropdown-more', () => {
			runConstructor('d2l-dropdown-more');
		});

	});

});
