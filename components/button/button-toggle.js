import { css, html, LitElement } from 'lit';

/**
 * A button container component for button toggles.
 */
class ButtonToggle extends LitElement {

	static get properties() {
		return {
			/**
			 * Pressed state
			 * @type {boolean}
			 */
			pressed: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			::slotted(:not(d2l-button-icon, d2l-button-subtle)) {
				display: none;
			}
			:host slot[name="pressed"] {
				display: none;
			}
			:host slot[name="not-pressed"] {
				display: contents;
			}
			:host([pressed]) slot[name="not-pressed"] {
				display: none;
			}
			:host([pressed]) slot[name="pressed"] {
				display: contents;
			}
		`;
	}

	render() {
		return html`
			<slot @click="${this._handleNotPressedClick}" name="not-pressed"></slot>
			<slot @click="${this._handlePressedClick}" name="pressed"></slot>
		`;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this._focusOnFirstRender) {
			this._focusOnFirstRender = false;
			this.focus();
		}
	}

	focus() {
		if (!this.hasUpdated) {
			this._focusOnFirstRender = true;
			return;
		}

		const elem = this.shadowRoot.querySelector(this.pressed ? 'slot[name="pressed"]' : 'slot[name="not-pressed"]').assignedNodes()[0];
		if (!elem) {
			throw new Error('d2l-button-toggle: no button to focus');
		}

		elem.focus();
	}

	async _handleClick(pressed) {
		this.pressed = pressed;
		await this.updateComplete;
		this.focus();
	}

	_handleNotPressedClick() {
		this._handleClick(true);
	}

	_handlePressedClick() {
		this._handleClick(false);
	}

}

customElements.define('d2l-button-toggle', ButtonToggle);
