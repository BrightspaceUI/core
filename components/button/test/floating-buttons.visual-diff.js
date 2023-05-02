import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-floating-buttons', () => {

	const visualDiff = new VisualDiff('floating-buttons', import.meta.url);

	let browser, page;

	const scroll = async(page, selector, alignToTop) => {
		await page.evaluate((selector, alignToTop) => {
			document.querySelector(selector).scrollIntoView(alignToTop);
		}, selector, alignToTop);
	};

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/floating-buttons.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	it('floats', async function() {
		await scroll(page, '#floating-buttons');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
	});

	it('does not float at bottom of container', async function() {
		await scroll(page, '#floating-buttons-bottom', false);
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
	});

	it('does not float when small amount of content', async function() {
		await scroll(page, '#floating-buttons-short');
		const rect = await visualDiff.getRect(page, '#floating-buttons-short');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('floats when content added to dom', async function() {
		await page.evaluate(() => {
			const elem = document.querySelector('#floating-buttons-short-content').querySelector('p');
			elem.innerHTML += '<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>';
		});
		await scroll(page, '#floating-buttons-short');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
	});

	it('floats at bottom of page when always-float', async function() {
		await scroll(page, '#floating-buttons-always-float-bottom', false);
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
	});

	it('is correct with rtl', async function() {
		await scroll(page, '#floating-buttons-rtl');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
	});

	it('floats when bounded', async function() {
		await scroll(page, '#floating-buttons-bounded');
		const rect = await visualDiff.getRect(page, '#floating-buttons-bounded');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('window less than min-height (500px)', () => {

		before(async() => {
			await page.setViewport({ width: 800, height: 499, deviceScaleFactor: 2 });
		});

		it('does not float', async function() {
			await scroll(page, '#floating-buttons');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});

		it('floats at bottom of page when always-float is true', async function() {
			await scroll(page, '#floating-buttons-always-float-bottom', false);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});

	});

});
