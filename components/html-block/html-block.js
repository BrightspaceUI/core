import '../colors/colors.js';
import { codeStyles, createHtmlBlockRenderer as createCodeRenderer } from '../../helpers/prism.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createHtmlBlockRenderer as createMathRenderer } from '../../helpers/mathjax.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { HtmlAttributeObserverController } from '../../controllers/attributeObserver/htmlAttributeObserverController.js';

import { requestInstance } from '../../mixins/provider/provider-mixin.js';

export const htmlBlockContentStyles = css`
	.d2l-html-block-rendered {
		line-height: 1.47; /* 1.4rem / 0.95rem */
	}
	.d2l-html-block-rendered > :first-child {
		margin-top: 0;
	}
	.d2l-html-block-rendered > :last-child {
		margin-bottom: 0;
	}
	.d2l-html-block-compact {
		font-size: 0.8rem;
		font-weight: 400;
		line-height: 1.5; /* 1.2rem / 0.8rem */
	}
	h1, h2, h3, h4, h5, h6, b, strong, b *, strong * {
		font-weight: bold;
	}
	h1 {
		font-size: 2em;
		line-height: 1;
		margin: 21px 0;
	}
	h2 {
		font-size: 1.5em;
		line-height: 1;
		margin: 20px 0;
	}
	h3 {
		font-size: 1.2em;
		line-height: 1;
		margin: 19px 0;
	}
	h4 {
		font-size: 1em;
		line-height: 1.05;
		margin: 21px 0;
	}
	h5 {
		font-size: 0.83em;
		line-height: 1;
		margin: 22px 0;
	}
	h6 {
		font-size: 0.67em;
		line-height: 1;
		margin: 25px 0;
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
		padding-inline-start: 3em;
	}
	.d2l-html-block-compact ul,
	.d2l-html-block-compact ol {
		padding-inline-start: 1.5em;
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
	a:hover {
		color: var(--d2l-color-celestine-minus-1, #004489);
		text-decoration: underline;
	}
	a:${unsafeCSS(getFocusPseudoClass())} {
		border-radius: 2px;
		outline: 2px solid var(--d2l-color-celestine, #006fbf);
		outline-offset: 1px;
		text-decoration: underline;
	}
	@media print {
		a,
		a:visited,
		a:link,
		a:active {
			color: var(--d2l-color-ferrite, #202122);
		}
	}
	mjx-assistive-mml math {
		position: absolute;
	}
	${codeStyles}
`;

let renderers;

const getRenderers = async() => {
	if (renderers) return renderers;
	const rendererLoader = requestInstance(document, 'html-block-renderer-loader');
	const tempRenderers = rendererLoader ? await rendererLoader.getRenderers() : undefined;
	const defaultRenderers = [ createMathRenderer(), createCodeRenderer() ];
	renderers = (tempRenderers ? [ ...defaultRenderers, ...tempRenderers ] : defaultRenderers);
	return renderers;
};

/**
 * A component for displaying user-authored HTML.
 * @slot - Provide your user-authored HTML
 */
class HtmlBlock extends LitElement {

	static get properties() {
		return {
			/**
			 * Whether compact styles should be applied
			 * @type {Boolean}
			 */
			compact: { type: Boolean },
			/**
			 * The HTML to be rendered. Ignored if slotted content is provided.
			 * @type {String}
			 */
			html: { type: String },
			/**
			 * Whether to display the HTML in inline mode
			 * @type {Boolean}
			 */
			inline: { type: Boolean },
			/**
			 * Whether to disable deferred rendering of the user-authored HTML. Do *not* set this
			 * unless your HTML relies on script executions that may break upon stamping.
			 * @type {Boolean}
			 */
			noDeferredRendering: { type: Boolean, attribute: 'no-deferred-rendering' }
		};
	}

	static get styles() {
		return [ htmlBlockContentStyles, css`
			:host {
				display: block;
				overflow-wrap: break-word;
				overflow-x: auto;
				overflow-y: hidden;
				text-align: start;
			}
			:host([inline]),
			:host([inline]) .d2l-html-block-rendered {
				display: inline;
			}
			:host([hidden]),
			:host([no-deferred-rendering]) .d2l-html-block-rendered,
			slot {
				display: none;
			}
			:host([no-deferred-rendering]) slot {
				display: contents;
			}
		`];
	}

