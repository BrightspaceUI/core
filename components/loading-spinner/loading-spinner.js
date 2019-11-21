import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class LoadingSpinner extends LitElement {

	static get properties() {
		return {
			color: { type: String },
			size: { type: Number }
		};
	}

	static get styles() {
		return css`

			:host {
				color: var(--d2l-loading-spinner-color, var(--d2l-color-celestine));
				display: inline-block;
				text-align: initial;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-loading-spinner-wrapper {
				height: var(--d2l-loading-spinner-size, 50px);
				margin: auto;
				overflow: hidden;
				position: relative;
				width: var(--d2l-loading-spinner-size, 50px);
			}
			.d2l-loading-spinner-bg,
			.d2l-loading-spinner-bg-blur {
				height: 100%;
				position: absolute;
				stroke: var(--d2l-loading-spinner-color, var(--d2l-color-celestine));
				top: 0;
				width: 100%;
			}
			.d2l-loading-spinner-bg-stroke {
				stroke: #ededfa;
			}
			.d2l-loading-spinner-bg-blur {
				opacity: 0.1;
				filter: blur(calc(var(--d2l-loading-spinner-size, 50px) / 10));
			}

			.d2l-loading-spinner-slice1,
			.d2l-loading-spinner-slice2,
			.d2l-loading-spinner-slice3,
			.d2l-loading-spinner-slice4,
			.d2l-loading-spinner-slice5 {
				animation-duration: 1.5s;
				animation-iteration-count: infinite;
				animation-timing-function: cubic-bezier(.5,0,.5,1);
				height: 50%;
				left: 50%;
				position: absolute;
				top: 0;
				transform-origin: left bottom;
				width: 50%;
			}
			.d2l-loading-spinner-slice1 {
				animation-name: slicespin1;
				transform: rotate(54deg);
			}
			.d2l-loading-spinner-slice2 {
				animation-name: slicespin2;
				transform: rotate(124deg);
			}
			.d2l-loading-spinner-slice3 {
				animation-name: slicespin3;
				transform: rotate(198deg);
			}
			.d2l-loading-spinner-slice4 {
				animation-name: slicespin4;
				transform: rotate(270deg);
			}
			.d2l-loading-spinner-slice5 {
				animation-name: slicespin5;
				transform: rotate(344deg);
			}

			@keyframes slicespin1 {
				0% { transform: rotate(54deg); }
				80%, 100% { transform: rotate(430deg); }
			}
			@keyframes slicespin2 {
				0%, 10% { transform: rotate(124deg); }
				80%, 100% { transform: rotate(500deg); }
			}
			@keyframes slicespin3 {
				0%, 20% { transform: rotate(198deg); }
				80%, 100% { transform: rotate(574deg); }
			}
			@keyframes slicespin4 {
				0%, 35% { transform: rotate(270deg); }
				80%, 100% { transform: rotate(644deg); }
			}
			@keyframes slicespin5 {
				80%, 100% { transform: rotate(720deg); }
			}

		`;
	}

	render() {
		return html`
			<div class="d2l-loading-spinner-wrapper">
				<svg viewBox="0 0 42 42" class="d2l-loading-spinner-bg-blur" focusable="false">
					<g fill="none" fill-rule="evenodd" transform="translate(5 5)">
						<circle stroke="none" fill="#000" cx="16" cy="16" r="14"></circle>
					</g>
				</svg>
				<svg viewBox="0 0 42 42" class="d2l-loading-spinner-bg" focusable="false">
					<g fill="none" fill-rule="evenodd" transform="translate(5 5)">
						<circle stroke-width="0.5" cx="16" cy="16" r="16" class="d2l-loading-spinner-bg-stroke"></circle>
						<circle stroke="none" fill="#FFF" cx="16" cy="16" r="16"></circle>
						<circle stroke-width="2" cx="16" cy="16" r="11"></circle>
					</g>
				</svg>
				<svg viewBox="0 0 42 42" class="d2l-loading-spinner-slice1" focusable="false">
					<g fill="none" fill-rule="evenodd">
						<path d="M24 42h8c0-17.673-14.327-32-32-32v8c1.105 0 2 .895 2 2s-.895 2-2 2v20h20c0-1.105.895-2 2-2s2 .895 2 2z" fill="#FFF"></path>
						<path d="M0 22c1.105 0 2-.895 2-2s-.895-2-2-2c13.255 0 24 10.745 24 24 0-1.105-.895-2-2-2s-2 .895-2 2c0-11.046-8.954-20-20-20z" fill="#E6EAF0"></path>
					</g>
				</svg>
				<svg viewBox="0 0 42 42" class="d2l-loading-spinner-slice2" focusable="false">
					<g fill="none" fill-rule="evenodd">
						<path d="M24 42h8c0-17.673-14.327-32-32-32v8c1.105 0 2 .895 2 2s-.895 2-2 2v20h20c0-1.105.895-2 2-2s2 .895 2 2z" fill="#FFF"></path>
						<path d="M0 22c1.105 0 2-.895 2-2s-.895-2-2-2c13.255 0 24 10.745 24 24 0-1.105-.895-2-2-2s-2 .895-2 2c0-11.046-8.954-20-20-20z" fill="#E6EAF0"></path>
					</g>
				</svg>
				<svg viewBox="0 0 42 42" class="d2l-loading-spinner-slice3" focusable="false">
					<g fill="none" fill-rule="evenodd">
						<path d="M24 42h8c0-17.673-14.327-32-32-32v8c1.105 0 2 .895 2 2s-.895 2-2 2v20h20c0-1.105.895-2 2-2s2 .895 2 2z" fill="#FFF"></path>
						<path d="M0 22c1.105 0 2-.895 2-2s-.895-2-2-2c13.255 0 24 10.745 24 24 0-1.105-.895-2-2-2s-2 .895-2 2c0-11.046-8.954-20-20-20z" fill="#E6EAF0"></path>
					</g>
				</svg>
				<svg viewBox="0 0 42 42" class="d2l-loading-spinner-slice4" focusable="false">
					<g fill="none" fill-rule="evenodd">
						<path d="M24 42h8c0-17.673-14.327-32-32-32v8c1.105 0 2 .895 2 2s-.895 2-2 2v20h20c0-1.105.895-2 2-2s2 .895 2 2z" fill="#FFF"></path>
						<path d="M0 22c1.105 0 2-.895 2-2s-.895-2-2-2c13.255 0 24 10.745 24 24 0-1.105-.895-2-2-2s-2 .895-2 2c0-11.046-8.954-20-20-20z" fill="#E6EAF0"></path>
					</g>
				</svg>
				<svg viewBox="0 0 42 42" class="d2l-loading-spinner-slice5" focusable="false">
					<g fill="none" fill-rule="evenodd">
						<path d="M24 42h8c0-17.673-14.327-32-32-32v8c1.105 0 2 .895 2 2s-.895 2-2 2v20h20c0-1.105.895-2 2-2s2 .895 2 2z" fill="#FFF"></path>
						<path d="M0 22c1.105 0 2-.895 2-2s-.895-2-2-2c13.255 0 24 10.745 24 24 0-1.105-.895-2-2-2s-2 .895-2 2c0-11.046-8.954-20-20-20z" fill="#E6EAF0"></path>
					</g>
				</svg>
			</div>
		`;
	}

	updated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'color') {
				// for IE11
				if (window.ShadyCSS) window.ShadyCSS.styleSubtree(this, {'--d2l-loading-spinner-color': this.color});
				else this.style.setProperty('--d2l-loading-spinner-color', this.color);
			} else if (propName === 'size') {
				// for IE11
				if (window.ShadyCSS) window.ShadyCSS.styleSubtree(this, {'--d2l-loading-spinner-size': `${this.size}px`});
				else this.style.setProperty('--d2l-loading-spinner-size', `${this.size}px`);
			}
		});
	}

}
customElements.define('d2l-loading-spinner', LoadingSpinner);
