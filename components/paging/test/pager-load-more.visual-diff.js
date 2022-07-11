/*global forceFocusVisible */
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-pager-load-more', () => {

	const visualDiff = new VisualDiff('pager-load-more', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/paging/test/pager-load-more.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	const loadMore = selector => {
		return page.$eval(selector, elem => {
			elem.querySelector('d2l-pager-load-more').shadowRoot.querySelector('button').click();
		});
	};

	[
		{ name: 'no-more', selector: '#no-more' },
		{ name: 'item-count', selector: '#item-count' },
		{ name: 'no-item-count', selector: '#no-item-count' },
		{ name: 'hover', selector: '#item-count', action: selector => page.hover(`${selector} d2l-pager-load-more`) },
		{ name: 'focus', selector: '#item-count', action: selector => page.$eval(selector, elem => forceFocusVisible(elem.querySelector('d2l-pager-load-more'))) },
		{ name: 'load-more', selector: '#load-more', action: selector => loadMore(selector) }
	].forEach(info => {

		it(info.name, async function() {
			if (info.action) await info.action(info.selector);
			const rect = await visualDiff.getRect(page, info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
