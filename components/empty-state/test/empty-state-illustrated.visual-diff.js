import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-empty-state-illustrated', () => {

	const visualDiff = new VisualDiff('empty-state-illustrated', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(
			`${visualDiff.getBaseUrl()}/components/empty-state/test/empty-state-illustrated.visual-diff.html`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		await page.bringToFront();
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	[
		'normal',
		'normal-button',
		'normal-button-primary',
		'normal-link',
		'small',
		'small-button',
		'small-button-primary',
		'small-link',
		'custom-svg',
		'no-svg'
	]
		.forEach(name => {

			it(name, async function() {
				const selector = `#${name}`;
				const rect = await visualDiff.getRect(page, selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		});

});
