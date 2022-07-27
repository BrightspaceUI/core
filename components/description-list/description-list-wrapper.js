import { bodyCompactStylize, labelStylize } from '../typography/styles.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';

export const descriptionListStyles = [
	labelStylize('dt'),
	bodyCompactStylize('dd'),
	css`
		:host {
			--d2l-dt-min-width: min-content;
			--d2l-dt-max-width: 10rem;
			--d2l-dd-min-width: 50%;
		}
		dl {
			align-items: baseline;
			display: var(--d2l-description-list-dl-display, grid);
			gap: 0.5rem 1.5rem;
			grid-auto-flow: row;
			grid-template-columns: minmax(var(--d2l-dt-min-width), auto) minmax(var(--d2l-dd-min-width), 1fr);
		}
		dt {
			max-width: var(--d2l-dt-max-width);
		}
		dd {
			margin: var(--d2l-description-list-dd-margin, 0);
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
			breakpoint: { type: Number, reflect: true },
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
				--d2l-description-list-dl-display: block;
				--d2l-dt-max-width: unset;
				--d2l-description-list-dd-margin: 0 0 0.5rem 0;
			}
		`;
	}

	constructor() {
		super();
		this._stacked = false;
		this.breakpoint = 350;
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

	render() {
		const classes = {
			'stacked': this._stacked,
		};
		return html`<slot class="${classMap(classes)}"></slot>`;
	}

	_checkIfShouldStack() {
		if (this.clientWidth < this.breakpoint && !this._stacked) {
			this._stacked = true;
		} else if (this.clientWidth >= this.breakpoint && this._stacked) {
			this._stacked = false;
		}
	}

	_onResize() {
		this._checkIfShouldStack();
	}
}

customElements.define('d2l-dl-wrapper', DescriptionListWrapper);
