
import '../../button/button-icon';
import '../../colors/colors.js';
import '../../expand-collapse/expand-collapse-content.js';
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
					<d2l-form @d2l-form-invalid=${this._onInvalid}>
						<div class="d2l-form-panel-demo-container">
							<label>First Name
								<input  class="d2l-input" type="text" name="first-name" required minlength="4" maxlength="15">
							</label>
						</div>
						<div class="d2l-form-panel-demo-container">
							<label>Middle Name
								<input  class="d2l-input" type="text" name="middle-name" minlength="4" maxlength="8">
							</label>
						</div>
						<div class="d2l-form-panel-demo-container">
							<label>Last Name
								<input  class="d2l-input" type="text" name="last-name" required minlength="4" maxlength="15">
							</label>
						</div>
					</d2l-form>
				</d2l-expand-collapse-content>
			</div>
		`;
	}

	_onInvalid() {
		this._expanded = true;
	}

	_toggleExpandCollapse(e) {
		e.stopPropagation();
		this._expanded = !this._expanded;
	}

}
customElements.define('d2l-form-panel-demo', FormPanelDemo);
