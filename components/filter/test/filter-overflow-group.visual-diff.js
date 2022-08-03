
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-filter-overflow-group', () => {

	const visualDiff = new VisualDiff('filter-overflow-group', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/filter/test/filter-overflow-group.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	// async function getShadowElem(id, selector) {
	// 	return await page.evaluateHandle(
	// 		`document.querySelector('${id}').shadowRoot.querySelector('${selector}')`
	// 	);
	// }

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
			name: 'ignores-hidden-filter',
		}
	];
	// const autoShow = [
	// 	{
	// 		name: 'auto-show-small',
	// 		selector: '#auto-show-small',
	// 		containerSelector: '#auto-show-small-container',
	// 		action: async(selector) => {
	// 			const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown');
	// 			await overflowMenu.click();
	// 		}
	// 	},
	// 	{
	// 		name: 'auto-show',
	// 		selector: '#auto-show',
	// 		containerSelector: '#auto-show-container',
	// 		action: async(selector) => {
	// 			const overflowMenu = await getShadowElem(selector, '.d2l-overflow-dropdown');
	// 			await overflowMenu.click();
	// 		}
	// 	},
	// ];
	[
		...hiddenButtonTests,
		...minMaxTests,
		// ...autoShow,
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
