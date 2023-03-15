import { html, LitElement } from 'lit';
import { linkGenerator, markup } from '../../helpers/localize.js';
import { LocalizeDynamicMixin } from '../../mixins/localize-dynamic-mixin.js';

class Mission extends LocalizeDynamicMixin(LitElement) {

	static get localizeConfig() {
		const langResources = {
			'en': {
				mission: '<p><link1>Transforming</link1> the way</p><link2> <b>{name}</b></link2> learns. \'<div></div>\'',
				a: '{a, select, true {T <i>{c}</i>} false {F - {b, date, medium}} other {O - {a}}}'
			},
			'fr': { mission: '<p><link1>Transformer</link1> la façon dont</p><link2> <br></br> <b>{name}</b></link2> apprend' }
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
		let a;
		return html`
			${this.localizeHTML('mission', replacements)}
			<div>1. ${this.localizeHTML('a', { a })}</div>
			<div>2. ${this.localizeHTML('a', { a: null })}</div>
			<div>3. ${this.localizeHTML('a', { a: 1 })}</div>
			<div>4. ${this.localizeHTML('a', { a: {} })}</div>
			<div>5. ${this.localizeHTML('a', { a: false, b: new Date() })}</div>
			<div>6. ${this.localizeHTML('a', { a: true, c: [1, 2, 3] })}</div>
			<div>7. ${this.localizeHTML('a', { a: true, c: markup`<b>bold</b>` })}</div>
			<div>8. ${this.localizeHTML('a', { a: true, c: [markup`<br>`] })}</div>
			<div>9. ${this.localizeHTML('a', { a: true, c: `<test>` })}</div>
		`;
	}
}

customElements.define('d2l-mission', Mission);
