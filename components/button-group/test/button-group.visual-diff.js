
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const { hidden } = require('chalk');
const { delay } = require('lodash');

describe('d2l-button-group', () => {

	const visualDiff = new VisualDiff('button-group', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/button-group/test/button-group.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	async function getShadowElem(id, selector) {
		return await page.evaluateHandle(
			`document.querySelector('${id}').shadowRoot.querySelector('${selector}')`
		);
	}

	after(async() => await browser.close());
	// less-than-min-to-show-container
	// less-than-min-to-show

	// between-min-max-to-show-container
	// between-min-max-to-show

	// exactly-max-to-show-container
	// exactly-max-to-show

	// more-than-max-to-show-container
	// more-than-max-to-show

	const minMaxTests = [
		{
			name: 'less-than-min-to-show',
			selector: '#less-than-min-to-show',
			containerSelector: '#less-than-min-to-show-container',
		},
		{
			name: 'between-min-max-to-show',
			selector: '#between-min-max-to-show',
			containerSelector: '#between-min-max-to-show-container',
		},
		{
			name: 'exactly-max-to-show',
			selector: '#exactly-max-to-show',
			containerSelector: '#exactly-max-to-show-container',
		},
		{
			name: 'more-than-max-to-show',
			selector: '#more-than-max-to-show',
			containerSelector: '#more-than-max-to-show-container',
			action: async(selector) => {
				const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown');
				await overflowMenu.click();
			}
		},
	];

	const hiddenButtonTests = [
		{
			name: 'ignores-hidden-button',
			selector: '#ignores-hidden-button',
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
			selector: '#opener-type-mini-menu',
			containerSelector: '#opener-type-mini-menu-container',
		},
		{
			name: 'opener-type-overflow-open-menu',
			selector: '#opener-type-overflow-open-menu',
			containerSelector: '#opener-type-overflow-open-menu-container',
			action: async(selector) => {
				const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown-mini');
				await overflowMenu.click();
			}
		},
		{
			name: 'opener-type-subtle-overflow-menu',
			selector: '#opener-type-subtle-overflow-menu',
			containerSelector: '#opener-type-subtle-overflow-menu-container',
			action: async(selector) => {
				const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown-mini');
				await overflowMenu.click();
			}
		},
		{
			name: 'opener-type-subtle-overflow-menu-open',
			selector: '#opener-type-subtle-overflow-menu-open',
			containerSelector: '#opener-type-subtle-overflow-menu-open-container',
			action: async(selector) => {
				const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown-mini');
				await overflowMenu.click();
			}
		}
	];
	// const changeButtonsTests = [
	// 	{
	// 		name: 'add-button',
	// 		selector: '#add-button',
	// 		containerSelector: '#add-button-container',
	// 		action: async(selector) => {
	// 			const element = await page.evaluateHandle(
	// 				'document.createElement(\'d2l-button\');'
	// 			);
	// 			console.log(element)
	// 			element.textContent = 'new button';
	// 			const buttonSlot = await getShadowElem(selector, '#buttons');
	// 			console.log(buttonSlot)
	// 			const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown-mini');
	// 			await overflowMenu.click();
	// 		}
	// 	}
	// ];
	[
		// ...hiddenButtonTests,
		// ...minMaxTests.reverse(),
		// ...autoShow,
		// ...iconType.reverse()
		...changeButtonsTests,
	].forEach((test) => {
		it(test.name, async function() {
			const rect = await visualDiff.getRect(page, test.containerSelector || test.selector);
			if (test.action) {
				await test.action(test.selector);
			}
			await visualDiff.screenshotAndCompare(page, `${this.test.fullTitle()}`, { clip: rect });
		});
	});
});
