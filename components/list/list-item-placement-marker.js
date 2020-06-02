import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class ListItemPlacementMarker extends RtlMixin(LitElement) {

	static get styles() {
		return css`
			:host {
				display: block;
				position: relative;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-list-drag-marker-line {
				height: 12px;
				stroke: var(--d2l-color-celestine);
				stroke-width: 3px;
			}

			.d2l-list-drag-marker-linecap {
				height: 12px;
				width: 3px;
				stroke: none;
				fill: var(--d2l-color-celestine);
				margin-left: -1.5px;
				margin-right: -1.5px;
				stroke-width: 0px;
			}

			.d2l-list-drag-marker-circle {
				height: 12px;
				width: 12px;
				margin-left: -1.5px;
				margin-right: -1.5px;
				stroke-width: 3px;
				stroke: var(--d2l-color-celestine);
			}

			.d2l-list-drag-marker {
				flex-wrap: nowrap;
				display: flex;
			 }

		`;
	}

	render() {
		return html`
			<div class="d2l-list-drag-marker">
				<svg class="d2l-list-drag-marker-circle">
					<circle cx="50%" cy="50%" r="4px" fill="none"/>
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
