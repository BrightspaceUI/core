import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-input-search', () => {

	const visualDiff = new VisualDiff('input-search', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-search.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	[
		'no-value',
		'has-value',
		'no-clear',
		'disabled',
		'placeholder',
		'placeholder-disabled',
		'padding',
		'flexbox'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('focus-input', async function() {
		await page.$eval('#no-value', (elem) => elem.focus());
		const rect = await visualDiff.getRect(page, '#no-value');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
