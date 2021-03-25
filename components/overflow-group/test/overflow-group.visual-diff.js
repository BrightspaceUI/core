
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-overflow-group', () => {

	const visualDiff = new VisualDiff('overflow-group', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/overflow-group/test/overflow-group.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
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
			selector: '#auto-show-small',
			containerSelector: '#auto-show-small-container',
			action: async(selector) => {
				const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown-mini');
				await overflowMenu.click();
			}
		},
		{
			name: 'auto-show',
			selector: '#auto-show',
			containerSelector: '#auto-show-container',
			action: async(selector) => {
				const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown');
				await overflowMenu.click();
			}
		},
	];
	const iconType = [
		{
			name: 'opener-type-mini-menu',
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
			name: 'opener-type-subtle-overflow-menu-open',
			action: async(selector) => {
				const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown-mini');
				await overflowMenu.click();
			}
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
			const rect = await visualDiff.getRect(page, containerSelector || selector);
			if (test.action) {
				await test.action(selector);
			}
			await visualDiff.screenshotAndCompare(page, `${this.test.fullTitle()}`, { clip: rect });
		});
	});
});
