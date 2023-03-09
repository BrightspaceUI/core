import { html, LitElement } from 'lit';
import { linkGenerator, markup } from '../../helpers/localize.js';
import { LocalizeDynamicMixin } from '../../mixins/localize-dynamic-mixin.js';

class Mission extends LocalizeDynamicMixin(LitElement) {

	static get localizeConfig() {
		const langResources = {
			'en': { mission: '<p><link1>Transforming</link1> the way</p><link2> <b>{name}</b></link2> learns. \'<div></div>\'' },
			'fr': { mission: '<p><link1>Transformer</link1> la façon dont</p><link2> \'<br>\'\'</br>\' <b>{name}</b></link2> apprend' }
		};
		return {
			importFunc: async lang => langResources[lang]
		};
	}

	render() {
		const surname = 'Smith';
		const surnameMarkup = markup`<i>${surname}</i>`;
		const replacements = {
			name: 'Bill',
			link1: linkGenerator({ href: 'https://wikipedia.org/wiki/Culture_change', target: '_blank' }),
			link2: chunks => markup`<d2l-link href="https://wikipedia.org/wiki/Earth" target="_blank"><em>${chunks}</em> ${surnameMarkup}</d2l-link>`
		};
		return html`
			${this.localizeHTML('mission', replacements)}
		`;
	}
}

customElements.define('d2l-mission', Mission);
