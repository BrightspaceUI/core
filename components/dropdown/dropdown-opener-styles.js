import { css } from 'lit';

export const dropdownOpenerStyles = css`
	:host {
		display: inline-block;
		outline: none;
		overflow: visible;
		position: relative;
	}
	:host([_fixed-positioning]) {
		position: static;
	}
	:host([hidden]) {
		display: none;
	}
`;
