import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const hierarchicalViewStyles = css`
	:host {
		box-sizing: border-box;
		display: inline-block;
		position: relative;
		left: 0;
		overflow: hidden;
		width: 100%;
		--d2l-hierarchical-view-height-transition: height 300ms linear;
		-webkit-transition: const(--d2l-hierarchical-view-height-transition);
		transition: const(--d2l-hierarchical-view-height-transition);
	}
	:host([child-view]) {
		display: none;
		position: absolute;
		top: 0;
		left: 100%;
	}
	:host([shown]) {
		display: inline-block;
	}
	.d2l-hierarchical-view-content.d2l-child-view-show {
		-webkit-animation: show-child-view-animation forwards 300ms linear;
		animation: show-child-view-animation 300ms forwards linear;
	}
	.d2l-hierarchical-view-content.d2l-child-view-hide {
		-webkit-animation: hide-child-view-animation forwards 300ms linear;
		animation: hide-child-view-animation 300ms forwards linear;
	}
	@keyframes show-child-view-animation {
		0% { transform: translate(0,0); }
		100% { transform: translate(-100%,0); }
	}
	@-webkit-keyframes show-child-view-animation {
		0% { -webkit-transform: translate(0,0); }
		100% { -webkit-transform: translate(-100%,0); }
	}
	@keyframes hide-child-view-animation {
		0% { transform: translate(-100%,0); }
		100% { transform: translate(0,0); }
	}
	@-webkit-keyframes hide-child-view-animation {
		0% { -webkit-transform: translate(-100%,0); }
		100% { -webkit-transform: translate(0,0); }
	}
`;
