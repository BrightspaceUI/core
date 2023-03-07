import '../../components/link/link.js';
import { html, LitElement } from 'lit';
import { linkGenerator } from '../../mixins/localize-mixin.js';
import { LocalizeDynamicMixin } from '../../mixins/localize-dynamic-mixin.js';

class Mission extends LocalizeDynamicMixin(LitElement) {

	static get localizeConfig() {
		const langResources = {
			'en': { mission: '<p><link1>Transforming</link1> the way</p><link2>the <br></br> <b>world</b></link2> learns' },
			'fr': { mission: '<p><link1>Transformer</link1> la façon dont</p><link2>le <br></br> <b>monde</b></link2> apprend' }
		};
		return {
			importFunc: async lang => langResources[lang]
		};
	}

	render() {
		const link1 = linkGenerator({ href: 'https://wikipedia.org/wiki/Culture_change', target: '_blank' });
		const link2 = linkGenerator({ href: 'https://wikipedia.org/wiki/Earth', target: '_blank' });
		return html`
			${this.localizeHTML('mission', { link1, link2 })}
		`;
	}
}

customElements.define('d2l-mission', Mission);
