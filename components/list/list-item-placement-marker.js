import { html, LitElement } from 'lit-element/lit-element.js';

class ListItemPlacementMarker extends LitElement {
	static get properties() {
		return {
			color: { type: String },
			displayed: {type: Boolean}
		};
	}

	constructor() {
		super();
		this.color = "blue";
		this.strokeWidth = 4;
		this.radius = this.strokeWidth * 2;
		this.height = this.radius * 2 + this.strokeWidth * 2;
	}

	render() {
	  return this.displayed ? html`
		<svg height="${this.height}"  width="100%">
		  	<circle cx="${this.strokeWidth + this.radius}" cy="${this.strokeWidth + this.radius}" r="${this.radius}" stroke="${this.color}" stroke-width="${this.strokeWidth}" fill="white" />
	  		<line x1="${this.radius*2 + this.strokeWidth}" y1="${this.height/2}" x2="98%" y2="${this.height/2}" stroke="${this.color}" stroke-width="${this.strokeWidth}" stroke-linecap="round"/>
	   	</svg>
	  ` : ``;
	}
  }

  customElements.define('d2l-list-item-placement-marker', ListItemPlacementMarker);
