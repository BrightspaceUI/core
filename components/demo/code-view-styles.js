import { css } from 'lit-element/lit-element.js';

export const styles = css`
	:host {
		border: 1px solid var(--d2l-color-tungsten);
		border-radius: 6px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
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
