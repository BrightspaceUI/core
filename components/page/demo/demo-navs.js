import { css, html, LitElement } from 'lit';

const sharedStyles = css`
	:host {
		display: block;
	}
	:host([hidden]) {
		display: none;
	}
	.nav-shadow {
		background-color: rgba(0, 0, 0, 0.02);
		bottom: -4px;
		display: block;
		height: 4px;
		pointer-events: none;
		position: absolute;
		width: 100%;
		z-index: 1;
	}
	.nav-band {
		background: linear-gradient(180deg, var(--d2l-branding-primary-color, var(--d2l-color-celestine)) 1.5rem, #ffffff 0%);
		min-height: 4px;
	}
	.nav-icon-btn {
		align-items: center;
		background: none;
		border: none;
		border-radius: 4px;
		color: var(--d2l-color-ferrite);
		cursor: pointer;
		display: inline-flex;
		font-size: 0.8rem;
		gap: 4px;
		justify-content: center;
		min-height: 42px;
		min-width: 42px;
		padding: 6px;
	}
	.nav-icon-btn:hover,
	.nav-icon-btn:focus-visible {
		background-color: var(--d2l-color-gypsum);
		color: var(--d2l-color-celestine);
	}
`;

/**
 * Temporary full navigation demo component - to be replaced by official navigation components
 */
class DemoNav extends LitElement {

	static get styles() {
		return [sharedStyles, css`
			.nav-wrapper {
				position: relative;
			}
			.nav-header {
				align-items: center;
				display: flex;
				height: 90px;
				margin-inline: var(--d2l-page-margin-inline);
				max-width: var(--d2l-page-header-top-max-width);
				padding: 0 30px;
			}
			@media (max-width: 767px) {
				.nav-header {
					height: 72px;
				}
			}
			@media (max-width: 615px) {
				.nav-header {
					padding: 0 15px;
				}
			}
			.nav-header-left {
				align-items: center;
				display: flex;
				flex: 0 1 auto;
				gap: 12px;
				height: 100%;
			}
			.nav-header-spacer {
				flex: 1 1 auto;
				min-width: 30px;
			}
			@media (max-width: 615px) {
				.nav-header-spacer {
					min-width: 15px;
				}
			}
			.nav-header-right {
				align-items: center;
				display: flex;
				flex: 0 0 auto;
				gap: 6px;
				height: 100%;
			}
			.nav-logo {
				background-color: var(--d2l-color-celestine);
				border-radius: 4px;
				color: white;
				font-size: 0.8rem;
				font-weight: 700;
				padding: 8px 14px;
			}
			.nav-separator {
				background-color: var(--d2l-color-mica);
				height: 26px;
				margin: 0 6px;
				width: 1px;
			}
			.nav-footer {
				border-bottom: 1px solid rgba(124, 134, 149, 0.18);
				border-top: 1px solid rgba(124, 134, 149, 0.18);
			}
			.nav-footer-inner {
				align-items: center;
				display: flex;
				gap: 4px;
				margin: 0 auto;
				max-width: 1230px;
				padding: 0 30px;
			}
			@media (max-width: 615px) {
				.nav-footer-inner {
					padding: 0 15px;
				}
			}
			.nav-footer-link {
				border-bottom: 4px solid transparent;
				color: var(--d2l-color-ferrite);
				display: inline-block;
				font-size: 0.7rem;
				padding: 8px 12px;
				text-decoration: none;
			}
			.nav-footer-link:hover,
			.nav-footer-link:focus-visible {
				border-bottom-color: var(--d2l-color-celestine);
				color: var(--d2l-color-celestine);
			}
		`];
	}

