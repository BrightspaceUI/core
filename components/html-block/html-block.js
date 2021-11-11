import '../colors/colors.js';
import { css, LitElement } from 'lit-element/lit-element.js';
import { HtmlAttributeObserverController } from '../../helpers/htmlAttributeObserverController.js';
import { HtmlBlockMathRenderer } from '../../helpers/mathjax.js';
import { requestInstance } from '../../mixins/provider-mixin.js';

export const htmlBlockContentStyles = css`
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
		color: var(--d2l-color-celestine, #006fbf);
		cursor: pointer;
		text-decoration: none;
	}
	a:hover,
	a:focus {
		color: var(--d2l-color-celestine-minus-1, #004489);
		outline-width: 0;
		text-decoration: underline;
	}
	@media print {
		a,
		a:visited,
		a:link,
		a:active {
			color: var(--d2l-color-ferrite, #494c4e);
		}
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

let renderers;

const getRenderers = () => {
	if (renderers) return renderers;
	const tempRenderers = requestInstance(document, 'html-block-renderers');
	const htmlBlockMathRenderer = new HtmlBlockMathRenderer();
	renderers = (tempRenderers ? [ htmlBlockMathRenderer, ...tempRenderers ] : [ htmlBlockMathRenderer ]);
	return renderers;
};

/**
 * A component for displaying user-authored HTML.
 * @slot - Provide an html template that contains your user-authored HTML
 */
class HtmlBlock extends LitElement {

	static get styles() {
		return [ htmlBlockContentStyles, css`
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
		`];
	}

	constructor() {
		super();
		this._contextObserverController = new HtmlAttributeObserverController(
			this,
			...getRenderers().reduce((renderers, currentRenderer) => {
				if (currentRenderer.contextAttribute) renderers.push(currentRenderer.contextAttribute);
				return renderers;
			}, [])
		);
	}

	connectedCallback() {
		super.connectedCallback();
		this._contextObserverController.hostConnected();

		if (!this._templateObserver) return;

		const template = this.querySelector('template');
		if (template) this._templateObserver.observe(template.content, { attributes: true, childList: true, subtree: true });
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._contextObserverController.hostDisconnected();
		if (this._templateObserver) this._templateObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this._renderContainer) return;

		this.shadowRoot.innerHTML += '<div class="d2l-html-block-rendered"></div><slot></slot>';

		this.shadowRoot.querySelector('slot').addEventListener('slotchange', async e => {

			const template = e.target.assignedNodes({ flatten: true })
				.find(node => (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TEMPLATE'));

			this._stamp(template);

		});
		this._renderContainer = this.shadowRoot.querySelector('.d2l-html-block-rendered');
		this._context = { ...this._contextObserverController.values };
	}

	updated() {
		super.updated();
		if (this._contextObjectHasChanged()) {
			const template = this.querySelector('template');
			this._stamp(template);
		}
	}

	_contextObjectHasChanged() {
		if (this._context.size !== this._contextObserverController.values.size) return true;
		for (const [attr, val] of this._context) {
			if (!this._contextObserverController.values.has(attr)) return true;
			if (this._contextObserverController.values.get(attr) !== val) return true;
		}
		return false;
	}

	_stamp(template) {
		const stampHTML = async template => {
			const fragment = template ? document.importNode(template.content, true) : null;
			if (fragment) {

				let temp = document.createElement('div');
				temp.appendChild(fragment);

				for (const renderer of getRenderers()) {
					if (renderer.contextAttribute) {
						temp = await renderer.render(temp, this._contextObserverController.values.get(renderer.contextAttribute));
					} else {
						temp = await renderer.render(temp);
					}
				}
				this._renderContainer.innerHTML = temp.innerHTML;

			} else {
				this._renderContainer.innerHTML = '';
			}
		};

		if (this._templateObserver) this._templateObserver.disconnect();
		if (template) {
			this._templateObserver = new MutationObserver(() => stampHTML(template));
			this._templateObserver.observe(template.content, { attributes: true, childList: true, subtree: true });
		}

		stampHTML(template);
	}

}

customElements.define('d2l-html-block', HtmlBlock);
