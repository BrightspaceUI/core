import { html, LitElement } from 'lit';
import { LocalizeDynamicMixin } from '../../mixins/localize-dynamic-mixin.js';
import { markup } from '../../helpers/localize.js';

class Mission extends LocalizeDynamicMixin(LitElement) {

	static get localizeConfig() {
		const langResources = {
			'en': {	mission: '<p>Transforming the way <link>the world</link> learns</p>' },
			'fr': { mission: '<p>Transformer la façon dont <link>le monde</link> apprend</p>' }
		};
		return {
			importFunc: async lang => langResources[lang]
		};
	}

	render() {
		const replacements = {
			link: chunks => markup`<d2l-link href="https://wikipedia.org/wiki/Earth" target="_blank"><strong>${chunks}</strong></d2l-link>`
		};
		return html`
			${this.localizeHTML('mission', replacements)}
		`;
	}
}

customElements.define('d2l-mission', Mission);
