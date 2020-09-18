import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const skeletonStyles = css`
	@keyframes loadingPulse {
		0% { background-color: var(--d2l-color-sylvite); }
		50% { background-color: var(--d2l-color-regolith); }
		75% { background-color: var(--d2l-color-sylvite); }
		100% { background-color: var(--d2l-color-sylvite); }
	}
	:host([skeleton]) .d2l-skeletize::before {
		animation: loadingPulse 1.8s linear infinite;
		background-color: var(--d2l-color-sylvite);
		border-radius: 0.2rem;
		bottom: 0;
		content: '';
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		:host([skeleton]) .d2l-skeletize::before {
			animation: none;
		}
	}
	:host([skeleton]) .d2l-skeletize {
		background-color: transparent;
		border-color: transparent;
		box-shadow: none;
		color: transparent;
		position: relative;
	}
	:host([skeleton]) .d2l-skeletize-95::before {
		width: 95%;
	}
	:host([skeleton]) .d2l-skeletize-90::before {
		width: 90%;
	}
	:host([skeleton]) .d2l-skeletize-85::before {
		width: 85%;
	}
	:host([skeleton]) .d2l-skeletize-80::before {
		width: 80%;
	}
	:host([skeleton]) .d2l-skeletize-75::before {
		width: 75%;
	}
	:host([skeleton]) .d2l-skeletize-70::before {
		width: 70%;
	}
	:host([skeleton]) .d2l-skeletize-65::before {
		width: 65%;
	}
	:host([skeleton]) .d2l-skeletize-60::before {
		width: 60%;
	}
	:host([skeleton]) .d2l-skeletize-55::before {
		width: 55%;
	}
	:host([skeleton]) .d2l-skeletize-50::before {
		width: 50%;
	}
	:host([skeleton]) .d2l-skeletize-45::before {
		width: 45%;
	}
	:host([skeleton]) .d2l-skeletize-40::before {
		width: 40%;
	}
	:host([skeleton]) .d2l-skeletize-35::before {
		width: 35%;
	}
	:host([skeleton]) .d2l-skeletize-30::before {
		width: 30%;
	}
	:host([skeleton]) .d2l-skeletize-25::before {
		width: 25%;
	}
	:host([skeleton]) .d2l-skeletize-20::before {
		width: 20%;
	}
	:host([skeleton]) .d2l-skeletize-15::before {
		width: 15%;
	}
	:host([skeleton]) .d2l-skeletize-10::before {
		width: 10%;
	}
	:host([skeleton]) .d2l-skeletize-5::before {
		width: 5%;
	}
`;

export const SkeletonMixin = superclass => class extends superclass {

	static get properties() {
		return {
			skeleton: { reflect: true, type: Boolean  }
		};
	}

	static get styles() {
		return skeletonStyles;
	}

};
