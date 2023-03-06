import { html, LitElement } from 'lit';
import { LocalizeDynamicMixin } from '../../mixins/localize-dynamic-mixin.js';

class Mission extends LocalizeDynamicMixin(LitElement) {

	static get localizeConfig() {
		const langResources = {
			'en': { mission: 'Transforming the way [a]the world[/a] learns' },
			'fr': { mission: 'Transformer la façon dont [a]le monde[/a] apprend' }
		};
		return {
			importFunc: async lang => langResources[lang]
		};
	}

	render() {
		const _link = 'href="https://wikipedia.org/wiki/Earth" target="_blank"';
		return html`
			<p>${this.localizeHTML('mission', { _link })}</p>
		`;
	}
}

customElements.define('d2l-mission', Mission);
