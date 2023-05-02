
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-overflow-group', () => {

	const visualDiff = new VisualDiff('overflow-group', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/overflow-group/test/overflow-group.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		// some tests were being excecuted before icons had time to load asnycronously causing
		// the tests to be flaky, the 500ms delay ensures they have loaded before any tests begin execution
		await page.waitForTimeout(500);
		await page.bringToFront();
	});

	async function getShadowElem(id, selector) {
		return await page.evaluateHandle(
			`document.querySelector('${id}').shadowRoot.querySelector('${selector}')`
		);
	}

	after(async() => await browser.close());

	const minMaxTests = [
		{
			name: 'more-than-max-to-show'
		},
		{
			name: 'less-than-min-to-show'
		},
		{
			name: 'between-min-max-to-show'
		},
		{
			name: 'exactly-max-to-show'
		}
	];

	const hiddenButtonTests = [
		{
			name: 'ignores-hidden-button',
		}
	];
	const autoShow = [
		{
			name: 'auto-show-small',
			action: async(selector) => {
				const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown-mini');
				await overflowMenu.click();
			}
		},
		{
			name: 'auto-show',
			action: async(selector) => {
				const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown');
				await overflowMenu.click();
			}
		},
		{
			name: 'auto-show-add-later',
			action: async(selector) => {
				await page.$eval(selector, async(elem) => {
					elem.setAttribute('auto-show', 'auto-show');
					await elem.updateComplete;
				});
			}
		}
	];
	const iconType = [
		{
			name: 'opener-type-mini-menu',
			action: async() => {
				await page.mouse.move(0, 0);
			}
		},
		{
			name: 'opener-type-overflow-open-menu',
			action: async(selector) => {
				const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown-mini');
				await overflowMenu.click();
			}
		},
		{
			name: 'opener-type-subtle-overflow-menu',
		},
		{
			name: 'opener-type-subtle-icon'
		}
	];
	const itemTypeConversion = [
		{
			name: 'all-item-types',
			action: async(selector) => {
				const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown');
				await overflowMenu.click();
			}
		}];
	[
		...hiddenButtonTests,
		...itemTypeConversion,
		...minMaxTests,
		...autoShow,
		...iconType,
	].forEach((test) => {
		it(test.name, async function() {
			const selector = `#${test.name}`;
			const containerSelector = `#${test.name}-container`;
			await page.$eval(containerSelector || selector, (elem) => elem.scrollIntoView());
			const rect = await visualDiff.getRect(page, containerSelector || selector);
			if (test.action) {
				await test.action(selector);
			}
			await visualDiff.screenshotAndCompare(page, `${this.test.fullTitle()}`, { captureBeyondViewport: false, clip: rect });
		});
	});
});
