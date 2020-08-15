import { css, html, LitElement } from 'lit-element/lit-element.js';
import { skeletonStyles } from '../skeleton-styles.js';

class SkeletonHost extends LitElement {

	static get properties() {
		return {
			skeleton: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [
			skeletonStyles,
			css`
				:host {
					display: block;
				}

				:host([skeleton]) ul {
					height: 1rem;
				}
			`
		];
	}

	render() {
		return html`
			<label class="skeletize">I am alive</label>
			<ul class="skeletize">
				<li>One</li>
				<li>Two</li>
				<li>Three</li>
			</ul>
		`;
	}
}
customElements.define('d2l-skeleton-host', SkeletonHost);
