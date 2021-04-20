import '../colors/colors.js';
import { css, LitElement } from 'lit-element/lit-element.js';
import { htmlBlockMathRenderer } from '../../helpers/mathjax.js';
import { requestInstance } from '../../mixins/provider-mixin.js';

let renderers;

const getRenderers = () => {
	if (renderers) return renderers;
	const tempRenderers = requestInstance(document, 'html-block-renderers');
	renderers = (tempRenderers ? [ htmlBlockMathRenderer, ...tempRenderers ] : [ htmlBlockMathRenderer ]);
	return renderers;
};

/**
 * A component for displaying user-authored HTML.
 */
class HtmlBlock extends LitElement {

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
			::slotted(*) {
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
			mjx-assistive-mml math {
				position: absolute;
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

	constructor() {
		super();
		this._renderers = getRenderers();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._templateObserver) this._templateObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this._renderContainer) return;

		this.shadowRoot.innerHTML = '<div class="d2l-html-block-rendered"></div><slot></slot>';

		const stampHTML = async template => {
			const fragment = template ? document.importNode(template.content, true) : null;
			if (fragment) {

				let temp = document.createElement('div');
				temp.appendChild(fragment);

				// parallelize prepare (loading dependencies)
				const prepared = await Promise.all(this._renderers.map(renderer => {
					return renderer.prepare(temp);
				}));

				this._renderers.forEach((renderer, i) => {
					if (prepared[i]) temp = renderer.render(temp);
				});
				this._renderContainer.innerHTML = temp.innerHTML;

			} else {
				this._renderContainer.innerHTML = '';
			}
		};

		this.shadowRoot.querySelector('slot').addEventListener('slotchange', async e => {

			const template = e.target.assignedNodes({ flatten: true })
				.find(node => (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TEMPLATE'));

			if (this._templateObserver) this._templateObserver.disconnect();
			if (template) {
				this._templateObserver = new MutationObserver(() => stampHTML(template));
				this._templateObserver.observe(template.content, { attributes: true, childList: true, subtree: true });
			}

			stampHTML(template);

		});
		this._renderContainer = this.shadowRoot.querySelector('.d2l-html-block-rendered');

	}

}

customElements.define('d2l-html-block', HtmlBlock);
