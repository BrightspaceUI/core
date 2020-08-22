const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-card', () => {

	const visualDiff = new VisualDiff('card', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 3700 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/card/test/card.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		{ name: 'header-content', selector: '#header-content' },
		{ name: 'footer', selector: '#footer' },
		{ name: 'align-center', selector: '#align-center' },
		{ name: 'badge', selector: '#badge' },
		{ name: 'actions', selector: '#actions' },
		{ name: 'actions-focus', selector: '#actions', action: (selector) => page.$eval(`${selector} > d2l-button-icon`, (elem) => elem.focus()) },
		{ name: 'actions-voa', selector: '#actions-voa' },
		{ name: 'actions-rtl', selector: '#actions-rtl' },
		{ name: 'no-link-focus', selector: '#header-content', action: (selector) => page.$eval(selector, (elem) => elem.focus()) },
		{ name: 'subtle', selector: '#subtle' },
		{ name: 'link', selector: '#link' },
		{ name: 'link-focus', selector: '#link', action: (selector) => page.$eval(selector, (elem) => elem.focus()) },
		{ name: 'link-actions-focus', selector: '#link', action: (selector) => page.$eval(`${selector} > d2l-button-icon`, (elem) => elem.focus()) },
		{ name: 'link-footer-focus', selector: '#link', action: (selector) => page.$eval(`${selector} > d2l-button`, (elem) => elem.focus()) }
	].forEach((info) => {

		it(info.name, async function() {
			const rect = await visualDiff.getRect(page, info.selector);
			if (info.action) await info.action(info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
