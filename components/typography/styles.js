import '../colors/colors.js';
import { css, unsafeCSS } from 'lit';
import { svgToCSS } from '../../helpers/svg-to-css.js';

export const _isValidCssSelector = (selector) => {
	const partIsValid = (part) => {
		const re = /([a-zA-Z0-9-_ >.#]+)(\[[a-zA-Z0-9-_]+\])?([a-zA-Z0-9-_ >.#]+)?/g;
		if (part === ':host') return true;
		const match = part.match(re);
		const isValid = !!match && match.length === 1 && match[0].length === part.length;
		if (!isValid) {
			console.warn(`Invalid CSS selector: "${part}"`);
		}
		return isValid;
	};

	const parts = selector.split(',');
	const allValid = parts.every(part => partIsValid(part));
	return allValid;
};

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateBodyStandardStyles = (selector) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	return css`
		${selector} {
			font-size: 0.95rem;
			font-weight: 400;
			line-height: 1.4rem;
		}
		@media (max-width: 615px) {
			${selector} {
				font-size: 0.8rem;
				line-height: 1.2rem;
			}
		}
	`;
};
export const bodyStandardStyles = css`
	${_generateBodyStandardStyles('.d2l-body-standard')}
	:host([skeleton]) .d2l-body-standard.d2l-skeletize::before {
		bottom: 0.35rem;
		top: 0.3rem;
	}
	:host([skeleton]) .d2l-body-standard.d2l-skeletize-paragraph-2 {
		max-height: 2.8rem;
	}
	:host([skeleton]) .d2l-body-standard.d2l-skeletize-paragraph-3 {
		max-height: 4.2rem;
	}
	:host([skeleton]) .d2l-body-standard.d2l-skeletize-paragraph-5 {
		max-height: 7rem;
	}
	@media (max-width: 615px) {
		:host([skeleton]) .d2l-body-standard.d2l-skeletize::before {
			bottom: 0.3rem;
			top: 0.3rem;
		}
		:host([skeleton]) .d2l-body-standard.d2l-skeletize-paragraph-2 {
			max-height: 2.4rem;
		}
		:host([skeleton]) .d2l-body-standard.d2l-skeletize-paragraph-3 {
			max-height: 3.6rem;
		}
		:host([skeleton]) .d2l-body-standard.d2l-skeletize-paragraph-5 {
			max-height: 6rem;
		}
	}
`;

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateResetStyles = (selector) => {

	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	return css`
		${selector} {
			color: var(--d2l-color-ferrite);
			font-size: 0.95rem;
			font-weight: 400;
			line-height: 1.4rem;
			text-align: start;
			white-space: normal;
		}
	`;
};

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateBodyCompactStyles = (selector, includeSkeleton = true) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	const skeletonStyles = includeSkeleton ? css`
		:host([skeleton]) ${selector}.d2l-skeletize::before {
			bottom: 0.3rem;
			top: 0.3rem;
		}
		:host([skeleton]) ${selector}.d2l-skeletize-paragraph-2 {
			max-height: 2.4rem;
		}
		:host([skeleton]) ${selector}.d2l-skeletize-paragraph-3 {
			max-height: 3.6rem;
		}
		:host([skeleton]) ${selector}.d2l-skeletize-paragraph-5 {
			max-height: 6rem;
		}
	` : unsafeCSS('');
	return css`
		${selector} {
			font-size: 0.8rem;
			font-weight: 400;
			line-height: 1.2rem;
		}
		${skeletonStyles}
	`;
};

export const bodyCompactStyles = _generateBodyCompactStyles('.d2l-body-compact', true);

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateBodySmallStyles = (selector, includeSkeleton = true) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	const skeletonStyles = includeSkeleton ? css`
		:host([skeleton]) ${selector}.d2l-skeletize::before {
			bottom: 0.25rem;
			top: 0.2rem;
		}
		:host([skeleton]) ${selector}.d2l-skeletize-paragraph-2 {
			max-height: 2rem;
		}
		:host([skeleton]) ${selector}.d2l-skeletize-paragraph-3 {
			max-height: 3rem;
		}
		:host([skeleton]) ${selector}.d2l-skeletize-paragraph-5 {
			max-height: 5rem;
		}
		@media (max-width: 615px) {
			:host([skeleton]) ${selector}.d2l-skeletize::before {
				bottom: 0.25rem;
				top: 0.2rem;
			}
			:host([skeleton]) ${selector}.d2l-skeletize-paragraph-2 {
				max-height: 1.8rem;
			}
			:host([skeleton]) ${selector}.d2l-skeletize-paragraph-3 {
				max-height: 2.7rem;
			}
			:host([skeleton]) ${selector}.d2l-skeletize-paragraph-5 {
				max-height: 4.5rem;
			}
		}` : unsafeCSS('');
	return css`
		${selector} {
			color: var(--d2l-color-tungsten);
			font-size: 0.7rem;
			font-weight: 400;
			line-height: 0.9rem;
			margin: auto;
		}
		${skeletonStyles}
	`;
};

