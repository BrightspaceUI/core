import '@webcomponents/shadycss/custom-style-interface.min.js';

const importUrl = 'https://s.brightspace.com/lib/fonts/0.4.0/assets/';

const head = document.getElementsByTagName('head')[0];
if (!head.querySelector('#d2l-typography-font-face')) {
	const style = document.createElement('style');
	style.id = 'd2l-typography-font-face';
	style.textContent = `
		@font-face {
			font-family: 'Lato';
			font-style: normal;
			font-weight: 400;
			src: local('Lato Regular'), local('Lato-Regular'), url(${new URL('Lato-400.woff2', importUrl)}) format('woff2'), url(${new URL('Lato-400.woff', importUrl)}) format('woff'), url(${new URL('Lato-400.ttf', importUrl)}) format('truetype');
		}
		@font-face {
			font-family: 'Lato';
			font-style: normal;
			font-weight: 700;
			src: local('Lato Bold'), local('Lato-Bold'), url(${new URL('Lato-700.woff2', importUrl)}) format('woff2'), url(${new URL('Lato-700.woff', importUrl)}) format('woff'), url(${new URL('Lato-700.ttf', importUrl)}) format('truetype');
		}
		@font-face {
			font-family: 'Open Dyslexic';
			font-style: normal;
			font-weight: 400;
			src: local('Open Dyslexic Regular'), local('OpenDyslexic-Regular'), url(${new URL('OpenDyslexic.woff', importUrl)}) format('woff'), url(${new URL('OpenDyslexic.ttf', importUrl)}) format('truetype');
		}
		@font-face {
			font-family: 'Open Dyslexic';
			font-style: italic;
			font-weight: 400;
			src: local('Open Dyslexic Italic'), local('OpenDyslexic-Italic'), url(${new URL('OpenDyslexic-Italic.woff', importUrl)}) format('woff'), url(${new URL('OpenDyslexic-Italic.ttf', importUrl)}) format('truetype');
		}
		@font-face {
			font-family: 'Open Dyslexic';
			font-style: normal;
			font-weight: 700;
			src: local('Open Dyslexic Bold'), local('OpenDyslexic-Bold'), url(${new URL('OpenDyslexic-700.woff', importUrl)}) format('woff'), url(${new URL('OpenDyslexic-700.ttf', importUrl)}) format('truetype');
		}
		@font-face {
			font-family: 'Open Dyslexic';
			font-style: italic;
			font-weight: 700;
			src: local('Open Dyslexic Bold Italic'), local('OpenDyslexic-BoldItalic'), url(${new URL('OpenDyslexic-700-Italic.woff', importUrl)}) format('woff'), url(${new URL('OpenDyslexic-700-Italic.ttf', importUrl)}) format('truetype');
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

		.d2l-typography.d2l-dyslexic,
		.d2l-typography .d2l-dyslexic {
			font-family: 'Open Dyslexic', sans-serif;
			font-weight: 400;
		}

		.d2l-typography:lang(ar),
		.d2l-typography :lang(ar) {
			font-family: 'Arabic Transparent', 'Arabic Typesetting', 'Geeza Pro', sans-serif;
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

			.d2l-typography .d2l-label-text {
				font-size: 0.6rem;
				line-height: 0.9rem;
			}

		}
	`;
	head.appendChild(style);
	window.ShadyCSS.CustomStyleInterface.addCustomStyle(style);
}
