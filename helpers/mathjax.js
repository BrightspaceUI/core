/* When updating MathJax, update mathjaxBaseUrl to use the new version
 * and verify that the font mappings included in mathjaxFontMappings
 * match what's present in the MathJax-src repo.
 */

const mathjaxContextAttribute = 'data-mathjax-context';
const mathjaxBaseUrl = 'https://s.brightspace.com/lib/mathjax/3.2.2';

const mathjaxFontMappings = new Map([
	['MJXTEX', 'MathJax_Main-Regular'],
	['MJXTEX-B', 'MathJax_Main-Bold'],
	['MJXTEX-I', 'MathJax_Math-Italic'],
	['MJXTEX-MI', 'MathJax_Main-Italic'],
	['MJXTEX-BI', 'MathJax_Math-BoldItalic'],
	['MJXTEX-S1', 'MathJax_Size1-Regular'],
	['MJXTEX-S2', 'MathJax_Size2-Regular'],
	['MJXTEX-S3', 'MathJax_Size3-Regular'],
	['MJXTEX-S4', 'MathJax_Size4-Regular'],
	['MJXTEX-A', 'MathJax_AMS-Regular'],
	['MJXTEX-C', 'MathJax_Calligraphic-Regular'],
	['MJXTEX-CB', 'MathJax_Calligraphic-Bold'],
	['MJXTEX-FR', 'MathJax_Fraktur-Regular'],
	['MJXTEX-FRB', 'MathJax_Fraktur-Bold'],
	['MJXTEX-SS', 'MathJax_SansSerif-Regular'],
	['MJXTEX-SSB', 'MathJax_SansSerif-Bold'],
	['MJXTEX-SSI',  'MathJax_SansSerif-Italic'],
	['MJXTEX-SC', 'MathJax_Script-Regular'],
	['MJXTEX-T', 'MathJax_Typewriter-Regular'],
	['MJXTEX-V', 'MathJax_Vector-Regular'],
	['MJXTEX-VB', 'MathJax_Vector-Bold']
]);

class HtmlBlockMathRenderer {

	get contextAttributes() {
		return [mathjaxContextAttribute];
	}

