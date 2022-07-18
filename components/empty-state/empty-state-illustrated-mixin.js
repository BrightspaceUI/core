import { emptyStateIllustratedStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, nothing } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { loadSvg } from '../../generated/empty-state/presetIllustrationLoader.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

const illustrationAspectRatio = 500 / 330;

export const EmptyStateIllustratedMixin = superclass => class extends RtlMixin(superclass) {

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
			 * REQUIRED: A title for the empty state
			 * @type {string}
				*/
			titleText: { type: String, attribute: 'title-text' },
			_contentHeight: { state: true },
			_illustratedComponentType: { state: true },
			_titleSmall: { state: true }
		};
	}

	static get styles() {
		return [bodyCompactStyles, emptyStateStyles, emptyStateIllustratedStyles];
	}

	constructor() {
		super();

		this._contentHeight = 330;
		this._titleSmall = false;
		this._resizeObserver = new ResizeObserver(this._onResize.bind(this));

		this._missingTitleTextErrorHasBeenThrown = false;
		this._missingDescriptionErrorHasBeenThrown = false;
		this._validatingAttributesTimeout = null;
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
		this._validateAttributes();
	}

	async _getIllustration(illustrationName) {
		if (illustrationName) {
			const svg = await loadSvg(illustrationName);
			if (!svg) setTimeout(() => { throw new Error(`<d2l-empty-state-illustrated-${this._illustratedComponentType}>: Unable to retrieve requested illustration.`); });
			return svg ? html`${unsafeSVG(svg.val)}` : nothing;
		}
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

	_onResize(entries) {
		if (!entries || entries.length === 0) return;
		const entry = entries[0];
		this._contentHeight = Math.min(entry.contentRect.right / illustrationAspectRatio, 330);
		this._titleSmall = entry.contentRect.right <= 615;
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
				setTimeout(() => { throw new Error(`<d2l-empty-state-illustrated-${this._illustratedComponentType}>: missing required "titleText" attribute.`); });
			}

			if (!hasDescription && !this._missingDescriptionErrorHasBeenThrown) {
				this._missingDescriptionErrorHasBeenThrown = true;
				setTimeout(() => { throw new Error(`<d2l-empty-state-illustrated-${this._illustratedComponentType}>: missing required "description" attribute.`); });
			}
		}, 3000);
	}

};
