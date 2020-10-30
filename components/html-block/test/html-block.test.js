import '../html-block.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-html-block', () => {

	it('should construct', () => {
		runConstructor('d2l-html-block');
	});

});
