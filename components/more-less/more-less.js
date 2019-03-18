import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LitElement, html, css } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '../localize/localize-mixin.js';
import '../button/button-subtle.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';

export class D2LMoreLess extends LocalizeMixin(LitElement)  {

	static get properties() {
		return {
			expanded: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}`;
	}

	constructor() {
		super();
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
				icon="${this.__computeIcon()}"
				aria-hidden="true"
				@click="${this.__toggleOnClick}"
				text="${this.__computeText()}"
				h-align="${ifDefined(this.hAlign)}">
			</d2l-button-subtle>
		`;
	}

	__computeText() {
		return this.localize(this.expanded ? 'less' : 'more');
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
