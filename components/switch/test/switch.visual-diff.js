/*global forceFocusVisible */
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-switch', () => {

	const visualDiff = new VisualDiff('switch', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
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
			{ name: 'off', selector: '#off' },
			{ name: 'off-focus', selector: '#off', action: (selector) => page.$eval(selector, (elem) => forceFocusVisible(elem)) },
			{ name: 'off-disabled', selector: '#off-disabled' },
			{ name: 'off-hover', selector: '#off',
				action: async(selector) => {
					const d2lSwitch = await getSwitch(selector);
					await d2lSwitch.hover();
				}
			},
			{ name: 'on', selector: '#on' },
			{ name: 'on-focus', selector: '#on', action: (selector) => page.$eval(selector, (elem) => forceFocusVisible(elem)) },
			{ name: 'on-hover', selector: '#on',
				action: async(selector) => {
					const d2lSwitch = await getSwitch(selector);
					await d2lSwitch.hover();
				}
			},
			{ name: 'on-disabled', selector: '#on-disabled' },
			{ name: 'text-hidden', selector: '#text-hidden' },
			{ name: 'text-start', selector: '#text-start' },
			{ name: 'text-end', selector: '#text-end' },
			{ name: 'toggle on', selector: '#off', action: (selector) => page.$eval(selector, (elem) => elem.on = true) },
			{ name: 'toggle off', selector: '#on', action: (selector) => page.$eval(selector, (elem) => elem.on = false) },
			{ name: 'tooltip', selector: '#tooltip' },
			{ name: 'tooltip-focus', selector: '#tooltip', action: () => page.$eval('#tooltip > d2l-switch', (elem) => forceFocusVisible(elem)) }
		].forEach((info) => {

			it(info.name, async function() {
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
