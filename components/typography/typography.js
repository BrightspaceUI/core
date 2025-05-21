import '../colors/colors.js';
import { _generateBlockquoteStyles, fontFacesCss } from './styles.js';

if (!document.head.querySelector('#d2l-typography-font-face')) {
	const style = document.createElement('style');
	style.id = 'd2l-typography-font-face';
	style.textContent = `
		* {
			--d2l-document-direction: ltr;
			--d2l-mirror-transform: none;
		}

		html[dir="rtl"] * {
			--d2l-document-direction: rtl;
			--d2l-mirror-transform: scale(-1, 1);
		}

		${fontFacesCss}

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
			line-height: 0.9rem;
			margin: auto;
		}

		.d2l-typography .d2l-label-text {
			font-size: 0.7rem;
			line-height: 0.9rem;
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

		${_generateBlockquoteStyles('.d2l-typography .d2l-blockquote')}

		@media (max-width: 615px) {

			.d2l-typography .d2l-body-standard {
				font-size: 0.8rem;
				line-height: 1.2rem;
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

		}
	`;
	document.head.appendChild(style);
}
