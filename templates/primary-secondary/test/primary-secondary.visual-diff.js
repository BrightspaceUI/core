const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-template-primary-secondary', () => {
	const visualDiff = new VisualDiff('primary-secondary', __dirname);
	let browser;
	let page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
	});

	after(() => browser.close());

	describe('desktop', () => {
		before(async() => {
			await page.setViewport({width: 930, height: 930, deviceScaleFactor: 2});
		});

		[
			{ name: 'normal', fileName: 'primary-secondary-desktop.visual-diff.html' },
			{ name: 'larger-than-viewport-height', fileName: 'primary-secondary-desktop-large.visual-diff.html' },
			{ name: 'footer-hidden', fileName: 'primary-secondary-desktop-footer-hidden.visual-diff.html' }
		].forEach((entry) => {
			it(entry.name, async function() {
				await page.goto(`${visualDiff.getBaseUrl()}/templates/primary-secondary/test/${entry.fileName}`, {waitUntil: ['networkidle0', 'load']});
				await page.bringToFront();
				const rect = await visualDiff.getRect(page, 'd2l-template-primary-secondary', 0);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});
});
