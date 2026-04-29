import '../../button/button.js';
import '../dialog-confirm.js';
import { expect, fixture, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { html } from 'lit';
import { isComposedAncestor } from '../../../helpers/dom.js';

describe('d2l-dialog-confirm', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-dialog-confirm');
		});

	});

	describe('focus management', () => {

		it('should focus on first non-primary button', async() => {
			const el = await fixture(html`
				<d2l-dialog-confirm opened>
					<d2l-button slot="footer" primary>Yes</d2l-button>
					<d2l-button id="no" slot="footer">No</d2l-button>
				</d2l-dialog-confirm>
			`);
			await oneEvent(el, 'd2l-dialog-open');
			expect(isComposedAncestor(el.querySelector('#no'), getComposedActiveElement())).to.be.true;
		});

		it('should focus on primary button if no others', async() => {
			const el = await fixture(html`
				<d2l-dialog-confirm opened>
					<d2l-button slot="footer" primary>Yes</d2l-button>
				</d2l-dialog-confirm>
			`);
			await oneEvent(el, 'd2l-dialog-open');
			expect(isComposedAncestor(el.querySelector('d2l-button'), getComposedActiveElement())).to.be.true;
		});

	});

});
