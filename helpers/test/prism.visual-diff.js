import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('prism-helper', () => {

	const visualDiff = new VisualDiff('prism-helper', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 1000, height: 2000 } });
		await page.goto(`${visualDiff.getBaseUrl()}/helpers/test/prism.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();

		await page.evaluate(() => window.codeFormatted);
	});

	beforeEach(async() => {
		await page.emulateMediaType('screen');
	});

	after(async() => await browser.close());

	describe('general', () => {

		[
			'block',
			'block-lines-numbers',
			'inline'
		].forEach(name => {

			['light', 'dark'].forEach(color => {

				it(`${name}-${color}`, async function() {
					const selector = `#${name}-${color}`;
					const rect = await visualDiff.getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

			});

		});

	});

	describe('tokens', () => {

		[
			'keyword',
			'builtin',
			'class-name',
			'function',
			'parameter',
			'boolean',
			'number',
			'string',
			'template-string',
			'interpolation',
			'regex',
			'url',
			'operator',
			'variable',
			'constant',
			'property',
			'punctuation',
			'important',
			'comment',
			'tag',
			'attribute',
			'namespace',
			'prolog',
			'doctype',
			'cdata',
			'entity',
			'atrule',
			'selector',
			'null',
			'color'
		].forEach(token => {

			['light', 'dark'].forEach(color => {

				it(`${token}-${color}`, async function() {
					const selector = `#${token}-${color}`;
					const rect = await visualDiff.getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

			});

		});

	});

});
