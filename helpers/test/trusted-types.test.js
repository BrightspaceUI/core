import { markdownHtmlPolicy, safeHtmlPolicy } from '../trusted-types.js';
import DOMPurify from 'dompurify';
import { expect } from '@brightspace-ui/testing';
import sinon from 'sinon';

describe('trusted-types', () => {

	describe('safe-html policy', () => {

		it('returns an instance of TrustedHTML', () => {
			const input = '<div>donuts</div>';
			const result = safeHtmlPolicy.createHTML(input);
			expect(globalThis.trustedTypes.isHTML(result)).to.be.true;
		});

		it('does not filter safe elements', () => {
			const input = '<div>donuts</div>';
			const result = safeHtmlPolicy.createHTML(input);
			expect(result.toString()).to.equal('<div>donuts</div>');
		});

		it('filters unsafe attributes', () => {
			const input = '<img src=x onerror=alert(1)//>';
			const result = safeHtmlPolicy.createHTML(input);
			expect(result.toString()).to.equal('<img src="x">');
		});

		it('filters unsafe elements', () => {
			const input = '<script>alert(1)</script><p>donuts</p>';
			const result = safeHtmlPolicy.createHTML(input);
			expect(result.toString()).to.equal('<p>donuts</p>');
		});

		it('calls DOMPurify.sanitize to filter the input', () => {
			const input = '<img src=x onerror=alert(1)//>';
			const sanitizeSpy = sinon.spy(DOMPurify, 'sanitize');
			try {
				safeHtmlPolicy.createHTML(input);
				expect(sanitizeSpy).to.have.been.calledOnceWith(input, { TRUSTED_TYPES_POLICY: null });
			} finally {
				sanitizeSpy.restore();
			}
		});

	});

	describe('markdown-html policy', () => {

		it('returns an instance of TrustedHTML', () => {
			const input = '<code>const donuts;</code>';
			const result = markdownHtmlPolicy.createHTML(input);
			expect(globalThis.trustedTypes.isHTML(result)).to.be.true;
		});

		it('keeps configured markdown tags and attributes only', () => {
			const input = '<div><p class="note" title="tip" data-extra="value" aria-label="label" onclick="alert(1)">Text <span>inside</span> <strong>bold</strong> <a href="https://example.com">link</a></p></div>';
			const result = markdownHtmlPolicy.createHTML(input);
			expect(result.toString()).to.equal('<p class="note" title="tip">Text inside <strong>bold</strong> <a href="https://example.com">link</a></p>');
		});

		it('calls DOMPurify.sanitize to filter the input', () => {
			const input = '<img src=x onerror=alert(1)//>';
			const sanitizeSpy = sinon.spy(DOMPurify, 'sanitize');
			try {
				markdownHtmlPolicy.createHTML(input);
				expect(sanitizeSpy).to.have.been.calledOnceWith(input, {
					ALLOWED_TAGS: ['a', 'blockquote', 'br', 'code', 'em', 'li', 'ol', 'p', 'pre', 'strong', 'ul'],
					ALLOWED_ATTR: ['class', 'href', 'start', 'title'],
					ALLOW_ARIA_ATTR: false,
					ALLOW_DATA_ATTR: false,
					TRUSTED_TYPES_POLICY: null
				});
			} finally {
				sanitizeSpy.restore();
			}
		});

	});

});
