import { getRect, open, reset } from './dropdown-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dropdown-menu', () => {

	const visualDiff = new VisualDiff('dropdown-menu', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-menu.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await reset(page, '#dropdown-menu');
		const defaultViewportOptions = { width: 800, height: 800, deviceScaleFactor: 2 };
		await page.setViewport(defaultViewportOptions);
	});

	after(async() => await browser.close());

	it('first-page', async function() {
		await open(page, '#dropdown-menu');
		const rect = await getRect(page, '#dropdown-menu');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	/* Prevent regression to DE37329: reopening caused etra bottom spacing */
	it('closed-reopened', async function() {
		await open(page, '#dropdown-menu');
		await reset(page, '#dropdown-menu');
		await open(page, '#dropdown-menu');
		const rect = await getRect(page, '#dropdown-menu');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with-header-footer', async function() {
		await open(page, '#dropdown-menu-header-footer');
		const rect = await getRect(page, '#dropdown-menu-header-footer');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with-header-footer-mobile', async function() {
		await page.setViewport({ width: 300, height: 800 });
		await open(page, '#dropdown-menu-header-footer-mobile');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		await reset(page, '#dropdown-menu-header-footer-mobile');
	});

	it('with-nopadding-header-footer', async function() {
		await open(page, '#dropdown-menu-header-footer-nopadding');
		const rect = await getRect(page, '#dropdown-menu-header-footer-nopadding');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('dark theme', async function() {
		await open(page, '#dark');
		const rect = await getRect(page, '#dark');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});
});
