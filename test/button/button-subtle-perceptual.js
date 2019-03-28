const puppeteer = require('puppeteer');
const visualDiff = require('visual-diff');

visualDiff.run((ctx) => {

	describe('d2l-button-subtle', function() {

		this.timeout(10000);
		let browser, page;

		before(async() => {
			browser = await puppeteer.launch();
			page = await browser.newPage();
		});

		after(() => browser.close());

		const runTests = () => {

			it('normal', async function() {
				const rect = await ctx.puppeteer.getRect(page, '#normal');
				await ctx.puppeteer.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('mouse', async function() {
				await page.hover('#normal');
				const rect = await ctx.puppeteer.getRect(page, '#normal');
				await ctx.puppeteer.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('focus', async function() {
				await page.click('#normal');
				const rect = await ctx.puppeteer.getRect(page, '#normal');
				await ctx.puppeteer.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('disabled', async function() {
				const rect = await ctx.puppeteer.getRect(page, '#disabled');
				await ctx.puppeteer.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('with-icon', async function() {
				const rect = await ctx.puppeteer.getRect(page, '#with-icon');
				await ctx.puppeteer.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		};

		describe('wide', function() {

			beforeEach(async function() {
				await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
				await page.goto('http://127.0.0.1:8081/components/d2l-core-ui/test/button/button-subtle-fixture.html', {waitUntil: ['networkidle2', 'load']});
			});

			runTests();

		});

		describe('narrow', function() {

			beforeEach(async function() {
				await page.setViewport({width: 600, height: 800, deviceScaleFactor: 2});
				await page.goto('http://127.0.0.1:8081/components/d2l-core-ui/test/button/button-subtle-fixture.html', {waitUntil: ['networkidle2', 'load']});
			});

			runTests();

		});

	});

}, {dir: __dirname, port: 8081});
