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

			svg {
				width: 100%;
			}

			circle {
				stroke: var(--d2l-color-celestine);
				fill: white;
			}

			line {
				stroke: var(--d2l-color-celestine);
				stroke-linecap: round;
			}
		`;
	}

	constructor() {
		super();
	}


	render() {

		// TODO: figure out how to draw with RTL

		// dimensions
		const strokeWidth = 3;
		const radius = strokeWidth * 1.5;
		const height = radius * 2 + strokeWidth;

		// circle coordinates
		let cx = strokeWidth/2 + radius;
		const cy = strokeWidth/2 + radius;;
		let x1 = radius * 2 + strokeWidth;
		const y1 = height / 2;
		const y2 = y1;
		let x2 = "99%"; // with 100% the round line cap is cut off because circle is drawn at x2 coordinate.

		return html`
			<svg height="${height}">
				<circle cx="${cx}" cy="${cy}" r="${radius}" stroke-width="${strokeWidth}"/>
				<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${strokeWidth}"/>
			</svg>
	  	`;
	}
}

customElements.define('d2l-list-item-placement-marker', ListItemPlacementMarker);
