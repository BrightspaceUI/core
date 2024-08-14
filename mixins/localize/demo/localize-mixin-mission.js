import { generateLink, LocalizeMixin } from '../localize-mixin.js';
import { LitElement } from 'lit';

class Mission extends LocalizeMixin(LitElement) {

	static get localizeConfig() {
		const langResources = {
			'en': { mission: '<b>Transforming</b> the way <linkEarth>the world</linkEarth> learns' },
			'fr': { mission: '<b>Transformer</b> la façon dont <linkEarth>le monde</linkEarth> apprend' }
		};
		return {
			importFunc: async lang => langResources[lang]
		};
	}

	render() {
		const replacements = {
			linkEarth: generateLink({ href: 'https://wikipedia.org/wiki/Earth', target: '_blank' }),
		};

		return this.localizeHTML('mission', replacements);
	}
}

customElements.define('d2l-mission', Mission);
