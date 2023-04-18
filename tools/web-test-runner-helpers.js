export { aTimeout, defineCE, expect, html, nextFrame, oneEvent, waitUntil } from '@open-wc/testing';
import { executeServerCommand, sendKeys, sendMouse, setViewport } from '@web/test-runner-commands';
import { expect, nextFrame, fixture as wcFixture } from '@open-wc/testing';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { getComposedChildren } from '../helpers/dom.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

const DEFAULT_LANG = 'en',
	DEFAULT_VIEWPORT_HEIGHT = 800,
	DEFAULT_VIEWPORT_WIDTH = 800;

let currentLang = DEFAULT_LANG,
	currentTheme = undefined,
	currentRtl = false,
	currentViewportHeight = DEFAULT_VIEWPORT_HEIGHT,
	currentViewportWidth = DEFAULT_VIEWPORT_WIDTH,
	mouseResetNeeded = false;

let awaitedFonts = false;
async function waitForFonts() {
	if (awaitedFonts) return Promise.resolve();
	awaitedFonts = true;
	return await document.fonts.ready;
}

export const WaitForMeMixin = dedupeMixin(superclass => class extends superclass {

	constructor() {
		super();
		this._waitKey = 0;
		this._waitPromises = new Map();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._waitPromises.forEach((_value, key) => this.clearWaitHandle(key));
	}

	clearWaitHandle(handle) {
		const entry = this._waitPromises.get(handle);
		if (entry !== undefined) {
			this._waitPromises.delete(handle);
			entry.resolve();
		}
	}

	setWaitHandle() {
		const handle = ++this._waitKey;
		let resolve;
		const promise = new Promise((res) => {
			resolve = res;
		});
		this._waitPromises.set(handle, { promise, resolve });
		return handle;
	}

	waitForIt() {
		const promises = [];
		this._waitPromises.forEach((value) => promises.push(value.promise));
		return Promise.all(promises);
	}

});

async function waitForElem(elem, depth) {
	const myDepth = depth + 1;
	const spaces = ' '.repeat(myDepth);
	let hasUpdateComplete = false;

	const update = elem?.updateComplete;
	if (typeof update === 'object' && Promise.resolve(update) === update) {
		if (elem.waitForIt !== undefined) {
			await elem.waitForIt();
		}
		await update;
		await nextFrame();
		hasUpdateComplete = true;
	}

	const children = getComposedChildren(elem);
	//console.log(`${spaces}${elem.tagName} ${hasUpdateComplete} ${children?.length || 0}`);
	if (children !== null) {
		await Promise.all(children.map(e => waitForElem(e, myDepth)));
	}
}

export const fixture = async(element, opts) => {
	await Promise.all([reset(opts), waitForFonts()]);
	const elem = await wcFixture(element);
	await waitForElem(elem, -1);
	return elem;
};

export const focusWithKeyboard = async(element) => {
	await sendKeys({ press: 'Escape' });
	element.focus({ focusVisible: true });
};

export const focusWithMouse = async(element) => {
	const { height, width, x, y } = element.getBoundingClientRect();
	await sendMouse({ type: 'click', position: [Math.ceil(x + width / 2), Math.ceil(y + height / 2)] });
	await sendMouse({ type: 'move', position: [0, 0] });
};

export const hoverWithMouse = async(element) => {
	mouseResetNeeded = true;
	const { height, width, x, y } = element.getBoundingClientRect();
	await sendMouse({ type: 'move', position: [Math.ceil(x + width / 2), Math.ceil(y + height / 2)] });
};

async function reset(opts) {

	opts = opts || {};
	opts.lang = opts.lang || DEFAULT_LANG;
	opts.rtl = opts.lang.startsWith('ar') || !!opts.rtl;
	opts.viewport = opts.viewport || {};
	opts.viewport.height = opts.viewport.height || DEFAULT_VIEWPORT_HEIGHT;
	opts.viewport.width = opts.viewport.width || DEFAULT_VIEWPORT_WIDTH;

	let awaitNextFrame = false;

	window.scroll(0, 0);

	if (mouseResetNeeded) {
		mouseResetNeeded = false;
		await sendMouse({ type: 'move', position: [0, 0] });
	}

	if (opts?.theme !== currentTheme) {
		if (opts?.theme !== undefined) {
			document.body.setAttribute('data-theme', opts.theme);
		} else {
			document.body.removeAttribute('data-theme');
		}
		awaitNextFrame = true;
		currentTheme = opts?.theme;
	}

	if (opts.rtl !== currentRtl) {
		document.documentElement.setAttribute('dir', opts.rtl ? 'rtl' : 'ltr');
		awaitNextFrame = true;
		currentRtl = opts.rtl;
	}

	if (opts.lang !== currentLang) {
		getDocumentLocaleSettings().language = opts.lang;
		currentLang = opts.lang;
		awaitNextFrame = true;
	}

	if (opts.viewport.height !== currentViewportHeight || opts.viewport.width !== currentViewportWidth) {
		await setViewport(opts.viewport);
		awaitNextFrame = true;
		currentViewportHeight = opts.viewport.height;
		currentViewportWidth = opts.viewport.width;
	}

	// TODO: reset focus

	if (awaitNextFrame) {
		await nextFrame();
	}

}

export const screenshotAndCompare = async(elem, name, opts) => {

	const rect = elem.getBoundingClientRect();
	const { pass, message } = await executeServerCommand('brightspace-visual-diff', { name, rect, opts });
	expect(pass, message).to.be.true;

};
