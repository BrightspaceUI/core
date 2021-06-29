import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-selection', () => {

	const visualDiff = new VisualDiff('selection', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/selection/test/selection.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	const runTest = (info) => {
		it(info.name, async function() {
			if (info.action) await info.action(info.selector);
			const rect = await visualDiff.getRect(page, info.rectSelector ? info.rectSelector : info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	};

	describe('action', () => {
		[
			{ name: 'text', selector: '#action-text' },
			{ name: 'text-focus', selector: '#action-text', action: selector => page.$eval(selector, elem => elem.focus()) },
			{ name: 'text-icon', selector: '#action-text-icon' },
			{ name: 'text-icon-focus', selector: '#action-text-icon', action: selector => page.$eval(selector, elem => elem.focus()) },
			{ name: 'disabled', selector: '#action-disabled' },
			{ name: 'disabled-focus', selector: '#action-disabled', action: selector => page.$eval(selector, elem => elem.focus()), rectSelector: '#action-disabled-container' },
			{ name: 'requires-selection-none', selector: '#action-requires-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'none', keys: [] }) },
			{ name: 'requires-selection-some', selector: '#action-requires-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'some', keys: [] }) },
			{ name: 'requires-selection-all', selector: '#action-requires-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'all', keys: [] }) }
		].forEach(runTest);
	});

	describe('checkbox', () => {
		[
			{ name: 'default', selector: '#checkbox' },
			{ name: 'focus', selector: '#checkbox', action: selector => page.$eval(selector, elem => elem.focus()) },
			{ name: 'selected', selector: '#checkbox-selected' },
			{ name: 'selected-focus', selector: '#checkbox-selected', action: selector => page.$eval(selector, elem => elem.focus()) }
		].forEach(runTest);
	});

	describe('select-all', () => {
		[
			{ name: 'default', selector: '#select-all' },
			{ name: 'focus', selector: '#select-all', action: selector => page.$eval(selector, elem => elem.focus()) },
			{ name: 'none-selected', selector: '#select-all-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'none', keys: [] }) },
			{ name: 'some-selected', selector: '#select-all-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'some', keys: [] }) },
			{ name: 'all-selected', selector: '#select-all-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'all', keys: [] }) }
		].forEach(runTest);
	});

	describe('summary', () => {
		[
			{ name: 'none-selected', selector: '#summary' },
			{ name: 'some-selected', selector: '#summary', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'some', keys: ['1', '2', '3'] }) },
			{ name: 'all-selected', selector: '#summary', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'all', keys: ['1', '2', '3', '4'] }) },
			{ name: 'no-selection-text', selector: '#summary-no-selection-text' },
			{ name: 'no-selection-text-selected', selector: '#summary-no-selection-text', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'some', keys: ['1', '2', '3'] }) }
		].forEach(runTest);
	});

	describe('mixin', () => {
		[
			{ name: 'none-selected', selector: '#mixin-none-selected' },
			{ name: 'some-selected', selector: '#mixin-some-selected' },
			{ name: 'all-selected', selector: '#mixin-all-selected' },
			{ name: 'select-all', selector: '#mixin-none-selected', action: selector => page.$eval(selector, elem => elem.querySelector('d2l-selection-select-all').shadowRoot.querySelector('d2l-input-checkbox').shadowRoot.querySelector('input').click()) },
			{ name: 'select-none', selector: '#mixin-all-selected', action: selector => page.$eval(selector, elem => elem.querySelector('d2l-selection-select-all').shadowRoot.querySelector('d2l-input-checkbox').shadowRoot.querySelector('input').click()) },
			{ name: 'select-all-from-some', selector: '#mixin-some-selected', action: selector => page.$eval(selector, elem => elem.querySelector('d2l-selection-select-all').shadowRoot.querySelector('d2l-input-checkbox').shadowRoot.querySelector('input').click()) }
		].forEach(runTest);
	});

});
