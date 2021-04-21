import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-html-block', () => {

	const visualDiff = new VisualDiff('html-block', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 1000, height: 2000 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/html-block/test/html-block.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	[
		{ name: 'empty', selector: '#empty' },
		{ name: 'empty-template', selector: '#empty-template' },
		{ name: 'no-template', selector: '#no-template' },
		{ name: 'typography', selector: '#typography' },
		{ name: 'update-template', selector: '#update-template', action: selector => page.$eval(selector, elem => elem.innerHTML = '<template>after update</template>') },
		{ name: 'update-content', selector: '#update-content', action: selector => page.$eval(selector, elem => elem.querySelector('template').content.textContent = 'after update') },
		//{ name: 'math (block)', selector: '#math-block' },
		//{ name: 'math (inline)', selector: '#math-inline' }
	].forEach((info) => {

		it(info.name, async function() {
			const rect = await visualDiff.getRect(page, info.selector);
			if (info.action) await info.action(info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