	constructor() {
		super();
		this.compact = false;
		this.html = '';
		this.inline = false;
		this.noDeferredRendering = false;

		this._contextObserverControllerResolve = undefined;
		this._contextObserverControllerInitialized = new Promise(resolve => {
			this._contextObserverControllerResolve = resolve;
		});

		getRenderers().then(renderers => renderers.reduce((attrs, currentRenderer) => {
			if (currentRenderer.contextAttributes) currentRenderer.contextAttributes.forEach(attr => attrs.push(attr));
			return attrs;
		}, [])).then(rendererContextAttributes => {
			this._contextObserverController = new HtmlAttributeObserverController(this, ...rendererContextAttributes);
			this._contextObserverControllerResolve();
		});
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._updateContextKeys();
	}

	render() {
		this._validateHtml();

		const renderContainerClasses = {
			'd2l-html-block-rendered': true,
			'd2l-html-block-compact': this.compact
		};

		return html`
			<div class="${classMap(renderContainerClasses)}"></div>
			${this.noDeferredRendering ? html`<slot @slotchange="${this._handleSlotChange}"></slot>` : ''}
		`;
	}

	async updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('html') && this.html !== undefined && this.html !== null && !this.noDeferredRendering) {
			await this._updateRenderContainer();
		}
		if (await this._contextChanged()) {
			if (this.noDeferredRendering) this._renderInline();
			else if (this.html !== undefined && this.html !== null) {
				await this._updateRenderContainer();
			}

			this._updateContextKeys();
		}
	}

	async _contextChanged() {
		await this._contextObserverControllerInitialized;
		if (!this._contextKeys) {
			this._updateContextKeys();
			return true;
		}

		if (this._contextKeys.size !== this._contextObserverController.values.size) return true;
		for (const [attr, val] of this._contextKeys) {
			if (!this._contextObserverController.values.has(attr)) return true;
			if (this._contextObserverController.values.get(attr) !== val) return true;
		}
		return false;
	}

	async _handleSlotChange(e) {
		if (!e.target || !this.shadowRoot || !this.noDeferredRendering) return;
		await this._renderInline(e.target);
	}

	async _processRenderers(elem) {
		await this._contextObserverControllerInitialized;
		const renderers = await getRenderers();
		for (const renderer of renderers) {
			if (renderer.contextAttributes) {
				const contextValues = new Map();
				renderer.contextAttributes.forEach(attr => contextValues.set(attr, this._contextObserverController.values.get(attr)));
				await renderer.render(elem, {
					contextValues: contextValues,
					noDeferredRendering: this.noDeferredRendering
				});
			} else {
				await renderer.render(elem, {
					noDeferredRendering: this.noDeferredRendering
				});
			}
		}
	}

	async _renderInline(slot) {
		if (!this.shadowRoot) return;
		if (!slot) slot = this.shadowRoot.querySelector('slot');

		const noDeferredRenderingContainer = slot.assignedNodes({ flatten: true })
			.find(node => (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV'));

		if (!noDeferredRenderingContainer) return;
		await this._processRenderers(noDeferredRenderingContainer);
	}

	_updateContextKeys() {
		if (!this._contextObserverController) return;
		if (!this._contextKeys) this._contextKeys = new Map();

		this._contextObserverController.values.forEach((val, attr) => {
			this._contextKeys.set(attr, val);
		});
	}

	async _updateRenderContainer() {
		const renderContainer = this.shadowRoot.querySelector('.d2l-html-block-rendered');
		renderContainer.innerHTML = this.html;
		await this._processRenderers(renderContainer);
	}

	_validateHtml() {
		if (this._validatingHtmlTimeout) clearTimeout(this._validatingHtmlTimeout);

		this._validatingHtmlTimeout = setTimeout(() => {
			this._validatingHtmlTimeout = undefined;
			if (this.html && this.noDeferredRendering) {
				throw new Error('<d2l-html-block>: Cannot use html attribute with no-deferred-rendering.');
			}
		}, 3000);
	}

}

customElements.define('d2l-html-block', HtmlBlock);
