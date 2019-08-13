import { css, html, LitElement } from 'lit-element/lit-element.js';

class ListDemoNameImage extends LitElement {
	static get properties() {
		return {
			letters: { type: String },
			color: { type: String }
		};
	}

	static get styles() {
		return [ css`
			svg {
				height: 42px;
				width: 42px;
			}
			.d2l-list-demo-name-image-text {
				fill: white;
				font-size: 12;
			}
			rect {
				stroke: none;
			}
		`];
	}

	render() {

		return html`
			<svg viewBox="0 0 42 42">
				<rect x="1" y="1" rx="10" ry="10" width="40" height="40" style="fill:${this.color};" />
				<text x="21" y="28" text-anchor="middle" class="d2l-list-demo-name-image-text">
					${this.letters}
				</text>
			</svg>
		`;
	}
}

customElements.define('d2l-list-demo-name-image', ListDemoNameImage);
