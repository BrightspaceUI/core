import '../colors/colors.js';
import { css, unsafeCSS } from 'lit';
import { _isValidCssSelector } from '../../helpers/internal/css.js';
import { getFocusRingStyles } from '../../helpers/focus.js';

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateLinkStyles = (selector, includeSkeleton = true) => {
	if (!_isValidCssSelector(selector)) return;

	const selectorCSS = unsafeCSS(selector);
	const skeletonStyles = includeSkeleton ? css`
		:host([skeleton])  ${selectorCSS}.d2l-skeletize::before {
			bottom: 0.2rem;
			top: 0.2rem;
		}
		:host([skeleton]) ${selectorCSS}.d2l-link-small.d2l-skeletize::before {
			bottom: 0.15rem;
			top: 0.15rem;
		}
	` : unsafeCSS('');
	return css`
		${selectorCSS}, ${selectorCSS}:visited, ${selectorCSS}:active, ${selectorCSS}:link {
			--d2l-focus-ring-offset: 1px;
			color: var(--d2l-color-celestine);
			cursor: pointer;
			outline-style: none;
			text-decoration: none;
		}
		${selectorCSS}:hover {
			color: var(--d2l-color-celestine-minus-1);
			text-decoration: underline;
		}
		${getFocusRingStyles(selector, { extraStyles: css`border-radius: 2px; text-decoration: underline;` })}
		${selectorCSS}.d2l-link-main {
			font-weight: 700;
		}
		${selectorCSS}.d2l-link-small {
			font-size: 0.7rem;
			letter-spacing: 0.01rem;
			line-height: 1.05rem;
		}
		@media print {
			${selectorCSS}, ${selectorCSS}:visited, ${selectorCSS}:active, ${selectorCSS}:link {
				color: var(--d2l-color-ferrite);
			}
		}
		${skeletonStyles}
	`;
};
