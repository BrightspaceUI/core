
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-button-group', () => {

	const visualDiff = new VisualDiff('button-group', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/button-group/test/button-group.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	describe('', () => {
		[
			// { name: 'min-items-to-show', selector: '#noProps' },
			// { name: 'min-items-to-show', selector: '#min' },
			// { name: 'max-items-to-show', selector: '#max' },
			{ name: 'min-items-to-auto-show', selector: '#min-auto', viewport: { width: 200, height: 200 } },
			{ name: 'max-items-to-auto-show', selector: '#max-auto' },

			// {
			// 	name: 'min-and-max-items-to-show',
			// 	selector: '#min',
			// 	action: async() => {
			// 		console.log(page.setViewPort)
			// 		await page.setViewPort(300, 300);
			// 		// page.$eval(selector, (elem) => elem.on = true)
			// 	}
			// },
			// { name: 'min-and-max-items-to-show', selector: 'min-max' },
			{ name: 'one-item', selector: '#one-item' },

			// autoshow test
		].forEach((test) => {
			it(test.name, async function() {
				const rect = await visualDiff.getRect(page, test.selector);
				if (test.action) {
					await test.action(test.selector);
				}
				await visualDiff.screenshotAndCompare(page, `${this.test.fullTitle()}`, { clip: rect });
			});
		});
	});
});
