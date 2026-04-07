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

	describe('footer slotchange', () => {
		const preferNative = window.D2L.DialogMixin.preferNative;

		afterEach(() => {
			window.D2L.DialogMixin.preferNative = preferNative;
		});

		[
			{ mode: 'native', useNative: true, expectedAutofocus: true },
			{ mode: 'custom', useNative: false, expectedAutofocus: false }
		].forEach(({ mode, useNative, expectedAutofocus }) => {
			describe(mode, () => {

				beforeEach(() => {
					window.D2L.DialogMixin.preferNative = useNative;
				});

				it('should update autofocus on initial footer content', async() => {
					const el = await fixture(html`
						<d2l-dialog-confirm>
							<d2l-button slot="footer" primary>Yes</d2l-button>
							<d2l-button slot="footer">No</d2l-button>
						</d2l-dialog-confirm>
					`);

					const buttons = el.querySelectorAll('[slot="footer"]');
					expect(buttons[0].hasAttribute('autofocus')).to.be.false;
					expect(buttons[1].hasAttribute('autofocus')).to.equal(expectedAutofocus);
				});

				it('should update autofocus when footer content changes', async() => {
					const el = await fixture(html`
						<d2l-dialog-confirm>
							<d2l-button slot="footer" primary>Yes</d2l-button>
							<d2l-button slot="footer">No</d2l-button>
						</d2l-dialog-confirm>
					`);

					const noButton = el.querySelectorAll('[slot="footer"]')[1];
					expect(noButton.hasAttribute('autofocus')).to.equal(expectedAutofocus);
					const cancelButton = document.createElement('d2l-button');
					cancelButton.setAttribute('slot', 'footer');
					cancelButton.textContent = 'Cancel';

					el.insertBefore(cancelButton, noButton);
					await el.updateComplete;

					expect(cancelButton.hasAttribute('autofocus')).to.equal(expectedAutofocus);
					expect(noButton.hasAttribute('autofocus')).to.be.false;
				});

			});
		});

	});

});
