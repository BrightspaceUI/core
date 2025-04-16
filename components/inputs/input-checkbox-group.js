import { css, html, LitElement } from 'lit';

/**
 * A wrapper for <d2l-input-checkbox> components which provides spacing between the items.
 * @slot - Checkbox components
 */
class InputCheckboxGroup extends LitElement {

	static get styles() {
		return css`
			:host {
				display: flex;
				flex-direction: column;
				gap: 0.6rem;
			}
			:host([hidden]) {
				display: none;
			}
			::slotted(d2l-input-checkbox) {
				margin-bottom: 0;
			}
		`;
	}

	render() {
		return html`<slot></slot>`;
	}

}
customElements.define('d2l-input-checkbox-group', InputCheckboxGroup);
