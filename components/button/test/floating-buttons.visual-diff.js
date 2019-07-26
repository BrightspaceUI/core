const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-floating-buttons', function() {

	const visualDiff = new VisualDiff('floating-buttons', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
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
			elem.textContent += 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci repellat cum totam! Enim, sunt. Numquam voluptate, velit quisquam ipsa molestias laudantium odit reiciendis nisi corporis voluptatibus, voluptatum sunt natus, accusantium magnam consequatur fugit officiis minima voluptatem consequuntur nam, earum necessitatibus! Cupiditate ullam repellendus, eius iure voluptas at commodi consectetur, quia, adipisci possimus, ex mollitia. Labore harum error consectetur officiis aut optio, temporibus iste nobis ducimus cumque laudantium rem pariatur. Ut repudiandae id, consequuntur quasi quis pariatur autem corporis perferendis facilis eius similique voluptatibus iusto deleniti odio officia numquam tenetur excepturi, aspernatur sunt minima aut fugiat ipsam. Ea nesciunt, amet fugit facere similique dolor nam tempora perferendis aut fugiat non, ex pariatur excepturi odio aspernatur libero saepe ducimus rem magni cumque. Laboriosam nisi fuga accusantium quos qui? Maiores ratione aliquam eos odio eius molestiae nesciunt exercitationem dolor perspiciatis quam. Necessitatibus rem nihil ad culpa, tenetur iusto consectetur rerum, delectus neque? Error, quas, eaque! Quibusdam voluptas expedita possimus consequatur accusantium distinctio, esse quisquam, ipsa blanditiis, officia perferendis et? Iste, nam optio vero earum tenetur voluptatibus modi a, odit aliquid eos corporis nulla saepe vel neque voluptate ratione, facilis quo sed nisi voluptates nostrum dolor. Non mollitia dignissimos laudantium quos libero nisi, nobis harum, asperiores soluta reprehenderit doloremque ipsa id unde voluptates beatae deserunt. Minima repellendus ipsam molestias veritatis pariatur nobis nihil, alias quasi, esse, aspernatur saepe beatae, hic consequatur. Sit sequi, libero quisquam quibusdam fuga tempore ab molestiae praesentium, necessitatibus, vero odio ullam qui non totam voluptas reprehenderit ad neque voluptate. Nam atque impedit ducimus, dolore reiciendis delectus inventore beatae cumque. Magni, id quos officiis soluta consequatur nam quis, modi fugit adipisci vel autem dolorum iusto cumque, libero reprehenderit amet doloremque voluptatem sunt sapiente reiciendis omnis, similique nulla enim. Autem repellendus, illo eveniet recusandae quae quibusdam itaque, delectus, consequatur provident vitae vero magnam repudiandae fugit, placeat sapiente! Omnis, possimus natus .';
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
		const transition = waitForTransition(page, '#floating-buttons-buttons');
		await page.evaluate(() => {
			document.querySelector('#floating-buttons').shadowRoot.querySelector('#d2l-demo-snippet-toggle-dir').click();
		});
		await scroll(page, '#floating-buttons');
		await transition;
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		await page.evaluate(() => {
			document.querySelector('#floating-buttons').shadowRoot.querySelector('#d2l-demo-snippet-toggle-dir').click();
		});
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
				elem.shadowRoot.querySelector('.d2l-floating-buttons-container').addEventListener('transitionend', () => {
					resolve();
				});
			});
		}, selector);
	};
});
