import '../colors/colors.js';
import { codeStyles, HtmlBlockCodeRenderer } from '../../helpers/prism.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { HtmlAttributeObserverController } from '../../controllers/attributeObserver/htmlAttributeObserverController.js';
import { HtmlBlockMathRenderer } from '../../helpers/mathjax.js';
import { requestInstance } from '../../mixins/provider-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

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
			color: var(--d2l-color-ferrite, #202122);
		}
	}
	mjx-assistive-mml math {
		position: absolute;
	}
	${codeStyles}
`;

let renderers;

const getRenderers = () => {
	if (renderers) return renderers;
	const tempRenderers = requestInstance(document, 'html-block-renderers');
	const defaultRenderers = [ new HtmlBlockMathRenderer(), new HtmlBlockCodeRenderer() ];
	renderers = (tempRenderers ? [ ...defaultRenderers, ...tempRenderers ] : defaultRenderers);
	return renderers;
};

/**
 * A component for displaying user-authored HTML.
 * @slot - Provide your user-authored HTML
 */
class HtmlBlock extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Whether compact styles should be applied
			 * @type {Boolean}
			 */
			compact: { type: Boolean },
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
				text-align: left;
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
			:host([dir="rtl"]) {
				text-align: right;
			}
		`];
	}

	constructor() {
		super();
		this.compact = false;
		this.inline = false;
		this.noDeferredRendering = false;

		const rendererContextAttributes = getRenderers().reduce((attrs, currentRenderer) => {
			if (currentRenderer.contextAttributes) currentRenderer.contextAttributes.forEach(attr => attrs.push(attr));
			return attrs;
		}, []);

		if (rendererContextAttributes.length === 0) return;
		this._contextObserverController = new HtmlAttributeObserverController(this, ...rendererContextAttributes);
	}

	connectedCallback() {
		super.connectedCallback();

		if (!this._contentObserver || this.noDeferredRendering) return;

		const slot = this.shadowRoot.querySelector('slot');
		if (slot) {
			slot.assignedNodes({ flatten: true }).forEach(
				node => this._contentObserver.observe(node, { attributes: true, childList: true, subtree: true })
			);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._contentObserver) this._contentObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._updateContextKeys();
	}

	render() {
		const renderContainerClasses = {
			'd2l-html-block-rendered': true,
			'd2l-html-block-compact': this.compact
		};

		return html`
			<div class="${classMap(renderContainerClasses)}"></div>
			<slot @slotchange="${this._handleSlotChange}"></slot>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (this._contextChanged()) {
			this._render();
			this._updateContextKeys();
		}
	}

	_contextChanged() {
		if (!this._contextObserverController) return false;

		if (this._contextKeys.size !== this._contextObserverController.values.size) return true;
		for (const [attr, val] of this._contextKeys) {
			if (!this._contextObserverController.values.has(attr)) return true;
			if (this._contextObserverController.values.get(attr) !== val) return true;
		}
		return false;
	}

	async _handleSlotChange(e) {
		if (!e.target) return;
		await this._render(e.target);
	}

	async _processRenderers(elem) {
		for (const renderer of getRenderers()) {
			if (this._contextObserverController && renderer.contextAttributes) {
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

	async _render(slot) {
		if (this.noDeferredRendering) await this._renderInline(slot);
		else this._stamp(slot);
	}

	async _renderInline(slot) {
		if (!this.shadowRoot) return;
		if (!slot) slot = this.shadowRoot.querySelector('slot');

		const noDeferredRenderingContainer = slot.assignedNodes({ flatten: true })
			.find(node => (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV'));

		if (!noDeferredRenderingContainer) return;
		await this._processRenderers(noDeferredRenderingContainer);
	}

	_stamp(slot) {
		const renderContainer = this.shadowRoot.querySelector('.d2l-html-block-rendered');

		const stampHTML = async nodes => {
			renderContainer.innerHTML = '';
			if (!nodes || nodes.length === 0) return;

			// Nodes must be cloned into the render container before processing, as
			// some renderers require connected nodes (e.g. MathJax).
			nodes.forEach(node => renderContainer.appendChild(node.cloneNode(true)));
			await this._processRenderers(renderContainer);
		};

		if (this._contentObserver) this._contentObserver.disconnect();

		if (!slot) slot = this.shadowRoot.querySelector('slot');
		const slottedNodes = slot.assignedNodes({ flatten: true });

		this._contentObserver = new MutationObserver(() => stampHTML(slottedNodes));
		slottedNodes.forEach(
			node => this._contentObserver.observe(node, { attributes: true, childList: true, subtree: true })
		);

		stampHTML(slottedNodes);
	}

	_updateContextKeys() {
		if (!this._contextObserverController) return;
		if (!this._contextKeys) this._contextKeys = new Map();

		this._contextObserverController.values.forEach((val, attr) => {
			this._contextKeys.set(attr, val);
		});
	}

}

customElements.define('d2l-html-block', HtmlBlock);
