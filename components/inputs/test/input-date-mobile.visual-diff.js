import { open, reset } from './input-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-input-date-mobile', () => {

	const visualDiff = new VisualDiff('input-date-mobile', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 600, height: 500 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date-mobile.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	beforeEach(async() =>  {
		await reset(page, '#min-max');
		await reset(page, '#placeholder');
		await reset(page, '#value');
	});

	describe('open', () => {
		[
			'min-max',
			'placeholder',
			'value'
		].forEach((name) => {

			it(name, async function() {
				await open(page, `#${name}`);
				await page.waitForTimeout(100);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				await reset(page, `#${name}`);
			});
		});
	});

});
