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
	}

	render() {
	  return this.displayed ? html`
		<svg height="10" width="100%">
		  	<circle cx="5" cy="5" r="4" stroke="${this.color}" stroke-width="2" fill="white" />
	  		<line x1="10" y1="5" x2="100%" y2="5" stroke="${this.color}" stroke-width="2" />
	   	</svg>
	  ` : ``;
	}
  }

  customElements.define('d2l-list-item-placement-marker', ListItemPlacementMarker);
