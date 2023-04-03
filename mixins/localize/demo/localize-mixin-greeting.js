import { html, LitElement } from 'lit';
import { LocalizeMixin } from '../localize-mixin.js';

class Greeting extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			name: {	type: String }
		};
	}

	static get localizeConfig() {
		const langResources = {
			'ar': { 'hello': 'مرحبا {name}' },
			'de': { 'hello': 'Hallo {name}' },
			'en': { 'hello': 'Hello, {name}' },
			'en-gb': { 'hello': '\'Ello, {name}' },
			'es': { 'hello': 'Hola {name}' },
			'fr': { 'hello': 'Bonjour, {name}' },
			'ja': { 'hello': 'こんにちは {name}' },
			'ko': { 'hello': '안녕하세요 {name}' },
			'pt-br': { 'hello': 'Olá {name}' },
			'tr': { 'hello': 'Merhaba {name}' },
			'zh-cn': { 'hello': '你好 {name}' },
			'zh-tw': { 'hello': '你好 {name}' }
		};
		return {
			importFunc: async lang => langResources[lang]
		};
	}

	render() {
		return html`
			<p>${this.localize('hello', { name: this.name })}</p>
		`;
	}
}

customElements.define('d2l-greeting', Greeting);
