import { css, html, LitElement } from 'lit-element/lit-element.js';

class ListItemPlacementMarker extends LitElement {

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
		this.strokeWidth = 4;
		this.radius = this.strokeWidth * 2;
		this.height = this.radius * 2 + this.strokeWidth * 2;
	}

	render() {
		return html`
			<svg height="${this.height}">
				<circle cx="${this.strokeWidth + this.radius}" cy="${this.strokeWidth + this.radius}" r="${this.radius}" stroke-width="${this.strokeWidth}"/>
				<line x1="${this.radius * 2 + this.strokeWidth}" y1="${this.height / 2}" x2="98%" y2="${this.height / 2}" stroke-width="${this.strokeWidth}"/>
			</svg>
	  	`;
	}
}

customElements.define('d2l-list-item-placement-marker', ListItemPlacementMarker);
