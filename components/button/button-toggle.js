import { css, html, LitElement } from 'lit';

/**
 * A button container component for button toggles.
 * @fires d2l-button-toggle-before-change - Dispatched before pressed state is updated. Can be canceled to allow the consumer to handle toggling pressed state. This is useful if something needs to happen prior to the pressed state being toggled.
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
			::slotted(:not(d2l-button-icon, d2l-button-subtle)),
			:host slot[name="pressed"],
			:host([pressed]) slot[name="not-pressed"] {
				display: none;
			}
			:host slot[name="not-pressed"],
			:host([pressed]) slot[name="pressed"] {
				display: contents;
			}
		`;
	}

	constructor() {
		super();
		this.pressed = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this._focusOnFirstRender) {
			this._focusOnFirstRender = false;
			this.focus();
		}
	}

	render() {
		return html`
			<slot @click="${this._handleNotPressedClick}" name="not-pressed"></slot>
			<slot @click="${this._handlePressedClick}" name="pressed"></slot>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.get('pressed') === undefined) return;

		/** Dispatched when the pressed state changes */
		this.dispatchEvent(new CustomEvent('d2l-button-toggle-change'));
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
		const beforeToggleEvent = new CustomEvent('d2l-button-toggle-before-change', {
			detail: {
				update: (newPressed) => this._updatePressedState(newPressed)
			},
			cancelable: true
		});
		this.dispatchEvent(beforeToggleEvent);
		if (beforeToggleEvent.defaultPrevented) return;

		this._updatePressedState(pressed);
	}

	_handleNotPressedClick() {
		this._handleClick(true);
	}

	_handlePressedClick() {
		this._handleClick(false);
	}

	async _updatePressedState(newPressed) {
		this.pressed = newPressed;
		await this.updateComplete;
		this.focus();
	}

}

customElements.define('d2l-button-toggle', ButtonToggle);