export const bodySmallStyles = _generateBodySmallStyles('.d2l-body-small', true);

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateHeading1Styles = (selector) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	return css`
		${selector} {
			font-size: 2rem;
			font-weight: 400;
			line-height: 2.4rem;
			margin: 1.5rem 0 1.5rem 0;
		}
		@media (max-width: 615px) {
			${selector} {
				font-size: 1.5rem;
				line-height: 1.8rem;
			}
			
		}
	`;
};
export const heading1Styles = css`
	${_generateHeading1Styles('.d2l-heading-1')}
	:host([skeleton]) .d2l-heading-1.d2l-skeletize {
		height: 2.4rem;
		overflow: hidden;
	}
	:host([skeleton]) .d2l-heading-1.d2l-skeletize::before {
		bottom: 0.45rem;
		top: 0.45rem;
	}
	@media (max-width: 615px) {
		:host([skeleton]) .d2l-heading-1.d2l-skeletize {
			height: 1.8rem;
		}
		:host([skeleton]) .d2l-heading-1.d2l-skeletize::before {
			bottom: 0.3rem;
			top: 0.35rem;
		}
	}
`;

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateHeading2Styles = (selector) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	return css`
		${selector} {
			font-size: 1.5rem;
			font-weight: 400;
			line-height: 1.8rem;
			margin: 1.5rem 0 1.5rem 0;
		}
		@media (max-width: 615px) {
			${selector} {
				font-size: 1rem;
				font-weight: 700;
				line-height: 1.5rem;
			}
			
		}
	`;
};
export const heading2Styles = css`
	${_generateHeading2Styles('.d2l-heading-2')}
	:host([skeleton]) .d2l-heading-2.d2l-skeletize {
		height: 1.8rem;
		overflow: hidden;
	}
	:host([skeleton]) .d2l-heading-2.d2l-skeletize::before {
		bottom: 0.3rem;
		top: 0.35rem;
	}
	@media (max-width: 615px) {
		:host([skeleton]) .d2l-heading-2.d2l-skeletize {
			height: 1.5rem;
		}
		:host([skeleton]) .d2l-heading-2.d2l-skeletize::before {
			bottom: 0.35rem;
			top: 0.35rem;
		}
	}
`;

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateHeading3Styles = (selector) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	return css`
		${selector} {
			font-size: 1rem;
			font-weight: 700;
			line-height: 1.5rem;
			margin: 1.5rem 0 1.5rem 0;
		}
		@media (max-width: 615px) {
			${selector} {
				font-size: 0.8rem;
				line-height: 1.2rem;
			}
			
		}
	`;
};
export const heading3Styles = css`
	${_generateHeading3Styles('.d2l-heading-3')}
	:host([skeleton]) .d2l-heading-3.d2l-skeletize {
		height: 1.5rem;
		overflow: hidden;
	}
	:host([skeleton]) .d2l-heading-3.d2l-skeletize::before {
		bottom: 0.35rem;
		top: 0.35rem;
	}
	@media (max-width: 615px) {
		:host([skeleton]) .d2l-heading-3.d2l-skeletize {
			height: 1.2rem;
		}
		:host([skeleton]) .d2l-heading-3.d2l-skeletize::before {
			bottom: 0.3rem;
			top: 0.25rem;
		}
	}
`;

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateHeading4Styles = (selector) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	return css`
		${selector} {
			font-size: 0.8rem;
			font-weight: 700;
			line-height: 1.2rem;
			margin: 1.5rem 0 1.5rem 0;
		}
	`;
};
export const heading4Styles = css`
	${_generateHeading4Styles('.d2l-heading-4')}
	:host([skeleton]) .d2l-heading-4.d2l-skeletize {
		height: 1.2rem;
		overflow: hidden;
	}
	:host([skeleton]) .d2l-heading-4.d2l-skeletize::before {
		bottom: 0.25rem;
		top: 0.25rem;
	}
`;

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateLabelStyles = (selector, includeSkeleton = true) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	const skeletonStyles = includeSkeleton ? css`
		:host([skeleton]) ${selector}.d2l-skeletize::before {
			bottom: 0.25rem;
			top: 0.15rem;
		}
	` : unsafeCSS('');
	return css`
		${selector} {
			font-size: 0.7rem;
			font-weight: 700;
			letter-spacing: 0.2px;
			line-height: 0.9rem;
		}
		${skeletonStyles}
	`;
};
export const labelStyles = _generateLabelStyles('.d2l-label-text', true);

