import { createConfig, startServer } from 'es-dev-server';
import puppeteer from 'puppeteer';

describe('test', () => {
	const delay = async(page) => {
		await page.evaluate(() => {
			return new Promise(resolve => {
				setTimeout(resolve, 1000);
			});
		});
	};

	let _server, baseUrl, browser, page;

	before(async() => {
		const { server } = await startServer(createConfig({ babel: true, nodeResolve: true, dedupe: true }));
		_server = server;
		baseUrl = `http://localhost:${_server.address().port}`;
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({ width: 1200, height: 1200, deviceScaleFactor: 2 });
		page.on('console', msg => console.log(msg.text()));
		await page.goto(`${baseUrl}/components/switch/test/switch.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
	});

	beforeEach(async() => {
		await delay(page);
	});

	after(async() => {
		await browser.close();
		await _server.close();
	});

	[
		{ name: 'test', selector: '#test' },
		{ name: 'test2', selector: '#test' },
		{ name: 'test3', selector: '#test' },
		{ name: 'test4', selector: '#test' },
		{ name: 'test5', selector: '#test' },
		{ name: 'test6', selector: '#test' },
		{ name: 'test7', selector: '#test' },
		{ name: 'test8', selector: '#test' },
		{ name: 'test9', selector: '#test' },
		{ name: 'test10', selector: '#test' }
	].forEach((info) => {
		it.only(info.name, async function() {
			await page.screenshot({ path: `${this.test.fullTitle()}.png` });
		});
	});

});
