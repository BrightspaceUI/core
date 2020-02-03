import { css } from 'lit-element/lit-element.js';

export const dropdownContentStyles = css`
	:host {
		box-sizing: border-box;
		color: var(--d2l-color-ferrite);
		display: none;
		left: 0;
		position: absolute;
		text-align: left;
		top: calc(100% + var(--d2l-dropdown-verticaloffset, 20px));
		width: 100%;
		z-index: 1000; /* position on top of floating buttons */
	}

	:host([opened]) {
		display: inline-block;
	}
`;
