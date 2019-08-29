import '../../components/colors/colors.js';
import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class DismissibleTest extends LitElement {

	static get properties() {
		return {
			opened: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				background-color: #ffffff;
				border: 1px solid var(--d2l-color-chromite);
				display: none;
				padding: 1rem;
				position: absolute;
			}
			:host([opened]) {
				display: block;
			}
		`;
	}

	constructor() {
		super();
		this.opened = false;
	}

	disconnectedCallback() {
		clearDismissible(this.__dismissibleId);
		super.disconnectedCallback();
	}

	render() {
		return html`<slot></slot>
			<button @click=${this.__handleClose} type="button">Close</button>
			<button @click=${this.__handleRemove} type="button">Remove</button>`;
	}

	updated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'opened') {
				if (this.opened) {
					this.__dismissibleId = setDismissible(() => this.opened = false);
				} else {
					clearDismissible(this.__dismissibleId);
				}
			}
		});
	}

	__handleClose() {
		this.opened = false;
	}

	__handleRemove() {
		this.parentNode.removeChild(this);
	}

}

customElements.define('d2l-test-dismissible', DismissibleTest);
