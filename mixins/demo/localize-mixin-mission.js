import { generateLink, localizeMarkup } from '../../helpers/localize.js';
import { LitElement } from 'lit';
import { LocalizeDynamicMixin } from '../../mixins/localize-dynamic-mixin.js';

class Mission extends LocalizeDynamicMixin(LitElement) {

	static get localizeConfig() {
		const langResources = {
			'en': { mission: '<p><link1>Transforming</link1> the way</p><link2> <b>{name}</b></link2> learns. \'<div></div>\'' },
			'fr': { mission: '<p><link1>Transformer</link1> la façon dont</p><link2> <br></br> <b>{name}</b></link2> apprend' }
		};
		return {
			importFunc: async lang => langResources[lang]
		};
	}

	render() {
		const surname = 'Smith';
		const surnameMarkup = localizeMarkup`<i>${surname}</i>`;
		const replacements = {
			name: 'Bill',
			link1: generateLink({ href: 'https://wikipedia.org/wiki/Culture_change', target: '_blank' }),
			link2: chunks => localizeMarkup`<d2l-link href="https://wikipedia.org/wiki/Earth" target="_blank"><em>${chunks}</em> ${surnameMarkup}</d2l-link>`
		};

		return this.localizeHTML('mission', replacements);
	}
}

customElements.define('d2l-mission', Mission);
