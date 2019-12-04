const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-async-container-mixin', function() {

	const visualDiff = new VisualDiff('async-container-mixin', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/async-container/test/async-container-mixin.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		page.on('console', msg => console.log(msg.text()));
		await page.bringToFront();
	});

	after(() => browser.close());

	it('initial', async function() {
		const rect = await visualDiff.getRect(page, '#initial');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('pending', async function() {
		const pendingState = getAsyncStateEvent(page, '#pending', 'pending');
		await page.$eval('#pending d2l-async-test-item', item => item.key = 'key');
		await pendingState;
		const rect = await visualDiff.getRect(page, '#pending');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('pending-delay', async function() {
		await page.$eval('#pending-delay d2l-async-test-item', item => item.key = 'key');
		const rect = await visualDiff.getRect(page, '#pending-delay');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('mixed', async function() {
		const pendingState = getAsyncStateEvent(page, '#mixed', 'pending');
		await page.evaluate(() => {
			const items = document.querySelectorAll('#mixed d2l-async-test-item');
			for (let i = 0; i < items.length; i++) {
				items[i].key = `key ${i}`;
			}
			items[0].resolve();
		});
		await pendingState;
		const rect = await visualDiff.getRect(page, '#mixed');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('failure', async function() {
		const completeState = getAsyncStateEvent(page, '#failure', 'complete');
		await page.$eval('#failure d2l-async-test-item', (item) => {
			item.key = 'key';
			item.reject();
		});
		await completeState;
		const rect = await visualDiff.getRect(page, '#failure');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('complete', async function() {
		const completeState = getAsyncStateEvent(page, '#complete', 'complete');
		await page.$eval('#complete d2l-async-test-item', (item) => {
			item.key = 'key';
			item.resolve();
		});
		await completeState;
		const rect = await visualDiff.getRect(page, '#complete');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	const getAsyncStateEvent = (page, selector, state) => {
		return page.$eval(selector, (elem, state) => {
			return new Promise((resolve) => {
				elem.addEventListener('d2l-async-demo-container-changed', (e) => {
					if (e.detail.state === state) resolve();
				});
			});
		}, state);
	};

});
