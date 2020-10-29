import '../colors/colors.js';
import { css, LitElement } from 'lit-element/lit-element.js';

let mathJaxLoaded;

const loadMathJax = () => {

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
			script.src = 'https://s.brightspace.com/lib/mathjax/3.1.2/mml-chtml.js';
			document.head.appendChild(script);
	});

	return mathJaxLoaded;

};

/**
 * A component for displaying user-authored HTML.
 */
class HtmlBlock extends LitElement {

	static get properties() {
		return {
			/**
			 * The HTML to be rendered
			 */
			html: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
				overflow-wrap: break-word;
				overflow-x: auto;
				overflow-y: hidden;
				position: relative;
				text-align: left;
			}
			:host([hidden]) {
				display: none;
			}
			h1, h2, h3, h4, h5, h6, b, strong, b *, strong * {
				font-weight: bold;
			}
			h1 {
				font-size: 2em;
				line-height: 37px;
				margin: 21.43px 0;
			}
			h2 {
				font-size: 1.5em;
				line-height: 27px;
				margin: 19.92px 0;
			}
			h3 {
				font-size: 1.2em;
				line-height: 23px;
				margin: 18.72px 0;
			}
			h4 {
				font-size: 1em;
				line-height: 20px;
				margin: 21.28px 0;
			}
			h5 {
				font-size: 0.83em;
				line-height: 16px;
				margin: 22.13px 0;
			}
			h6 {
				font-size: 0.67em;
				line-height: 13px;
				margin: 24.97px 0;
			}
			pre {
				font-family: Monospace;
				font-size: 13px;
				margin: 13px 0;
			}
			p {
				margin: 0.5em 0 1em 0;
			}
			ul, ol {
				list-style-position: outside;
				margin: 1em 0;
				padding-left: 3em;
			}
			ul, ul[type="disc"] {
				list-style-type: disc;
			}
			ul ul, ul ol,
			ol ul, ol ol {
				margin-bottom: 0;
				margin-top: 0;
			}
			ul ul, ol ul, ul[type="circle"] {
				list-style-type: circle;
			}
			ul ul ul, ul ol ul,
			ol ul ul, ol ol ul,
			ul[type="square"] {
				list-style-type: square;
			}
			a,
			a:visited,
			a:link,
			a:active {
				color: var(--d2l-color-celestine);
				cursor: pointer;
				text-decoration: none;
			}
			a:hover,
			a:focus {
				color: var(--d2l-color-celestine-minus-1);
				outline-width: 0;
				text-decoration: underline;
			}
			:host([dir="rtl"]) {
				text-align: right;
			}
			:host([dir="rtl"]) ul,
			:host([dir="rtl"]) ol {
				padding-left: 0;
				padding-right: 3em;
			}
		`;
	}

	async updated(changedProperties) {
		super.updated(changedProperties);

		if (!changedProperties.has('html')) return;

		if (this._hasMath()) {

			await loadMathJax();
			this.shadowRoot.innerHTML = `<mjx-doc><mjx-head></mjx-head><mjx-body>${this.html}</mjx-body></mjx-doc>`;

			if (window.MathJax.typesetShadow) {
				window.MathJax.typesetShadow(this.shadowRoot);
			}

		} else {
			this.shadowRoot.innerHTML = this.html;
		}

	}

	_hasMath() {
		const temp = document.createElement('div');
		temp.innerHTML = this.html;
		return temp.querySelector('math');
	}

}

customElements.define('d2l-html-block', HtmlBlock);
