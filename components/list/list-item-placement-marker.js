import '../colors/colors.js';
import { css, html, LitElement } from 'lit';

class ListItemPlacementMarker extends LitElement {

	static properties = {
		verticle: { type: Boolean, reflect: true }
	};

	static get styles() {
		return css`
			:host {
				display: block;
			}

			:host([verticle]) {
				height: 100%;
			}

			:host([hidden]) {
				display: none;
			}

			:host([verticle]) .d2l-list-drag-marker-line {
				height: 100%;
				margin: -1px 0;
				width: 12px;
			}

			.d2l-list-drag-marker-line {
				height: 12px;
				margin-left: -1px;
				margin-right: -1px;
				stroke: var(--d2l-color-celestine);
				stroke-width: 3px;
				width: 100%;
			}

			:host([verticle]) .d2l-list-drag-marker-linecap {
				height: 4px;
				margin-inline: 0 -2px;
				width: 12px;
			}

			.d2l-list-drag-marker-linecap {
				fill: var(--d2l-color-celestine);
				height: 12px;
				margin-inline: -1px 0;
				stroke: none;
				width: 4px;
			}

			:host([verticle]) .d2l-list-drag-marker-circle {
				margin-inline: 0 0;
			}


			.d2l-list-drag-marker-circle {
				fill: none;
				height: 12px;
				margin-inline: 0 -1px;
				stroke: var(--d2l-color-celestine);
				stroke-width: 3px;
				width: 12px;
			}

			.d2l-list-drag-marker {
				display: flex;
				flex-wrap: nowrap;
			}

			:host([verticle]) .d2l-list-drag-marker {
				flex-direction: column;
				height: 100%;
			}
		`;
	}

	constructor() {
		super();
		this.verticle = false;
	}

	render() {

		if (this.verticle) {
			return html`
			<div class="d2l-list-drag-marker">
				<svg class="d2l-list-drag-marker-circle">
					<circle cx="50%" cy="50%" r="3.8px"/>
				</svg>
				<svg class="d2l-list-drag-marker-line">
					<line x1="50%" y1="0" x2="50%" y2="100%" />
				</svg>
				<svg class="d2l-list-drag-marker-linecap">
					<circle cx="50%" cy="50%" r="1.5px"/>
				</svg>
			</div>
		`;
		}

		return html`
			<div class="d2l-list-drag-marker">
				<svg class="d2l-list-drag-marker-circle">
					<circle cx="50%" cy="50%" r="3.8px"/>
				</svg>
				<svg class="d2l-list-drag-marker-line">
					<line x1="0" y1="50%" x2="100%" y2="50%" />
				</svg>
				<svg class="d2l-list-drag-marker-linecap">
					<circle cx="50%" cy="50%" r="1.5px"/>
				</svg>
			</div>
		`;
	}

}

customElements.define('d2l-list-item-placement-marker', ListItemPlacementMarker);
