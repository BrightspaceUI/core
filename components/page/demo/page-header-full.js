import '../../button/button-icon.js';
import '../../colors/colors.js';
import '../page-header-button.js';
import '../page-header-custom.js';
import '../page-header-separator.js';
import { css, html, LitElement } from 'lit';
import { RequesterMixin } from '../../../mixins/provider/provider-mixin.js';

class PageHeaderFullDemo extends RequesterMixin(LitElement) {

	static styles = css`
		.full-nav-header {
			align-items: center;
			display: flex;
			height: 90px;
		}
		.full-nav-header-left {
			align-items: center;
			display: flex;
			flex: 0 1 auto;
			gap: 5px;
			height: 100%;
		}
		.full-nav-header-course {
			align-items: center;
			display: flex;
			gap: 5px;
		}
		.full-nav-header-spacer {
			flex: 1 1 auto;
			min-width: 30px;
		}
		.full-nav-header-right {
			align-items: center;
			display: flex;
			flex: 0 0 auto;
			height: 100%;
		}
		.full-nav-header-alerts {
			align-items: center;
			display: flex;
			height: 100%;
		}
		.full-nav-header-alerts-combined {
			display: none;
		}
		.full-nav-header-right d2l-page-header-button {
			margin-inline: 15px;
		}
		.full-nav-logo {
			background-color: var(--d2l-color-celestine);
			border-radius: 4px;
			color: white;
			font-size: 0.8rem;
			font-weight: 700;
			padding: 8px 14px;
		}
		.full-nav-footer-inner {
			align-items: center;
			display: flex;
			gap: 20px;
		}
		.full-nav-footer-links {
			display: flex;
			flex: 0 1 auto;
			gap: 20px;
			min-width: 0;
			overflow: hidden;
		}
		.full-nav-footer-inner d2l-button-icon {
			flex: 0 0 auto;
		}
		.full-nav-footer-link {
			border-bottom: 4px solid transparent;
			color: var(--d2l-color-ferrite);
			display: inline-block;
			padding: 8px 0;
			text-decoration: none;
		}
		.full-nav-footer-link:hover,
		.full-nav-footer-link:focus-visible {
			border-bottom-color: var(--d2l-color-celestine);
			color: var(--d2l-color-celestine);
		}
		@media (max-width: 615px) {
			.full-nav-header-alerts {
				display: none;
			}
			.full-nav-header-alerts-combined {
				display: inline-flex;
			}
		}
		@media (max-width: 400px) {
			.full-nav-header-course {
				display: none;
			}
		}
	`;

	connectedCallback() {
		super.connectedCallback();
		const configurePageHeader = this.requestInstance('d2l-page-header-configure');
		if (configurePageHeader) {
			configurePageHeader({ sticky: false });
		}
	}

	render() {
		return html`
			<d2l-page-header-custom bottom-is-visible-on-ancestor-target has-skip-nav>
				<div class="full-nav-header" slot="top">
					<div class="full-nav-header-left">
						<span class="full-nav-logo">Logo</span>
						<div class="full-nav-header-course">
							<d2l-page-header-separator></d2l-page-header-separator>
							Course
						</div>
					</div>
					<div class="full-nav-header-spacer"></div>
					<div class="full-nav-header-right">
						<d2l-page-header-button icon="tier3:classes" text="Select a course..." text-hidden></d2l-page-header-button>
						<d2l-page-header-separator></d2l-page-header-separator>
						<div class="full-nav-header-alerts">
							<d2l-page-header-button icon="tier3:email" text="Message alerts" text-hidden></d2l-page-header-button>
							<d2l-page-header-button icon="tier3:discussions" text="Subscription alerts" text-hidden></d2l-page-header-button>
							<d2l-page-header-button icon="tier3:notification-bell" text="Update alerts" text-hidden></d2l-page-header-button>
						</div>
						<d2l-page-header-button class="full-nav-header-alerts-combined" icon="tier3:notification-bell" text="Alerts" text-hidden></d2l-page-header-button>
					</div>
				</div>
				<div class="full-nav-footer" slot="bottom">
					<div class="full-nav-footer-inner">
						<div class="full-nav-footer-links">
							<a class="full-nav-footer-link" href="javascript:void(0)">Content</a>
							<a class="full-nav-footer-link" href="javascript:void(0)">Assignments</a>
							<a class="full-nav-footer-link" href="javascript:void(0)">Quizzes</a>
							<a class="full-nav-footer-link" href="javascript:void(0)">Grades</a>
							<a class="full-nav-footer-link" href="javascript:void(0)">Classlist</a>
						</div>
						<d2l-button-icon icon="tier1:more" text="More" visible-on-ancestor></d2l-button-icon>
					</div>
				</div>
			</d2l-page-header-custom>
		`;
	}

}

customElements.define('d2l-page-header-full-demo', PageHeaderFullDemo);
