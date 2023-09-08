import { emptyStateIllustratedStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement, nothing } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { loadSvg } from '../../generated/empty-state/presetIllustrationLoader.js';
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
class EmptyStateIllustrated extends LitElement {

	static get properties() {
		return {
			/**
			 * REQUIRED: A description giving details about the empty state
			 * @type {string}
			 */
			description: { type: String },
			/**
			 * The name of the preset image you would like to display in the component
			 * @type {string}
			 */
			illustrationName: { type: String, attribute: 'illustration-name' },
			/**
			 * REQUIRED: A title for the empty state
			 * @type {string}
			 */
			titleText: { type: String, attribute: 'title-text' },
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
		this._missingDescriptionErrorHasBeenThrown = false;
		this._missingTitleTextErrorHasBeenThrown = false;
		this._resizeObserver = new ResizeObserver(this._onResize.bind(this));
		this._titleSmall = false;
		this._validatingAttributesTimeout = null;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-empty-state-illustrated-check', this._handleEmptyStateIllustratedCheck);
		this._resizeObserver.observe(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-empty-state-illustrated-check', this._handleEmptyStateIllustratedCheck);
		this._resizeObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._validateAttributes();
	}

	render() {
		const illustrationContainerStyle = this._getIllustrationContainerStyle();
		const titleClass = this._getTitleClass();

		return html`
			${this.illustrationName
		? html`
			<div style="${styleMap(illustrationContainerStyle)}">
				${runAsync(this.illustrationName, () => this._getIllustration(this.illustrationName), { success: (illustration) => illustration }, { pendingState: false })}
			</div>`
		: html`<slot class="illustration-slot" name="illustration"></slot>`}

			<p class="${classMap(titleClass)}">${this.titleText}</p>
			<p class="d2l-body-compact d2l-empty-state-description">${this.description}</p>
			<slot class="action-slot"></slot>
		`;
	}

	async _getIllustration(illustrationName) {
		if (!illustrationName) return;

		const svg = await loadSvg(illustrationName);
		if (!svg) setTimeout(() => {
			throw new Error(`<d2l-empty-state-illustrated-${this._illustratedComponentType}>: Unable to retrieve requested illustration.`);
		});
		return svg ? html`${unsafeSVG(svg.val)}` : nothing;
	}

	_getIllustrationContainerStyle() {
		return {
			height: `${this._contentHeight}px`,
		};
	}

	_getTitleClass() {
		return {
			'd2l-empty-state-title': true,
			'd2l-empty-state-title-small': this._titleSmall,
			'd2l-empty-state-title-large': !this._titleSmall,
		};
	}

	_handleEmptyStateIllustratedCheck(e) {
		e.stopPropagation();
		e.detail.illustrated = true;
	}

	_onResize(entries) {
		if (!entries || entries.length === 0) return;
		const entry = entries[0];
		requestAnimationFrame(() => {
			this._contentHeight = Math.min(entry.contentRect.right / illustrationAspectRatio, 330);
			this._titleSmall = entry.contentRect.right <= 615;
		});
	}

	_validateAttributes() {
		clearTimeout(this._validatingAttributesTimeout);
		// don't error immediately in case it doesn't get set immediately
		this._validatingAttributesTimeout = setTimeout(() => {
			this._validatingAttributesTimeout = null;
			const hasTitleText = (typeof this.titleText === 'string') && this.titleText.length > 0;
			const hasDescription = (typeof this.description === 'string') && this.description.length > 0;

			if (!hasTitleText && !this._missingTitleTextErrorHasBeenThrown) {
				this._missingTitleTextErrorHasBeenThrown = true;
				setTimeout(() => {
					throw new Error('<d2l-empty-state-illustrated>: missing required "titleText" attribute.');
				});
			}

			if (!hasDescription && !this._missingDescriptionErrorHasBeenThrown) {
				this._missingDescriptionErrorHasBeenThrown = true;
				setTimeout(() => {
					throw new Error('<d2l-empty-state-illustrated>: missing required "description" attribute.');
				});
			}
		}, 3000);
	}

}

customElements.define('d2l-empty-state-illustrated', EmptyStateIllustrated);
