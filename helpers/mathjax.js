/* When updating MathJax, update mathjaxBaseUrl to use the new version
 * and verify that the font mappings included in mathjaxFontMappings
 * match what's present in the MathJax-src repo.
 */

const mathjaxContextAttribute = 'data-mathjax-context';
const mathjaxBaseUrl = 'https://s.brightspace.com/lib/mathjax/3.1.2';

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

let mathJaxLoaded;

export class HtmlBlockMathRenderer {

	get contextAttributes() {
		return [mathjaxContextAttribute];
	}

	async render(elem, options) {
		if (!options.contextValues) return elem;
		const contextVal = options.contextValues.get(mathjaxContextAttribute);
		if (contextVal === undefined) return elem;

		const context = JSON.parse(contextVal) || {};
		const isLatexSupported = context.renderLatex;

		if (!elem.querySelector('math') && !(isLatexSupported && /\$\$|\\\(|\\\[|\\begin{|\\ref{|\\eqref{/.test(elem.innerHTML))) return elem;

		const mathJaxConfig = {
			deferTypeset: true,
			renderLatex: isLatexSupported,
			outputScale: context.outputScale || 1
		};

		await loadMathJax(mathJaxConfig);

		// If we're opting out of deferred rendering, we need to rely
		// on the global MathJax install for rendering.
		if (options.noDeferredRendering) {
			await window.MathJax.startup.promise;
			window.MathJax.typeset([elem]);
			return elem;
		}

		const temp = document.createElement('div');
		temp.style.display = 'none';
		temp.attachShadow({ mode: 'open' });
		temp.shadowRoot.innerHTML = `<div><mjx-doc><mjx-head></mjx-head><mjx-body>${elem.innerHTML}</mjx-body></mjx-doc></div>`;

		elem.appendChild(temp);
		await window.MathJax.startup.promise;
		window.MathJax.typesetShadow(temp.shadowRoot);
		return temp.shadowRoot.firstChild;
	}

}

export function loadMathJax(mathJaxConfig) {

	if (mathJaxLoaded) return mathJaxLoaded;

	window.MathJax = {
		chtml: {
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
				const mathjax = window.MathJax._.mathjax.mathjax;
				const HTMLAdaptor = window.MathJax._.adaptors.HTMLAdaptor.HTMLAdaptor;
				const HTMLHandler = window.MathJax._.handlers.html.HTMLHandler.HTMLHandler;
				const AbstractHandler = window.MathJax._.core.Handler.AbstractHandler.prototype;
				const startup = window.MathJax.startup;

				//
				//  Extend HTMLAdaptor to handle shadowDOM as the document
				//
				class ShadowAdaptor extends HTMLAdaptor {
					body(doc) {
						return doc.body || (doc.firstChild || {}).lastChild || doc;
					}
					create(kind, ns) {
						const document = (this.document.createElement ? this.document : this.window.document);
						return (ns ?
							document.createElementNS(ns, kind) :
							document.createElement(kind));
					}
					head(doc) {
						return doc.head || (doc.firstChild || {}).firstChild || doc;
					}
					root(doc) {
						return doc.documentElement || doc.firstChild || doc;
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
						} else if ((document instanceof adaptor.window.HTMLElement || document instanceof adaptor.window.DocumentFragment) && !(document instanceof window.ShadowRoot)) {
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
				startup.registerConstructor('browserAdaptor', () => new ShadowAdaptor(window));

				//
				//  A service function that creates a new MathDocument from the
				//  shadow root with the configured input and output jax, and then
				//  renders the document.  The MathDocument is returned in case
				//  you need to rerender the shadowRoot later.
				//
				window.MathJax.typesetShadow = function(root) {
					const InputJax = startup.getInputJax();
					const OutputJax = startup.getOutputJax();
					const html = mathjax.document(root, { InputJax, OutputJax });
					html.render().typeset();
					return html;
				};

				//
				//  Now do the usual startup now that the extensions are in place
				//
				window.MathJax.startup.defaultReady();
			},
			// Defer typesetting if the config is present and deferring is set
			typeset: !(mathJaxConfig && mathJaxConfig.deferTypeset)
		}
	};

	if (mathJaxConfig && mathJaxConfig.deferTypeset && !document.head.querySelector('#d2l-mathjax-fonts') && !document.head.querySelector('#MJX-CHTML-styles')) {
		const styleElem = document.createElement('style');
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
		document.head.appendChild(styleElem);
	}

	mathJaxLoaded = new Promise(resolve => {
		const script = document.createElement('script');
		script.async = 'async';
		script.onload = resolve;

		const component = mathJaxConfig && mathJaxConfig.renderLatex
			? 'tex-mml-chtml'
			: 'mml-chtml';

		script.src = `${mathjaxBaseUrl}/${component}.js`;
		document.head.appendChild(script);
	});

	return mathJaxLoaded;

}
