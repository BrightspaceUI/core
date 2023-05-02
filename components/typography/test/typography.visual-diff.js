import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-typography', function() {

	const visualDiff = new VisualDiff('typography', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
	});

	after(async() => await browser.close());

	const runDiff = () => {

		it('heading-1', async function() {
			const rect = await visualDiff.getRect(page, '#heading-1', 0);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('heading-2', async function() {
			const rect = await visualDiff.getRect(page, '#heading-2', 0);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('heading-3', async function() {
			const rect = await visualDiff.getRect(page, '#heading-3', 0);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('heading-4', async function() {
			const rect = await visualDiff.getRect(page, '#heading-4', 0);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('standard-body', async function() {
			const rect = await visualDiff.getRect(page, '#standard-body', 0);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('compact-body', async function() {
			const rect = await visualDiff.getRect(page, '#compact-body', 0);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('small-body', async function() {
			const rect = await visualDiff.getRect(page, '#small-body', 0);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('paragraph', async function() {
			const rect = await visualDiff.getRect(page, '#paragraph', 0);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('label', async function() {
			const rect = await visualDiff.getRect(page, '#label', 0);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('blockquote', async function() {
			const rect = await visualDiff.getRect(page, '#blockquote', 0);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('blockquote-rtl', async function() {
			const rect = await visualDiff.getRect(page, '#blockquote-rtl', 0);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	};

	describe('wide', function() {

		before(async() => {
			await page.setViewport({ width: 800, height: 1200, deviceScaleFactor: 2 });
			await page.goto(`${visualDiff.getBaseUrl()}/components/typography/test/typography.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		runDiff();

	});

	describe('narrow', function() {

		before(async() => {
			await page.setViewport({ width: 600, height: 1200, deviceScaleFactor: 2 });
			await page.goto(`${visualDiff.getBaseUrl()}/components/typography/test/typography.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		runDiff();

	});

});
