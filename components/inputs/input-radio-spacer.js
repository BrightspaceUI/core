import { css, html, LitElement } from 'lit';

/**
 * Used to align related content below radio buttons
 * @slot - Additional related content
 */
class InputRadioSpacer extends LitElement {

	static get styles() {
		return css`
				:host {
					box-sizing: border-box;
					display: block;
					margin-bottom: 0.9rem;
					padding-inline-start: 1.7rem;
				}
				:host(.d2l-input-inline-help) {
					margin-bottom: 0.9rem !important;
				}
			`;
	}

	render() {
		return html`<slot></slot>`;
	}

}
customElements.define('d2l-input-radio-spacer', InputRadioSpacer);
