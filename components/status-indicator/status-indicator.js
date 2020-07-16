import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

/**
 * A component for communicating the status of an item. It is non-interactive and used to assert prominence on state.
 */
class StatusIndicator extends LitElement {

	static get properties() {
		return {
			/**
			 * State of status indicator to display
			 * @type {'default'|'success'|'alert'|'none'}
			 */
			state: {
				type: String,
				reflect: true
			},
			/**
			 * REQUIRED: The text that is displayed within the status indicator
			 */
			text: {
				type: String
			},
			/**
			 * Use when the status is very important and needs to have a lot of prominence
			 */
			bold: {
				type: Boolean,
				reflect: true
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
				text-overflow: ellipsis;
				text-transform: uppercase;
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

			:host([bold]) {
				background-color: var(--d2l-color-celestine);
				color: white;
			}
			:host([bold][state="success"]) {
				background-color: var(--d2l-color-olivine-minus-1);
			}
			:host([bold][state="alert"]) {
				background-color: var(--d2l-color-cinnabar);
			}
			:host([bold][state="none"]),
			:host([bold][state="null"]) {
				background-color: var(--d2l-color-ferrite);
			}
		`;
	}

	constructor() {
		super();
		this.state = 'default';
		this.bold = false;
	}

	render() {
		return html`
			${this.text}
		`;
	}

}
customElements.define('d2l-status-indicator', StatusIndicator);
