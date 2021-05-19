import '../dialog-confirm.js';
import { expect, fixture, oneEvent } from '@open-wc/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { html } from 'lit-element/lit-element.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-dialog-confirm', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-dialog-confirm');
		});

	});

	describe.skip('focus management', () => {

		it('should focus on first non-primary button', async() => {
			const el = await fixture(html`
				<d2l-dialog-confirm opened>
					<button slot="footer" primary>Yes</button>
					<button slot="footer">No</button>
				</d2l-dialog-confirm>
			`);
			await oneEvent(el, 'd2l-dialog-open');
			expect(getComposedActiveElement().innerText).to.equal('No');
		});

		it('should focus on primary button if no others', async() => {
			const el = await fixture(html`
				<d2l-dialog-confirm opened>
					<button slot="footer" primary>Yes</button>
				</d2l-dialog-confirm>
			`);
			await oneEvent(el, 'd2l-dialog-open');
			expect(getComposedActiveElement().innerText).to.equal('Yes');
		});

	});

});
