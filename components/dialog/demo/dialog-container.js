import '../dialog.js';
import '../../button/button.js';
import { html, LitElement } from 'lit-element/lit-element.js';

class DialogContainer extends LitElement {

	static get properties() {
		return {
			opened: { type: Boolean }
		};
	}

	constructor() {
		super();
		this.opened = false;
	}

	render() {
		return html`
			<d2l-button @click="${this._open}">Show Dialog</d2l-button>
			<d2l-dialog title-text="Dialog Title" ?opened="${this.opened}" @d2l-dialog-close="${this._handleClose}">
				<div>Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker.</div>
				<d2l-button slot="footer" primary dialog-action="ok">Click Me!</d2l-button>
				<d2l-button slot="footer" dialog-action>Cancel</d2l-button>
			</d2l-dialog>
		`;
	}

	_handleClose() {
		// dialog may have closed in several ways, so we need to make sure state is in sync
		this.opened = false;
	}

	_open() {
		this.opened = true;
	}

}

customElements.define('d2l-dialog-demo-container', DialogContainer);
