import { emptyStateIllustratedStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement, nothing } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { LoadingCompleteMixin } from '../../mixins/loading-complete/loading-complete-mixin.js';
import { loadSvg } from '../../generated/empty-state/presetIllustrationLoader.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { runAsync } from '../../directives/run-async/run-async.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

const illustrationAspectRatio = 500 / 330;

/**
 * The `d2l-empty-state-illustrated` component is an empty state component that displays a title and description with an illustration. An empty state action component can be placed inside of the default slot to add an optional action.
 * @slot - Slot for empty state actions
 * @slot illustration - Slot for custom SVG content if `illustration-name` property is not set
 */
class EmptyStateIllustrated extends LoadingCompleteMixin(PropertyRequiredMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * REQUIRED: A description giving details about the empty state
			 * @type {string}
			 */
			description: { type: String, required: true },
			/**
			 * The name of the preset image you would like to display in the component
			 * @type {string}
			 */
			illustrationName: { type: String, attribute: 'illustration-name' },
			/**
			 * REQUIRED: A title for the empty state
			 * @type {string}
			 */
			titleText: { type: String, attribute: 'title-text', required: true },
			_contentHeight: { state: true },
			_titleSmall: { state: true }
		};
	}

	static get styles() {
		return [bodyCompactStyles, emptyStateStyles, emptyStateIllustratedStyles];
	}

	constructor() {
		super();
		this._contentHeight = 330;
		this._resizeObserver = new ResizeObserver(this._onResize.bind(this));
		this._titleSmall = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-empty-state-illustrated-check', this.#handleEmptyStateIllustratedCheck);
		this._resizeObserver.observe(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-empty-state-illustrated-check', this.#handleEmptyStateIllustratedCheck);
		this._resizeObserver.disconnect();
	}

	render() {
		const titleClass = {
			'd2l-empty-state-title': true,
			'd2l-empty-state-title-small': this._titleSmall,
			'd2l-empty-state-title-large': !this._titleSmall,
		};

		return html`
			${this.#renderIllustration()}
			<p class="${classMap(titleClass)}">${this.titleText}</p>
			<p class="d2l-body-compact d2l-empty-state-description">${this.description}</p>
			<slot class="action-slot"></slot>
		`;
	}

	_onResize(entries) {
		if (!entries || entries.length === 0) return;
		const entry = entries[0];
		requestAnimationFrame(() => {
			this._contentHeight = Math.min(entry.contentRect.right / illustrationAspectRatio, 330);
			this._titleSmall = entry.contentRect.right <= 615;
		});
	}

	async #getIllustration(illustrationName) {
		if (!illustrationName) return;

		const svg = await loadSvg(illustrationName);
		if (!svg) setTimeout(() => {
			throw new Error(`<d2l-empty-state-illustrated-${this._illustratedComponentType}>: Unable to retrieve requested illustration.`);
		});
		return svg ? html`${unsafeSVG(svg.val)}` : nothing;
	}

	#handleEmptyStateIllustratedCheck(e) {
		e.stopPropagation();
		e.detail.illustrated = true;
	}

	#renderIllustration() {
		if (!this.illustrationName) {
			this.resolveLoadingComplete();
			return html`<slot class="illustration-slot" name="illustration"></slot>`;
		}
		const illustrationContainerStyle = {
			height: `${this._contentHeight}px`,
		};
		const asyncVal = runAsync(
			this.illustrationName,
			async() => this.#getIllustration(this.illustrationName),
			{
				success: illustration => {
					this.resolveLoadingComplete();
					return illustration;
				}
			},
			{ pendingState: false }
		);
		return html`<div style="${styleMap(illustrationContainerStyle)}">${asyncVal}</div>`;
	}

}

customElements.define('d2l-empty-state-illustrated', EmptyStateIllustrated);
