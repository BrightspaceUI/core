import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class StatusIndicator extends LitElement {

	static get properties() {
		return {
			/**
			 * Valid values are: 'default', 'success', 'alert', and 'none'.
			 */
			state: {
				type: String,
				reflect: true
			},
			text: {
				type: String,
				value: null
			}
		};
	}

	static get styles() {
		return css`
			:host {
				border-color: var(--d2l-color-celestine);
				border-radius: 0.6rem;
				border-style: solid;
				border-width: 1px;
				color: var(--d2l-color-celestine);
				cursor: default;
				display: inline-block;
				font-size: 0.6rem;
				font-weight: bold;
				line-height: 1;
				overflow: hidden;
				padding: 2px 10px 2px 10px;
				text-transform: uppercase;
				text-overflow: ellipsis;
				vertical-align: middle;
				white-space: nowrap;
			}

			:host([hidden]) {
				display: none;
			}
			:host([state="success"]) {
				border-color: var(--d2l-color-olivine-minus-1);
				color: var(--d2l-color-olivine-minus-1);
			}
			:host([state="alert"]) {
				border-color: var(--d2l-color-cinnabar);
				color: var(--d2l-color-cinnabar);
			}
			:host([state="none"]),
			:host([state="null"]) {
				border-color: var(--d2l-color-ferrite);
				color: var(--d2l-color-ferrite);
			}
		`;
	}

	constructor() {
		super();
		this.state = 'default';
	}

	render() {
		return html`
			${this.text}
		`;
	}

}
customElements.define('d2l-status-indicator', StatusIndicator);
