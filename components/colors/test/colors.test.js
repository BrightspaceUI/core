import { expect } from '@brightspace-ui/testing';
import { registerSemanticVariableForSvgImageUrl } from '../colors.js';

describe('colors', () => {

	describe('registerSemanticVariableForSvgImageUrl', () => {

		const style = globalThis.document.head.querySelector('#d2l-colors');

		it('should throw when name is missing', () => {
			expect(() => registerSemanticVariableForSvgImageUrl('', '<svg></svg>'))
				.to.throw('registerSemanticVariableForSvgImageUrl requires both a name and value');
		});

		it('should throw when value is not a string', () => {
			expect(() => registerSemanticVariableForSvgImageUrl('--d2l-test-image', null))
				.to.throw('registerSemanticVariableForSvgImageUrl requires both a name and value');
		});

		// if vdiff is enhanced to support OS emulation of color preference then this test can be removed
		it('should register light, dark, and os-dark rules with resolved semantic variables', () => {

			const ruleCount = style.sheet.cssRules.length;
			const variableName = '--d2l-test-svg-image-url-semantic';
			const image = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path fill="var(--d2l-theme-text-color-static-standard)" d="M0 0h10v10H0z"/><path fill="var(--d2l-theme-text-color-interactive-default)" d="M0 0h10v10H0z"/></svg>';

			registerSemanticVariableForSvgImageUrl(variableName, image);

			expect(style.sheet.cssRules.length).to.equal(ruleCount);

			const mediaRule = style.sheet.cssRules[2].cssText;
			expect(mediaRule).to.contain('@media (prefers-color-scheme: dark)');
			expect(mediaRule).to.contain('html[data-color-mode="os"]');
			expect(mediaRule).to.contain(variableName);

		});

	});

});
