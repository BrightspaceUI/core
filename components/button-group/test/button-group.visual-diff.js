
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
	// min items to show
	// max items to show
	// overflow menu hiddem
	// subtle setting
	// opener type
	// auto show
	describe('', () => {
		[
			{ name: 'no-props', selector: '#noProps' },
			{ name: 'min-items-to-show', selector: '#min' },
			{ name: 'max-items-to-show', selector: '#max' },
			// { name: 'min-and-max-items-to-show', selector: 'min-max' },

			// { name: 'min-items-to-auto-show', selector: '#min-auto' },
			// { name: 'max-items-to-auto-show', selector: '#max-auto' },
			{ name: 'min-max-items-to-auto-show-small', selector: '#min-max-auto-small' },
			{ name: 'min-max-items-to-auto-show-large', selector: '#min-max-auto-large' },
			
			// { name: 'one-item', selector: '#one-item' },

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
