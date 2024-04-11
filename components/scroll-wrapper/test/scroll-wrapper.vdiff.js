import '../demo/scroll-wrapper-test.js';
import { expect, fixture, focusElem, html, waitUntil } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

function wrapScrollWrapper(scrollWrapper) {
	return html`<div style="max-width: 300px;">${scrollWrapper}</div>`;
}

describe('scroll-wrapper', () => {
	[true, false].forEach(rtl => {
		[
			{ actions: 'show-actions' },
			{ actions: 'hide-actions', hideActions: true },
			{ actions: 'split-scrollers', splitScrollers: true }
		].forEach(({ actions, hideActions, splitScrollers }) => {
			[
				{ size: 'smaller', width: 200 },
				{ size: 'same', width: 300 },
				{ size: 'overflow-right', width: 400 },
				{ size: 'overflow-both', width: 400, scroll: 50 },
				{ size: 'overflow-left', width: 400, scroll: 100 }
			].forEach(({ size, width, scroll }) => {
				it(`${actions}-${size}${rtl ? '-rtl' : ''}`, async() => {
					const elem = await fixture(wrapScrollWrapper(html`
						<d2l-test-scroll-wrapper
							class="vdiff-include"
							?hide-actions="${hideActions}"
							?split-scrollers="${splitScrollers}"
							width="${width}"
							scroll="${ifDefined(scroll)}"></d2l-test-scroll-wrapper>
					`), { rtl });
					await expect(elem).to.be.golden();
				});
			});
		});

		// skip until this is resolved: https://issues.chromium.org/issues/333414300
		if (!rtl) {
			it(`split-scrollers-secondary-focus-scroll${rtl ? '-rtl' : ''}`, async() => {
				const elem = await fixture(wrapScrollWrapper(html`<d2l-test-scroll-wrapper width="400" split-scrollers class="vdiff-include"></d2l-test-scroll-wrapper>`), { rtl });
				const scrollWrapper = elem.querySelector('d2l-test-scroll-wrapper');
				const innerScrollWrapper = scrollWrapper.shadowRoot.querySelector('d2l-scroll-wrapper');
				await waitUntil(() => !innerScrollWrapper._syncDriver); // Wait until scrollbars synced before causing additional scroll

				await focusElem(scrollWrapper.shadowRoot.querySelector('button'));
				await expect(elem).to.be.golden();
			});
		}
	});

	describe('focus', () => {
		it('show-actions', async() => {
			const elem = await fixture(wrapScrollWrapper(html`<d2l-test-scroll-wrapper width="400" class="vdiff-include"></d2l-test-scroll-wrapper>`));
			await focusElem(elem.querySelector('d2l-test-scroll-wrapper'));

			await expect(elem).to.be.golden();
		});

		it('split-scrollers', async() => {
			const elem = await fixture(wrapScrollWrapper(html`<d2l-test-scroll-wrapper width="400" split-scrollers class="vdiff-include"></d2l-test-scroll-wrapper>`));
			await focusElem(elem.querySelector('d2l-test-scroll-wrapper'));

			await expect(elem).to.be.golden();
		});
	});

	describe('print', () => {
		it('hide-actions', async() => {
			const elem = await fixture(
				wrapScrollWrapper(html`<d2l-test-scroll-wrapper width="400" scroll="50" class="vdiff-include"></d2l-test-scroll-wrapper>`),
				{ media: 'print' }
			);

			await expect(elem).to.be.golden();
		});

		it('split-scrollers', async() => {
			const elem = await fixture(
				wrapScrollWrapper(html`<d2l-test-scroll-wrapper width="400" scroll="50" split-scrollers class="vdiff-include"></d2l-test-scroll-wrapper>`),
				{ media: 'print' }
			);

			await expect(elem).to.be.golden();
		});
	});
});
