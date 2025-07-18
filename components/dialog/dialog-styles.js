import '../colors/colors.js';
import { css } from 'lit';
import { getFocusRingStyles } from '../../helpers/focus.js';

export const dialogStyles = css`

	:host {
		display: none;
	}

	:host([opened]), :host([_state="showing"]), :host([_state="hiding"]) {
		display: block;
	}

	:host([opened]:not([_state="showing"])) {
		visibility: hidden;
	}

	:host([opened][_state="showing"]),
	:host([opened][_state="hiding"]) {
		visibility: visible;
	}

	.d2l-dialog-outer {
		animation: d2l-dialog-close 200ms ease-in;
		background-color: white;
		border: 1px solid var(--d2l-color-mica);
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		box-sizing: border-box;
		position: fixed; /* also required for native to override position: absolute */
		top: 75px;
	}

	:host([_state="showing"]) > .d2l-dialog-outer {
		/* must target direct child to avoid ancestor from interfering with closing child dialogs in Legacy-Edge */
		animation: d2l-dialog-open 200ms ease-out;
	}

	@keyframes d2l-dialog-close {
		0% { opacity: 1; transform: translateY(0); }
		100% { opacity: 0; transform: translateY(-50px); }
	}

	@keyframes d2l-dialog-open {
		0% { opacity: 0; transform: translateY(-50px); }
		100% { opacity: 1; transform: translateY(0); }
	}

	.d2l-dialog-outer.d2l-dialog-outer-full-height {
		bottom: 1.5rem;
		top: 1.5rem;
	}

	.d2l-dialog-outer.d2l-dialog-outer-nested-showing {
		border-color: rgba(205, 213, 220, 0.35);
		box-shadow: none;
	}

	div.d2l-dialog-outer {
		left: 0;
		margin: auto;
		right: 0;
		width: 300px;
		z-index: 1000;
	}

	dialog.d2l-dialog-outer {
		color: var(--d2l-color-ferrite);
		margin-bottom: 0; /* required to override Chrome native positioning */
		margin-top: 0; /* required to override Chrome native positioning */
		padding: 0;
	}

	dialog::backdrop {
		/* cannot use variables inside of ::backdrop : https://github.com/whatwg/fullscreen/issues/124 */
		background-color: #f9fbff;
		opacity: 0;
		transition: opacity 200ms ease-in;
	}

	:host([_state="showing"]) dialog::backdrop {
		opacity: 0.7;
		transition-timing-function: ease-out;
	}

	d2l-focus-trap {
		display: block;
		height: 100%;
	}

	.d2l-dialog-inner {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	:host([critical]) .d2l-dialog-header {
		border-block-start: 0.4rem solid var(--d2l-color-cinnabar);
		border-start-end-radius: 0.4rem;
		border-start-start-radius: 0.4rem;
		margin-block: -1px 0;
		margin-inline: -1px;
		padding: 1rem 31px 23px 31px;
	}

	.d2l-dialog-header {
		box-sizing: border-box;
		flex: none;
		padding: 19px 30px 23px 30px;
		position: relative; /* stack header overflow shadow on top of content */
		z-index: 1; /* stack header overflow shadow on top of content */
	}

	.d2l-dialog-outer.d2l-dialog-outer-overflow-top .d2l-dialog-header {
		box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.05);
	}

	.d2l-dialog-header > div {
		display: flex;
	}

	.d2l-dialog-header > div > h2 {
		flex: 1 0 0;
		margin: 0;
	}

	.d2l-dialog-content {
		--d2l-list-controls-padding: 30px;
		box-sizing: border-box;
		flex: 1 0 0;
		overflow: hidden; /* scrollbar is kept hidden while we update the scroll position to avoid scrollbar flash */
		padding: 0 30px;
	}
	${getFocusRingStyles('.d2l-dialog-content', { extraStyles: css`--d2l-focus-ring-offset: -2px; border-radius: 6px;` })}
	.d2l-dialog-content > div {
		position: relative; /* make this the positioned parent for absolute positioned elements like d2l-template-primary-secondary */
	}

	:host([full-height]) .d2l-dialog-content > div {
		box-sizing: border-box;
		height: 100%;
	}

	:host(:not([no-content-scroll])) .d2l-dialog-outer-scroll .d2l-dialog-content {
		overflow: auto;
	}

	.d2l-dialog-footer {
		box-sizing: border-box;
		flex: none;
		padding: 18px 30px 0 30px; /* 18px margin below footer children */
		position: relative; /* stack footer overflow shadow on top of content */
	}

	.d2l-dialog-outer.d2l-dialog-outer-overflow-bottom .d2l-dialog-footer {
		box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, 0.05);
	}

	.d2l-dialog-footer ::slotted(*) {
		margin-block-end: 18px;
		margin-inline-end: 18px;
	}

	dialog.d2l-dialog-outer.d2l-dialog-fullscreen-within,
	div.d2l-dialog-outer.d2l-dialog-fullscreen-within {
		border: none;
		border-radius: 0;
		box-shadow: none;
		height: 100% !important;
		max-height: initial; /* required to override Chrome native positioning */
		max-width: initial; /* required to override Chrome native positioning */
		top: 0;
		width: 100% !important;
	}

	@media (max-width: 615px), (max-height: 420px) and (max-width: 900px) {

		.d2l-dialog-header {
			padding: 14px 20px 16px 20px;
		}
		.d2l-dialog-fullscreen-mobile .d2l-dialog-header > div > d2l-button-icon {
			margin-block: -8px 0;
			margin-inline: 15px -13px;
		}
		.d2l-dialog-content {
			--d2l-list-controls-padding: 20px;
			padding: 0 20px;
		}
		.d2l-dialog-footer {
			padding: 18px 20px 0 20px;
		}
		.d2l-dialog-outer.d2l-dialog-fullscreen-mobile {
			margin: 0 !important;
			min-width: calc(var(--d2l-vw, 1vw) * 100);
			top: 5%;
		}
		:host(:not([in-iframe])) dialog.d2l-dialog-outer.d2l-dialog-fullscreen-mobile,
		:host(:not([in-iframe])) div.d2l-dialog-outer.d2l-dialog-fullscreen-mobile {
			height: calc(var(--d2l-vh, 1vh) * 95);
			min-height: calc(var(--d2l-vh, 1vh) * 95);
		}

	}

	@media (prefers-reduced-motion: reduce) {
		.d2l-dialog-outer,
		:host([_state="showing"]) > .d2l-dialog-outer {
			animation: none;
		}
		dialog::backdrop {
			transition: none;
		}
	}
`;
