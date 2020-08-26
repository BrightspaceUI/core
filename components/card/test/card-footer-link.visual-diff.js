const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-card-footer-link', () => {

	const visualDiff = new VisualDiff('card-footer-link', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
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
		{ name: 'no-secondary-focus', selector: '#no-secondary', action: (selector) => page.$eval(selector, (elem) => elem.focus()) },
		{ name: 'secondary-notification', selector: '#secondary-notification' },
		{ name: 'secondary-notification-focus', selector: '#secondary-notification', action: (selector) => page.$eval(selector, (elem) => elem.focus()) },
		{ name: 'secondary-notification-rtl', selector: '#secondary-notification-rtl' },
		{ name: 'secondary-count', selector: '#secondary-count' },
		{ name: 'secondary-count-focus', selector: '#secondary-count', action: (selector) => page.$eval(selector, (elem) => elem.focus()) },
		{ name: 'secondary-count-focus-rtl', selector: '#secondary-count-rtl', action: (selector) => page.$eval(selector, (elem) => elem.focus()) }
	].forEach((info) => {

		it(info.name, async function() {
			const rect = await visualDiff.getRect(page, info.selector);
			if (info.action) await info.action(info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
