const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-floating-buttons', function() {

	const visualDiff = new VisualDiff('floating-buttons', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await visualDiff.disableAnimations(page);
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/floating-buttons.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	it('floats', async function() {
		await scroll(page, '#floating-buttons');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
	});

	it('does not float at bottom of container', async function() {
		await scroll(page, '#floating-buttons-bottom', false);
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
	});

	it('does not float when small amount of content', async function() {
		const rect = await visualDiff.getRect(page, '#floating-buttons-short');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('floats when content added to dom', async function() {
		const transition = waitForTransition(page, '#floating-buttons-short-buttons');
		await page.evaluate(() => {
			const elem = document.querySelector('#floating-buttons-short-content').querySelector('p');
			elem.innerHTML += '<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>';
		});
		await scroll(page, '#floating-buttons-short');
		await transition;
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
	});

	it('floats at bottom of page when always-float', async function() {
		await scroll(page, '#floating-buttons-always-float-bottom', false);
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
	});

	it('is correct with rtl', async function() {
		const transition = waitForTransition(page, '#floating-buttons-rtl-buttons');
		await scroll(page, '#floating-buttons-rtl');
		await transition;
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
	});

	describe('window less than min-height (500px)', () => {
		before(async() => {
			await page.setViewport({width: 800, height: 499, deviceScaleFactor: 2});
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

	const scroll = async(page, selector, alignToTop) => {
		await page.evaluate((selector, alignToTop) => {
			document.querySelector(selector).scrollIntoView(alignToTop);
		}, selector, alignToTop);
	};

	const waitForTransition = (page, selector) => {
		return page.evaluate((selector) => {
			return new Promise((resolve) => {
				const elem = document.querySelector(selector);
				let transformTransitioned, borderTopColorTransitioned, backgroundColorTransitioned;
				elem.shadowRoot.querySelector('.d2l-floating-buttons-container').addEventListener('transitionend', (e) => {
					if (e.propertyName === 'transform') transformTransitioned = true;
					if (e.propertyName === 'border-top-color') borderTopColorTransitioned = true;
					if (e.propertyName === 'background-color') backgroundColorTransitioned = true;
					if (transformTransitioned && borderTopColorTransitioned && backgroundColorTransitioned) resolve();
				});
			});
		}, selector);
	};
});
