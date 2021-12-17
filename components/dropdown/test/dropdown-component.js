import '../../button/button.js';
import '../dropdown.js';
import '../dropdown-content.js';
import { html, LitElement } from 'lit-element/lit-element.js';

class DropdownComponent extends LitElement {

	render() {
		return html`
			<d2l-dropdown>
				<d2l-button class="d2l-dropdown-opener">Open it!</d2l-button>
				<d2l-dropdown-content max-width="400">
					<div slot="header">
						<h3>Scrolling is Fun</h3>
					</div>
					<a href="https://youtu.be/9ze87zQFSak">Google</a>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
						commodo consequat.</p>
					<div slot="footer">
						<a href="http://www.desire2learn.com">D2L</a>
					</div>
				</d2l-dropdown-content>
			</d2l-dropdown>
			<d2l-button>See!</d2l-button>
		`;
	}

	toggleOpen() {
		if (this.shadowRoot) this.shadowRoot.querySelector('d2l-dropdown-content').toggleOpen();
	}

}

customElements.define('dropdown-component', DropdownComponent);
