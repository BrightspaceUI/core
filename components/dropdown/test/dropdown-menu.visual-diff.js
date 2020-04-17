const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const helper = require('./dropdown-helper.js');

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
		await helper.reset(page, '#dropdown-menu');
	});

	after(async() => await browser.close());

	it('first-page', async function() {
		await helper.open(page, '#dropdown-menu');
		const rect = await helper.getRect(page, '#dropdown-menu');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	/* Prevent regression to DE37329: reopening caused etra bottom spacing */
	it('closed-reopened', async function() {
		await helper.open(page, '#dropdown-menu');
		await helper.reset(page, '#dropdown-menu');
		await helper.open(page, '#dropdown-menu');
		const rect = await helper.getRect(page, '#dropdown-menu');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with-header-footer', async function() {
		await helper.open(page, '#dropdown-menu-header-footer');
		const rect = await helper.getRect(page, '#dropdown-menu-header-footer');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with-nopadding-header-footer', async function() {
		await helper.open(page, '#dropdown-menu-header-footer-nopadding');
		const rect = await helper.getRect(page, '#dropdown-menu-header-footer-nopadding');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});
});
