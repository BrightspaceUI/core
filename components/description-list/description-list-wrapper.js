import { bodyCompactStylize, labelStylize } from '../typography/styles.js';
import { css, html, LitElement } from 'lit';
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
			display: grid;
			grid-auto-flow: row;
			align-items: baseline;
			grid-template-columns: minmax(var(--d2l-dt-min-width), auto) minmax(var(--d2l-dd-min-width), 1fr);
			gap: 0.5rem 1.5rem;
		}
		dt {
			max-width: var(--d2l-dt-max-width);
		}
		dd {
			margin: 0;
		}
		d2l-dl-wrapper[stacked] dl {
			display: block;
		}
		d2l-dl-wrapper[stacked] dt {
			max-width: unset;
		}
		d2l-dl-wrapper[stacked] dd {
			margin-bottom: 0.5rem;
		}
	`
];

/**
 * Wraps a native <dl> element, providing styling and resize behavior.
 * @slot - Content to wrap
 */
class DescriptionListWrapper extends LitElement {
	static get properties() {
		return {
			stacked: { type: Boolean, reflect: true },
			breakpoint: { type: Number, reflect: true },
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
		`;
	}

	constructor() {
		super();
		this.stacked = false;
		this.breakpoint = 350;
		this._resizeObserver = new ResizeObserver(this._onResize.bind(this));
		this._checkIfShouldStack();
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
		return html`
			<slot></slot>
		`;
	}

	_checkIfShouldStack() {
		if (this.clientWidth < this.breakpoint && !this.stacked) {
			this.stacked = true;
		} else if (this.clientWidth >= this.breakpoint && this.stacked) {
			this.stacked = false;
		}
	}

	_onResize() {
		this._checkIfShouldStack();
	}
}

customElements.define('d2l-dl-wrapper', DescriptionListWrapper);
