import { focusWithKeyboard, focusWithMouse, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-button-move', () => {

	const visualDiff = new VisualDiff('button-move', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/button-move.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		{ name: 'normal', selector: '#normal' },
		{ name: 'hover', selector: '#normal', action: selector => page.hover(selector)  },
		{ name: 'keyboard-focus', selector: '#normal', action: selector => focusWithKeyboard(page, selector) },
		{ name: 'keyboard-mouse', selector: '#normal', action: selector => focusWithMouse(page, selector) },
		{ name: 'disabled', selector: '#disabled' },
		{ name: 'disabled-tooltip', selector: '#disabled-tooltip', action: selector => focusWithKeyboard(page, `${selector} d2l-button-move`) }
	].forEach(info => {

		it(info.name, async function() {
			if (info.action) await info.action(info.selector);
			const rect = await visualDiff.getRect(page, info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
