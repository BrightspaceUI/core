import { css } from 'lit-element/lit-element.js';

/* TODO: copy fresh styles and figure out what to do with button mixins and typography mixin
/* TODO: cleanup these styles / dedupe */

export const buttonStyles = css`
	:host {
		display: inline-block;
	}
	button {
		background-color: transparent;
		border-color: transparent;
		font-family: inherit;
		padding: 0.5rem 0.6rem;
		position: relative;
		box-shadow: 0 0 0 4px rgba(0, 0, 0, 0);
		border-radius: 0.3rem;
		border-style: solid;
		border-width: 1px;
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
		/*@apply --d2l-label-text;*/
		font-size: 0.7rem;
		line-height: 1rem;
		font-weight: 700;
		letter-spacing: 0.2px;
	}
	:host([h-align="text"]) button {
		left: -0.6rem;
	}
	:host(:dir(rtl)):host([h-align="text"]) button {
		left: 0;
		right: -0.6rem;
	}
	:host(:dir(rtl))[h-align="text"] button {
		left: 0;
		right: -0.6rem;
	}
	/* Firefox includes a hidden border which messes up button dimensions */
	button::-moz-focus-inner {
		border: 0;
	}
	button[disabled]:hover,
	button[disabled]:focus,
	:host([active]) button[disabled] {
		background-color: transparent;
	}
	button:hover,
	button:focus,
	:host([active]) button,
	:host(.d2l-button-subtle-hover) button,
	:host(.d2l-button-subtle-focus) button {
		background-color: var(--d2l-color-gypsum);
	}
	button:focus, :host(.d2l-button-subtle-focus) button {
		border-color: rgba(0, 111, 191, 0.4);
		box-shadow: 0 0 0 4px rgba(0, 111, 191, 0.3);
	}
	.d2l-button-subtle-content {
		color: var(--d2l-color-celestine);
		vertical-align: middle;
	}
	:host([icon]) .d2l-button-subtle-content {
		padding-left: 1.2rem;
	}
	:host([icon][icon-right]) .d2l-button-subtle-content {
		padding-left: 0;
		padding-right: 1.2rem;
	}
	:host(:dir(rtl)):host([icon]) .d2l-button-subtle-content {
		padding-left: 0;
		padding-right: 1.2rem;
	}
	:host(:dir(rtl))[icon] .d2l-button-subtle-content {
		padding-left: 0;
		padding-right: 1.2rem;
	}
	:host(:dir(rtl)):host([icon]):host([icon-right]) .d2l-button-subtle-content {
		padding-left: 1.2rem;
		padding-right: 0;
	}
	:host(:dir(rtl))[icon][icon-right] .d2l-button-subtle-content {
		padding-left: 1.2rem;
		padding-right: 0;
	}
	d2l-icon.d2l-button-subtle-icon {
		color: var(--d2l-color-celestine);
		display: none;
		height: 0.9rem;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 0.9rem;
	}
	:host([icon]) d2l-icon.d2l-button-subtle-icon {
		display: inline-block;
	}
	:host([icon][icon-right]) d2l-icon.d2l-button-subtle-icon {
		right: 0.6rem;
	}
	:host([dir="rtl"][icon][icon-right]) d2l-icon.d2l-button-subtle-icon {
		left: 0.6rem;
		right: auto;
	}
	:host(:dir(rtl))[icon][icon-right] d2l-icon.d2l-button-subtle-icon {
		left: 0.6rem;
		right: auto;
	}
	button[disabled] {
		cursor: default;
		opacity: 0.5;
	}
	:host([hidden]) {
		display: none;
	}
`;
