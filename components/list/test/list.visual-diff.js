const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-list', function() {

	const visualDiff = new VisualDiff('list', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 900, height: 900, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		{ category: 'general', tests: [
			{ name: 'simple', selector: '#simple' },
			{ name: 'actions', selector: '#actions' },
			{ name: 'rtl', selector: '#rtl' },
			{ name: 'rtl outside', selector: '#rtlOutside' }
		]},
		{ category: 'illustration', tests: [
			{ name: 'default', selector: '#illustration' },
			{ name: 'outside', selector: '#illustrationOutside' }
		]},
		{ category: 'separators', tests: [
			{ name: 'simple', selector: '#simple' },
			{ name: 'none', selector: '#separatorsNone' },
			{ name: 'all', selector: '#separatorsAll' },
			{ name: 'between', selector: '#separatorsBetween' },
			{ name: 'extended', selector: '#separatorsExtended' }
		]},
		{ category: 'item-content', tests: [
			{ name: 'primary and secondary', selector: '#itemContent' },
			{ name: 'no secondary', selector: '#itemContentNoSecondary' }
		]},
		{ category: 'breakpoints', tests: [
			{ name: '842', selector: '#breakpoint-842' },
			{ name: '636', selector: '#breakpoint-636' },
			{ name: '580', selector: '#breakpoint-580' },
			{ name: '0', selector: '#breakpoint-0' }
		]}
	].forEach((info) => {

		describe(info.category, () => {

			info.tests.forEach((info) => {
				it(info.name, async function() {
					const rect = await visualDiff.getRect(page, info.selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});

		});

	});

});
