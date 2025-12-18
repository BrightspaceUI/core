import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../../mixins/focus/focus-mixin.js';
import { PropertyRequiredMixin } from '../../../mixins/property-required/property-required-mixin.js';

class NavigationSkip extends FocusMixin(PropertyRequiredMixin(LitElement)) {

	static get properties() {
		return {
			text: { required: true, type: String }
		};
	}

	static get styles() {
		return css`
			a {
				inset-inline-start: -10000px;
				overflow: hidden;
				position: absolute;
				width: 1px;
			}
			a:active,
			a:focus {
				background-color: rgba(0, 0, 0, 0.7);
				border: 1px solid rgba(0, 0, 0, 0.8);
				color: #ffffff;
				cursor: pointer;
				display: block;
				font-weight: bold;
				inset-block-start: 0;
				inset-inline-start: 25%;
				margin: 0 auto;
				outline: none;
				padding: 0.3em;
				text-align: center;
				text-decoration: none;
				width: 50%;
				z-index: 10000;
			}
		`;
	}

	static get focusElementSelector() {
		return 'a';
	}

	render() {
		// Href attribute is needed for a11y tools to recognize anchor as a link
		// and for click events to be dispatched using key presses
		return html`<a href="javascript:void(0);" class="vdiff-target">${this.text}</a>`;
	}

}

customElements.define('d2l-labs-navigation-skip', NavigationSkip);
