import '../link/link.js';
import { emptyStateIllustratedStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement, nothing } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { loadSvg } from '../../generated/empty-state/presetIllustrationLoader.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { runAsync } from '../../directives/run-async/run-async.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

/**
 * The `d2l-empty-state-illustrated-link` component is an empty state component that displays an illustration and action link. The illustration property can be set to use one of the preset illustrations or a custom SVG illustration can be added in the default slot.
 * @slot - Custom SVG content if `illustration-name` property is not set
 */
class EmptyStateIllustratedLink extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			  * Optional: The action URL or URL fragment of the link
			  * @type {string}
			  */
			actionHref: { type: String, attribute: 'action-href' },
			/**
			 * Optional: The action text to be used in the link
			 * @type {string}
			 */
			actionText: { type: String, attribute: 'action-text' },
			/**
			 * REQUIRED: A description giving details about the empty state
			 * @type {string}
			 */
			description: { type: String },
			/**
			 * Optional: The name of the preset image you would like to display in the component
			 * @type {string}
			 */
			illustrationName: { type: String, attribute: 'illustration-name' },
			/**
			 * REQUIRED: A title for the empty state
			 * @type {string}
			 */
			titleText: { type: String, attribute: 'title-text' },
			_contentWidth: { type: Number }
		};
	}

	static get styles() {
		return [bodyCompactStyles, emptyStateStyles, emptyStateIllustratedStyles];
	}

	constructor() {
		super();

		this._contentWidth = 700;
		this._resizeObserver = new ResizeObserver(this._onResize.bind(this));
	}

	connectedCallback() {
		super.connectedCallback();
		this._resizeObserver.observe(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._resizeObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.titleText || this.titleText.length === 0) {
			console.warn('d2l-empty-state-illustrated-link component requires titleText.');
		}

		if (!this.description || this.description.length === 0) {
			console.warn('d2l-empty-state-illustrated-link component requires a description.');
		}
	}

	render() {
		const illustrationContainerStyle = {
			height: `${Math.min(this._contentWidth, 500) / 1.5}px`,
		};

		const titleSmall = this._contentWidth <= 615;
		const titleClass = {
			'd2l-empty-state-title': true,
			'd2l-empty-state-title-small': titleSmall,
			'd2l-empty-state-title-large': !titleSmall,
		};

		const actionLink = this.actionText && this.actionHref
			? html`<d2l-link class='d2l-body-compact d2l-empty-state-action' href=${this.actionHref}>${this.actionText}</d2l-link>`
			: nothing;

		return html`
			${this.illustrationName
		? html`
			<div style="${styleMap(illustrationContainerStyle)}">
				${runAsync(this.illustrationName, () => this._getIllustration(this.illustrationName), { success: (illustration) => illustration }, { pendingState: false })}
			</div>`
		: html`<slot></slot>`}

			<p class="${classMap(titleClass)}" id="d2l-empty-state-title">${this.titleText}</p>
			<p class="d2l-body-compact d2l-empty-state-description">${this.description}</p>
			${actionLink}
		`;
	}

	async _getIllustration(illustrationName) {
		if (illustrationName) {
			const svg = await loadSvg(illustrationName);
			return svg ? html`${unsafeSVG(svg.val)}` : undefined;
		}
	}

	_onResize(entries) {
		if (!entries || entries.length === 0) return;
		const entry = entries[0];
		this._contentWidth = entry.contentRect.right;
	}

}

customElements.define('d2l-empty-state-illustrated-link', EmptyStateIllustratedLink);
