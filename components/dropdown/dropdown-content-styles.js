import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const dropdownContentStyles = css`

	:host {
		--d2l-dropdown-above-animation-name: d2l-dropdown-above-animation;
		--d2l-dropdown-animation-name: d2l-dropdown-animation;
		--d2l-dropdown-background-color: #ffffff;
		--d2l-dropdown-border-color: var(--d2l-color-mica);
		--d2l-dropdown-foreground-color: var(--d2l-color-ferrite);
		--d2l-dropdown-shadow-color: rgba(0, 0, 0, 0.15);
		box-sizing: border-box;
		color: var(--d2l-dropdown-foreground-color);
		display: none;
		left: 0;
		position: absolute;
		text-align: left;
		top: calc(100% + var(--d2l-dropdown-verticaloffset, 20px));
		width: 100%;
		z-index: 1000; /* position on top of floating buttons */
	}

	:host([theme="dark"]) {
		--d2l-dropdown-above-animation-name: d2l-dropdown-above-animation-dark;
		--d2l-dropdown-animation-name: d2l-dropdown-animation-dark;
		--d2l-dropdown-background-color: #333536; /* ferrite @ 70% */
		--d2l-dropdown-border-color: var(--d2l-color-ferrite);
		--d2l-dropdown-foreground-color: var(--d2l-color-sylvite);
		--d2l-dropdown-shadow-color: rgba(0, 0, 0, 1);
		opacity: 0.9;
	}

	:host([opened]) {
		animation: var(--d2l-dropdown-animation-name) 300ms ease;
		display: inline-block;
	}

	:host([opened-above]) {
		animation: var(--d2l-dropdown-above-animation-name) 300ms ease;
		bottom: calc(100% + var(--d2l-dropdown-verticaloffset, 20px));
		top: auto;
	}

	:host([data-mobile]) {
		:host([opened]) {
			animation: var(--d2l-dropdown-animation-name) 300ms ease;
			display: inline-block;
		}
	
		:host([opened-above]) {
			animation: var(--d2l-dropdown-above-animation-name) 300ms ease;
			bottom: calc(100% + var(--d2l-dropdown-verticaloffset, 20px));
			top: auto;
		}
	}

	.d2l-dropdown-content-pointer {
		clip: rect(-5px, 21px, 8px, -7px);
		display: inline-block;
		left: calc(50% - 7px);
		position: absolute;
		top: -7px;
		z-index: 1;
	}

	.d2l-dropdown-content-pointer > div {
		background-color: var(--d2l-dropdown-background-color);
		border: 1px solid var(--d2l-dropdown-border-color);
		border-radius: 0.1rem;
		box-shadow: -4px -4px 12px -5px rgba(73, 76, 78, 0.2); /* ferrite */
		height: 16px;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
		width: 16px;
	}

	:host([opened-above]) .d2l-dropdown-content-pointer {
		bottom: -8px;
		clip: rect(9px, 21px, 22px, -3px);
		top: auto;
	}

	:host([opened-above]) .d2l-dropdown-content-pointer > div {
		box-shadow: 4px 4px 12px -5px rgba(73, 76, 78, 0.2); /* ferrite */
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
		align-items: flex-start;
		background-color: var(--d2l-dropdown-background-color);
		border: 1px solid var(--d2l-dropdown-border-color);
		border-radius: 0.3rem;
		box-shadow: 0 2px 12px 0 var(--d2l-dropdown-shadow-color);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		max-width: 370px;
		min-width: 70px;
		position: absolute;
		width: 100vw;
	}

	:host([opened-above]) .d2l-dropdown-content-width {
		bottom: 100%;
	}

	.d2l-dropdown-content-container {
		box-sizing: border-box;
		max-width: 100%;
		outline: none;
		padding: 1rem;
	}

	.d2l-dropdown-content-top,
	.d2l-dropdown-content-bottom {
		box-sizing: border-box;
		max-width: 100%;
		min-height: 5px;
		position: relative;
		z-index: 2;
	}

	.d2l-dropdown-content-header {
		border-bottom: 1px solid var(--d2l-dropdown-border-color);
		padding: 1rem;
	}

	.d2l-dropdown-content-footer {
		border-top: 1px solid var(--d2l-dropdown-border-color);
		padding: 1rem;
	}

	:host([no-padding]) .d2l-dropdown-content-container,
	:host([no-padding-header]) .d2l-dropdown-content-header,
	:host([no-padding-footer]) .d2l-dropdown-content-footer {
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
		box-shadow: 0 3px 3px 0 var(--d2l-dropdown-shadow-color);
	}

	.d2l-dropdown-content-bottom-scroll {
		box-shadow: 0 -3px 3px 0 var(--d2l-dropdown-shadow-color);
	}

	:host([dir="rtl"]) {
		left: auto;
		right: 0;
		text-align: right;
	}

	@media (prefers-reduced-motion: reduce) {
		:host([opened]), :host([opened-above]) {
			animation: none;
		}
	}

	@keyframes d2l-dropdown-animation {
		0% { opacity: 0; transform: translate(0, -10px); }
		100% { opacity: 1; transform: translate(0, 0); }
	}
	@keyframes d2l-dropdown-animation-dark {
		0% { opacity: 0; transform: translate(0, -10px); }
		100% { opacity: 0.9; transform: translate(0, 0); }
	}
	@keyframes d2l-dropdown-above-animation {
		0% { opacity: 0; transform: translate(0, 10px); }
		100% { opacity: 1; transform: translate(0, 0); }
	}
	@keyframes d2l-dropdown-above-animation-dark {
		0% { opacity: 0; transform: translate(0, 10px); }
		100% { opacity: 0.9; transform: translate(0, 0); }
	}

	@keyframes d2l-dropdown-mobile-tray-right {
		0% { opacity: 0; transform: translateX(100%); }
		100% { opacity: 1; transform: translate(0, 0); }
	}

	@keyframes d2l-dropdown-mobile-tray-right-close {
		0% { opacity: 1; transform: translate(0, 0); }
		100% { opacity: 0; transform: translateX(100%); }
	}

	@keyframes d2l-dropdown-mobile-tray-left {
		0% { opacity: 0; transform: translateX(-100%); }
		100% { opacity: 1; transform: translate(0, 0); }
	}

	@keyframes d2l-dropdown-mobile-tray-left-close {
		0% { opacity: 1; transform: translate(0, 0); }
		100% { opacity: 0; transform: translateX(-100%); }
	}


	:host[data-mobile] {

		:host([mobile-tray="left"]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width,
		:host([mobile-tray="right"]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width {
			height: 100vh;
			position: fixed;
			top: 0;
			z-index: 1000;
		}

		:host([mobile-tray="right"][opened]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width {
			animation: d2l-dropdown-mobile-tray-right 300ms ease-out;
			right: 0;
		}

		:host([mobile-tray="left"][opened]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width {
			animation: d2l-dropdown-mobile-tray-left 300ms ease-out;
			left: 0;
		}

		:host([mobile-tray="right"][opened]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width[data-closing] {
			animation: d2l-dropdown-mobile-tray-right-close 300ms ease-out;
		}

		:host([mobile-tray="left"][opened]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width[data-closing] {
			animation: d2l-dropdown-mobile-tray-left-close 300ms ease-out;
		}

		:host([mobile-tray="left"][opened]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width > .d2l-dropdown-content-container,
		:host([mobile-tray="right"][opened]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width > .d2l-dropdown-content-container {
			height: 100vh;
		}

		:host([mobile-tray="left"]) > .d2l-dropdown-content-pointer,
		:host([mobile-tray="right"]) > .d2l-dropdown-content-pointer {
			display: none;
		}

		:host([mobile-tray="right"][opened]), :host([mobile-tray="left"][opened]) {
			animation: none;
		}

		:host([mobile-tray="left"]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width > .d2l-dropdown-content-bottom,
		:host([mobile-tray="right"]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width > .d2l-dropdown-content-bottom,
		:host([mobile-tray="left"]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width > .d2l-dropdown-content-top,
		:host([mobile-tray="right"]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width > .d2l-dropdown-content-top {
			min-height: auto;
		}

		/* TODO: dialog-style */
		d2l-dropdown-content[mobile-tray="bottom"] {
			/* content */
		}

		@media (prefers-reduced-motion: reduce) {
			:host([mobile-tray="left"][opened]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width,
			:host([mobile-tray="right"][opened]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width {
				animation: none;
			}

			:host([mobile-tray="left"][opened]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width[data-closing],
			:host([mobile-tray="right"][opened]) > .d2l-dropdown-content-position > .d2l-dropdown-content-width[data-closing] {
				animation: none;
			}
		}
	}
`;
