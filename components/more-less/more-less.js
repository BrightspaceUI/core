import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LitElement, html, css } from 'lit-element/lit-element.js';
import { AppLocalizeBehavior } from '../localize/localize-mixin.js';
import '../button/button-subtle.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';

export class D2LMoreLess extends AppLocalizeBehavior(LitElement)  {

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
		this.resources = {
			'ar': {
				more: 'المزيد',
				less: 'أقل'
			},
			'en': {
				more: 'more',
				less: 'less'
			},
			'es': {
				more: 'más',
				less: 'menos'
			},
			'fr': {
				more: 'plus',
				less: 'moins'
			},
			'ja': {
				more: 'より多い',
				less: 'より少ない'
			},
			'ko': {
				more: '더 보기',
				less: '축소'
			},
			'nl': {
				more: 'meer',
				less: 'minder'
			},
			'pt': {
				more: 'mais',
				less: 'menos'
			},
			'sv': {
				more: 'mer',
				less: 'mindre'
			},
			'tr': {
				more: 'diğer',
				less: 'daha az'
			},
			'zh': {
				more: '更多',
				less: '更少'
			},
			'zh-tw': {
				more: '較多',
				less: '較少'
			}
		};
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
				text="${this.localize(this.text)}"
				h-align="${ifDefined(this.hAlign)}">
			</d2l-button-subtle>
		`;
	}

	updated() {
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
