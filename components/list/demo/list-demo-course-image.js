import { css, html, LitElement } from 'lit-element/lit-element.js';

class ListDemoCourseImage extends LitElement {
	static get properties() {
		return {
		};
	}

	static get styles() {
		return [ css`
			:host {
				position: relative;
				width: 100%;
				border-radius: 6px;
				overflow: hidden;
			}
			svg {
				height: inherit;
				width: inherit;
			}
			rect {
				stroke: none;
			}
		`];
	}

	render() {
		return html`
			<svg viewBox="0 0 100 100" preserveAspectRatio="none">
				<rect width='100' height='100'
					fill="rgb(${this.getRandomArbitrary(150, 255)},${this.getRandomArbitrary(150, 220)},${this.getRandomArbitrary(150, 230)})"/>

				<g transform='rotate(${this.getRandomArbitrary(-45, 45)})'>
					<rect x="-100" y='-50' width='500' height='25'
						fill="rgb(${this.getRandomArbitrary(5, 255)},${this.getRandomArbitrary(2, 220)},${this.getRandomArbitrary(50, 230)})"/>

					<rect x="-100" width='500' height='25'
						fill="rgb(${this.getRandomArbitrary(5, 255)},${this.getRandomArbitrary(2, 220)},${this.getRandomArbitrary(50, 230)})"/>

					<rect x="-100" y='50' width='500' height='25'
						fill="rgb(${this.getRandomArbitrary(5, 255)},${this.getRandomArbitrary(2, 220)},${this.getRandomArbitrary(50, 230)})"/>

					<rect x="-100" y='100' width='500' height='25'
						fill="rgb(${this.getRandomArbitrary(5, 255)},${this.getRandomArbitrary(2, 220)},${this.getRandomArbitrary(50, 230)})"/>
				</g>
			</svg>
		`;
	}

	getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	}
}

customElements.define('d2l-list-demo-course-image', ListDemoCourseImage);
