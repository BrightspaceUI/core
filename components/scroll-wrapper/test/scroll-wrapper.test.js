import '../demo/scroll-wrapper-test.js';
import { expect, fixture, focusElem, html, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { SCROLL_AMOUNT } from '../scroll-wrapper.js';

async function getScrollWrapper({ stickyContent, scroll, splitScrollers } = {}) {
	// Browsers seem to do scroll rounding differently, hence we force the client width(max-width - 2px borders) to be easily divisible so no rounding occurs when multiplied by the SCROLL_AMOUNT
	const el = await fixture(html`<div style="max-width: 502px;">
		<d2l-test-scroll-wrapper
			width="3000"
			scroll=${ifDefined(scroll)}
			?sticky-content=${stickyContent}
			?split-scrollers=${splitScrollers}>
		</d2l-test-scroll-wrapper>
	</div>`);
	return el.querySelector('d2l-test-scroll-wrapper').shadowRoot.querySelector('d2l-scroll-wrapper');
}

describe('scroll-wrapper', () => {
	describe('scrolling', () => {

		it('scrolls right all scrollers', async() => {
			const wrapper = await getScrollWrapper({ splitScrollers: true, scroll: 1 }); //Force left border
			wrapper._scrollRight();
			await oneEvent(wrapper._container, 'scrollend');
			for (const scroller of wrapper._allScrollers)
				expect(scroller.scrollLeft).to.equal(1 + Math.round(500 * SCROLL_AMOUNT)); // 502 max-width - 2px inline border
		});

		it('scrolls left all scrollers', async() => {
			const wrapper = await getScrollWrapper({ splitScrollers: true, scroll: 1000 });
			wrapper._scrollLeft();
			await oneEvent(wrapper._container, 'scrollend');
			for (const scroller of wrapper._allScrollers)
				expect(scroller.scrollLeft).to.equal(Math.round(1000 - 500 * SCROLL_AMOUNT)); // 502 max-width - 2px inline border
		});

		it('scrolls with offset area', async() => {
			const wrapper = await getScrollWrapper({ scroll: 1, stickyContent: true });
			wrapper._scrollRight();
			await oneEvent(wrapper._container, 'scrollend');
			for (const scroller of wrapper._allScrollers)
				expect(scroller.scrollLeft).to.equal(Math.round(1 + 300 * SCROLL_AMOUNT)); // 502 max-width - 2px inline border - 100 offset
		});

		it('scrolls elements behind sticky content into view', async() => {
			const wrapper = await getScrollWrapper({ scroll: 150, stickyContent: true }); // scroll 150 to hide button under sticky content;
			await focusElem(wrapper.querySelector('.not-sticky button'));
			await oneEvent(wrapper._container, 'scrollend');
			for (const scroller of wrapper._allScrollers)
				expect(scroller.scrollLeft).to.be.lessThan(10); // scroll left seems to vary based on browser/environment so exact value makes it flaky
		});

	});
});
