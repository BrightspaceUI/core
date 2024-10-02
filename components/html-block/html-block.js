import '../colors/colors.js';
import { codeStyles, createHtmlBlockRenderer as createCodeRenderer } from '../../helpers/prism.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createHtmlBlockRenderer as createMathRenderer } from '../../helpers/mathjax.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { LoadingCompleteMixin } from '../../mixins/loading-complete/loading-complete-mixin.js';
import { renderEmbeds } from '../../helpers/embeds.js';
import { requestInstance } from '../../mixins/provider/provider-mixin.js';
import { tryGet } from '@brightspace-ui/lms-context-provider/client.js';

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
	ul ul,
	ul ol,
	ol ul,
	ol ol {
		margin-bottom: 0;
		margin-top: 0;
	}
	ul ul,
	ol ul,
	ul[type="circle"] {
		list-style-type: circle;
	}
	ul ul ul,
	ul ol ul,
	ol ul ul,
	ol ol ul,
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
 */
class HtmlBlock extends LoadingCompleteMixin(LitElement) {

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
			noDeferredRendering: { type: Boolean, attribute: 'no-deferred-rendering' },
			_context: { type: Object, state: true }
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

		this._context = new Map();
		this._initialContextResolve = undefined;
		this._initialContextPromise = new Promise(resolve => this._initialContextResolve = resolve);

		this._renderContainerRef = createRef();

		const contextKeysPromise = getRenderers().then(renderers => renderers.reduce((keys, currentRenderer) => {
			if (currentRenderer.contextKeys) currentRenderer.contextKeys.forEach(key => keys.push(key));
			return keys;
		}, []));

		const contextValsPromise = contextKeysPromise.then(contextKeys => {
			return Promise.allSettled(contextKeys.map(key => {
				return tryGet(key, undefined, ctx => this._context.set(key, ctx));
			}));
		});

		Promise.all([contextKeysPromise, contextValsPromise]).then(([contextKeys, contextResults]) => {
			contextKeys.forEach((key, index) => this._context.set(key, contextResults[index].value));
			this._initialContextResolve();
		});
	}

	render() {
		this._validateHtml();

		const renderContainerClasses = {
			'd2l-html-block-rendered': true,
			'd2l-html-block-compact': this.compact
		};

		return html`
			<div class="${classMap(renderContainerClasses)}" ${ref(this._renderContainerRef)}></div>
			${this.noDeferredRendering ? html`<slot @slotchange="${this._handleSlotChange}"></slot>` : ''}
		`;
	}

	async updated(changedProperties) {
		super.updated(changedProperties);
		if (this.html !== undefined && this.html !== null && !this.noDeferredRendering) {
			await this._updateRenderContainer();
		}
	}

	async _handleSlotChange(e) {
		if (!e.target || !this.shadowRoot || !this.noDeferredRendering) return;
		await this._renderInline(e.target);
	}

	async _processEmbeds() {
		const htmlFragment = document.createRange().createContextualFragment(this.html);
		await renderEmbeds(htmlFragment);
		return htmlFragment;
	}

	async _processRenderers(elem) {
		await this._initialContextPromise;
		const renderers = await getRenderers();
		const loadingCompletePromises = [];
		for (const renderer of renderers) {
			if (renderer.contextKeys) {
				const contextValues = new Map();
				renderer.contextKeys.forEach(key => contextValues.set(key, this._context.get(key)));
				await renderer.render(elem, {
					contextValues: contextValues,
					noDeferredRendering: this.noDeferredRendering
				});
			} else {
				await renderer.render(elem, {
					noDeferredRendering: this.noDeferredRendering
				});
			}
			if (typeof renderer.getLoadingComplete === 'function') {
				loadingCompletePromises.push(renderer.getLoadingComplete());
			}
		}
		Promise.all(loadingCompletePromises).then(this.resolveLoadingComplete);
	}

	async _renderInline(slot) {
		if (!this.shadowRoot) return;
		if (!slot) slot = this.shadowRoot.querySelector('slot');

		const noDeferredRenderingContainer = slot.assignedNodes({ flatten: true })
			.find(node => (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV'));

		if (!noDeferredRenderingContainer) {
			this.resolveLoadingComplete();
			return;
		}
		await this._processRenderers(noDeferredRenderingContainer);
	}

	async _updateRenderContainer() {
		if (!this._renderContainerRef.value) return;
		this._renderContainerRef.value.innerHTML = '';
		this._renderContainerRef.value.append(await this._processEmbeds());
		await this._processRenderers(this._renderContainerRef.value);
	}

	_validateHtml() {
		if (this._validatingHtmlTimeout) clearTimeout(this._validatingHtmlTimeout);

		this._validatingHtmlTimeout = setTimeout(() => {
			this._validatingHtmlTimeout = undefined;
			if (this.html && this.noDeferredRendering) {
				throw new Error('<d2l-html-block>: "html" attribute is not supported with "no-deferred-rendering".');
			}
		}, 3000);
	}

}

customElements.define('d2l-html-block', HtmlBlock);
