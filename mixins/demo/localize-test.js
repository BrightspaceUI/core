import { html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '../../mixins/localize-mixin.js';

class LocalizeTest extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			name: {
				type: String
			}
		};
	}

	static async getLocalizeResources(langs) {
		const langResources = {
			'ar': { 'hello': 'مرحبا {name}' },
			'de': { 'hello': 'Hallo {name}' },
			'en': { 'hello': 'Hello {name}' },
			'en-ca': { 'hello': 'Hello, {name} eh' },
			'es': { 'hello': 'Hola {name}' },
			'fr': { 'hello': 'Bonjour {name}' },
			'ja': { 'hello': 'こんにちは {name}' },
			'ko': { 'hello': '안녕하세요 {name}' },
			'pt-br': { 'hello': 'Olá {name}' },
			'sv': { 'hello': 'Hallå {name}' },
			'tr': { 'hello': 'Merhaba {name}' },
			'zh-cn': { 'hello': '你好 {name}' },
			'zh-tw': { 'hello': '你好 {name}' }
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

	render() {
		const date = new Date();
		requestAnimationFrame(
			() => this.dispatchEvent(new CustomEvent('d2l-test-localize-render', {
				bubbles: false,
				composed: false
			}))
		);
		return html`
			<p>Text: ${this.localize('hello', {name: this.name})}</p>
			<p>Number: ${this.formatNumber(123456.789)}</p>
			<p>Date: ${this.formatDate(date)}</p>
			<p>Time: ${this.formatTime(date)}</p>
			<p>Date &amp; time: ${this.formatDateTime(date)}</p>
			<p>File size: ${this.formatFileSize(123456789)}</p>
		`;
	}
}

customElements.define('d2l-test-localize', LocalizeTest);
