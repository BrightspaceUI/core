import { html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '../../mixins/localize-mixin.js';

class LocalizeAsyncTest extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			name: {
				type: String
			}
		};
	}

	static async getLocalizeResources(langs) {
		return new Promise((resolve) => {
			const langResources = {
				'ar': { 'hello': 'مرحبا {name}' },
				'de': { 'hello': 'Hallo {name}' },
				'en': {
					'hello': 'Hello {name}',
					'plural': 'You have {itemCount, plural, =0 {no items} one {1 item} other {{itemCount} items}}.'
				},
				'en-ca': { 'hello': 'Hello, {name} eh' },
				'es': { 'hello': 'Hola {name}' },
				'fr': { 'hello': 'Bonjour {name}' },
				'ja': { 'hello': 'こんにちは {name}' },
				'ko': { 'hello': '안녕하세요 {name}' },
				'pt-br': { 'hello': 'Olá {name}' },
				'tr': { 'hello': 'Merhaba {name}' },
				'zh-cn': { 'hello': '你好 {name}' },
				'zh-tw': { 'hello': '你好 {name}' }
			};
			for (let i = 0; i < langs.length; i++) {
				if (langResources[langs[i]]) {
					const langVal = {
						language: langs[i],
						resources: langResources[langs[i]]
					};
					setTimeout(() => {
						resolve(langVal);
					}, 50);
				}
			}
		});
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		this.dispatchEvent(new CustomEvent('d2l-test-localize-updated', {
			bubbles: false,
			composed: false,
			detail: {
				props: changedProperties
			}
		}));
	}

	render() {
		requestAnimationFrame(
			() => this.dispatchEvent(new CustomEvent('d2l-test-localize-render', {
				bubbles: false,
				composed: false
			}))
		);
		return html`
			<p>${this.localize('hello', {name: this.name})}</p>
		`;
	}

}

customElements.define('d2l-test-localize-async', LocalizeAsyncTest);
