import '../list.js';
import '../list-item.js';
import '../list-item-content.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-list', () => {

	describe('constructor', () => {

		it('should construct list', () => {
			runConstructor('d2l-list');
		});

		it('should construct list-item', () => {
			runConstructor('d2l-list-item');
		});

		it('should construct list-item-content', () => {
			runConstructor('d2l-list-item-content');
		});

	});

});
