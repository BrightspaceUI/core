const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-radio', () => {

	const visualDiff = new VisualDiff('input-radio', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-radio.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	async function getRadio(id, val) {
		return await page.evaluateHandle(
			`document.querySelector('#${id}').shadowRoot.querySelector('input[type="radio"][value="${val}"]')`
		);
	}

	['label', 'solo'].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	['label', 'solo'].forEach((name) => {
		['normal', 'invalid'].forEach((val) => {
			it(`${name}-${val}-focus`, async function() {
				const input = await getRadio(name, val);
				input.focus();
				const rect = await visualDiff.getRect(page, `#${name}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

});
