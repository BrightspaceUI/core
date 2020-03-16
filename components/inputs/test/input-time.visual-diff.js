const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

function getOpenEvent(page, selector) {
	return page.$eval(selector, (elem) => {
		return new Promise((resolve) => {
			elem.shadowRoot.querySelector('d2l-dropdown').addEventListener('d2l-dropdown-open', resolve, { once: true });
		});
	});
}

async function open(page, selector) {
	const openEvent = getOpenEvent(page, selector);
	await page.$eval(selector, (elem) => {
		const dropdown = elem.shadowRoot.querySelector('d2l-dropdown');
		return new Promise((resolve) => {
			dropdown.querySelector('[dropdown-content]').addEventListener('animationend', () => resolve(), { once: true });
			dropdown.toggleOpen();
		});
	});
	return openEvent;
}

describe('d2l-input-time', () => {

	const visualDiff = new VisualDiff('input-time', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 300, height: 600, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-time.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		'basic',
		'disabled',
		'labelled',
		'label-hidden',
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('basic-focus', async function() {
		await page.$eval('#basic', (elem) => elem.focus());
		const rect = await visualDiff.getRect(page, '#basic');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	[
		'time-dropdown',
		'time-dropdown-scrolled',
	].forEach((name) => {
		it(name, async function() {
			await open(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});
	});

});
