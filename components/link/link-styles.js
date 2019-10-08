import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const linkStyles = css`
	.d2l-link, .d2l-link:visited, .d2l-link:active, .d2l-link:link {
		color: var(--d2l-color-celestine);
		text-decoration: none;
		cursor: pointer;
	}
	.d2l-link:hover, .d2l-link:focus {
		color: var(--d2l-color-celestine-minus-1);
		text-decoration: underline;
		outline-width: 0;
	}
	.d2l-link[main] {
		font-weight: 700;
	}
	.d2l-link[small] {
		font-size: 0.7rem;
		line-height: 1.05rem;
		letter-spacing: 0.01rem;
	}
`;
