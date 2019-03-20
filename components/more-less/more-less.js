import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LitElement, html, css } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '../localize/localize-mixin.js';
import '../button/button-subtle.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';

export class D2LMoreLess extends LocalizeMixin(LitElement)  {

	static get properties() {
		return {
			expanded: { type: Boolean, reflect: true },
			__langResources: { type: Object }
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

		this.__langResources = {
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

	getLanguage(lang, backupLang) {
		return this._tryGetResources(lang)
			|| this._tryGetResources(backupLang)
			|| this._tryGetResources('en-us');
	}

	async getLangResources(lang) {
		var proto = this.constructor.prototype;
		this.checkLocalizationCache(proto);

		var namespace = `more-less:${lang}`;

		if (proto.__localizationCache.requests[namespace]) {
			return;
		}

		proto.__localizationCache.requests[namespace] = true;
		return this.__langResources[lang];
	}

	_tryGetResources(val) {
		if (val === null) return null;
		val = val.toLowerCase();
		var baseLang = val.split('-')[0];
		var foundBaseLang = null;

		for (var key in this.__langResources) {
			var keyLower = key.toLowerCase();
			if (keyLower.toLowerCase() === val) {
				return key;
			} else if (keyLower === baseLang) {
				foundBaseLang = key;
			}
		}

		if (foundBaseLang) {
			return foundBaseLang;
		}

		return null;
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
