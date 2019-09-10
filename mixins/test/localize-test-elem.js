import { LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '../../mixins/localize-mixin.js';

class LocalizeTestElem extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			date: { attribute: false },
			number: { type: Number }
		};
	}

	static async getLocalizeResources(langs) {
		const langResources = {
			'ar': { 'hello': 'مرحبا' },
			'de': { 'hello': 'Hallo' },
			'en': { 'hello': 'Hello' },
			'en-ca': { 'hello': 'Hello, eh' },
			'es': { 'hello': 'Hola' },
			'fr': { 'hello': 'Bonjour' },
			'ja': { 'hello': 'こんにちは' },
			'ko': { 'hello': '안녕하세요' },
			'pt-br': { 'hello': 'Olá' },
			'sv': { 'hello': 'Hallå' },
			'tr': { 'hello': 'Merhaba' },
			'zh-cn': { 'hello': '你好' },
			'zh-tw': { 'hello': '你好' }
		};

		for (let i = 0; i < langs.length; i++) {
			if (langResources[langs[i]]) {
				return {
					language: langs[i],
					resources: langResources[langs[i]]
				};
			}
		}

		return null;
	}

	constructor() {
		super();

		this.date = new Date();
	}
}

customElements.define('localize-test-elem', LocalizeTestElem);
