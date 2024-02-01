import '../object-property-list-item.js';
import { html, LitElement } from 'lit';
import { LocalizeCoreElement } from '../../../helpers/localize-core-element.js';
import { localizeMarkup } from '../../../mixins/localize/localize-mixin.js';

/**
 * A single object property, to be used within an object-property-list,
 * with an optional icon.
 */
export class ObjectPropertyListItemAbbr extends LocalizeCoreElement(LitElement) {

	render() {
		return html`<d2l-object-property-list-item .text="${localizeMarkup`<input type="file">sdfasdf</input>`}"></d2l-object-property-list-item>`;
	}
}

customElements.define('d2l-object-property-list-item-abbr', ObjectPropertyListItemAbbr);
