import { getRect, open, reset } from './dropdown-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dropdown-menu', () => {

	const visualDiff = new VisualDiff('dropdown-menu', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-menu.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		const defaultViewportOptions = { width: 800, height: 800, deviceScaleFactor: 2 };
		await page.setViewport(defaultViewportOptions);
	});

	after(async() => await browser.close());

	afterEach(async function() {
		const dropdown = this.currentTest.value;
		if (dropdown) await reset(page, dropdown);
	});

	it('initially opened', async function() {
		const rect = await getRect(page, '#dropdown-menu-initially-opened');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('first-page', async function() {
		this.test.value = '#dropdown-menu'; // Needed for retries
		await open(page, '#dropdown-menu');
		const rect = await getRect(page, '#dropdown-menu');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	/* Prevent regression to DE37329: reopening caused extra bottom spacing */
	it('closed-reopened', async function() {
		this.test.value = '#dropdown-menu'; // Needed for retries
		await open(page, '#dropdown-menu');
		await reset(page, '#dropdown-menu');
		await open(page, '#dropdown-menu');
		const rect = await getRect(page, '#dropdown-menu');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with-header-footer', async function() {
		this.test.value = '#dropdown-menu-header-footer'; // Needed for retries
		await open(page, '#dropdown-menu-header-footer');
		const rect = await getRect(page, '#dropdown-menu-header-footer');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with-header-footer-mobile', async function() {
		console.log('before viewport');
		await page.setViewport({ width: 300, height: 1200, deviceScaleFactor: 2 });
		this.test.value = '#dropdown-menu-header-footer-mobile'; // Needed for retries
		console.log('before open');
		await open(page, '#dropdown-menu-header-footer-mobile');
		console.log('before screenshot');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		console.log('after screenshot');

	});

	it('with-nopadding-header-footer', async function() {
		this.test.value = '#dropdown-menu-header-footer-nopadding'; // Needed for retries
		await open(page, '#dropdown-menu-header-footer-nopadding');
		const rect = await getRect(page, '#dropdown-menu-header-footer-nopadding');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('dark theme', async function() {
		this.test.value = '#dark'; // Needed for retries
		await open(page, '#dark');
		const rect = await getRect(page, '#dark');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});
});
