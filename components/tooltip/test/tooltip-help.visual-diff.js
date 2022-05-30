// import { forceFocusVisible } from '../../../helpers/focus.js';
import puppeteer from 'puppeteer';
import { show } from './tooltip-helper.js';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-tooltip-help', () => {

	const visualDiff = new VisualDiff('tooltip-help', import.meta.url);
	const tooltipHelpSelector = '#help-tooltip-basic';

	let browser, page;

	before(async() => {
		// browser = await puppeteer.launch();
		browser = await puppeteer.launch({headless: false});
		page = await visualDiff.createPage(browser, { viewport: { width: 400, height: 400 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/tooltip/test/tooltip-help.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	afterEach(async() => {
		await page.reload();
	});

	after(async() => await browser.close());

	[
		{ case: 'help tooltip hidden' },
		{ case: 'help tooltip hovered and focused', hover: true, focus: true },
		{ case: 'help tooltip hovered', hover: true },
		{ case: 'help tooltip focused', focus: true },
		{ case: 'help tooltip clicked', click: true }
	].forEach((testCase) => {

		it(testCase.case, async function() {
			const target = await page.evaluate(async(selector) => { document.querySelector(selector); }, tooltipHelpSelector);
			if (testCase.focus) {
				await page.$eval(tooltipHelpSelector, async(elem, focus) => { focus(elem); }, forceFocusVisible);
			}
			if (testCase.hover) {
				await page.hover(tooltipHelpSelector);
			}
			if (testCase.click) {
				await page.$eval(tooltipHelpSelector, (elem) => elem.click());
				// await page.click(tooltipHelpSelector);
			}

			if (testCase.focus || testCase.hover || testCase.click) {
				await visualDiff.oneEvent(page, target, 'd2l-tooltip-show');
			}

			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});
	});

	[
		'help-tooltip-unordered-list',
		'help-tooltip-ordered-list',
	].forEach((testName) => {

		it(testName, async function() {
			const selector = `#${testName}`;
			await show(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});

	});

});
