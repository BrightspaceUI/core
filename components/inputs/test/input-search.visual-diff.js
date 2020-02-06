const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-search', () => {

	const visualDiff = new VisualDiff('input-search', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-search.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	async function getShadowElem(id, selector) {
		return await page.evaluateHandle(
			`document.querySelector('#${id}').shadowRoot.querySelector('${selector}')`
		);
	}

	async function getClearButton(id) {
		return getShadowElem(id, 'd2l-button-icon[icon="tier1:close-default"]');
	}

	async function getSearchButton(id) {
		return getShadowElem(id, 'd2l-button-icon[icon="tier1:search"]');
	}

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

	it('focus-search-button', async function() {
		const searchButton = await getSearchButton('no-value');
		searchButton.focus();
		const rect = await visualDiff.getRect(page, '#no-value');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('focus-clear-button', async function() {
		const clearButton = await getClearButton('has-value');
		clearButton.focus();
		const rect = await visualDiff.getRect(page, '#has-value');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('hover-search-button', async function() {
		const searchButton = await getSearchButton('no-value');
		await searchButton.hover();
		const rect = await visualDiff.getRect(page, '#no-value');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('hover-clear-button', async function() {
		const clearButton = await getClearButton('has-value');
		await clearButton.hover();
		const rect = await visualDiff.getRect(page, '#has-value');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