const quoteIcon = svgToCSS(`<svg width="11" height="11" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<defs>
		<path id="a" d="M0 0h24v24H0z"/>
	</defs>
	<g transform="translate(-1 -1)" fill="none" fill-rule="evenodd">
		<mask id="b" fill="#fff"><use xlink:href="#a"/></mask>
		<path d="M6 22.667A4.667 4.667 0 0 0 10.667 18c0-1.227-.559-2.5-1.334-3.333C8.481 13.75 7.35 13.333 6 13.333c-.411 0 1.333-6.666 3-9 1.667-2.333 1.333-3 .333-3C8 1.333 5.253 4.586 4 7.255 1.773 12 1.333 15.392 1.333 18A4.667 4.667 0 0 0 6 22.667zm12 0A4.667 4.667 0 0 0 22.667 18c0-1.227-.559-2.5-1.334-3.333-.852-.917-1.983-1.334-3.333-1.334-.411 0 1.333-6.666 3-9 1.667-2.333 1.333-3 .333-3-1.333 0-4.08 3.253-5.333 5.922C13.773 12 13.333 15.392 13.333 18A4.667 4.667 0 0 0 18 22.667z" fill="#D3D9E3" mask="url(#b)"/>
	</g>
</svg>`);

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateBlockquoteStyles = (selector) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	return css`
		${selector} {
			font-size: 0.8rem;
			font-weight: 400;
			line-height: 1.4rem;
			margin-block: 0;
			margin-inline: 0 1.2rem;
			padding-block: 0.5rem 0;
			padding-inline: 1.2rem 0;
			position: relative;
		}
		${selector}::before {
			content: ${quoteIcon};
			inset-block-start: 0;
			inset-inline-start: 0;
			position: absolute;
			transform: var(--d2l-mirror-transform, ${globalThis.document?.dir === 'rtl' ? css`scale(-1, 1)` : css`none`}); /* stylelint-disable-line @stylistic/string-quotes, @stylistic/function-whitespace-after */
		}
		@media (max-width: 615px) {
			${selector} {
				line-height: 1.2rem;
			}
		}
	`;
};

export const blockquoteStyles = _generateBlockquoteStyles('.d2l-blockquote');

