import '../../components/link/link.js';
import { html, LitElement } from 'lit';
import { LocalizeDynamicMixin } from '../../mixins/localize-dynamic-mixin.js';

class Mission extends LocalizeDynamicMixin(LitElement) {

	static get localizeConfig() {
		const langResources = {
			'en': { mission: 'Transforming the way <my-link>the <br></br> <b>world</b></my-link> learns' },
			'fr': { mission: 'Transformer la façon dont <my-link>le <br></br> <b>monde</b></my-link> apprend' }
		};
		return {
			importFunc: async lang => langResources[lang]
		};
	}

	render() {
		const myLink = chunks => html`<d2l-link href="https://wikipedia.org/wiki/Earth" target="_blank">${chunks}</d2l-link>`;
		return html`
			<p>${this.localizeHTML('mission', { 'my-link': myLink })}</p>
		`;
	}
}

customElements.define('d2l-mission', Mission);
