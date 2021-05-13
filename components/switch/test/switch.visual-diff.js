/*global forceFocusVisible */
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-switch', () => {

	const visualDiff = new VisualDiff('switch', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		page.on('console', msg => console.log(msg.text()));
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	describe('ltr', () => {

		async function getShadowElem(id, selector) {
			return await page.evaluateHandle(
				`document.querySelector('${id}').shadowRoot.querySelector('${selector}')`
			);
		}

		async function getSwitch(id) {
			return getShadowElem(id, '.d2l-switch-inner');
		}

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/switch/test/switch.visual-diff.html?dir=ltr`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		[
			{ name: 'tooltip-focus1', selector: '#tooltip', action: () => page.$eval('#tooltip > d2l-switch', (elem) => forceFocusVisible(elem)) },
			{ name: 'tooltip-focus2', selector: '#tooltip', action: () => page.$eval('#tooltip > d2l-switch', (elem) => forceFocusVisible(elem)) },
			{ name: 'tooltip-focus3', selector: '#tooltip', action: () => page.$eval('#tooltip > d2l-switch', (elem) => forceFocusVisible(elem)) },
			{ name: 'tooltip-focus4', selector: '#tooltip', action: () => page.$eval('#tooltip > d2l-switch', (elem) => forceFocusVisible(elem)) },
			{ name: 'tooltip-focus5', selector: '#tooltip', action: () => page.$eval('#tooltip > d2l-switch', (elem) => forceFocusVisible(elem)) },
			{ name: 'tooltip-focus6', selector: '#tooltip', action: () => page.$eval('#tooltip > d2l-switch', (elem) => forceFocusVisible(elem)) },
			{ name: 'tooltip-focus7', selector: '#tooltip', action: () => page.$eval('#tooltip > d2l-switch', (elem) => forceFocusVisible(elem)) },
			{ name: 'tooltip-focus8', selector: '#tooltip', action: () => page.$eval('#tooltip > d2l-switch', (elem) => forceFocusVisible(elem)) }
		].forEach((info) => {

			it.only(info.name, async function() {
				const rect = await visualDiff.getRect(page, info.selector);
				if (info.action) await info.action(info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

	});

	describe('rtl', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/switch/test/switch.visual-diff.html?dir=rtl`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		[
			{ name: 'off', selector: '#off' },
			{ name: 'on', selector: '#on' }
		].forEach(info => {

			it(info.name, async function() {
				const rect = await visualDiff.getRect(page, info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		});

	});

});
