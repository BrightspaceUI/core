import { css } from 'lit';

export const dropdownOpenerStyles = css`
	:host {
		display: inline-block;
		outline: none;
		overflow: visible;
		position: static;
	}
	:host([hidden]) {
		display: none;
	}
`;
