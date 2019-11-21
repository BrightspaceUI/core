import { css, html, LitElement } from 'lit-element/lit-element.js';
import { HierarchicalViewMixin } from '../../hierarchical-view/hierarchical-view-mixin.js';
import { hierarchicalViewStyles } from '../../hierarchical-view/hierarchical-view-styles.js';

class CustomView extends HierarchicalViewMixin(LitElement) {

	static get styles() {
		return [ hierarchicalViewStyles,
			css`
				:host {
					background-image: url("https://www.nasa.gov/sites/default/files/images/504349main_ngc6357_hst_big_full.jpg");
					background-size: cover;
					border: 1px solid black;
					border-radius: 0.3rem;
					box-sizing: border-box;
					color: white;
					font-size: 1.5rem;
				}
				:host .d2l-hierarchical-view-content {
					min-height: 500px;
					padding: 1rem;
				}
				:host .back-container {
					margin-top: 1rem;
				}
				:host a {
					color: white;
					font-size: 0.7rem;
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
				<div class="back-container">
					<a href="javascript:void(0);" @click="${this._handleHide}" tabindex="-1">Go Back</a>
				</div>
			</div>
		`;
	}

	focus() {
		this.shadowRoot.querySelector('.back-container > a').focus();
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
