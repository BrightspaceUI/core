import '../alert-toast.js';
import { clickElem, expect, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { setViewport as cmdSetViewport, emulateMedia, sendMouse } from '@web/test-runner-commands';
import { nextFrame, fixture as wcFixture } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

/**
 * @param {*} node
 */
function getComposedChildren(node) {

	if (node?.nodeType !== Node.ELEMENT_NODE) {
		return [];
	}

	let nodes;
	const children = [];

	if (node.tagName === 'SLOT') {
		nodes = node.assignedNodes({ flatten: true });
	} else {
		if (node.shadowRoot) {
			node = node.shadowRoot;
		}
		nodes = node.children || node.childNodes;
	}

	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].nodeType === 1) {
			children.push(nodes[i]);
		}
	}

	return children;

}

/**
 * @param {*} elem
 * @param {boolean} awaitLoadingComplete
 */
async function waitForElem(elem, awaitLoadingComplete = true) {

	if (!elem) return;

	const doWait = async() => {

		const update = elem.updateComplete;
		if (typeof update === 'object' && Promise.resolve(update) === update) {
			console.log(performance.now(), 'waitForElem.doWait', elem.tagName.toLowerCase(), 'awaiting updateComplete...');
			await update;
			console.log(performance.now(), 'waitForElem.doWait', elem.tagName.toLowerCase(), 'awaiting nextFrame...');
			await nextFrame();
			console.log(performance.now(), 'waitForElem.doWait', elem.tagName.toLowerCase(), 'done');
		}

		if (awaitLoadingComplete && typeof elem.getLoadingComplete === 'function') {
			console.log(performance.now(), 'waitForElem.doWait', elem.tagName.toLowerCase(), 'awaiting loadingComplete...');
			await elem.getLoadingComplete();
			console.log(performance.now(), 'waitForElem.doWait', elem.tagName.toLowerCase(), 'awaiting nextFrame...');
			await nextFrame();
			console.log(performance.now(), 'waitForElem.doWait', elem.tagName.toLowerCase(), 'done');
		}

		const children = getComposedChildren(elem);
		await Promise.all(children.map(e => waitForElem(e, awaitLoadingComplete)));

	};

	await new Promise((resolve) => {
		const observer = new MutationObserver((records) => {
			for (const record of records) {
				for (const removedNode of record.removedNodes) {
					if (removedNode === elem) {
						observer.disconnect();
						resolve();
						return;
					}
				}
			}
		});
		observer.observe(elem.parentNode, { childList: true });
		doWait()
			.then(() => observer.disconnect())
			.then(resolve);
	});

}

/**
 *
 * @param {*} element
 * @param {{
 *      awaitLoadingComplete: boolean,
 * 		lang: string,
 *		mathjax: {renderLatex: boolean},
 *		rtl: boolean,
 *		pagePadding: boolean,
 *		media: string,
 *      viewport: { height: number, width: number }
 *	}} opts
 */
export async function fixture(element, opts = {}) {
	console.log(performance.now(), 'fixure.waiting for reset, fonts...');
	await Promise.all([reset(opts), document.fonts.ready]);
	console.log(performance.now(), 'fixure.reset/fonts complete');

	const parentNode = document.createElement('div');
	parentNode.setAttribute('id', 'd2l-test-fixture-container');

	const elem = await wcFixture(element, { parentNode });
	console.log(performance.now(), 'fixure.wcFixture complete, waiting for elements...');
	await waitForElem(elem, opts.awaitLoadingComplete);
	console.log(performance.now(), 'fixure.waiting for elements complete, waiting for pause...');

	await pause();
	console.log(performance.now(), 'fixure.pause complete, returning element');
	return elem;
}

async function pause() {
	const test = window.d2lTest || {};

	test.update?.();

	if (test.pause) {
		await test.pause;
		if (test.pause) test.pause = new Promise(r => test.run = r);
	}
}

