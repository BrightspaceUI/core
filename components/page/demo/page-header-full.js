import '../../colors/colors.js';
import '../../link/link.js';
import '../page-header-button.js';
import '../page-header-custom.js';
import '../page-header-separator.js';
import { css, html, LitElement } from 'lit';
import { RequesterMixin } from '../../../mixins/provider/provider-mixin.js';

class PageHeaderFullDemo extends RequesterMixin(LitElement) {

	static styles = css`
		.full-nav-header {
			display: flex;
			height: 90px;
		}
		.full-nav-header-left {
			align-items: center;
			display: flex;
			flex: 1;
		}
		.full-nav-logo {
			background-color: var(--d2l-color-celestine);
			border-radius: 4px;
			color: white;
			font-weight: 700;
			padding: 8px 14px;
		}
		.full-nav-footer-links {
			display: flex;
			gap: 20px;
			padding: 0.4rem;
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
			<d2l-page-header-custom has-skip-nav>
				<div class="full-nav-header" slot="top">
					<div class="full-nav-header-left">
						<span class="full-nav-logo">Logo</span>
						<d2l-page-header-separator></d2l-page-header-separator>
						Course
					</div>
					<d2l-page-header-button icon="tier3:gear" text="Settings" text-hidden></d2l-page-header-button>
				</div>
				<div class="full-nav-footer-links" slot="bottom">
					<d2l-link href="javascript:void(0)">Content</d2l-link>
					<d2l-link href="javascript:void(0)">Assignments</d2l-link>
					<d2l-link href="javascript:void(0)">Grades</d2l-link>
				</div>
			</d2l-page-header-custom>
		`;
	}
}

customElements.define('d2l-page-header-full-demo', PageHeaderFullDemo);
