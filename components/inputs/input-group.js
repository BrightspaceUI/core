import { css, html, LitElement } from 'lit';

/**
 * Wraps a collection of input components, providing vertical spacing between them.
 * @slot - Input components
 */
class InputGroup extends LitElement {

	static get styles() {
		return css`
			:host {
				display: flex;
				flex-direction: column;
				gap: 0.9rem;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	render() {
		return html`<slot></slot>`;
	}

}
customElements.define('d2l-input-group', InputGroup);