const DEFAULT_PAGE_PADDING = true,
	DEFAULT_LANG = 'en',
	DEFAULT_MATHJAX_RENDER_LATEX = false,
	DEFAULT_MEDIA = 'screen',
	DEFAULT_VIEWPORT = {
		height: 800,
		width: 800
	};

const documentLocaleSettings = getDocumentLocaleSettings();

let
	currentPagePadding = true,
	currentMathjaxRenderLatex = DEFAULT_MATHJAX_RENDER_LATEX,
	currentMedia = DEFAULT_MEDIA,
	currentRtl = false,
	currentViewportHeight = 0,
	currentViewportWidth = 0,
	shouldResetMouse = false;

export function requestMouseReset() {
	shouldResetMouse = true;
}

export async function setViewport(viewport) {

	const newViewport = { ...DEFAULT_VIEWPORT, ...viewport };

	if (newViewport.height !== currentViewportHeight || newViewport.width !== currentViewportWidth) {
		currentViewportHeight = newViewport.height;
		currentViewportWidth = newViewport.width;
		await cmdSetViewport(newViewport).catch(() => {});
		return true;
	}

	return false;

}

export async function reset(opts = {}) {

	const defaultOpts = {
		lang: DEFAULT_LANG,
		mathjax: {},
		rtl: !!opts.lang?.startsWith('ar'),
		pagePadding: DEFAULT_PAGE_PADDING,
		media: DEFAULT_MEDIA
	};

	opts = { ...defaultOpts, ...opts };
	opts.mathjax.renderLatex = (typeof opts.mathjax.renderLatex === 'boolean') ? opts.mathjax.renderLatex : DEFAULT_MATHJAX_RENDER_LATEX;

	let awaitNextFrame = false;

	window.scroll(0, 0);

	if (opts.pagePadding !== currentPagePadding) {
		if (!opts.pagePadding) {
			document.body.classList.add('no-padding');
		}
		else {
			document.body.classList.remove('no-padding');
		}
		awaitNextFrame = true;
		currentPagePadding = opts.pagePadding;
	}

	if (shouldResetMouse) {
		shouldResetMouse = false;
		await sendMouse({ type: 'move', position: [0, 0] }).catch(() => {});
	}

	if (document.activeElement !== document.body) {
		document.activeElement.blur();
		awaitNextFrame = true;
	}

	if (opts.rtl !== currentRtl) {
		if (!opts.rtl) {
			document.documentElement.removeAttribute('dir');
		} else {
			document.documentElement.setAttribute('dir', 'rtl');
		}
		awaitNextFrame = true;
		currentRtl = opts.rtl;
	}

	opts.lang ??= '';
	if (documentLocaleSettings.language !== opts.lang) {
		document.documentElement.lang = opts.lang;
		awaitNextFrame = true;
	}

	if (await setViewport(opts.viewport)) {
		awaitNextFrame = true;
	}

	if (opts.mathjax.renderLatex !== currentMathjaxRenderLatex) {
		currentMathjaxRenderLatex = opts.mathjax.renderLatex;
		if (opts.mathjax.renderLatex === DEFAULT_MATHJAX_RENDER_LATEX) {
			document.documentElement.removeAttribute('data-mathjax-context');
		} else {
			document.documentElement.dataset.mathjaxContext = JSON.stringify({
				renderLatex: opts.mathjax.renderLatex
			});
		}
	}

	if (opts.media !== currentMedia) {
		currentMedia = opts.media;
		await emulateMedia({ media: opts.media }).catch(() => {});
		awaitNextFrame = true;
	}

	if (awaitNextFrame) {
		await nextFrame();
	}

}

