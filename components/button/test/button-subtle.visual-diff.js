const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-button-subtle', () => {

	const visualDiff = new VisualDiff('button-subtle', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/button-subtle.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		{ category: 'normal', tests: ['normal', 'hover', 'focus', 'click', 'disabled'] },
		{ category: 'icon', tests: ['with-icon', 'with-icon-rtl', 'icon-right', 'icon-right-rtl'] },

	].forEach((entry) => {
		describe(entry.category, () => {
			entry.tests.forEach((name) => {
				it(name, async function() {

					const selector = `#${entry.category}`;
					if (name === 'hover') {
						await page.hover(selector);
					} else if (name === 'focus') {
						await page.$eval(selector, (elem) => { elem.focus(); elem.shadowRoot.querySelector('button').classList.add('focus-visible'); });
					} else if (name === 'click') {
						await page.$eval(selector, (elem) => elem.focus());
					}

					const rectId = (name.indexOf('disabled') !== -1 || name.indexOf('icon') !== -1) ? name : entry.category;
					const rect = await visualDiff.getRect(page, `#${rectId}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });

					if (name === 'focus') {
						await page.$eval(selector, (elem) => elem.shadowRoot.querySelector('button').classList.remove('focus-visible'));
					}

				});
			});
		});
	});

});
