import '../button/button.js';
import '../button/button-subtle.js';
import { emptyStateIllustratedStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement, nothing } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { loadSvg } from '../../generated/empty-state/presetIllustrationLoader.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { runAsync } from '../../directives/run-async/run-async.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

/**
 * The `d2l-empty-state-illustrated-button` component is an empty state component that displays an illustration and action button. The illustration property can be set to use one of the preset illustrations or a custom SVG illustration can be added in the default slot.
 * @fires d2l-empty-state-action - Dispatched when the action button is clicked
 * @slot - Custom SVG content if `illustration-name` property is not set
 */
class EmptyStateIllustratedButton extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Optional: The action text to be used in the subtle button
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
			 * Optional: This will change the action button to use a primary button instead of the default subtle button
			 * @type {boolean}
			 */
			primary: { type: Boolean },
			/**
			 * REQUIRED: A title for the empty state
			 * @type {string}
			 */
			titleText: { type: String, attribute: 'title-text' },
			_contentWidth: { type: Number }
		};
	}

	static get styles() {
		return [emptyStateStyles, emptyStateIllustratedStyles, bodyCompactStyles];
	}

	constructor() {
		super();

		this._contentWidth = 0;
		this._onResize = this._onResize.bind(this);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		const resizeObserver = new ResizeObserver(this._onResize);
		resizeObserver.observe(this);
	}

	render() {
		const illustrationContainerStyle = {
			height: `${Math.min(this._contentWidth, 492) / 1.5}px`,
		};

		const titleSmall = this._contentWidth <= 615;
		const titleClass = {
			'd2l-empty-state-title': true,
			'd2l-empty-state-title-small': titleSmall,
			'd2l-empty-state-title-large': !titleSmall,
		};

		let actionButton = nothing;
		if (this.actionText && this.primary) {
			actionButton = this.actionText && html`<d2l-button class='d2l-empty-state-action' @click=${this._handleActionClick} primary>${this.actionText}</d2l-button>`;
		}
		else if (this.actionText && !this.primary) {
			actionButton = this.actionText && html`<d2l-button-subtle class='d2l-empty-state-action' @click=${this._handleActionClick} text=${this.actionText}></d2l-button-subtle>`;
		}

		return html`
			${this.illustrationName
		? html`
			<div style="${styleMap(illustrationContainerStyle)}">
				${runAsync(this.illustrationName, () => this._getIllustration(this.illustrationName), { success: (illustration) => illustration }, { pendingState: false })}
			</div>`
		: html`<slot></slot>`}
            <p class="${classMap(titleClass)}">${this.titleText}</p>
			<p class="d2l-body-compact d2l-empty-state-description">${this.description}</p>
			${actionButton}
		`;
	}

	async _getIllustration(illustrationName) {

		if (illustrationName) {

			const svg = await loadSvg(illustrationName);
			return svg ? html`${unsafeSVG(svg.val)}` : undefined;

		}

	}

	_handleActionClick(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('d2l-empty-state-action'));
	}

	_onResize(entries) {
		if (!entries || entries.length === 0) return;
		const entry = entries[0];
		this._contentWidth = entry.borderBoxSize[0].inlineSize;

	}

}

customElements.define('d2l-empty-state-illustrated-button', EmptyStateIllustratedButton);
