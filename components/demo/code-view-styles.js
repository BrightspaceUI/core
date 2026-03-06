import { css } from 'lit';

export const styles = css`
	:host {
		border: 1px solid var(--d2l-color-tungsten);
		border-radius: 6px;
		display: block;
		max-width: 900px;
		overflow: hidden;
		position: relative;
	}
	:host([hidden]) {
		display: none;
	}
	:host .d2l-code-view-code {
		font-size: 14px;
	}
	:host .d2l-code-view-code::before {
		box-sizing: border-box;
		color: var(--d2l-color-tungsten);
		content: attr(data-language);
		font-size: 0.7rem;
		margin: 0 0.4rem;
		padding: 0;
		position: absolute;
		right: 0;
		top: 0;
	}
	:host([hide-language]) .d2l-code-view-code::before {
		display: none;
	}
	:host .d2l-code-view-src {
		display: none;
	}
	pre[class*="language-"] {
		margin: 0;
		padding: 18px;
	}
`;
