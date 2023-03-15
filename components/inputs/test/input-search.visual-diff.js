import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

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
		await focusWithKeyboard(page, '#no-value');
		const rect = await visualDiff.getRect(page, '#no-value');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('focus-search-button', async function() {
		await focusWithKeyboard(page, ['#no-value', 'd2l-button-icon[icon="tier1:search"]']);
		const rect = await visualDiff.getRect(page, '#no-value');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('focus-clear-button', async function() {
		await focusWithKeyboard(page, ['#has-value', 'd2l-button-icon[icon="tier1:close-default"]']);
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
