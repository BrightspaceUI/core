import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const acceptedTags = Object.freeze(['d2l-link', 'd2l-tooltip-help', 'p', 'br', 'b', 'strong', 'i', 'em']);

const markupError = `localize() rich-text replacements must use markup templates with only the following accepted elements: ${acceptedTags}. [link to docs]`;
const regex = new RegExp(`<(?!\/?(${acceptedTags.join('|')}))`);

export function validateMarkup(parts) {
	return parts.map(p => {
		debugger;
		if (p._markup) return p;
		else if (p.constructor !== String) throw markupError;
		return p;
	});
}

export function markup(str, ...parts) {
	let reject = str.some(str => regex.test(str));
	reject = reject || parts.some(subparts => { // subparts === chunks?
		if (subparts.constructor === String) {
			return regex.test(subparts);
		}
		else if (Array.isArray(subparts)) {
			 return !subparts.some(subpart => subpart.constructor === String || subpart._markup);
		}
		else {
			return !subparts._markup;
		}
	});
	if (reject) throw markupError;
	const _html = html(str, ...parts);
	_html._markup = true;
	return _html;
}

export const linkGenerator = ({ href, target }) => {
	import('../components/link/link.js');
	return chunks => markup`<d2l-link href="${ifDefined(href)}" target="${ifDefined(target)}">${chunks}</d2l-link>`;
};