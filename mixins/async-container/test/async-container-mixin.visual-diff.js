import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-async-container-mixin', function() {

	const visualDiff = new VisualDiff('async-container-mixin', import.meta.url);

	let browser, page;

	const getAsyncStateEvent = (page, selector, state) => {
		return page.$eval(selector, (elem, state) => {
			return new Promise((resolve) => {
				elem.addEventListener('d2l-async-demo-container-changed', (e) => {
					if (e.detail.state === state) resolve();
				});
			});
		}, state);
	};

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/mixins/async-container/test/async-container-mixin.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	afterEach(async() => {
		await page.reload(); // Needed for retries
	});

	after(async() => await browser.close());

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
		await page.$eval('#mixed', (container) => {
			return new Promise((resolve) => {
				const items = container.querySelectorAll('d2l-async-test-item');
				container.addEventListener('d2l-async-demo-container-changed', (e) => {
					if (e.detail.state === 'pending') {
						items[0].resolve();
						resolve();
					}
				});
				for (let i = 0; i < items.length; i++) {
					items[i].key = `key ${i}`;
				}
			});
		});
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

});
