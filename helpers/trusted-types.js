import DOMPurify from 'dompurify';

if (typeof globalThis.trustedTypes === 'undefined') {
	globalThis.trustedTypes = { createPolicy: (name, rules) => rules };
}

export const safeHtmlPolicy = globalThis.trustedTypes.createPolicy('safe-html', {
	createHTML: (input) => DOMPurify.sanitize(input, {
		TRUSTED_TYPES_POLICY: null
	})
});

export const markdownHtmlPolicy = globalThis.trustedTypes.createPolicy('markdown-html', {
	createHTML: (input) => DOMPurify.sanitize(input, {
		ALLOWED_TAGS: ['a', 'blockquote', 'br', 'code', 'em', 'li', 'ol', 'p', 'pre', 'strong', 'ul'],
		ALLOWED_ATTR: ['class', 'href', 'start', 'title'],
		ALLOW_ARIA_ATTR: false,
		ALLOW_DATA_ATTR: false,
		TRUSTED_TYPES_POLICY: null
	})
});
