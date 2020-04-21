const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-list', () => {

	const visualDiff = new VisualDiff('list', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, {viewport: {width: 1000, height: 3700}});
		await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		{ category: 'general', tests: [
			{ name: 'simple', selector: '#simple' },
			{ name: 'actions', selector: '#actions' },
			{ name: 'rtl', selector: '#rtl' },
			{ name: 'rtl outside', selector: '#rtlOutside' }
		]},
		{ category: 'illustration', tests: [
			{ name: 'default', selector: '#illustration' },
		]},
		{ category: 'separators', tests: [
			{ name: 'default', selector: '#simple' },
			{ name: 'none', selector: '#separatorsNone' },
			{ name: 'all', selector: '#separatorsAll' },
			{ name: 'between', selector: '#separatorsBetween' },
			{ name: 'extended', selector: '#separatorsExtended' }
		]},
		{ category: 'item-content', tests: [
			{ name: 'primary and secondary', selector: '#itemContent' },
			{ name: 'no secondary', selector: '#itemContentNoSecondary' }
		]},
		{ category: 'href', tests: [
			{ name: 'default', selector: '#href' },
			{ name: 'focus', selector: '#href', action: () => focusLink('#href [href]') },
			{ name: 'hover', selector: '#href', action: () => hover('#href [href]') }
		]},
		{ category: 'selectable', tests: [
			{ name: 'not selected', selector: '#selectable' },
			{ name: 'not selected focus', selector: '#selectable', action: () => focusInput('#selectable [selectable]') },
			{ name: 'not selected hover', selector: '#selectable', action: () => hover('#selectable [selectable]') },
			{ name: 'selected', selector: '#selectableSelected' },
			{ name: 'selected focus', selector: '#selectableSelected', action: () => focusInput('#selectableSelected [selectable]') },
			{ name: 'selected hover', selector: '#selectableSelected', action: () => hover('#selectableSelected [selectable]') },
			{ name: 'item-content', selector: '#selectableItemContent' }
		]},
		{ category: 'focus method', tests: [
			{ name: 'href', selector: '#href', action: () => focusMethod('#href [href]') },
			{ name: 'selectable', selector: '#selectable', action: () => focusMethod('#selectable [selectable]') },
			{ name: 'actions', selector: '#actions', action: () => focusMethod('#actions d2l-list-item') }
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
					if (info.action) {
						await info.action();
					}
					const rect = await visualDiff.getRect(page, info.selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});

		});

	});

	const focusMethod = (selector) => {
		return page.$eval(selector, (item) => {
			item.focus();
		});
	};

	const focusInput = (selector) => {
		return page.$eval(selector, (item) => {
			item.shadowRoot.querySelector('input').focus();
		});
	};

	const focusLink = (selector) => {
		return page.$eval(selector, (item) => {
			item.shadowRoot.querySelector('a').focus();
		});
	};

	const hover = (selector) => {
		return page.hover(selector);
	};

});
