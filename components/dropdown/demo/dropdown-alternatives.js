import { html, LitElement } from 'lit';
import { floatingUIStyles } from './floating-ui-setup/index.styles.js';
import { initFloatingUI } from './floating-ui-setup/index.js';
import { initPopper } from './popper-setup/index.js';
import { popperStyles } from './popper-setup/index.styles.js';

class PopupApiDemo extends LitElement {
	render() {
		return html`
			<button popuptoggletarget="popup-api" id="popup-api-button">Open it! (Popup API)</button>
			<div popup="auto" id="popup-api" anchor="popup-api-button">
				<a href="https://youtu.be/9ze87zQFSak">Google</a>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
					commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
					nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
					anim id est laborum.</p>
				<a href="http://www.desire2learn.com">D2L</a>
			</div>
		`;
	}
}

class PopperDemo extends LitElement {
	static get properties() {
		return {
			fixed: { type: Boolean },
			placement: { type: String },
		};
	}

	static get styles() {
		return popperStyles;
	}

	firstUpdated() {
		initPopper(this.shadowRoot.getElementById('popper-button'), this.shadowRoot.getElementById('popper-tooltip'), {
			...(this.fixed ? { strategy: 'fixed' } : {}),
			...(this.placement ? { placement: this.placement } : {}),
		});
	}

	render() {
		return html`
			<button id="popper-button" aria-describedby="popper-tooltip">Open it! (Popper${this.fixed ? ' Fixed' : ''}${this.placement ? ` ${this.placement}` : ''})</button>
			<div id="popper-tooltip" role="tooltip" class="popper-tooltip">
				<div class="popper-arrow" data-popper-arrow></div>
				<a href="https://youtu.be/9ze87zQFSak">Google</a>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
					commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
					nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
					anim id est laborum.</p>
				<a href="http://www.desire2learn.com">D2L</a>
			</div>
		`;
	}
}

class FloatingUIDemo extends LitElement {
	static get properties() {
		return {
			fixed: { type: Boolean },
			placement: { type: String },
		};
	}

	static get styles() {
		return floatingUIStyles;
	}

	firstUpdated() {
		initFloatingUI(this.shadowRoot.getElementById('floating-ui-button'), this.shadowRoot.getElementById('floating-ui-tooltip'), this.shadowRoot.querySelector('.floating-ui-arrow'), {
			...(this.fixed ? { strategy: 'fixed' } : {}),
			...(this.placement ? { placement: this.placement } : {}),
		});
	}

	render() {
		return html`
			<button id="floating-ui-button" aria-describedby="floating-ui-tooltip">Open it! (Floating-UI${this.fixed ? ' Fixed' : ''}${this.placement ? ` ${this.placement}` : ''})</button>
			<div id="floating-ui-tooltip" role="tooltip" class="floating-ui-tooltip">
				<div class="floating-ui-arrow"></div>
				<a href="https://youtu.be/9ze87zQFSak">Google</a>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
					commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
					nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
					anim id est laborum.</p>
				<a href="http://www.desire2learn.com">D2L</a>
			</div>
		`;
	}
}

customElements.define('popup-api-demo', PopupApiDemo);
customElements.define('popper-demo', PopperDemo);
customElements.define('floating-ui-demo', FloatingUIDemo);
