import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-collapsible-panel', () => {

	const visualDiff = new VisualDiff('collapsible-panel', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
	});

	beforeEach(async() => {
		await page.reload();
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	function focusElement(selector) {
		return focusWithKeyboard(page, `${selector} > d2l-collapsible-panel`);
	}

	function expandPanel(selector) {
		return page.$eval(selector, (elem) => {
			return new Promise((resolve) => {
				const panel = elem.querySelector('d2l-collapsible-panel');
				panel.addEventListener('d2l-collapsible-panel-expand', async(e) => {
					await e.detail.complete;
					resolve();
				});
				panel.expanded = true;
			});
		});
	}

	describe('ltr', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/collapsible-panel/test/collapsible-panel.visual-diff.html?dir=ltr`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		[
			{ name: 'default', selector: '#default' },
			{ name: 'default-focus', selector: '#default', action: focusElement },
			{ name: 'default-expanded', selector: '#default-expanded' },
			{ name: 'default-expanded-sticky', selector: '#default-expanded-sticky' },
			{ name: 'default-expanded-focus', selector: '#default-expanded', action: focusElement },
			{ name: 'default-expand-event', selector: '#default-expand-event', action: expandPanel },
			{ name: 'default-summary', selector: '#default-summary' },
			{ name: 'default-summary-expanded', selector: '#default-summary-expanded' },
			{ name: 'default-summary-focus', selector: '#default-summary', action: focusElement },
			{ name: 'default-large-padding', selector: '#default-large-padding' },
			{ name: 'default-large-padding-summary', selector: '#default-large-padding-summary' },
			{ name: 'default-large-padding-expanded', selector: '#default-large-padding-expanded' },
			{ name: 'default-long', selector: '#default-long' },
			{ name: 'skeleton', selector: '#skeleton' },
			{ name: 'subtle', selector: '#subtle' },
			{ name: 'subtle-focus', selector: '#subtle', action: focusElement },
			{ name: 'subtle-expanded', selector: '#subtle-expanded' },
			{ name: 'subtle-expanded-sticky', selector: '#subtle-expanded-sticky' },
			{ name: 'subtle-expanded-focus', selector: '#subtle-expanded', action: focusElement },
			{ name: 'subtle-summary', selector: '#subtle-summary' },
			{ name: 'subtle-summary-expanded', selector: '#subtle-summary-expanded' },
			{ name: 'subtle-summary-focus', selector: '#subtle-summary', action: focusElement },
			{ name: 'subtle-large-padding', selector: '#subtle-large-padding' },
			{ name: 'subtle-large-padding-summary', selector: '#subtle-large-padding-summary' },
			{ name: 'subtle-large-padding-expanded', selector: '#subtle-large-padding-expanded' },
			{ name: 'subtle-long', selector: '#subtle-long' },
			{ name: 'inline', selector: '#inline' },
			{ name: 'inline-focus', selector: '#inline', action: focusElement },
			{ name: 'inline-expanded', selector: '#inline-expanded' },
			{ name: 'inline-expanded-sticky', selector: '#inline-expanded-sticky' },
			{ name: 'inline-expanded-focus', selector: '#inline-expanded', action: focusElement },
			{ name: 'inline-summary', selector: '#inline-summary' },
			{ name: 'inline-summary-expanded', selector: '#inline-summary-expanded' },
			{ name: 'inline-summary-focus', selector: '#inline-summary', action: focusElement },
			{ name: 'inline-large-padding', selector: '#inline-large-padding' },
			{ name: 'inline-large-padding-summary', selector: '#inline-large-padding-summary' },
			{ name: 'inline-large-padding-expanded', selector: '#inline-large-padding-expanded' },
			{ name: 'inline-long', selector: '#inline-long' },
			{ name: 'custom', selector: '#custom' },
			{ name: 'custom-expanded', selector: '#custom-expanded' },
			{ name: 'custom-summary', selector: '#custom-summary' },
			{ name: 'custom-summary-expanded', selector: '#custom-summary-expanded' },
		].forEach((info) => {

			it(info.name, async function() {
				if (info.action) await info.action(info.selector);
				const rect = await visualDiff.getRect(page, info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('rtl', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/collapsible-panel/test/collapsible-panel.visual-diff.html?dir=rtl`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		[
			{ name: 'default', selector: '#default' },
			{ name: 'default-focus', selector: '#default', action: focusElement },
			{ name: 'default-expanded', selector: '#default-expanded' },
			{ name: 'default-summary', selector: '#default-summary' },
			{ name: 'subtle', selector: '#subtle' },
			{ name: 'subtle-focus', selector: '#subtle', action: focusElement },
			{ name: 'subtle-expanded', selector: '#subtle-expanded' },
			{ name: 'subtle-summary', selector: '#subtle-summary' },
			{ name: 'inline', selector: '#inline' },
			{ name: 'inline-focus', selector: '#inline', action: focusElement },
			{ name: 'inline-expanded', selector: '#inline-expanded' },
			{ name: 'inline-summary', selector: '#inline-summary' },
			{ name: 'custom', selector: '#custom' },
			{ name: 'custom-expanded', selector: '#custom-expanded' },
			{ name: 'custom-summary', selector: '#custom-summary' },
		].forEach((info) => {

			it(info.name, async function() {
				const rect = await visualDiff.getRect(page, info.selector);
				if (info.action) await info.action(info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});
});