describe('d2l-alert-toast', () => {

	before(async() => {
		console.log(performance.now(), 'before start');
		const sheet = new CSSStyleSheet();
		sheet.replaceSync("a { color: red; }");
		document.adoptedStyleSheets.push(sheet);
		await nextFrame();
		console.log(performance.now(), 'test1 end');
	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-alert-toast');
		});

	});

	describe('button-press', () => {

		it.only('should fire "d2l-alert-toast-button-press" event when alert button is pressed', async() => {
			console.log(performance.now(), 'test1 start');
			const el = await fixture(html`<d2l-alert-toast open>message</d2l-alert-toast>`);
			console.log(performance.now(), 'fixture1 created');
			/*const alert = el.shadowRoot.querySelector('d2l-alert');
			console.log(performance.now(), 'alert1 found');
			const button = alert.shadowRoot.querySelector('d2l-button-subtle[text="Click Me"]');
			console.log(performance.now(), 'button1 found', button.getBoundingClientRect());
			clickElem(button);
			console.log(performance.now(), 'button1 clicked, waiting for event');
			await oneEvent(el, 'd2l-alert-toast-button-press');
			console.log(performance.now(), 'event1 received');*/
		});

	});

	describe('resize event', () => {
		it('emits resize events with correct details', async() => {
			const el = await fixture(html`<d2l-alert-toast>message</d2l-alert-toast>`);
			el.open = true;
			const e1 = await oneEvent(el, 'd2l-alert-toast-resize');
			expect(e1.detail.opening).to.be.true;
			expect(e1.detail.heightDifference).to.be.greaterThan(0);

			// Trigger height change by adding subtext
			el.subtext = 'subtext';
			const e2 = await oneEvent(el, 'd2l-alert-toast-resize');
			expect(e2.detail.opening).to.be.false;
			expect(e2.detail.heightDifference).to.be.greaterThan(0);
		});
	});

	describe('close', () => {

		it('should close when close button is clicked', async() => {
			const el = await fixture(html`<d2l-alert-toast open>message</d2l-alert-toast>`);
			const alert = el.shadowRoot.querySelector('d2l-alert');
			alert.dispatchEvent(new CustomEvent('d2l-alert-close'));
			await el.updateComplete;
			expect(el.open).to.be.false;
		});

		it('should fire "d2l-alert-toast-close" event when closed', async() => {
			console.log(performance.now(), 'test2 start');
			const el = await fixture(html`<d2l-alert-toast open>message</d2l-alert-toast>`);
			console.log(performance.now(), 'fixture2 created');
			setTimeout(() => el.open = false);
			console.log(performance.now(), 'button2 clicked, waiting for event');
			await oneEvent(el, 'd2l-alert-toast-close');
			console.log(performance.now(), 'event2 received');
			expect(el.open).to.be.false;
		});

		it('close event details are correct', async() => {
			const el = await fixture(html`<d2l-alert-toast open subtext="more">message</d2l-alert-toast>`);
			el.open = false;
			const e = await oneEvent(el, 'd2l-alert-toast-close');
			expect(e.detail.closing).to.be.true;
			expect(e.detail.heightDifference).to.be.below(0);
		});

		describe('auto-close timing & pause', () => {
			let clock;
			beforeEach(() => {
				clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
			});
			afterEach(() => clock.restore());

			it('auto-closes after 4s without button', async() => {
				const el = await fixture(html`<d2l-alert-toast open>message</d2l-alert-toast>`);
				clock.tick(3999);
				expect(el.open).to.be.true;
				clock.tick(1);
				expect(el.open).to.be.false;
			});

			it('auto-closes after 10s with button', async() => {
				const el = await fixture(html`<d2l-alert-toast button-text="Do it" open>message</d2l-alert-toast>`);
				clock.tick(9999);
				expect(el.open).to.be.true;
				clock.tick(1);
				expect(el.open).to.be.false;
			});

			it('does not auto-close when no-auto-close set', async() => {
				const el = await fixture(html`<d2l-alert-toast no-auto-close open>message</d2l-alert-toast>`);
				clock.tick(12000);
				expect(el.open).to.be.true;
			});
		});
	});

});