	render() {
		return html`
			<div class="nav-wrapper">
				<div class="nav-band"></div>
				<div class="nav-header">
					<div class="nav-header-left">
						<span class="nav-logo">Logo</span>
						<div class="nav-separator"></div>
						<button class="nav-icon-btn">📚 Courses</button>
					</div>
					<div class="nav-header-spacer"></div>
					<div class="nav-header-right">
						<button class="nav-icon-btn" title="Alerts">🔔</button>
						<button class="nav-icon-btn" title="Settings">⚙️</button>
						<button class="nav-icon-btn" title="Profile">👤</button>
					</div>
				</div>
				<div class="nav-footer">
					<div class="nav-footer-inner">
						<a class="nav-footer-link" href="javascript:void(0)">Content</a>
						<a class="nav-footer-link" href="javascript:void(0)">Assignments</a>
						<a class="nav-footer-link" href="javascript:void(0)">Quizzes</a>
						<a class="nav-footer-link" href="javascript:void(0)">Grades</a>
						<a class="nav-footer-link" href="javascript:void(0)">Classlist</a>
					</div>
				</div>
				<div class="nav-shadow"></div>
			</div>
		`;
	}
}

/**
 * Temporary immersive navigation demo component - to be replaced by official navigation components
 */
class DemoNavImmersive extends LitElement {

	static get styles() {
		return [sharedStyles, css`
			.immersive-wrapper {
				background-color: white;
				border-bottom: 1px solid var(--d2l-color-mica);
				position: relative;
			}
			.immersive-container {
				align-items: center;
				display: flex;
				height: 3.1rem;
				justify-content: space-between;
				margin-inline: var(--d2l-page-margin-inline);
				max-width: var(--d2l-page-header-top-max-width);
				overflow: hidden;
				padding: 0 30px;
			}
			@media (max-width: 929px) {
				.immersive-container {
					padding: 0 24px;
				}
			}
			@media (max-width: 767px) {
				.immersive-container {
					padding: 0 18px;
				}
			}
			@media (max-width: 615px) {
				.immersive-container {
					height: 2.8rem;
				}
			}
			.immersive-left {
				align-items: center;
				color: var(--d2l-color-tungsten);
				display: flex;
				flex: 0 0 auto;
				font-size: 0.8rem;
				letter-spacing: 0.2px;
			}
			.immersive-back-link {
				align-items: center;
				color: var(--d2l-color-tungsten);
				display: inline-flex;
				gap: 4px;
				text-decoration: none;
			}
			.immersive-back-link:hover,
			.immersive-back-link:focus-visible {
				color: var(--d2l-color-celestine);
			}
			.immersive-back-icon {
				font-size: 1rem;
			}
			.immersive-middle {
				border-inline-end: 1px solid var(--d2l-color-gypsum);
				border-inline-start: 1px solid var(--d2l-color-gypsum);
				flex: 0 1 auto;
				font-size: 0.8rem;
				margin: 0 24px;
				min-width: 0;
				overflow: hidden;
				padding: 0 24px;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 100%;
			}
			@media (max-width: 615px) {
				.immersive-middle {
					margin: 0 18px;
					padding: 0 18px;
				}
			}
			.immersive-right {
				align-items: center;
				display: flex;
				flex: 0 0 auto;
				gap: 8px;
			}
			.immersive-right .nav-icon-btn {
				font-size: 0.7rem;
			}
		`];
	}

	render() {
		return html`
			<div class="immersive-wrapper">
				<div class="nav-band"></div>
				<div class="immersive-container">
					<div class="immersive-left">
						<a class="immersive-back-link" href="javascript:void(0)">
							<span class="immersive-back-icon">‹</span>
							Back to Course
						</a>
					</div>
					<div class="immersive-middle">
						Assignment 1 - Introduction to Economics
					</div>
					<div class="immersive-right">
						<button class="nav-icon-btn">‹ Prev</button>
						<button class="nav-icon-btn">Next ›</button>
					</div>
				</div>
				<div class="nav-shadow"></div>
			</div>
		`;
	}
}

customElements.define('d2l-demo-nav', DemoNav);
customElements.define('d2l-demo-nav-immersive', DemoNavImmersive);
