import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-card-footer-link', () => {

	const visualDiff = new VisualDiff('card-footer-link', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/card/test/card-footer-link.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		{ name: 'no-secondary', selector: '#no-secondary' },
		{ name: 'no-secondary-focus', selector: '#no-secondary-focus', action: (selector) => focusWithKeyboard(page, selector) },
		{ name: 'secondary-notification', selector: '#secondary-notification' },
		{ name: 'secondary-notification-focus', selector: '#secondary-notification-focus', action: (selector) => focusWithKeyboard(page, selector) },
		{ name: 'secondary-count', selector: '#secondary-count' },
		{ name: 'secondary-count-focus', selector: '#secondary-count-focus', action: (selector) => focusWithKeyboard(page, selector) }
	].forEach((info) => {

		it(info.name, async function() {
			if (info.action) await info.action(info.selector);
			if (info.action) await page.waitForTimeout(100);
			const rect = await visualDiff.getRect(page, info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
