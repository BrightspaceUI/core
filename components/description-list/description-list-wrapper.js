import { _generateBodyCompactStyles, _generateLabelStyles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';

export const descriptionListStyles = [
	_generateLabelStyles('d2l-dl-wrapper > dl > dt'),
	_generateBodyCompactStyles('d2l-dl-wrapper > dl > dd'),
	css`
		d2l-dl-wrapper {
			--d2l-dl-wrapper-dt-min-width: min-content;
			--d2l-dl-wrapper-dt-max-width: 10rem;
			--d2l-dl-wrapper-dd-min-width: 50%;
		}
		d2l-dl-wrapper > dl {
			align-items: baseline;
			display: var(--d2l-dl-wrapper-dl-display, grid);
			gap: 0.3rem 1.5rem;
			grid-auto-flow: row;
			grid-template-columns: minmax(var(--d2l-dl-wrapper-dt-min-width), auto) minmax(var(--d2l-dl-wrapper-dd-min-width), 1fr);
		}
		d2l-dl-wrapper > dl > dt {
			margin: var(--d2l-dl-wrapper-dt-margin, 0);
			max-width: var(--d2l-dl-wrapper-dt-max-width);
		}
		d2l-dl-wrapper > dl > dd {
			margin: var(--d2l-dl-wrapper-dd-margin, 0);
		}
	`,
];

/**
 * Wraps a native <dl> element, providing styling and resize behavior.
 * @slot - Content to wrap
 */
class DescriptionListWrapper extends LitElement {
	static get properties() {
		return {
			/**
			 * Width for component to use a stacked layout
			 * @type {number}
			 */
			breakpoint: { type: Number, reflect: true },
			/**
			 * Force the component to always use a stacked layout; will override breakpoint attribute
			 * @type {boolean}
			 */
			forceStacked: { type: Boolean, reflect: true, attribute: 'force-stacked' },
			_stacked: { state: true },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.stacked {
				--d2l-dl-wrapper-dl-display: block;
				--d2l-dl-wrapper-dt-max-width: none;
				--d2l-dl-wrapper-dt-margin: 0 0 0.3rem 0;
				--d2l-dl-wrapper-dd-margin: 0 0 0.9rem 0;
			}
		`;
	}

	constructor() {
		super();
		this.breakpoint = 240;
		this.forceStacked = false;
		this._stacked = false;
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
		}
	}

	render() {
		const classes = {
			'stacked': this._stacked,
		};
		return html`<slot class="${classMap(classes)}"></slot>`;
	}

	updated(changedProperties) {
		if (changedProperties.has('forceStacked')) {
			if (!this.forceStacked) {
				this._resizeObserver = new ResizeObserver(this._onResize.bind(this));
				this._resizeObserver.observe(this);
			} else {
				if (this._resizeObserver) {
					this._resizeObserver.disconnect();
					this._resizeObserver = undefined;
				}
				this._stacked = true;
			}
		}
	}

	_onResize(entries) {
		if (!entries || entries.length === 0) return;
		const entry = entries[0];

		this._stacked = entry.contentRect.width < this.breakpoint;
	}
}

customElements.define('d2l-dl-wrapper', DescriptionListWrapper);
