import '../offscreen/screen-reader-pause.js';
import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement, nothing } from 'lit';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A single object property, to be used within an object-property-list,
 * with an optional icon.
 */
export class ObjectPropertyListItem extends SkeletonMixin(LitElement) {
	static get properties() {
		return {
			/**
			 * @ignore
			 */
			hidden: { type: Boolean },
			/**
			 * Name of an optional icon to display
			 * @type {string}
			 */
			icon: { type: String },
			/**
			 * REQUIRED: Text to display on the item
			 * @type {string}
			 */
			text: { type: String },
			_showSeparator: { state: true },
		};
	}

	static get styles() {
		return [super.styles, css`
			:host {
				vertical-align: middle;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-icon {
				height: 1.2857em; /* 18px desired height at main font size (14px), but using em to scale properly at smaller breakpoint. */
				width: 1.2857em;
			}
			.separator {
				margin: 0 -0.05rem; /* 10px desired margin, subtract 5px arbitrary whitespace and 6px whitespace inside bullet icon. */
			}
			.separator d2l-icon {
				color: var(--d2l-color-galena);
			}
			.item-icon {
				margin-inline-end: 0.05rem; /* 6px desired margin, subtract 5px arbitrary whitespace. */
				margin-top: -0.1rem;
			}
			:host([skeleton]) d2l-icon {
				color: var(--d2l-color-sylvite);
			}
			:host([skeleton]) .d2l-skeletize {
				display: inline-block;
				max-width: 80%;
				overflow: hidden;
				vertical-align: middle;
				white-space: nowrap;
			}
		`];
	}

	constructor() {
		super();
		this._showSeparator = true;
	}

	render() {
		return html`
			${this._renderIcon()}
			${this._renderText()}
			${this._renderSeparator()}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('hidden')) this._onHidden();
	}

	_onHidden() {
		/** Dispatched when the visibility of the item changes */
		this.dispatchEvent(new CustomEvent('d2l-object-property-list-item-visibility-change', { bubbles: true, composed: true }));
	}

	_renderIcon() {
		return this.icon && !this.skeleton ? html`<d2l-icon icon="${this.icon}" class="item-icon"></d2l-icon>` : nothing;
	}

	_renderSeparator() {
		return this._showSeparator ? html`
			<span class="separator">
				<d2l-screen-reader-pause></d2l-screen-reader-pause>
				<d2l-icon icon="tier1:bullet"></d2l-icon>
			</span>
		` : nothing;
	}

	_renderText() {
		return html`<span class="d2l-skeletize" aria-hidden="${this.skeleton ? 'true' : 'false'}">${this.text}</span>`;
	}
}

customElements.define('d2l-object-property-list-item', ObjectPropertyListItem);
