import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-empty-state-text', () => {

	const visualDiff = new VisualDiff('empty-state-text', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(
			`${visualDiff.getBaseUrl()}/components/empty-state/test/empty-state-text.visual-diff.html`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		await page.bringToFront();
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	it('simple', async function() {
		const rect = await visualDiff.getRect(page, '#simple');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('simple-button-wrap', async function() {
		const rect = await visualDiff.getRect(page, '#simple-button-wrap');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('simple-wrap', async function() {
		const rect = await visualDiff.getRect(page, '#simple-wrap');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('no-description', async function() {
		const rect = await visualDiff.getRect(page, '#no-description');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('no-action', async function() {
		const rect = await visualDiff.getRect(page, '#no-action');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('custom-subtle-button', async function() {
		const rect = await visualDiff.getRect(page, '#custom-subtle-button');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('custom-link', async function() {
		const rect = await visualDiff.getRect(page, '#custom-link');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
