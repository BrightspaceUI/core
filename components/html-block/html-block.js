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

	static get properties() {
		return {
			_noDeferredRendering: { Type: Boolean, attribute: 'no-deferred-rendering', reflect: true }
		};
	}

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
			:host([no-deferred-rendering="true"]) div.d2l-html-block-rendered {
				display: none;
			}
			:host([no-deferred-rendering="false"])::slotted(*) {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this._noDeferredRendering = false;

		const rendererContextAttributes = getRenderers().reduce((attrs, currentRenderer) => {
			if (currentRenderer.contextAttributes) currentRenderer.contextAttributes.forEach(attr => attrs.push(attr));
			return attrs;
		}, []);

		if (rendererContextAttributes.length === 0) return;
		this._contextObserverController = new HtmlAttributeObserverController(this, ...rendererContextAttributes);
	}

	connectedCallback() {
		super.connectedCallback();
		if (this._contextObserverController) this._contextObserverController.hostConnected();

		if (!this._templateObserver) return;

		const template = this.querySelector('template');
		if (template) this._templateObserver.observe(template.content, { attributes: true, childList: true, subtree: true });
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._contextObserverController) this._contextObserverController.hostDisconnected();
		if (this._templateObserver) this._templateObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this._renderContainer) return;

		this.shadowRoot.innerHTML += '<div class="d2l-html-block-rendered"></div><slot></slot>';

		this.shadowRoot.querySelector('slot').addEventListener('slotchange', async e => {

			const template = e.target.assignedNodes({ flatten: true })
				.find(node => (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TEMPLATE'));

			if (template) this._stamp(template);
			else this._renderInline();

		});
		this._renderContainer = this.shadowRoot.querySelector('.d2l-html-block-rendered');
		this._context = this._contextObserverController ? { ...this._contextObserverController.values } : {};
	}

	updated() {
		super.updated();
		if (this._contextObserverController && this._contextObjectHasChanged()) {
			const template = this.querySelector('template');
			if (template) this._stamp(template);
			else this._renderInline();
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

	async _render(elem) {
		for (const renderer of getRenderers()) {
			if (this._noDeferredRendering && !renderer.canRenderInline) continue;

			if (this._contextObserverController && renderer.contextAttributes) {
				const contextValues = new Map();
				renderer.contextAttributes.forEach(attr => contextValues.set(attr, this._contextObserverController.values.get(attr)));
				elem = await renderer.render(elem, contextValues);
			} else {
				elem = await renderer.render(elem);
			}
		}

		return elem;
	}

	async _renderInline() {
		const noDeferredRenderingContainer = this.querySelector('div.no-deferred-rendering');
		if (!noDeferredRenderingContainer) return;

		this._noDeferredRendering = true;
		await this._render(noDeferredRenderingContainer);
	}

	_stamp(template) {
		const stampHTML = async template => {
			const fragment = template ? document.importNode(template.content, true) : null;
			if (fragment) {

				let temp = document.createElement('div');
				temp.appendChild(fragment);

				temp = await this._render(temp);
				this._renderContainer.innerHTML = temp.innerHTML;

			} else {
				this._renderContainer.innerHTML = '';
			}
		};

		if (this._templateObserver) this._templateObserver.disconnect();
		if (template) {
			this._noDeferredRendering = false;
			this._templateObserver = new MutationObserver(() => stampHTML(template));
			this._templateObserver.observe(template.content, { attributes: true, childList: true, subtree: true });
		}

		stampHTML(template);
	}

}

customElements.define('d2l-html-block', HtmlBlock);
