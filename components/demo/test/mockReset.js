import { setViewport as cmdSetViewport, emulateMedia, sendMouse } from '@web/test-runner-commands';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { nextFrame } from '@open-wc/testing';

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
