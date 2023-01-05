/*global forceFocusVisible */
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-collapsible-panel', () => {

	const visualDiff = new VisualDiff('collapsible-panel', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);

		// TODO: remove this before merge
		page.on('console', (msg) => {
			console.log(msg.text());
		});
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	function focusElement(selector) {
		return page.$eval(selector, (elem) => forceFocusVisible(elem));
	}

	describe('ltr', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/collapsible-panel/test/collapsible-panel.visual-diff.html?dir=ltr`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		[
			{ name: 'default', selector: '#default' },
			{ name: 'default-focus', selector: '#default', action: focusElement },
		].forEach((info) => {

			it(info.name, async function() {
				const rect = await visualDiff.getRect(page, info.selector);
				if (info.action) await info.action(info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('rtl', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/collapsible-panel/test/collapsible-panel.visual-diff.html?dir=rtl`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		[
			{ name: 'default', selector: '#default' },
			{ name: 'default-focus', selector: '#default', action: focusElement },
		].forEach((info) => {

			it(info.name, async function() {
				const rect = await visualDiff.getRect(page, info.selector);
				if (info.action) await info.action(info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});
});
