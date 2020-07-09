import { css, html, LitElement } from 'lit-element/lit-element.js';
import { HierarchicalViewMixin } from '../../hierarchical-view/hierarchical-view-mixin.js';

class CustomView extends HierarchicalViewMixin(LitElement) {

	static get styles() {
		return [ super.styles,
			css`
				:host {
					background-color: orange;
					border: 1px solid black;
					border-radius: 0.3rem;
					box-sizing: border-box;
					color: white;
					font-size: 1.5rem;
				}
				:host .d2l-hierarchical-view-content {
					min-height: 100px;
					padding: 1rem;
				}
				:host .d2l-custom-view-back-container {
					margin-top: 1rem;
				}
				:host a {
					color: var(d2l-color-ferrite);
					font-size: 0.7rem;
					outline: none;
				}
			`
		];
	}

	firstUpdated() {
		super.firstUpdated();

		this.addEventListener('d2l-hierarchical-view-show-complete', this._onShowComplete);
	}

	render() {
		return html`
			<div class="d2l-hierarchical-view-content">
				<slot></slot>
				<div class="d2l-custom-view-back-container">
					<a href="javascript:void(0);" @click="${this._handleHide}" tabindex="-1">Go Back</a>
				</div>
			</div>
		`;
	}

	focus() {
		this.shadowRoot.querySelector('.d2l-custom-view-back-container > a').focus();
	}

	_handleHide(e) {
		e.stopPropagation();
		this.hide();
	}

	_onShowComplete() {
		this.focus();
	}
}

customElements.define('d2l-custom-view', CustomView);
