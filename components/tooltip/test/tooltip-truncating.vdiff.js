import '../../button/button.js';
import '../../link/link.js';
import '../tooltip.js';
import { expect, fixture, focusElem, html, oneEvent } from '@brightspace-ui/testing';

const viewport = { width: 400 };

const shortText = 'Short Text';
const longText = 'Very Very Very Very Long Text';
const shortTooltipText = 'This tooltip will not show.';
const longTooltipText = 'Very Very Very Very Long Text - this tooltip will show because the text is truncating.';

function wrapTruncatingTooltip(content) {
	return html`
		<div style="border: 1px solid #cdd5dc; border-radius: 6px; height: 400px; padding: 20px; width: 200px;">
			<div id="content" style="display: block; text-align: center;">${content}</div>
		</div>
	`;
}

describe('tooltip-truncating', () => {
	[true, false].forEach(truncating => {
		it(`button${truncating ? '' : '-not'}-truncating`, async() => {
			const elem = await fixture(wrapTruncatingTooltip(html`
				<d2l-button id="button" style="max-width: 100%;">
					<span style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
						${truncating ? longText : shortText}
					</span>
				</d2l-button>
				<d2l-tooltip class="vdiff-include" for="button" show-truncated-only>
					${truncating ? longTooltipText : shortTooltipText}
				</d2l-tooltip>
			`), { viewport });
			const button = elem.querySelector('d2l-button');

			if (!truncating) await focusElem(button);
			else {
				focusElem(button);
				await oneEvent(elem.querySelector('d2l-tooltip'), 'd2l-tooltip-show');
			}
			await expect(elem.querySelector('#content')).to.be.golden();
		});

		it(`link${truncating ? '' : '-not'}-truncating`, async() => {
			const elem = await fixture(wrapTruncatingTooltip(html`
				<d2l-link id="link" href="https://www.d2l.com" lines="1" style="display: flex; justify-content: center;">
					${truncating ? longText : shortText}
				</d2l-link>
				<d2l-tooltip class="vdiff-include" for="link" show-truncated-only>
					${truncating ? longTooltipText : shortTooltipText}
				</d2l-tooltip>
			`), { viewport });
			const link = elem.querySelector('d2l-link');

			if (!truncating) await focusElem(link);
			else {
				focusElem(link);
				await oneEvent(elem.querySelector('d2l-tooltip'), 'd2l-tooltip-show');
			}
			await expect(elem.querySelector('#content')).to.be.golden();
		});
	});
});
