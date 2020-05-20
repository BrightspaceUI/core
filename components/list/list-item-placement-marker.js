import { css, html, LitElement } from 'lit-element/lit-element.js';
import { nothing } from 'lit-html/lit-html';

class ListItemPlacementMarker extends LitElement {

	static get properties() {
		return {
			displayed: {type: Boolean}
		};
	}

	static get styles() {
		return css`
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
		return this.displayed ? html`
			<svg height="${this.height}">
				<circle cx="${this.strokeWidth + this.radius}" cy="${this.strokeWidth + this.radius}" r="${this.radius}" stroke-width="${this.strokeWidth}"/>
				<line x1="${this.radius * 2 + this.strokeWidth}" y1="${this.height / 2}" x2="98%" y2="${this.height / 2}" stroke-width="${this.strokeWidth}"/>
			</svg>
	  	` : nothing;
	}
}

customElements.define('d2l-list-item-placement-marker', ListItemPlacementMarker);
