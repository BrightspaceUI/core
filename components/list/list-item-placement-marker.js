import '../colors/colors.js';
import { css, html, LitElement } from 'lit';

class ListItemPlacementMarker extends LitElement {

	static get styles() {
		return css`
			:host {
				display: block;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-list-drag-marker-line {
				height: 12px;
				margin-left: -1px;
				margin-right: -1px;
				stroke: var(--d2l-color-celestine);
				stroke-width: 3px;
				width: 100%;
			}

			.d2l-list-drag-marker-linecap {
				fill: var(--d2l-color-celestine);
				height: 12px;
				margin-inline: -1px 0;
				stroke: none;
				width: 4px;
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
		`;
	}

	render() {
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