const importUrl = 'https://s.brightspace.com/lib/fonts/0.6.4/assets/';
const fonts = {
	LatoRegular: 'Lato-400',
	LatoBold: 'Lato-700',
	NotoSansThaiRegular: 'NotoSansThai-Regular',
	NotoSansThaiBold: 'NotoSansThai-Bold',
	BCSansLight: 'BCSans-Light',
	BCSansRegular: 'BCSans-Regular',
	BCSansBold: 'BCSans-Bold',
	BCSansLightItalic: 'BCSans-LightItalic',
	BCSansItalic: 'BCSans-Italic',
	BCSansBoldItalic: 'BCSans-BoldItalic'
};
export const fontFacesCss = `@font-face {
	font-family: 'Lato';
	font-style: normal;
	font-weight: 400;
	src:
		url(${new URL(`${fonts.LatoRegular}.woff2`, importUrl)}) format('woff2'),
		url(${new URL(`${fonts.LatoRegular}.woff`, importUrl)}) format('woff');
}
@font-face {
	font-family: 'Lato';
	font-style: normal;
	font-weight: 700;
	src:
		url(${new URL(`${fonts.LatoBold}.woff2`, importUrl)}) format('woff2'),
		url(${new URL(`${fonts.LatoBold}.woff`, importUrl)}) format('woff');
}
@font-face {
	font-family: 'Noto Sans Thai';
	font-style: normal;
	font-weight: 400;
	src:
		url(${new URL(`${fonts.NotoSansThaiRegular}.woff2`, importUrl)}) format('woff2'),
		url(${new URL(`${fonts.NotoSansThaiRegular}.woff`, importUrl)}) format('woff');
}
@font-face {
	font-family: 'Noto Sans Thai';
	font-style: normal;
	font-weight: 700;
	src:
		url(${new URL(`${fonts.NotoSansThaiBold}.woff2`, importUrl)}) format('woff2'),
		url(${new URL(`${fonts.NotoSansThaiBold}.woff`, importUrl)}) format('woff');
}
@font-face {
	font-family: 'BC Sans';
	font-style: normal;
	font-weight: 300;
	src:
		url(${new URL(`${fonts.BCSansLight}.woff2`, importUrl)}) format('woff2'),
		url(${new URL(`${fonts.BCSansLight}.woff`, importUrl)}) format('woff');
}
@font-face {
	font-family: 'BC Sans';
	font-style: normal;
	font-weight: 400;
	src:
		url(${new URL(`${fonts.BCSansRegular}.woff2`, importUrl)}) format('woff2'),
		url(${new URL(`${fonts.BCSansRegular}.woff`, importUrl)}) format('woff');
}
@font-face {
	font-family: 'BC Sans';
	font-style: normal;
	font-weight: 700;
	src:
		url(${new URL(`${fonts.BCSansBold}.woff2`, importUrl)}) format('woff2'),
		url(${new URL(`${fonts.BCSansBold}.woff`, importUrl)}) format('woff');
}
@font-face {
	font-family: 'BC Sans';
	font-style: italic;
	font-weight: 300;
	src:
		url(${new URL(`${fonts.BCSansLightItalic}.woff2`, importUrl)}) format('woff2'),
		url(${new URL(`${fonts.BCSansLightItalic}.woff`, importUrl)}) format('woff');
}
@font-face {
	font-family: 'BC Sans';
	font-style: italic;
	font-weight: 400;
	src:
		url(${new URL(`${fonts.BCSansItalic}.woff2`, importUrl)}) format('woff2'),
		url(${new URL(`${fonts.BCSansItalic}.woff`, importUrl)}) format('woff');
}
@font-face {
	font-family: 'BC Sans';
	font-style: italic;
	font-weight: 700;
	src:
		url(${new URL(`${fonts.BCSansBoldItalic}.woff2`, importUrl)}) format('woff2'),
		url(${new URL(`${fonts.BCSansBoldItalic}.woff`, importUrl)}) format('woff');
}`;

export const baseTypographyStyles = css`
	${unsafeCSS(fontFacesCss)}
	html {
		--d2l-document-direction: ltr;
		--d2l-inline-end: right;
		--d2l-inline-start: left;
		--d2l-mirror-transform: none;
	}
	html[dir="rtl"] {
		--d2l-document-direction: rtl;
		--d2l-inline-end: left;
		--d2l-inline-start: right;
		--d2l-mirror-transform: scale(-1, 1);
	}

	.d2l-typography {
		color: var(--d2l-color-ferrite);
		display: block;
		font-family: "Lato", "Lucida Sans Unicode", "Lucida Grande", sans-serif;
		letter-spacing: 0.01rem;
	}
	${_generateBodyStandardStyles('.d2l-typography', false)}
	.d2l-typography p {
		margin: 1rem 0;
	}

	.d2l-typography:lang(ar), .d2l-typography :lang(ar) {
		font-family: "Segoe UI", "Geeza Pro", sans-serif;
	}
	.d2l-typography:lang(ja), .d2l-typography :lang(ja) {
		font-family: "Hiragino Kaku Gothic Pro", "Meiyro", sans-serif;
	}
	.d2l-typography:lang(ko), .d2l-typography :lang(ko) {
		font-family: "Apple SD Gothic Neo", Dotum, sans-serif;
	}
	.d2l-typography:lang(th), .d2l-typography :lang(th), .d2l-typography:lang(tha), .d2l-typography :lang(tha) {
		font-family: "Noto Sans Thai", system-ui, Tahoma;
	}
	.d2l-typography:lang(zh), .d2l-typography :lang(zh) {
		font-family: "Microsoft YaHei", "Hiragino Sans GB", sans-serif;
	}
`;
