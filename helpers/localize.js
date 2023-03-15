import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const allowedTags = Object.freeze(['d2l-link', 'd2l-tooltip-help', 'p', 'br', 'b', 'strong', 'i', 'em']);

const markupError = `localizeHTML() rich-text replacements must use markup templates with only the following allowed elements: ${allowedTags}. [link to docs]`;
const validTerminators = '([>\\s/]|$)';
const allowedAfterTriangleBracket = `/?(${allowedTags.join('|')})?${validTerminators}`;
const disallowedTagsRegex = new RegExp(`<(?!${allowedAfterTriangleBracket})`);

export function validateMarkup(content, applyRegex) {
	if (content) {
		if (content.map) return content.map(item => validateMarkup(item));
		if (content._markup) return content;
		if (Object.hasOwn(content, '_$litType$')) throw markupError;
		if (applyRegex && content.constructor === String && disallowedTagsRegex.test(content)) throw markupError;
	}
	return content;
}

export function markup(strings, ...expressions) {
	strings.forEach(str => validateMarkup(str, true));
	expressions.forEach(exp => validateMarkup(exp, true));
	return { ...html(strings, ...expressions), _markup: true };
}

export const linkGenerator = ({ href, target }) => {
	import('../components/link/link.js');
	return chunks => markup`<d2l-link href="${ifDefined(href)}" target="${ifDefined(target)}">${chunks}</d2l-link>`;
};
