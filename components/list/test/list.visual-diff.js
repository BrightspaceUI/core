import { hide, show } from '../../tooltip/test/tooltip-helper.js';
import { open, reset } from '../../dropdown/test/dropdown-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-list', () => {

	const visualDiff = new VisualDiff('list', import.meta.url);

	let browser, page;

	const closeDropdown = (selector) => {
		return reset(page, selector);
	};

	const focusMethod = (selector) => {
		return page.$eval(selector, (item) => {
			item.focus();
		});
	};

	const focusInput = (selector) => {
		return page.$eval(selector, (item) => {
			item.shadowRoot.querySelector('d2l-selection-input').focus();
		});
	};

	const focusLink = (selector) => {
		return page.$eval(selector, (item) => {
			item.shadowRoot.querySelector('a').focus();
		});
	};

	const focusButton = (selector) => {
		return page.$eval(selector, (item) => {
			item.shadowRoot.querySelector('button').focus();
		});
	};

	const hideTooltip = (selector) => {
		return hide(page, selector);
	};

	const hover = (selector) => {
		return page.hover(selector);
	};

	const openDropdown = (selector) => {
		return open(page, selector);
	};

	const showTooltip = (selector) => {
		return show(page, selector);
	};

	const scrollTo = (selector, y) => {
		return page.$eval(selector, (container, y) => {
			return new Promise(resolve => {
				container.scrollTo(0, y);
				setTimeout(resolve, 400);
			});
		}, y);
	};

	const wait = (selector, milliseconds) => {
		return page.$eval(selector, async(elem, milliseconds) => {
			await elem.updateComplete;
			await new Promise(resolve => setTimeout(resolve, milliseconds));
		}, milliseconds);
	};

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 1000, height: 6500 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
		page.on('console', msg => console.log(msg.text()));
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		{ category: 'nested', tests: [
			{ name: 'all-selected-1', selector: '#nested-all-selected', action: () => wait('#nested-all-selected d2l-list-header', 100) },
			{ name: 'all-selected-2', selector: '#nested-all-selected', action: () => wait('#nested-all-selected d2l-list-header', 100) },
			{ name: 'all-selected-3', selector: '#nested-all-selected', action: () => wait('#nested-all-selected d2l-list-header', 100) },
			{ name: 'all-selected-4', selector: '#nested-all-selected', action: () => page.waitForFunction(async() => {
				console.log(document.querySelector('#nested-all-selected d2l-list').getSelectionInfo(true).keys.length);
				await document.querySelector('#nested-all-selected d2l-list-header').updateComplete;
				return document.querySelector('#nested-all-selected d2l-list').getSelectionInfo(true).keys.length === 5;
			}) },
			{ name: 'all-selected-5', selector: '#nested-all-selected', action: () => page.waitForFunction(async() => {
				console.log(document.querySelector('#nested-all-selected d2l-list').getSelectionInfo(true).keys.length);
				await document.querySelector('#nested-all-selected d2l-list-header').updateComplete;
				return document.querySelector('#nested-all-selected d2l-list').getSelectionInfo(true).keys.length === 5;
			}) },
			{ name: 'all-selected-6', selector: '#nested-all-selected', action: () => wait('#nested-all-selected d2l-list-header', 100) },
			{ name: 'all-selected-7', selector: '#nested-all-selected', action: () => wait('#nested-all-selected d2l-list-header', 100) },
			{ name: 'all-selected-8', selector: '#nested-all-selected', action: () => wait('#nested-all-selected d2l-list-header', 100) },
			{ name: 'all-selected-9', selector: '#nested-all-selected', action: () => wait('#nested-all-selected d2l-list-header', 0) },
			{ name: 'all-selected-10', selector: '#nested-all-selected', action: () => wait('#nested-all-selected d2l-list-header', 0) },
			{ name: 'all-selected-11', selector: '#nested-all-selected', action: () => wait('#nested-all-selected d2l-list-header', 0) }
		] }
	].forEach((info) => {

		describe.only(info.category, () => {

			info.tests.forEach((info) => {
				afterEach(async function() {
					if (this.currentTest.value) {
						await this.currentTest.value();
					}
				});

				it(info.name, async function() {
					if (info.after) {
						this.test.value = info.after;
					}
					if (info.action) {
						await info.action();
					}
					/*await page.evaluate(() => {
						return new Promise(resolve => setTimeout(resolve, 0));
					});*/
					const rect = await (info.rect ? info.rect() : visualDiff.getRect(page, info.selector, 24));
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});

		});

	});

});
