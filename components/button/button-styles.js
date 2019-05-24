import { css } from 'lit-element/lit-element.js';

export const buttonStyles = css`
	button {
		border-radius: 0.3rem;
		border-style: solid;
		border-width: 1px;
		box-shadow: 0 0 0 4px rgba(0, 0, 0, 0);
		box-sizing: border-box;
		cursor: pointer;
		display: inline-block;
		margin: 0;
		min-height: calc(2rem + 2px);
		outline: none;
		text-align: center;
		transition: box-shadow 0.2s;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		vertical-align: middle;
		white-space: nowrap;
		width: auto;
	}
	button:focus {
		box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #006fbf;
	}
`;
