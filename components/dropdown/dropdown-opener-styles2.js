import { css } from 'lit';

export const dropdownOpenerStyles = css`
	:host {
		display: inline-block;
		outline: none;
		overflow: visible;
		/*position: relative;*/
	}
	:host([hidden]) {
		display: none;
	}
`;
