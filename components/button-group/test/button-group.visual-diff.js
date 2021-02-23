
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-button-group', () => {

	const visualDiff = new VisualDiff('button-group', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/button-group/test/button-group.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		// await page.waitFor(100);
		await page.bringToFront();
	});

	async function getShadowElem(id, selector) {
		return await page.evaluateHandle(
			`document.querySelector('${id}').shadowRoot.querySelector('${selector}')`
		);
	}

	after(async() => await browser.close());

	[
		// { name: 'less-than-min-to-show', selector: '#less-than-min' },
		// { name: 'between-min-max-items-to-show', selector: '#between-min-max' },
		// {
		// 	name: 'over-max-items',
		// 	selector: '#over-max',
		// 	containerSelector: '#over-max-container',
		// 	action: async(selector) => {
		// 		const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown');
		// 		await overflowMenu.click();
		// 	}
		// },

		{
			name: 'over-max-items-changed',
			selector: '#over-max',
			containerSelector: '#over-max-container',
			action: async(selector) => {
				const item = await getShadowElem(selector, '.d2l-overflow-dropdown');
				await item.click();
			}
		},
		{ name: 'less-than-min-to-show', selector: '#less-than-min' },

		// { name: 'min-items-to-auto-show', containerSelector: '#min-auto-container', selector: '#min-auto',
		// 	action: async(selector) => {
		// 		const overflowMenu = await getShadowElem(selector, '.d2l-dropdown-opener');
		// 		// await overflowMenu.hover();
		// 		await overflowMenu.click();
		// 		// await setTimeout(() => {
		// 		// }, 1000);
		// 	} },
		// { name: 'max-items-to-auto-show', selector: '#max-auto' },

		// this test is for when the more opener is not set to on but happens because
		// the container size is too small to show `More Actions`
		// { name: 'more-icon-opener', containerSelector: '#min-auto-container', selector: '#min-auto' },
		// { name: 'permanent-more-icon', selector: '#more-icon-opener' },
		// { name: 'min-max-items-to-auto-show-small', selector: '#min-max-auto-small' },
		// { name: 'min-max-items-to-auto-show-large', selector: '#min-max-auto-large' },
		// { name: 'one-item', selector: '#one-item' },
		// autoshow test
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
