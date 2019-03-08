import { LitElement, html } from 'lit-element';

export class D2LHelloWorld extends LitElement {

	static get properties() {
		return {
			message: { type: String }
		};
	}

	constructor() {
		super();
		this.message = 'Hello World from LitElement';
	}

	render() {
		return html`
			<style>
				:host {
					display: block;
					color: var(--d2l-color-celestine);
				}
				:host([hidden]) {
					display: none;
				}
			</style>
			<p>${this.message} Sincerely, LitElement!</p>
		`;
	}

}

customElements.define('d2l-hello-world', D2LHelloWorld);