	async render(elem, options) {
		if (!options.contextValues) return elem;
		const contextVal = options.contextValues.get(mathjaxContextAttribute);
		if (contextVal === undefined) return elem;

		const context = JSON.parse(contextVal) || {};

		if (!elem.querySelector('math') && !(context.renderLatex && /\$\$|\\\(|\\\[|\\begin{|\\ref{|\\eqref{/.test(elem.innerHTML))) return elem;

		const mathJaxConfig = {
			deferTypeset: true,
			renderLatex: context.renderLatex,
			outputScale: context.outputScale || 1,
			window: window
		};

		await loadMathJax(mathJaxConfig);

		// MathJax 3 does not support newlines, but it does persist styles, so add custom styles to mimic a linebreak
		// This work-around should be removed when linebreaks are natively supported.
		// MathJax issue: https://github.com/mathjax/MathJax/issues/2312
		// A duplicate that explains our exact issue: https://github.com/mathjax/MathJax/issues/2495
		elem.querySelectorAll('mspace[linebreak="newline"]').forEach(elm => {
			elm.style.display = 'block';
			elm.style.height = '0.5rem';
		});

		// If we're using deferred rendering, we need to create a document structure
		// within the element so MathJax can appropriately process math.
		if (!options.noDeferredRendering) elem.innerHTML = `<mjx-doc><mjx-head></mjx-head><mjx-body>${elem.innerHTML}</mjx-body></mjx-doc>`;

		await window.MathJax.startup.promise;
		window.D2L = window.D2L || {};

		if (!window.D2L.renderingPromise) window.D2L.renderingPromise = Promise.resolve();
		window.D2L.renderingPromise = window.D2L.renderingPromise.then(() => window.MathJax.typesetShadow(elem.getRootNode(), elem));
		await window.D2L.renderingPromise;
	}

}

export function createHtmlBlockRenderer() {
	return new HtmlBlockMathRenderer();
}

export function loadMathJax(mathJaxConfig) {

	const win = (mathJaxConfig && mathJaxConfig.window) || window;

	win.D2L = win.D2L || {};
	if (win.D2L.mathJaxLoaded) return win.D2L.mathJaxLoaded;

	win.MathJax = {
		chtml: {
			adaptiveCSS: false,
			scale: (mathJaxConfig && mathJaxConfig.outputScale) || 1
		},
		options: {
			menuOptions: {
				settings: { zoom: 'None' }
			}
		},
		loader: { load: ['ui/menu'] },
		startup: {
			ready: () => {

				// Setup for using MathJax for typesetting math in shadowDOM
				// https://github.com/mathjax/MathJax/issues/2195

				//
				//  Get some MathJax objects from the MathJax global
				//
				//  (Ideally, you would turn this into a custom component, and
				//  then these could be handled by normal imports, but this is
				//  just an example and so we use an expedient method of
				//  accessing these for now.)
				//
				const mathjax = win.MathJax._.mathjax.mathjax;
				const HTMLAdaptor = win.MathJax._.adaptors.HTMLAdaptor.HTMLAdaptor;
				const HTMLHandler = win.MathJax._.handlers.html.HTMLHandler.HTMLHandler;
				const AbstractHandler = win.MathJax._.core.Handler.AbstractHandler.prototype;
				const startup = win.MathJax.startup;

				const getFirstChild = doc => {
					const child = doc.firstChild;
					if (!child || child.nodeType === Node.ELEMENT_NODE) return child;
					else return child.nextElementSibling;
				};

				//
				//  Extend HTMLAdaptor to handle shadowDOM as the document
				//
				class ShadowAdaptor extends HTMLAdaptor {
					body(doc) {
						return doc.body || (getFirstChild(doc) || {}).lastChild || doc;
					}
					create(kind, ns) {
						const document = (this.document.createElement ? this.document : this.window.document);
						return (ns ?
							document.createElementNS(ns, kind) :
							document.createElement(kind));
					}
					head(doc) {
						return doc.head || (getFirstChild(doc) || {}).firstChild || doc;
					}
					root(doc) {
						return doc.documentElement || getFirstChild(doc) || doc;
					}
					text(text) {
						const document = (this.document.createTextNode ? this.document : this.window.document);
						return document.createTextNode(text);
					}
				}

				//
				//  Extend HTMLHandler to handle shadowDOM as document
				//
				class ShadowHandler extends HTMLHandler {
					create(document, options) {
						const adaptor = this.adaptor;
						if (typeof(document) === 'string') {
							document = adaptor.parse(document, 'text/html');
						} else if ((document instanceof adaptor.window.HTMLElement || document instanceof adaptor.window.DocumentFragment) && !(document instanceof win.ShadowRoot)) {
							const child = document;
							document = adaptor.parse('', 'text/html');
							adaptor.append(adaptor.body(document), child);
						}
						//
						//  We can't use super.create() here, since that doesn't
						//  handle shadowDOM correctly, so call HTMLHandler's parent class
						//  directly instead.
						//
						return AbstractHandler.create.call(this, document, options);
					}
				}

				//
				//  Register the new handler and adaptor
				//
				startup.registerConstructor('HTMLHandler', ShadowHandler);
				startup.registerConstructor('browserAdaptor', () => new ShadowAdaptor(win));

				//
				//  A service function that creates a new MathDocument from the
				//  shadow root with the configured input and output jax, and then
				//  renders the document.  The MathDocument is returned in case
				//  you need to rerender the shadowRoot later.
				//
				win.MathJax.typesetShadow = async function(root, elem) {
					const InputJax = startup.getInputJax();
					const OutputJax = startup.getOutputJax();
					const html = mathjax.document(root, { InputJax, OutputJax });

					if (elem) html.options.elements = [elem];

					await mathjax.handleRetriesFor(() => html.render());
					html.typeset();
				};

				//
				//  Now do the usual startup now that the extensions are in place
				//
				win.MathJax.startup.defaultReady();
			},
			// Defer typesetting if the config is present and deferring is set
			typeset: !(mathJaxConfig && mathJaxConfig.deferTypeset)
		}
	};

	if (mathJaxConfig && mathJaxConfig.deferTypeset && !win.document.head.querySelector('#d2l-mathjax-fonts') && !win.document.head.querySelector('#MJX-CHTML-styles')) {
		const styleElem = win.document.createElement('style');
		styleElem.id = 'd2l-mathjax-fonts';

		let fontImportStyles = '';
		mathjaxFontMappings.forEach((font, family) => {
			fontImportStyles +=
				`\n@font-face {
					font-family: ${family};
					src: url("${mathjaxBaseUrl}/output/chtml/fonts/woff-v2/${font}.woff") format("woff");
				}`;
		});

		styleElem.textContent = fontImportStyles;
		win.document.head.appendChild(styleElem);
	}

	win.D2L.mathJaxLoaded = new Promise(resolve => {
		const script = win.document.createElement('script');
		script.async = 'async';
		script.onload = resolve;

		const component = mathJaxConfig && mathJaxConfig.renderLatex
			? 'tex-mml-chtml'
			: 'mml-chtml';

		script.src = `${mathjaxBaseUrl}/${component}.js`;
		win.document.head.appendChild(script);
	});

	return win.D2L.mathJaxLoaded;

}
