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

	:host([opened]) {
		-webkit-animation: d2l-dropdown-animation 300ms ease;
		animation: d2l-dropdown-animation 300ms ease;
	}

	:host([opened-above]) {
		bottom: calc(100% + var(--d2l-dropdown-verticaloffset, 20px));
		top: auto;
		-webkit-animation: d2l-dropdown-above-animation 300ms ease;
		animation: d2l-dropdown-above-animation 300ms ease;
	}

	.d2l-dropdown-content-pointer {
		position: absolute;
		display: inline-block;
		clip: rect(-5px, 21px, 8px, -7px);
		top: -7px;
		left: calc(50% - 7px);
		z-index: 1;
	}

	.d2l-dropdown-content-pointer > div {
		background-color: #ffffff;
		border: 1px solid var(--d2l-color-mica);
		border-radius: 0.1rem;
		box-shadow: -4px -4px 12px -5px rgba(86, 90, 92, .2);
		height: 16px;
		width: 16px;
		transform: rotate(45deg);
		-webkit-transform: rotate(45deg);
	}

	:host([opened-above]) .d2l-dropdown-content-pointer {
		top: auto;
		clip: rect(9px, 21px, 22px, -3px);
		bottom: -8px;
	}

	:host([opened-above]) .d2l-dropdown-content-pointer > div {
		box-shadow: 4px 4px 12px -5px rgba(86, 90, 92, .2);
	}

	:host([no-pointer]) .d2l-dropdown-content-pointer {
		display: none;
	}

	.d2l-dropdown-content-position {
		border-radius: 0.3rem;
		display: inline-block;
		position: absolute;
	}

	.d2l-dropdown-content-width {
		background-color: #ffffff;
		border: 1px solid var(--d2l-color-mica);
		border-radius: 0.3rem;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
		box-sizing: border-box;
		min-width: 70px;
		max-width: 370px;
		position: absolute;
		width: 100vw;
	}

	:host([opened-above]) .d2l-dropdown-content-width {
		bottom: 100%;
	}

	.d2l-dropdown-content-container {
		box-sizing: border-box;
		display: inline-block;
		max-width: 100%;
		outline: none;
		padding: 1rem;
		vertical-align: top; /* prevents baseline bloat - fix for github issue #173 */
	}

	.d2l-dropdown-content-top,
	.d2l-dropdown-content-bottom {
		min-height: 5px;
		position: relative;
		z-index: 2;
	}

	.d2l-dropdown-content-header,
	.d2l-dropdown-content-footer {
		padding: 1rem;
	}

	:host([no-padding]) .d2l-dropdown-content-container,
	:host([no-padding]) .d2l-dropdown-content-header,
	:host([no-padding]) .d2l-dropdown-content-footer {
		padding: 0;
	}

	.d2l-dropdown-content-top {
		border-top-left-radius: 0.3rem;
		border-top-right-radius: 0.3rem;
	}

	.d2l-dropdown-content-bottom {
		border-bottom-left-radius: 0.3rem;
		border-bottom-right-radius: 0.3rem;
	}

	.d2l-dropdown-content-top-scroll {
		box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.05);
	}

	.d2l-dropdown-content-bottom-scroll {
		box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, 0.05);
	}

	:host([dir="rtl"]) {
		left: auto;
		right: 0;
		text-align: right;
	}

	@keyframes d2l-dropdown-animation {
		0% { transform: translate(0,-10px); opacity: 0; }
		100% { transform: translate(0,0); opacity: 1; }
	}
	@keyframes d2l-dropdown-above-animation {
		0% { transform: translate(0,10px); opacity: 0; }
		100% { transform: translate(0,0); opacity: 1; }
	}
	@-webkit-keyframes d2l-dropdown-animation {
		0% { -webkit-transform: translate(0,-10px); opacity: 0; }
		100% { -webkit-transform: translate(0,0); opacity: 1; }
	}
	@-webkit-keyframes d2l-dropdown-above-animation {
		0% { -webkit-transform: translate(0,10px); opacity: 0; }
		100% { -webkit-transform: translate(0,0); opacity: 1; }
	}
`;
