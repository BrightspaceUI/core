import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const acceptedTags = Object.freeze(['d2l-link', 'd2l-tooltip-help', 'p', 'br', 'b', 'strong', 'i', 'em']);

const markupError = `localizeHTML() rich-text replacements must use markup templates with only the following accepted elements: ${acceptedTags}. [link to docs]`;
const acceptedTagsRegex = new RegExp(`<(?!/?(${acceptedTags.join('|')}))`);

export function validateMarkup(content, applyRegex) {
	if (content.map) return content.map(validateMarkup);

	if (content._markup) return content;
	if (content.constructor !== String) throw markupError;
	if (applyRegex && acceptedTagsRegex.test(content)) throw markupError;

	return content;
}

export function markup(str, ...parts) {
	validateMarkup(str, true) && validateMarkup(parts, true);
	return { ...html(str, ...parts), _markup: true };
}

export const linkGenerator = ({ href, target }) => {
	import('../components/link/link.js');
	return chunks => markup`<d2l-link href="${ifDefined(href)}" target="${ifDefined(target)}">${chunks}</d2l-link>`;
};
