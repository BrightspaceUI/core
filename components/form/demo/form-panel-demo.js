
import '../../button/button-icon.js';
import '../../colors/colors.js';
import '../../expand-collapse/expand-collapse-content.js';
import '../../inputs/input-number.js';
import '../../inputs/input-text.js';
import '../form.js';
import '../../collapsible-panel/collapsible-panel.js';
import { css, html, LitElement } from 'lit';
import { heading3Styles } from '../../typography/styles.js';
import { inputStyles } from '../../inputs/input-styles.js';

class FormPanelDemo extends LitElement {

	static get properties() {
		return {
			_expanded: { type: Boolean, attribute: false }
		};
	}

	static get styles() {
		return [heading3Styles, inputStyles, css`
			:host {
				background-color: var(--d2l-color-gypsum);
				display: block;
				flex-basis: 35%;
				padding: 10px;
				width: 100%;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-form-panel-demo-container {
				margin-bottom: 10px;
			}
		`];
	}

	constructor() {
		super();
		this._expanded = false;
	}

	render() {
		return html`
			<d2l-collapsible-panel
				panel-title="Personal Information"
				type="subtle"
				?expanded=${this._expanded}
				@d2l-collapsible-panel-expand=${this._onExpand}
				@d2l-collapsible-panel-collapse=${this._onCollapse}>
				<d2l-form @d2l-form-invalid=${this._onInvalid} @d2l-form-submit=${this._onSubmit}>
					<div class="d2l-form-panel-demo-container">
						<d2l-input-text label="First Name" name="first-name" required minlength="4" maxlength="15"></d2l-input-text>
					</div>
					<div class="d2l-form-panel-demo-container">
						<d2l-input-text label="Middle Name" name="middle-name" minlength="4" maxlength="8"></d2l-input-text>
					</div>
					<div class="d2l-form-panel-demo-container">
						<d2l-input-text label="Last Name" name="last-name" required minlength="4" maxlength="15"></d2l-input-text>
					</div>
					<div class="d2l-form-panel-demo-container">
						<d2l-input-number label="Age" name="age" required min="18" max="23"></d2l-input-number>
					</div>
				</d2l-form>
			</d2l-collapsible-panel>
		`;
	}

	_onCollapse() {
		this._expanded = false;
	}

	_onExpand() {
		this._expanded = true;
	}

	_onInvalid() {
		this._expanded = true;
	}

	_onSubmit(e) {
		// eslint-disable-next-line no-console
		console.log(e.detail.formData);
	}
}
customElements.define('d2l-form-panel-demo', FormPanelDemo);
