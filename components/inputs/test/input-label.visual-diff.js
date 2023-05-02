import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-input-label', () => {

	const visualDiff = new VisualDiff('input-label', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1500 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-label.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'wc-wrap',
		'wc-wrap-required',
		'wc-ref',
		'wc-ref-required',
		'sass-wrap',
		'sass-wrap-required',
		'sass-ref',
		'sass-ref-required',
		'wc-fieldset',
		'wc-fieldset-required',
		'wc-fieldset-manual',
		'wc-fieldset-manual-required'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
