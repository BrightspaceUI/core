import '../colors/colors.js';
import { codeStyles, createHtmlBlockRenderer as createCodeRenderer } from '../../helpers/prism.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { _isValidCssSelector } from '../../helpers/internal/css.js';
import { classMap } from 'lit/directives/class-map.js';
import { createHtmlBlockRenderer as createMathRenderer } from '../../helpers/mathjax.js';
import { getFocusRingStyles } from '../../helpers/focus.js';
import { LoadingCompleteMixin } from '../../mixins/loading-complete/loading-complete-mixin.js';
import { renderEmbeds } from '../../helpers/embeds.js';
import { requestInstance } from '../../mixins/provider/provider-mixin.js';
import { tryGet } from '@brightspace-ui/lms-context-provider/client.js';

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateHtmlBlockContainerStyles = (selector) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	return css`
		${selector} {
			line-height: 1.47; /* 1.4rem / 0.95rem */
		}
		${selector} > :first-child {
			margin-top: 0;
		}
		${selector} > :last-child {
			margin-bottom: 0;
		}
	`;
};

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateHtmlBlockRootStyles = (selector) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	return css`
		${selector} {
			overflow-wrap: break-word;
			overflow-x: auto;
			overflow-y: hidden;
			text-align: start;
		}
	`;
};

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateHtmlBlockContentStyles = (selector) => {
	if (selector && !_isValidCssSelector(selector)) {
		return;
	} else if (!selector) {
		selector = '';
	}

	selector = unsafeCSS(selector);
	return css`
		${selector} h1,
		${selector} h2,
		${selector} h3,
		${selector} h4,
		${selector} h5,
		${selector} h6,
		${selector} b,
		${selector} strong,
		${selector} b *,
		${selector} strong * {
			font-weight: bold;
		}

		${selector} h1 {
			font-size: 2em;
			line-height: 1;
			margin: 21px 0;
		}
		${selector} h2 {
			font-size: 1.5em;
			line-height: 1;
			margin: 20px 0;
		}
		${selector} h3 {
			font-size: 1.2em;
			line-height: 1;
			margin: 19px 0;
		}
		${selector} h4 {
			font-size: 1em;
			line-height: 1.05;
			margin: 21px 0;
		}
		${selector} h5 {
			font-size: 0.83em;
			line-height: 1;
			margin: 22px 0;
		}
		${selector} h6 {
			font-size: 0.67em;
			line-height: 1;
			margin: 25px 0;
		}
		${selector} pre {
			font-family: Monospace;
			font-size: 13px;
			margin: 13px 0;
		}
		${selector} p {
			margin: 0.5em 0 1em 0;
		}
		${selector} ul,
		${selector} ol {
			list-style-position: outside;
			margin: 1em 0;
			padding-inline-start: 3em;
		}
		${selector} ul,
		${selector} ul[type="disc"] {
			list-style-type: disc;
		}
		${selector} ul ul,
		${selector} ul ol,
		${selector} ol ul,
		${selector} ol ol {
			margin-bottom: 0;
			margin-top: 0;
		}
		${selector} ul ul,
		${selector} ol ul,
		${selector} ul[type="circle"] {
			list-style-type: circle;
		}
		${selector} ul ul ul,
		${selector} ul ol ul,
		${selector} ol ul ul,
		${selector} ol ol ul,
		${selector} ul[type="square"] {
			list-style-type: square;
		}
		${selector} a,
		${selector} a:visited,
		${selector} a:link,
		${selector} a:active {
			color: var(--d2l-color-celestine, #006fbf);
			cursor: pointer;
			text-decoration: none;
		}
		${selector} a:hover {
			color: var(--d2l-color-celestine-minus-1, #004489);
			text-decoration: underline;
		}
		${selector} a {
			--d2l-focus-ring-offset: 1px;
			--d2l-focus-ring-color: var(--d2l-color-celestine, #006fbf);
		}
		${getFocusRingStyles(`${selector} a`, { extraStyles: css`border-radius: 2px; text-decoration: underline;` })}
		@media print {
			${selector} a,
			${selector} a:visited,
			${selector} a:link,
			${selector} a:active {
				color: var(--d2l-color-ferrite, #202122);
			}
		}
		${selector} mjx-assistive-mml math {
			position: absolute;
		}
	`;
};

export const htmlBlockContentStyles = css`
	${_generateHtmlBlockContainerStyles('.d2l-html-block-rendered')}
	.d2l-html-block-compact {
		font-size: 0.8rem;
		font-weight: 400;
		line-height: 1.5; /* 1.2rem / 0.8rem */
	}
	${_generateHtmlBlockContentStyles()}
	.d2l-html-block-compact ul,
	.d2l-html-block-compact ol {
		padding-inline-start: 1.5em;
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
			}
			${_generateHtmlBlockRootStyles(':host')}
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
			<div class="${classMap(renderContainerClasses)}"></div>
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
		const renderContainer = this.shadowRoot?.querySelector('.d2l-html-block-rendered');
		if (!renderContainer) return;
		renderContainer.innerHTML = '';
		renderContainer.append(await this._processEmbeds());
		await this._processRenderers(renderContainer);
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
