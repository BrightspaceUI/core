import '../dialog.js';
import { clickElem, expect, fixture, focusElem, html, oneEvent, sendKeys } from '@brightspace-ui/testing';
import { footer, general } from './dialog-shared-contents.js';

describe('dialog-mixin', () => {

	[/*'native',*/ 'custom'].forEach((type) => {

		describe(type, () => {
			before(async() => {
				window.D2L.DialogMixin.preferNative = type === 'native';
			});

			describe('generic', () => {
				let dialog;
				beforeEach(async() => {
					const elem = await fixture(html`
						<div>
							<d2l-button>Open Dialog</d2l-button>
							<d2l-dialog title-text="Dialog Title" width="400">
								${general}${footer}
							</d2l-dialog>
						</div>
					`, { viewport: { width: 800, height: 500 } });
					dialog = elem.querySelector('d2l-dialog');
					await focusElem(elem.querySelector('d2l-button'));
				});

				[
					{ name: 'initial-closed' },
					{ name: 'closed', action: async() => {
						dialog.opened = true;
						await oneEvent(dialog, 'd2l-dialog-open');
						dialog.opened = false;
						await oneEvent(dialog, 'd2l-dialog-close');
					} },
					{ name: 'abort', action: async() => {
						dialog.opened = true;
						await oneEvent(dialog, 'd2l-dialog-open');
						clickElem(dialog.shadowRoot.querySelector('d2l-button-icon'));
						await oneEvent(dialog, 'd2l-dialog-close');
					} },
					{ name: 'escape', action: async() => {
						dialog.opened = true;
						await oneEvent(dialog, 'd2l-dialog-open');
						sendKeys('press', 'Escape');
						await oneEvent(dialog, 'd2l-dialog-close');
					} },
				].forEach(({ name, action }) => {
					it(name, async() => {
						if (action) await action();
						await expect(document).to.be.golden();
					});
				});
			});
		});
	});
});
