let mathJaxLoaded;

export async function htmlBlockMathRenderer(elem) {
	const isLatexSupported = window.D2L && window.D2L.LP && window.D2L.LP.Web.UI.Flags.Flag('us125413-mathjax-render-latex', true);

	if (!elem.querySelector('math') && !(isLatexSupported && /\$\$|\\\(/.test(elem.innerHTML))) return elem;

	const mathJaxConfig = { renderLatex: isLatexSupported };
	await loadMathJax(mathJaxConfig);

	const temp = document.createElement('div');
	temp.attachShadow({ mode: 'open' });
	temp.shadowRoot.innerHTML = `<div><mjx-doc><mjx-head></mjx-head><mjx-body>${elem.innerHTML}</mjx-body></mjx-doc></div>`;

	window.MathJax.typesetShadow(temp.shadowRoot);
	return temp.shadowRoot.firstChild;
}

export function loadMathJax(mathJaxConfig) {

	if (mathJaxLoaded) return mathJaxLoaded;

	window.MathJax = {
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
					html.render();
					return html;
				};

				//
				//  Now do the usual startup now that the extensions are in place
				//
				window.MathJax.startup.defaultReady();
			}
		}
	};

	mathJaxLoaded = new Promise(resolve => {
		const script = document.createElement('script');
		script.async = 'async';
		script.onload = resolve;

		const component = mathJaxConfig && mathJaxConfig.renderLatex
			? 'tex-mml-chtml'
			: 'mml-chtml';

		script.src = `https://s.brightspace.com/lib/mathjax/3.1.2/${component}.js`;
		document.head.appendChild(script);
	});

	return mathJaxLoaded;

}
