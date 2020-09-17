
import '../../button/button-icon';
import '../../colors/colors.js';
import '../../expand-collapse/expand-collapse-content.js';
import '../../inputs/input-number.js';
import '../../inputs/input-text.js';
import '../form.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
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

			.d2l-form-panel-demo-panel {
				background-color: white;
				border-radius: 8px;
				padding: 20px;
			}

			.d2l-form-panel-demo-container {
				margin-bottom: 10px;
			}

			.d2l-form-panel-demo-header {
				align-items: top;
				cursor: pointer;
				display: flex;
				justify-content: space-between;
			}

			.d2l-form-panel-demo-text {
				align-items: center;
				display: flex;
				margin: 0;
			}
		`];
	}

	constructor() {
		super();
		this._expanded = false;
	}

	render() {
		return html`
			<div class="d2l-form-panel-demo-panel">
				<div class="d2l-form-panel-demo-header" @click=${this._toggleExpandCollapse}>
					<h3 class="d2l-form-panel-demo-text d2l-heading-3">Personal Information</h3>
					<d2l-button-icon
						aria-expanded=${this._expanded ? 'true' : 'false'}
						icon=${this._expanded ? 'tier1:arrow-collapse-small' : 'tier1:arrow-expand-small'}
						@click=${this._toggleExpandCollapse}>
					</d2l-button-icon>
				</div>
				<hr>
				<d2l-expand-collapse-content ?expanded=${this._expanded}>
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
				</d2l-expand-collapse-content>
			</div>
		`;
	}

	_onInvalid() {
		this._expanded = true;
	}

	_onSubmit(e) {
		// eslint-disable-next-line no-console
		console.log(e.detail.formData);
	}

	_toggleExpandCollapse(e) {
		e.stopPropagation();
		this._expanded = !this._expanded;
	}

}
customElements.define('d2l-form-panel-demo', FormPanelDemo);
