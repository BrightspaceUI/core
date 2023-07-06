import '../colors/colors.js';
import { css, unsafeCSS } from 'lit';

export const _isValidCssSelector = (selector) => {
	const re = /([a-zA-Z0-9-_ >.#]+)(\[[a-zA-Z0-9-_]+\])?([a-zA-Z0-9-_ >.#]+)?/g;
	const match = selector.match(re);

	return !!match && match.length === 1 && match[0].length === selector.length;
};

export const bodyStandardStyles = css`
	.d2l-body-standard {
		font-size: 0.95rem;
		font-weight: 400;
		line-height: 1.4rem;
	}
	:host([skeleton-active]) .d2l-body-standard.d2l-skeletize::before {
		bottom: 0.35rem;
		top: 0.3rem;
	}
	:host([skeleton-active]) .d2l-body-standard.d2l-skeletize-paragraph-2 {
		max-height: 2.8rem;
	}
	:host([skeleton-active]) .d2l-body-standard.d2l-skeletize-paragraph-3 {
		max-height: 4.2rem;
	}
	:host([skeleton-active]) .d2l-body-standard.d2l-skeletize-paragraph-5 {
		max-height: 7rem;
	}
	@media (max-width: 615px) {
		.d2l-body-standard {
			font-size: 0.8rem;
			line-height: 1.2rem;
		}
		:host([skeleton-active]) .d2l-body-standard.d2l-skeletize::before {
			bottom: 0.3rem;
			top: 0.3rem;
		}
		:host([skeleton-active]) .d2l-body-standard.d2l-skeletize-paragraph-2 {
			max-height: 2.4rem;
		}
		:host([skeleton-active]) .d2l-body-standard.d2l-skeletize-paragraph-3 {
			max-height: 3.6rem;
		}
		:host([skeleton-active]) .d2l-body-standard.d2l-skeletize-paragraph-5 {
			max-height: 6rem;
		}
	}
`;

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateBodyCompactStyles = (selector) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	return css`
		${selector} {
			font-size: 0.8rem;
			font-weight: 400;
			line-height: 1.2rem;
		}
		:host([skeleton-active]) ${selector}.d2l-skeletize::before {
			bottom: 0.3rem;
			top: 0.3rem;
		}
		:host([skeleton-active]) ${selector}.d2l-skeletize-paragraph-2 {
			max-height: 2.4rem;
		}
		:host([skeleton-active]) ${selector}.d2l-skeletize-paragraph-3 {
			max-height: 3.6rem;
		}
		:host([skeleton-active]) ${selector}.d2l-skeletize-paragraph-5 {
			max-height: 6rem;
		}
	`;
};

export const bodyCompactStyles = _generateBodyCompactStyles('.d2l-body-compact');

export const bodySmallStyles = css`
	.d2l-body-small {
		color: var(--d2l-color-tungsten);
		font-size: 0.7rem;
		font-weight: 400;
		line-height: 1rem;
		margin: auto;
	}
	:host([skeleton-active]) .d2l-body-small.d2l-skeletize::before {
		bottom: 0.25rem;
		top: 0.2rem;
	}
	:host([skeleton-active]) .d2l-body-small.d2l-skeletize-paragraph-2 {
		max-height: 2rem;
	}
	:host([skeleton-active]) .d2l-body-small.d2l-skeletize-paragraph-3 {
		max-height: 3rem;
	}
	:host([skeleton-active]) .d2l-body-small.d2l-skeletize-paragraph-5 {
		max-height: 5rem;
	}
	@media (max-width: 615px) {
		.d2l-body-small {
			font-size: 0.6rem;
			line-height: 0.9rem;
		}
		:host([skeleton-active]) .d2l-body-small.d2l-skeletize::before {
			bottom: 0.25rem;
			top: 0.2rem;
		}
		:host([skeleton-active]) .d2l-body-small.d2l-skeletize-paragraph-2 {
			max-height: 1.8rem;
		}
		:host([skeleton-active]) .d2l-body-small.d2l-skeletize-paragraph-3 {
			max-height: 2.7rem;
		}
		:host([skeleton-active]) .d2l-body-small.d2l-skeletize-paragraph-5 {
			max-height: 4.5rem;
		}
	}
`;

export const heading1Styles = css`
	.d2l-heading-1 {
		font-size: 2rem;
		font-weight: 400;
		line-height: 2.4rem;
		margin: 1.5rem 0 1.5rem 0;
	}
	:host([skeleton-active]) .d2l-heading-1.d2l-skeletize {
		height: 2.4rem;
		overflow: hidden;
	}
	:host([skeleton-active]) .d2l-heading-1.d2l-skeletize::before {
		bottom: 0.45rem;
		top: 0.45rem;
	}
	@media (max-width: 615px) {
		.d2l-heading-1 {
			font-size: 1.5rem;
			line-height: 1.8rem;
		}
		:host([skeleton-active]) .d2l-heading-1.d2l-skeletize {
			height: 1.8rem;
		}
		:host([skeleton-active]) .d2l-heading-1.d2l-skeletize::before {
			bottom: 0.3rem;
			top: 0.35rem;
		}
	}
`;

export const heading2Styles = css`
	.d2l-heading-2 {
		font-size: 1.5rem;
		font-weight: 400;
		line-height: 1.8rem;
		margin: 1.5rem 0 1.5rem 0;
	}
	:host([skeleton-active]) .d2l-heading-2.d2l-skeletize {
		height: 1.8rem;
		overflow: hidden;
	}
	:host([skeleton-active]) .d2l-heading-2.d2l-skeletize::before {
		bottom: 0.3rem;
		top: 0.35rem;
	}
	@media (max-width: 615px) {
		.d2l-heading-2 {
			font-size: 1rem;
			font-weight: 700;
			line-height: 1.5rem;
		}
		:host([skeleton-active]) .d2l-heading-2.d2l-skeletize {
			height: 1.5rem;
		}
		:host([skeleton-active]) .d2l-heading-2.d2l-skeletize::before {
			bottom: 0.35rem;
			top: 0.35rem;
		}
	}
`;

export const heading3Styles = css`
	.d2l-heading-3 {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.5rem;
		margin: 1.5rem 0 1.5rem 0;
	}
	:host([skeleton-active]) .d2l-heading-3.d2l-skeletize {
		height: 1.5rem;
		overflow: hidden;
	}
	:host([skeleton-active]) .d2l-heading-3.d2l-skeletize::before {
		bottom: 0.35rem;
		top: 0.35rem;
	}
	@media (max-width: 615px) {
		.d2l-heading-3 {
			font-size: 0.8rem;
			line-height: 1.2rem;
		}
		:host([skeleton-active]) .d2l-heading-3.d2l-skeletize {
			height: 1.2rem;
		}
		:host([skeleton-active]) .d2l-heading-3.d2l-skeletize::before {
			bottom: 0.3rem;
			top: 0.25rem;
		}
	}
`;

export const heading4Styles = css`
	.d2l-heading-4 {
		font-size: 0.8rem;
		font-weight: 700;
		line-height: 1.2rem;
		margin: 1.5rem 0 1.5rem 0;
	}
	:host([skeleton-active]) .d2l-heading-4.d2l-skeletize {
		height: 1.2rem;
		overflow: hidden;
	}
	:host([skeleton-active]) .d2l-heading-4.d2l-skeletize::before {
		bottom: 0.25rem;
		top: 0.25rem;
	}
`;

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateLabelStyles = (selector) => {
	if (!_isValidCssSelector(selector)) return;

	selector = unsafeCSS(selector);
	return css`
		${selector} {
			font-size: 0.7rem;
			font-weight: 700;
			letter-spacing: 0.2px;
			line-height: 1rem;
		}
		:host([skeleton-active]) ${selector}.d2l-skeletize::before {
			bottom: 0.25rem;
			top: 0.15rem;
		}
	`;
};

export const labelStyles = _generateLabelStyles('.d2l-label-text');

export const blockquoteStyles = css`
	.d2l-blockquote {
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
	.d2l-blockquote::before {
		content: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAyMiAyMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHBhdGggaWQ9ImEiIGQ9Ik0wIDBoMjR2MjRIMHoiLz48L2RlZnM+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEgLTEpIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxtYXNrIGlkPSJiIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNhIi8+PC9tYXNrPjxwYXRoIGQ9Ik02IDIyLjY2N0E0LjY2NyA0LjY2NyAwIDAgMCAxMC42NjcgMThjMC0xLjIyNy0uNTU5LTIuNS0xLjMzNC0zLjMzM0M4LjQ4MSAxMy43NSA3LjM1IDEzLjMzMyA2IDEzLjMzM2MtLjQxMSAwIDEuMzMzLTYuNjY2IDMtOSAxLjY2Ny0yLjMzMyAxLjMzMy0zIC4zMzMtM0M4IDEuMzMzIDUuMjUzIDQuNTg2IDQgNy4yNTUgMS43NzMgMTIgMS4zMzMgMTUuMzkyIDEuMzMzIDE4QTQuNjY3IDQuNjY3IDAgMCAwIDYgMjIuNjY3em0xMiAwQTQuNjY3IDQuNjY3IDAgMCAwIDIyLjY2NyAxOGMwLTEuMjI3LS41NTktMi41LTEuMzM0LTMuMzMzLS44NTItLjkxNy0xLjk4My0xLjMzNC0zLjMzMy0xLjMzNC0uNDExIDAgMS4zMzMtNi42NjYgMy05IDEuNjY3LTIuMzMzIDEuMzMzLTMgLjMzMy0zLTEuMzMzIDAtNC4wOCAzLjI1My01LjMzMyA1LjkyMkMxMy43NzMgMTIgMTMuMzMzIDE1LjM5MiAxMy4zMzMgMThBNC42NjcgNC42NjcgMCAwIDAgMTggMjIuNjY3eiIgZmlsbD0iI0QzRDlFMyIgbWFzaz0idXJsKCNiKSIvPjwvZz48L3N2Zz4=");
		left: 0;
		position: absolute;
		top: 0;
	}
	:host([dir="rtl"]) .d2l-blockquote {
		margin-left: 1.2rem;
		margin-right: 0;
		padding-left: 0;
		padding-right: 1.2rem;
	}
	:host([dir="rtl"]) .d2l-blockquote::before {
		left: initial;
		right: 0;
		transform: scaleX(-1);
	}
	@media (max-width: 615px) {
		.d2l-blockquote {
			line-height: 1.2rem;
		}
	}
`;
