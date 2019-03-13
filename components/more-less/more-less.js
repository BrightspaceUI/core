import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LitElement, html, css } from 'lit-element/lit-element.js';
import { i18next } from '../localize/i18next.js';
import { localize } from '../localize/localize-mixin.js';
import '../button/button-subtle.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';

export class D2LMoreLess extends localize(i18next)(LitElement)  {

	static get properties() {
		return {
			height: { type: String, value: '4em' },
			expanded: { type: Boolean, value: false, reflect: true },
			inactive: { type: Boolean, value: false, reflect: true },
			blurColor: { type: String },
			hAlign: { type: String, reflect: true },
			icon: { type: String, reflect: true },
			text: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			.more-less-content {
				overflow: hidden;
			}
			.more-less-transition {
				transition: height 400ms cubic-bezier(0, 0.7, 0.5, 1);
			}
			.more-less-blur {
				display: none;
			}
			:host(:not([expanded]):not([inactive])) .more-less-blur {
				display: block;
				content: "";
				position: relative;
				height: 1em;
				bottom: 1em;
				margin-bottom: -0.75em;
				background: linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%);
			}
			:host([inactive]) .more-less-toggle {
				display: none;
			}`;
	}

	constructor() {
		super();
		this.text = this.__computeText();
		this.icon = this.__computeIcon();
	}

	render() {
		return html`
			<div class="more-less-content"><slot></slot></div>
			<div class="more-less-blur"></div>
			<d2l-button-subtle
				class="more-less-toggle"
				icon="${ifDefined(this.icon)}"
				aria-hidden="true"
				@click="${this.__toggleOnClick}"
				text="${i18next.t(`more-less:${this.text}`)}"
				h-align="${ifDefined(this.hAlign)}">
			</d2l-button-subtle>
		`;
	}

	updated(changedProperties) {
		this.text = this.__computeText();
		this.icon = this.__computeIcon();
	}

	__computeText() {
		return this.expanded ? 'less' : 'more';
	}

	__computeIcon() {
		return this.expanded ? 'd2l-tier1:chevron-up' : 'd2l-tier1:chevron-down';
	}

	__toggleOnClick() {
		if (this.expanded) {
			this.__shrink();
		} else {
			this.__expand();
		}

		this.__autoExpanded = false;
	}

	__shrink() {
		this.expanded = false;
	}

	__expand() {
		this.expanded = true;
	}

}

customElements.define('d2l-more-less', D2LMoreLess);
