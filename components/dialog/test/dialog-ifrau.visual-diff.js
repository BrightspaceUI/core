import oneEvent from '@brightspace-ui/visual-diff/helpers/oneEvent.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dialog-ifrau', () => {

	const visualDiff = new VisualDiff('dialog-ifrau', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
	});

	after(async() => await browser.close());

	const getDialog = dialogContainer => {
		const iframe = dialogContainer.querySelector('iframe');
		return iframe.contentWindow.document.body.querySelector('#ifrau-dialog');
	};

	const open = async(page, selector) => {
		const openEvent = oneEvent(page, selector, 'ifrau-dialog-open');
		await page.$eval(selector, dialogContainer => {
			const dialog = getDialog(dialogContainer);
			dialog.opened = true;
		});
		return openEvent;
	};

	const reset = async(page, selector) => {
		const closeEvent = oneEvent(page, selector, 'ifrau-dialog-close');
		await Promise.race([
			page.$eval(selector, dialogContainer => {
				return new Promise(resolve => {
					const dialog = getDialog(dialogContainer);

					dialog._fullscreenWithin = 0;
					dialog.shadowRoot.querySelector('.d2l-dialog-content').scrollTo(0, 0);
					if (dialog._state) {
						dialog.opened = false;
					} else {
						resolve();
					}
				});
			}),
			closeEvent
		]);

		return page.$eval(selector, dialogContainer => {
			const iframe = dialogContainer.querySelector('iframe');
			iframe.contentWindow.document.body.querySelector('#open').click();
		});
	};

	['native', 'custom'].forEach((name) => {

		describe(name, () => {

			before(async() => {
				const preferNative = (name === 'native' ? '' : '?preferNative=false');
				const src = `${visualDiff.getBaseUrl()}/components/dialog/test/dialog-ifrau-contents.visual-diff.html${preferNative}`;
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog-ifrau.visual-diff.html?src=${encodeURIComponent(src)}`, { waitUntil: ['networkidle0', 'load'] });
				await page.setViewport({ width: 650, height: 450, deviceScaleFactor: 2 });
				await page.bringToFront();
			});

			beforeEach(async() => {
				await reset(page, '#ifrau-dialog-container');
			});

			[
				{ name: 'ifrau top height lt dialog top margin', ifrau: { availableHeight: 500, top: 50 } },
				{ name: 'ifrau top height gt dialog top margin', ifrau: { availableHeight: 500, top: 120 } },
				{ name: 'ifrau available height lt host height', ifrau: { availableHeight: 300, top: 50 } },
				{ name: 'host scrolled down', ifrau: { availableHeight: 400, top: -50 } }
			].forEach((info) => {
				it(info.name, async function() {
					await page.evaluate((info) => {
						window.ifrauAvailableHeight = info.ifrau.availableHeight;
						window.ifrauTop = info.ifrau.top;
					}, info);
					await open(page, '#ifrau-dialog-container');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});
			});

		});

	});

});
