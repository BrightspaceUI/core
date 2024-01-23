import '../colors/colors.js';

export const importUrl = 'https://s.brightspace.com/lib/fonts/0.6.1/assets/';
export const fonts = {
	LatoRegular: 'Lato-400',
	LatoBold: 'Lato-700',
	BCSansLight: 'BCSans-Light',
	BCSansRegular: 'BCSans-Regular',
	BCSansBold: 'BCSans-Bold',
	BCSansLightItalic: 'BCSans-LightItalic',
	BCSansItalic: 'BCSans-Italic',
	BCSansBoldItalic: 'BCSans-BoldItalic'
};

if (!document.head.querySelector('#d2l-typography-font-face')) {
	const style = document.createElement('style');
	style.id = 'd2l-typography-font-face';
	style.textContent = `
		* {
			--d2l-document-direction: ltr;
		}

		html[dir="rtl"] * {
			--d2l-document-direction: rtl;
		}

		@font-face {
			font-family: 'Lato';
			font-style: normal;
			font-weight: 400;
			src: local('Lato Regular'), local('Lato-Regular'), url(${new URL(`${fonts.LatoRegular}.woff2`, importUrl)}) format('woff2'), url(${new URL(`${fonts.LatoRegular}.woff`, importUrl)}) format('woff'), url(${new URL(`${fonts.LatoRegular}.ttf`, importUrl)}) format('truetype');
		}
		@font-face {
			font-family: 'Lato';
			font-style: normal;
			font-weight: 700;
			src: local('Lato Bold'), local('Lato-Bold'), url(${new URL(`${fonts.LatoBold}.woff2`, importUrl)}) format('woff2'), url(${new URL(`${fonts.LatoBold}.woff`, importUrl)}) format('woff'), url(${new URL(`${fonts.LatoBold}.ttf`, importUrl)}) format('truetype');
		}
		@font-face {
			font-family: 'BC Sans';
			font-style: normal;
			font-weight: 300;
			src: url(${new URL(`${fonts.BCSansLight}.woff2`, importUrl)}) format('woff2'), url(${new URL(`${fonts.BCSansLight}.woff`, importUrl)}) format('woff');
		}
		@font-face {
			font-family: 'BC Sans';
			font-style: normal;
			font-weight: 400;
			src: url(${new URL(`${fonts.BCSansRegular}.woff2`, importUrl)}) format('woff2'), url(${new URL(`${fonts.BCSansRegular}.woff`, importUrl)}) format('woff');
		}
		@font-face {
			font-family: 'BC Sans';
			font-style: normal;
			font-weight: 700;
			src: url(${new URL(`${fonts.BCSansBold}.woff2`, importUrl)}) format('woff2'), url(${new URL(`${fonts.BCSansBold}.woff`, importUrl)}) format('woff');
		}
		@font-face {
			font-family: 'BC Sans';
			font-style: italic;
			font-weight: 300;
			src: url(${new URL(`${fonts.BCSansLightItalic}.woff2`, importUrl)}) format('woff2'), url(${new URL(`${fonts.BCSansLightItalic}.woff`, importUrl)}) format('woff');
		}
		@font-face {
			font-family: 'BC Sans';
			font-style: italic;
			font-weight: 400;
			src: url(${new URL(`${fonts.BCSansItalic}.woff2`, importUrl)}) format('woff2'), url(${new URL(`${fonts.BCSansItalic}.woff`, importUrl)}) format('woff');
		}
		@font-face {
			font-family: 'BC Sans';
			font-style: italic;
			font-weight: 700;
			src: url(${new URL(`${fonts.BCSansBoldItalic}.woff2`, importUrl)}) format('woff2'), url(${new URL(`${fonts.BCSansBoldItalic}.woff`, importUrl)}) format('woff');
		}

		.d2l-typography {
			color: var(--d2l-color-ferrite);
			display: block;
			font-family: 'Lato', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
			letter-spacing: 0.01rem;
			font-size: 0.95rem;
			font-weight: 400;
			line-height: 1.4rem;
		}

		.d2l-typography .d2l-body-standard {
			font-size: 0.95rem;
			font-weight: 400;
			line-height: 1.4rem;
		}

		.d2l-typography .d2l-body-compact {
			font-size: 0.8rem;
			font-weight: 400;
			line-height: 1.2rem;
		}

		.d2l-typography .d2l-body-small {
			color: var(--d2l-color-tungsten);
			font-size: 0.7rem;
			font-weight: 400;
			line-height: 1rem;
			margin: auto;
		}

		.d2l-typography .d2l-label-text {
			font-size: 0.7rem;
			line-height: 1rem;
			font-weight: 700;
			letter-spacing: 0.2px;
		}

		.d2l-typography p {
			margin: 1rem 0;
		}

		.d2l-typography:lang(ar),
		.d2l-typography :lang(ar) {
			font-family: 'Segoe UI', 'Geeza Pro', sans-serif;
		}

		.d2l-typography:lang(zh),
		.d2l-typography :lang(zh) {
			font-family: 'Microsoft YaHei', 'Hiragino Sans GB', sans-serif;
		}

		.d2l-typography:lang(ko),
		.d2l-typography :lang(ko) {
			font-family: 'Apple SD Gothic Neo', Dotum, sans-serif;
		}

		.d2l-typography:lang(ja),
		.d2l-typography :lang(ja) {
			font-family: 'Hiragino Kaku Gothic Pro', 'Meiyro', sans-serif;
		}

		.d2l-typography .d2l-heading-1 {
			font-size: 2rem;
			font-weight: 400;
			line-height: 2.4rem;
			margin: 1.5rem 0 1.5rem 0;
		}

		.d2l-typography .d2l-heading-2 {
			font-size: 1.5rem;
			font-weight: 400;
			line-height: 1.8rem;
			margin: 1.5rem 0 1.5rem 0;
		}

		.d2l-typography .d2l-heading-3 {
			font-size: 1rem;
			font-weight: 700;
			line-height: 1.5rem;
			margin: 1.5rem 0 1.5rem 0;
		}

		.d2l-typography .d2l-heading-4 {
			font-size: 0.8rem;
			font-weight: 700;
			line-height: 1.2rem;
			margin: 1.5rem 0 1.5rem 0;
		}

		.d2l-typography .d2l-blockquote {
			font-size: 0.8rem;
			font-weight: 400;
			line-height: 1.4rem;
			margin: 0;
			margin-right: 1.2rem;
			padding: 0;
			padding-left: 1.2rem;
			padding-top: 0.5rem;
			position: relative;
		}

		.d2l-typography .d2l-blockquote::before {
			position: absolute;
			content: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAyMiAyMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHBhdGggaWQ9ImEiIGQ9Ik0wIDBoMjR2MjRIMHoiLz48L2RlZnM+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEgLTEpIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxtYXNrIGlkPSJiIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNhIi8+PC9tYXNrPjxwYXRoIGQ9Ik02IDIyLjY2N0E0LjY2NyA0LjY2NyAwIDAgMCAxMC42NjcgMThjMC0xLjIyNy0uNTU5LTIuNS0xLjMzNC0zLjMzM0M4LjQ4MSAxMy43NSA3LjM1IDEzLjMzMyA2IDEzLjMzM2MtLjQxMSAwIDEuMzMzLTYuNjY2IDMtOSAxLjY2Ny0yLjMzMyAxLjMzMy0zIC4zMzMtM0M4IDEuMzMzIDUuMjUzIDQuNTg2IDQgNy4yNTUgMS43NzMgMTIgMS4zMzMgMTUuMzkyIDEuMzMzIDE4QTQuNjY3IDQuNjY3IDAgMCAwIDYgMjIuNjY3em0xMiAwQTQuNjY3IDQuNjY3IDAgMCAwIDIyLjY2NyAxOGMwLTEuMjI3LS41NTktMi41LTEuMzM0LTMuMzMzLS44NTItLjkxNy0xLjk4My0xLjMzNC0zLjMzMy0xLjMzNC0uNDExIDAgMS4zMzMtNi42NjYgMy05IDEuNjY3LTIuMzMzIDEuMzMzLTMgLjMzMy0zLTEuMzMzIDAtNC4wOCAzLjI1My01LjMzMyA1LjkyMkMxMy43NzMgMTIgMTMuMzMzIDE1LjM5MiAxMy4zMzMgMThBNC42NjcgNC42NjcgMCAwIDAgMTggMjIuNjY3eiIgZmlsbD0iI0QzRDlFMyIgbWFzaz0idXJsKCNiKSIvPjwvZz48L3N2Zz4=");
			top: 0;
			left: 0;
		}

		[dir="rtl"] .d2l-typography .d2l-blockquote,
		.d2l-typography .d2l-blockquote[dir="rtl"] {
			margin-left: 1.2rem;
			margin-right: 0;
			padding-left: 0;
			padding-right: 1.2rem;
		}

		[dir="rtl"] .d2l-typography .d2l-blockquote::before,
		.d2l-typography .d2l-blockquote[dir="rtl"]::before {
			left: initial;
			right: 0;
			transform: scaleX(-1);
		}

		@media (max-width: 615px) {

			.d2l-typography .d2l-body-standard {
				font-size: 0.8rem;
				line-height: 1.2rem;
			}

			.d2l-typography .d2l-body-small {
				font-size: 0.6rem;
				line-height: 0.9rem;
			}

			.d2l-typography .d2l-heading-1 {
				font-size: 1.5rem;
				line-height: 1.8rem;
			}

			.d2l-typography .d2l-heading-2 {
				font-size: 1rem;
				font-weight: 700;
				line-height: 1.5rem;
			}

			.d2l-typography .d2l-heading-3 {
				font-size: 0.8rem;
				line-height: 1.2rem;
			}

			.d2l-typography .d2l-blockquote {
				line-height: 1.2rem;
			}

		}
	`;
	document.head.appendChild(style);
}
