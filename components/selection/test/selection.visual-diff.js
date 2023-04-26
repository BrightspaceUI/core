import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-selection', () => {

	const visualDiff = new VisualDiff('selection', import.meta.url);

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

	const radioKeyUp = async(page, selector, keyCode) => {
		await focusWithKeyboard(page, selector);
		return page.$eval(selector, (elem, keyCode) => {
			const event = new CustomEvent('keyup', {
				bubbles: true,
				cancelable: true,
				composed: true
			});
			event.keyCode = keyCode;
			event.code = keyCode;
			elem.shadowRoot.querySelector('[role="radio"]').dispatchEvent(event);
		}, keyCode);
	};

	const scrollIntoView = selector => {
		return page.$eval(selector, element => element.scrollIntoView());
	};

	describe('action', () => {
		[
			{ name: 'text', selector: '#action-text' },
			{ name: 'text-focus', selector: '#action-text', action: selector => focusWithKeyboard(page, selector) },
			{ name: 'text-icon', selector: '#action-text-icon' },
			{ name: 'text-icon-focus', selector: '#action-text-icon', action: selector => focusWithKeyboard(page, selector) },
			{ name: 'disabled', selector: '#action-disabled' },
			{ name: 'disabled-focus', selector: '#action-disabled', action: selector => focusWithKeyboard(page, selector), rectSelector: '#action-disabled-container' },
			{ name: 'requires-selection-none', selector: '#action-requires-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'none', keys: [] }) },
			{ name: 'requires-selection-some', selector: '#action-requires-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'some', keys: [] }) },
			{ name: 'requires-selection-all', selector: '#action-requires-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'all', keys: [] }) }
		].forEach(runTest);
	});

	describe('controls', () => {
		[
			{ name: 'minimal', selector: '#controls', action: () => scrollIntoView('#controls') },
			{ name: 'with-actions', selector: '#controls-with-actions', action: () => scrollIntoView('#controls-with-actions') },
			{ name: 'with-pageable', selector: '#controls-with-pageable', action: () => scrollIntoView('#controls-with-pageable') },
			{ name: 'with-pageable-more', selector: '#controls-with-pageable-more', action: () => scrollIntoView('#controls-with-pageable-more') },
			{ name: 'with-selection-pageable', selector: '#controls-with-selection-pageable', action: () => scrollIntoView('#controls-with-selection-pageable') },
			{ name: 'with-custom-no-selection-text', selector: '#controls-with-custom-no-selection-text', action: () => scrollIntoView('#controls-with-custom-no-selection-text') },
		].forEach(runTest);
	});

	describe('dropdown', () => {
		[
			{ name: 'text', selector: '#dropdown-text' },
			{ name: 'text-focus', selector: '#dropdown-text', action: selector => focusWithKeyboard(page, selector) },
			{ name: 'disabled', selector: '#dropdown-disabled' },
			{ name: 'disabled-focus', selector: '#dropdown-disabled', action: selector => focusWithKeyboard(page, selector), rectSelector: '#dropdown-disabled-container' },
			{ name: 'requires-selection-none', selector: '#dropdown-requires-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'none', keys: [] }) },
			{ name: 'requires-selection-some', selector: '#dropdown-requires-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'some', keys: [] }) },
			{ name: 'requires-selection-all', selector: '#dropdown-requires-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'all', keys: [] }) }
		].forEach(runTest);
	});

	describe('checkbox', () => {
		[
			{ name: 'default', selector: '#checkbox' },
			{ name: 'focus', selector: '#checkbox', action: selector => focusWithKeyboard(page, selector) },
			{ name: 'click', selector: '#checkbox', action: selector => page.$eval(selector, elem => elem.shadowRoot.querySelector('d2l-input-checkbox').shadowRoot.querySelector('input').click()) },
			{ name: 'selected', selector: '#checkbox-selected' },
			{ name: 'skeleton', selector: '#checkbox-skeleton' },
			{ name: 'selected-focus', selector: '#checkbox-selected', action: selector => focusWithKeyboard(page, selector) },
			{ name: 'selected-click', selector: '#checkbox-selected', action: selector => page.$eval(selector, elem => elem.shadowRoot.querySelector('d2l-input-checkbox').shadowRoot.querySelector('input').click()) },
		].forEach(runTest);
	});

	describe('radio', () => {
		[
			{ name: 'default', selector: '#radio' },
			{ name: 'focus', selector: '#radio', action: selector => focusWithKeyboard(page, selector) },
			{ name: 'click', selector: '#radio', action: selector => page.$eval(selector, elem => elem.shadowRoot.querySelector('[role="radio"]').click()) },
			{ name: 'space', selector: '#radio-space', action: selector => radioKeyUp(page, selector, 32) },
			{ name: 'selected', selector: '#radio-selected' },
			{ name: 'skeleton', selector: '#radio-skeleton' },
			{ name: 'selected-focus', selector: '#radio-selected', action: selector => focusWithKeyboard(page, selector) },
			{ name: 'selected-click', selector: '#radio-selected', action: selector => page.$eval(selector, elem => elem.shadowRoot.querySelector('[role="radio"]').click()) }
		].forEach(runTest);
	});

	describe('select-all', () => {
		[
			{ name: 'default', selector: '#select-all' },
			{ name: 'disabled', selector: '#select-all-disabled' },
			{ name: 'focus', selector: '#select-all', action: selector => focusWithKeyboard(page, selector) },
			{ name: 'none-selected', selector: '#select-all-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'none', keys: [] }) },
			{ name: 'some-selected', selector: '#select-all-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'some', keys: [] }) },
			{ name: 'all-selected', selector: '#select-all-selection', action: selector => page.$eval(selector, elem => elem.selectionInfo = { state: 'all', keys: [] }) }
		].forEach(runTest);
	});

	describe('select-all-pages', () => {
		[
			{ name: 'none-selected', selector: '#select-all-pages-none-selected' },
			{ name: 'some-selected', selector: '#select-all-pages-some-selected' },
			{ name: 'all-selected', selector: '#select-all-pages-all-selected' },
			{ name: 'select-all-pages', selector: '#select-all-pages-all-selected', action: async(selector) => {
				await page.reload(); // Needed for retries
				await page.$eval(selector, elem => {
					elem.querySelector('d2l-selection-select-all-pages').shadowRoot.querySelector('d2l-button-subtle').shadowRoot.querySelector('button').click();
				});
			} },
			{ name: 'add-item', selector: '#select-all-pages-all-selected', action: async(selector) => {
				await page.reload(); // Needed for retries
				await page.$eval(selector, elem => {
					elem.querySelector('d2l-selection-select-all-pages').shadowRoot.querySelector('d2l-button-subtle').shadowRoot.querySelector('button').click();
					const item = document.createElement('li');
					const input = document.createElement('d2l-selection-input');
					input.key = 'key4';
					input.label = 'Item 4';
					item.appendChild(input);
					item.appendChild(document.createTextNode('Item 4'));
					elem.querySelector('ul').appendChild(item);
				});
			} },
			{ name: 'unselect-item', selector: '#select-all-pages-all-selected', action: async(selector) => {
				await page.$eval(selector, elem => {
					const input = elem.querySelector('d2l-selection-input');
					if (input.selected) { // Do not click on retries
						input.shadowRoot.querySelector('d2l-input-checkbox').shadowRoot.querySelector('input').click();
					}
				});
			} }
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

	['mixin', 'external-to-mixin'].forEach(type => {
		describe(`${type}-multiple`, () => {
			[
				{ name: 'none-selected', selector: `#${type}-multiple-none-selected` },
				{ name: 'some-selected', selector: `#${type}-multiple-some-selected` },
				{ name: 'all-selected', selector: `#${type}-multiple-all-selected` },
				{ name: 'select-all', selector: `#${type}-multiple-none-selected`, action: selector => page.$eval(selector, elem => elem.querySelector('d2l-selection-select-all').shadowRoot.querySelector('d2l-input-checkbox').shadowRoot.querySelector('input').click()) },
				{ name: 'select-none', selector: `#${type}-multiple-all-selected`, action: selector => page.$eval(selector, elem => elem.querySelector('d2l-selection-select-all').shadowRoot.querySelector('d2l-input-checkbox').shadowRoot.querySelector('input').click()) },
				{ name: 'select-all-from-some', selector: `#${type}-multiple-some-selected`, action: selector => page.$eval(selector, elem => elem.querySelector('d2l-selection-select-all').shadowRoot.querySelector('d2l-input-checkbox').shadowRoot.querySelector('input').click()) }
			].forEach(runTest);
		});

		describe(`${type}-single`, () => {
			[
				{ name: 'none-selected', selector: `#${type}-single-none-selected` },
				{ name: 'one-selected', selector: `#${type}-single-one-selected` },
				{ name: 'select', selector: `#${type}-single-none-selected`, action: selector => page.$eval(selector, elem => elem.querySelector('[key="key1"]').selected = true) }
			].forEach(runTest);
		});
	});

	describe('mixin-single', () => {
		afterEach(async() => {
			await page.reload(); // Needed for retries
		});

		[
			{ name: 'right-arrow', selector: '#mixin-single-right-arrow', action: selector => radioKeyUp(page, `${selector} [selected]`, 39) },
			{ name: 'left-arrow', selector: '#mixin-single-left-arrow', action: selector => radioKeyUp(page, `${selector} [selected]`, 37) },
			{ name: 'right-arrow-rtl', selector: '#mixin-single-right-arrow-rtl', action: selector => radioKeyUp(page, `${selector} [selected]`, 39) },
			{ name: 'left-arrow-rtl', selector: '#mixin-single-left-arrow-rtl', action: selector => radioKeyUp(page, `${selector} [selected]`, 37) },
			{ name: 'down-arrow', selector: '#mixin-single-down-arrow', action: selector => radioKeyUp(page, `${selector} [selected]`, 40) },
			{ name: 'up-arrow', selector: '#mixin-single-up-arrow', action: selector => radioKeyUp(page, `${selector} [selected]`, 38) },
			{ name: 'wrap-first', selector: '#mixin-single-wrap-first', action: selector => radioKeyUp(page, `${selector} [selected]`, 40) },
			{ name: 'wrap-last', selector: '#mixin-single-wrap-last', action: selector => radioKeyUp(page, `${selector} [selected]`, 38) }
		].forEach(runTest);
	});

});
