import '../../button/button.js';
import '../dialog-confirm.js';
import { expect, fixture, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { html } from 'lit';

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
					<d2l-button slot="footer" primary>Yes</d2l-button>
					<d2l-button slot="footer">No</d2l-button>
				</d2l-dialog-confirm>
			`);
			await oneEvent(el, 'd2l-dialog-open');
			expect(getComposedActiveElement().innerText).to.equal('No');
		});

		it('should focus on primary button if no others', async() => {
			const el = await fixture(html`
				<d2l-dialog-confirm opened>
					<d2l-button slot="footer" primary>Yes</d2l-button>
				</d2l-dialog-confirm>
			`);
			await oneEvent(el, 'd2l-dialog-open');
			expect(getComposedActiveElement().innerText).to.equal('Yes');
		});

	});

});
