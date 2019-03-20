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

		const translations = await import(`./locales/${lang}.js`)
		proto.__localizationCache.requests[namespace] = true;
		return translations.val;
	}

	_tryGetResources(val) {
		var locales = ['ar', 'en'];

		if (val === null) return null;
		val = val.toLowerCase();
		var baseLang = val.split('-')[0];
		var foundBaseLang = null;

		if (locales) {
			for (var i = 0; i < locales.length; i++) {
				var localesKey = locales[i];
				var localesKeyLower = locales[i].toLowerCase();
				if (localesKeyLower === val) {
					return localesKey;
				} else if (localesKeyLower === baseLang) {
					foundBaseLang = localesKey;
				}
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
