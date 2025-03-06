import '../colors/colors.js';
import { _offscreenStyleDeclarations } from '../offscreen/offscreen.js';
import { css } from 'lit';

const pointerLength = 16;
const pointerRotatedLength = Math.SQRT2 * parseFloat(pointerLength);

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
		top: calc(100% + var(--d2l-dropdown-verticaloffset, 16px));
		width: 100%;
		z-index: 998; /* position on top of floating buttons */
	}
	:host([_fixed-positioning]) {
		position: fixed;
		top: 0;
	}

	:host([theme="dark"]) {
		--d2l-dropdown-above-animation-name: d2l-dropdown-above-animation-dark;
		--d2l-dropdown-animation-name: d2l-dropdown-animation-dark;
		--d2l-dropdown-background-color: #333536; /* tungsten @ 70% */
		--d2l-dropdown-border-color: var(--d2l-color-tungsten);
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
		bottom: calc(100% + var(--d2l-dropdown-verticaloffset, 16px));
		top: auto;
	}

	:host([data-mobile][opened]:not([mobile-tray])) {
		animation: var(--d2l-dropdown-animation-name) 300ms ease;
		display: inline-block;
	}

	:host([data-mobile][opened-above]:not([mobile-tray])) {
		animation: var(--d2l-dropdown-above-animation-name) 300ms ease;
		bottom: calc(100% + var(--d2l-dropdown-verticaloffset, 16px));
		top: auto;
	}

	:host([_fixed-positioning][opened-above]),
	:host([_fixed-positioning][data-mobile][opened-above]:not([mobile-tray])) {
		bottom: 0;
	}

	.d2l-dropdown-content-pointer {
		clip: rect(-5px, 21px, 8px, -7px);
		display: inline-block;
		left: calc(50% - 7px); /* todo: cleanup when switched to fixed positioning */
		position: absolute;
		top: -7px; /* todo: cleanup when switched to fixed positioning */
		z-index: 1;
	}
	:host([_fixed-positioning][dir="rtl"]) .d2l-dropdown-content-pointer {
		left: auto;
	}

	:host([align="start"]) .d2l-dropdown-content-pointer,
	:host([align="end"][dir="rtl"]) .d2l-dropdown-content-pointer {
		/* todo: cleanup when switched to fixed positioning */
		left: min(calc(1rem + ${(pointerRotatedLength - pointerLength) / 2}px), calc(50% - ${pointerLength / 2}px)); /* 1rem corresponds to .d2l-dropdown-content-container padding */
		right: auto;
	}
	:host([align="end"]) .d2l-dropdown-content-pointer,
	:host([align="start"][dir="rtl"]) .d2l-dropdown-content-pointer {
		/* todo: cleanup when switched to fixed positioning */
		left: auto;
		right: min(calc(1rem + ${(pointerRotatedLength - pointerLength) / 2}px), calc(50% - ${pointerLength / 2}px)); /* 1rem corresponds to .d2l-dropdown-content-container padding */
	}

	.d2l-dropdown-content-pointer > div {
		background-color: var(--d2l-dropdown-background-color);
		border: 1px solid var(--d2l-dropdown-border-color);
		border-radius: 0.1rem;
		box-shadow: -4px -4px 12px -5px rgba(32, 33, 34, 0.2); /* ferrite */
		height: ${pointerLength}px;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
		width: ${pointerLength}px;
	}

	:host([opened-above]) .d2l-dropdown-content-pointer {
		bottom: -8px;
		clip: rect(9px, 21px, 22px, -3px);
		top: auto;
	}
	:host([_fixed-positioning][opened-above]) .d2l-dropdown-content-pointer {
		bottom: auto;
	}

	:host([opened-above]) .d2l-dropdown-content-pointer > div {
		box-shadow: 4px 4px 12px -5px rgba(32, 33, 34, 0.2); /* ferrite */
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

	d2l-focus-trap {
		position: absolute;
	}

	:host([opened-above]) .d2l-dropdown-content-width {
		bottom: 100%;
	}

	.d2l-dropdown-content-container {
		box-sizing: border-box;
		max-width: 100%;
		outline: none;
		overflow-y: auto;
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

	:host(.d2l-dropdown-content-fading) {
		opacity: 0;
		/* matches DropdownOpenerMixin _closeTimerStart function */
		transition: opacity 0.4s ease-out 0.3s;
	}

	@media (prefers-reduced-motion: reduce) {
		:host(.d2l-dropdown-content-fading) {
			opacity: 1;
			transition: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:host([opened]), :host([opened-above]) {
			animation: none !important;
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

	@keyframes d2l-dropdown-mobile-tray-bottom {
		0% { opacity: 0; transform: translateY(100%); }
		100% { opacity: 1; transform: translate(0, 0); }
	}

	@keyframes d2l-dropdown-mobile-tray-bottom-close {
		0% { opacity: 1; transform: translate(0, 0); }
		100% { opacity: 0; transform: translateY(100%); }
	}

	:host([data-mobile][mobile-tray="left"]) .d2l-dropdown-content-width {
		border-bottom-left-radius: 0;
		border-top-left-radius: 0;
		bottom: 0;
		position: fixed;
		top: 0;
		z-index: 1000;
	}

	:host([data-mobile][mobile-tray="right"]) .d2l-dropdown-content-width {
		border-bottom-right-radius: 0;
		border-top-right-radius: 0;
		bottom: 0;
		position: fixed;
		top: 0;
		z-index: 1000;
	}

	:host([data-mobile][mobile-tray="bottom"]) .d2l-dropdown-content-width {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		left: 0;
		position: fixed;
		z-index: 1000;
	}

	:host([data-mobile][mobile-tray="right"][opened]) .d2l-dropdown-content-width {
		animation: d2l-dropdown-mobile-tray-right 300ms ease-out;
		right: 0;
	}

	:host([data-mobile][mobile-tray="left"][opened]) .d2l-dropdown-content-width {
		animation: d2l-dropdown-mobile-tray-left 300ms ease-out;
		left: 0;
	}

	:host([data-mobile][mobile-tray="bottom"][opened]) .d2l-dropdown-content-width {
		animation: d2l-dropdown-mobile-tray-bottom 300ms ease-out;
		bottom: 0;
	}

	:host([data-mobile][mobile-tray="right"][opened]) .d2l-dropdown-content-width[data-closing] {
		animation: d2l-dropdown-mobile-tray-right-close 300ms ease-out;
	}

	:host([data-mobile][mobile-tray="left"][opened]) .d2l-dropdown-content-width[data-closing] {
		animation: d2l-dropdown-mobile-tray-left-close 300ms ease-out;
	}

	:host([data-mobile][mobile-tray="bottom"][opened]) .d2l-dropdown-content-width[data-closing] {
		animation: d2l-dropdown-mobile-tray-bottom-close 300ms ease-out;
	}

	:host([data-mobile][mobile-tray="left"][opened]) .d2l-dropdown-content-container,
	:host([data-mobile][mobile-tray="right"][opened]) .d2l-dropdown-content-container {
		height: 100vh;
	}

	:host([data-mobile][mobile-tray]) > .d2l-dropdown-content-pointer {
		display: none;
	}

	:host([data-mobile][mobile-tray][opened]) {
		animation: none;
	}

	:host([data-mobile][mobile-tray]) .d2l-dropdown-content-bottom,
	:host([data-mobile][mobile-tray]) .d2l-dropdown-content-top {
		min-height: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		:host([data-mobile][mobile-tray][opened]) .d2l-dropdown-content-width {
			animation: none;
		}

		:host([data-mobile][mobile-tray][opened]) .d2l-dropdown-content-width[data-closing] {
			animation: none;
		}
	}

	:host([offscreen]) {
		${_offscreenStyleDeclarations}
	}
`;
