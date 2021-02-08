
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-button-group', () => {

	const visualDiff = new VisualDiff('button-group', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
	});

	beforeEach(async() => {
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/button-group/test/button-group.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());
	describe('', () => {
		[
			{ name: 'min-items-to-show', selector: '#min' },
			{ name: 'max-items-to-show', selector: '#max' },
			// {
			// 	name: 'min-and-max-items-to-show',
			// 	selector: '#min-max',
			// 	action: async() => {
			// 		await page.setViewPort(300, 300);
			// 		// page.$eval(selector, (elem) => elem.on = true)
			// 	}
			// },
			// { name: 'min-and-max-items-to-show', selector: 'min-max' },

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
