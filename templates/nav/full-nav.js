import './labs/navigation.js';
import './labs/navigation-main-header.js';
import './labs/navigation-main-footer.js';
import './labs/navigation-button-icon.js';
import './labs/navigation-link-icon.js';
import './labs/navigation-separator.js';
import './labs/navigation-link-image.js';
import './labs/navigation-dropdown-button-icon.js';
import './labs/navigation-dropdown-button-custom.js';
import './labs/profile-image-base.js';
import '../../components/dropdown/dropdown.js';
import '../../components/dropdown/dropdown-content.js';
import '../../components/dropdown/dropdown-menu.js';
import '../../components/icons/icon.js';
import '../../components/menu/menu.js';
import '../../components/menu/menu-item.js';
import '../../components/menu/menu-item-link.js';
import '../../components/menu/menu-item-separator.js';
import { css, html, LitElement } from 'lit';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../../components/offscreen/offscreen.js';

/**
 * Full nav
 */
class FullNav extends LocalizeCoreElement(LitElement) {

	static get styles() {
		return [ offscreenStyles, css`
			:host {
				display: block;
				height: 100%;
				width: 100%;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-navigation-s {
				background-color: #fff;
				line-height: 1;
				min-width: 320px;
				position: relative;
			}
			.d2l-labs-navigation-header-left, .d2l-navigation-header-left {
				margin: -7px;
				overflow: hidden;
			}
			div ::slotted(.d2l-labs-navigation-header-left), div ::slotted(.d2l-labs-navigation-header-right) {
				align-items: center;
				display: flex;
				height: 100%;
			}
			div ::slotted(.d2l-labs-navigation-header-right) {
				flex: 0 0 auto;
			}
			.d2l-navigation-s-header-open-button-wrapper {
				display: inline-block;
				flex: 0 1 auto;
				height: 100%;
				padding: 0 7px;
			}
			@media (min-width: 768px) {
    			.d2l-navigation-s-header-open-button-wrapper {
					display: none;
				}
			}
			.d2l-navigation-s-header-logo-area {
				align-items: center;
				display: flex;
				flex: 0 1 auto;
				height: 100%;
				overflow: hidden;
				padding: 0 7px;
			}
			.d2l-navigation-s-notifications-wrapper {
				display: inline-block;
				height: 100%;
				margin: 0 -15px;
			}
			.d2l-navigation-s-notification {
				display: inline-block;
				height: 100%;
				margin: 0 15px;
			}
			.d2l-navigation-s d2l-labs-navigation-separator, .d2l-navigation-s d2l-navigation-separator {
				flex: 0 0 auto;
			}
			.d2l-navigation-s-course-menu {
				height: 100%;
			}
			.d2l-navigation-s-notifications {
				display: inline-block;
				flex: 0 0 auto;
				height: 100%;
			}
			.d2l-navigation-s-personal-menu {
				display: inline-block;
				flex: 0 0 auto;
				height: 100%;
			}
			.d2l-navigation-s-personal-menu-wrapper {
				align-items: center;
				display: flex;
			}
			@media (max-width: 1055px) {
				.d2l-navigation-s-personal-menu-text {
					display: none;
				}
			}
			.d2l-navigation-s-personal-menu d2l-dropdown-content {
				line-height: 1.5rem;
			}
			.d2l-navigation-s-admin-menu {
				display: inline-block;
				flex: 0 0 auto;
				height: 100%;
			}
			.d2l-navigation-s-admin-menu-spacer {
				display: inline-block;
				min-width: 20px;
			}
			.d2l-branding-navigation-background-color {
				background-color: #FFFFFF;
			}
			.d2l-navigation-s-main-wrapper[has-edit-menu] {
				margin-right: 2.6rem;
			}
			.d2l-navigation-s-main-wrapper[data-more] {
				justify-content: space-between;
			}
			.d2l-navigation-s-main-wrapper {
				align-items: center;
				display: flex;
				flex-wrap: nowrap;
				height: calc(1rem + 40px);
				transition: opacity .2s ease-in;
			}
			.d2l-navigation-s-item {
				display: inline-block;
				margin-right: 20px;
				white-space: nowrap;
			}
			.d2l-navigation-s-item[data-hidden] {
				display: none;
			}
			a.d2l-navigation-s-link, a.d2l-navigation-s-link:link, a.d2l-navigation-s-link:visited, div.d2l-navigation-s-item>span {
				color: #202122;
			}
			a.d2l-navigation-s-link, a.d2l-navigation-s-link:link, a.d2l-navigation-s-link:visited {
				border-radius: 1px;
				cursor: pointer;
				display: inline-block;
				line-height: normal;
				outline-offset: 4px;
				text-decoration: none;
			}
			.d2l-navigation-s-main-wrapper[data-more] .d2l-navigation-s-more {
				margin-left: 0;
				margin-right: 0;
			}
			.d2l-navigation-s-group {
				background: none;
				border: 0;
				border-radius: 1px;
				color: #202122;
				font-family: inherit;
				font-size: inherit;
				font-weight: inherit;
				margin: 0;
				outline-offset: 4px;
				padding: 0;
			}
			.d2l-navigation-s-group .d2l-navigation-s-group-wrapper {
				align-items: center;
				display: inline-flex;
				flex-wrap: nowrap;
			}
			.d2l-navigation-s-group .d2l-navigation-s-group-text {
				margin-right: .3rem;
				white-space: nowrap;
			}

			@media (max-width: 767px) {
				d2l-labs-navigation-main-header .d2l-navigation-s-header-logo-area .d2l-navigation-s-home-icon, d2l-labs-navigation-main-header .d2l-navigation-s-header-logo-area .d2l-navigation-s-logo, d2l-labs-navigation-main-header .d2l-navigation-s-header-logo-area .d2l-navigation-s-logo-divider, d2l-navigation-main-header .d2l-navigation-s-header-logo-area .d2l-navigation-s-home-icon, d2l-navigation-main-header .d2l-navigation-s-header-logo-area .d2l-navigation-s-logo, d2l-navigation-main-header .d2l-navigation-s-header-logo-area .d2l-navigation-s-logo-divider {
					display: none;
				}
			}
			@media (max-width: 767px) {
				.d2l-navigation-s-course-menu, .d2l-navigation-s-divider.d2l-navigation-s-course-menu-divider {
					display: none;
				}
			}
			@media (max-width: 767px) {
				.d2l-navigation-s-admin-menu {
					display: none;
				}
			}
			@media (max-width: 931px) {
				.d2l-navigation-s-notifications-wrapper {
					margin: 0;
				}
				.d2l-navigation-s-notification {
					margin: 0 10px;
				}
				.d2l-navigation-s d2l-labs-navigation-separator, .d2l-navigation-s d2l-navigation-separator {
					display: none;
				}
			}
			@media (max-width: 767px) {
				.d2l-navigation-main-ib, d2l-labs-navigation-main-footer, d2l-navigation-main-footer, d2l-organization-consortium-tabs {
					display: none;
				}
			}

			.d2l-navigation-s-mobile-menu[data-state=closed] {
				display: none;
			}
			.d2l-navigation-s-mobile-menu-content {
				background-color: #ffffff;
				height: 100%;
				left: 0;
				min-width: 300px;
				overflow-y: auto;
				position: fixed;
				top: 0;
				transform: translateX(-100%);
				transition: transform 300ms;
				width: 84%;
				z-index: 9000;
			}
			.d2l-navigation-s-mobile-menu[data-state="opened"] .d2l-navigation-s-mobile-menu-content {
				transform: translateX(0);
			}

			.d2l-navigation-s-mobile-menu-mask {
				background-color: var(--d2l-color-ferrite);
				height: 0;
				left: 0;
				opacity: 0;
				overflow: hidden;
				position: absolute;
				transition: opacity 300ms, width 0s 0.3s, height 0s 0.3s;
				top: 0;
				width: 0;
				z-index: 8999;
			}
			.d2l-navigation-s-mobile-menu-mask-close {
				min-width: 300px;
				width: 84%;
			}
			.d2l-navigation-s-mobile-menu-mask-close > d2l-button-icon {
				position: relative;
				top: 10px;
			}
			.d2l-navigation-s-mobile-menu-mask-close > d2l-button-icon:focus {
				left: calc(100% + 10px);
			}
			.d2l-navigation-s-mobile-menu[data-state="opened"] .d2l-navigation-s-mobile-menu-mask {
				height: 100vh;
				opacity: 0.8;
				transition: opacity 300ms;
				width: 100vw;
			}
			.d2l-navigation-s-mobile-menu-header {
				align-items: center;
				display: flex;
				height: 72px;
				padding: 0 1rem;
				font-size: 1.1rem;
				font-weight: 700;
			}

			.d2l-navigation-s-mobile-menu-color-strip {
				border-top: 1px solid var(--d2l-color-galena);
				border-bottom: 1px solid var(--d2l-color-galena);
				display: block;
				height: 10px;
			}

			.d2l-navigation-s-linkarea-no-color .d2l-navigation-s-mobile-menu-color-strip {
				border-top: none;
				height: 0;
			}

			.d2l-navigation-s-mobile-menu-branded-header {
				align-items: center;
				display: flex;
				height: 100%;
				width: 100%;
			}

			.d2l-navigation-s-mobile-menu-course-selector {
				display: inline-block;
				height: 100%;
			}

			.d2l-navigation-s-mobile-menu-header-course-menu {
				align-items: center;
				display: none;
				height: 100%;
				width: 100%;
			}
			
			.d2l-navigation-s-mobile-menu-header-course-menu .d2l-navigation-s-title-container {
					display: inline-block;
					flex: auto;
					flex: 1; /* IE10 defaults to 0 0 auto */
					margin-left: 20px;
					margin-right: 62px;
					overflow-x: hidden;
					text-decoration: none;
					text-overflow: ellipsis;
					white-space: nowrap;
			}

			.d2l-navigation-s-mobile-menu.d2l-navigation-s-mobile-menu-show-course-menu .d2l-navigation-s-mobile-menu-header-course-menu {
				display: flex;
			}
			.d2l-navigation-s-mobile-menu.d2l-navigation-s-mobile-menu-show-course-menu .d2l-navigation-s-mobile-menu-course-menu {
				display: block;
			}
			.d2l-navigation-s-mobile-menu.d2l-navigation-s-mobile-menu-show-course-menu .d2l-navigation-s-mobile-menu-branded-header,
			.d2l-navigation-s-mobile-menu.d2l-navigation-s-mobile-menu-show-course-menu .d2l-navigation-s-mobile-menu-title-bp,
			.d2l-navigation-s-mobile-menu.d2l-navigation-s-mobile-menu-show-course-menu .d2l-navigation-s-mobile-menu-nav {
				display: none;
			}

		.d2l-navigation-s-mobile-menu-course-menu {
			display: none;
			line-height: 1.5rem;
		}

		.d2l-navigation-s-mobile-menu-title-bp {
			background-color: var(--d2l-color-regolith);
			border-bottom: 1px solid var(--d2l-color-light-galena);
			border-top: 1px solid var(--d2l-color-light-galena);
			display: none;
			font-size: 1rem;
			font-weight: 700;
			padding: 1rem;
		}

		.d2l-navigation-s-mobile-menu-title-bp .d2l-navigation-s-link {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		@media (max-width: 767px) {
			.d2l-navigation-s-mobile-menu-title-bp {
				display: block;
			}
		}

		.d2l-navigation-s-mobile-menu-header .d2l-navigation-s-header-logo-area {
			flex-grow: 1;
			margin: -7px;
		}
		.d2l-navigation-s-mobile-menu-header .d2l-navigation-s-header-logo-area .d2l-navigation-s-logo-divider {
			display: inline-block;
		}

		.d2l-navigation-s-mobile-menu-header .d2l-navigation-s-header-logo-area.d2l-navigation-s-header-no-home-icon .d2l-navigation-s-logo-divider {
			display: none;
		}

		.d2l-navigation-s-mobile-menu-header .d2l-navigation-s-header-logo-area .d2l-navigation-s-link {
			font-size: 1rem;
		}
		.d2l-navigation-s-mobile-menu-color-strip {
			border-bottom: 1px solid hsla(200, 4%, 45%, .18);
			border-top: 1px solid hsla(200, 4%, 45%, .18);
			display: block;
			height: 10px;
		}
		.d2l-navigation-s-mobile-menu-color-strip {
			border-top: none;
			height: 0;
		}
		`];
	}

	render() {
		return html`
			<nav class="d2l-navigation-s">
				<d2l-labs-navigation has-skip-nav>
					<d2l-labs-navigation-main-header>
						<div class="d2l-labs-navigation-header-left" slot="left">
							<div class="d2l-navigation-s-header-open-button-wrapper">
								<d2l-labs-navigation-button-icon
									icon="tier3:menu-hamburger"
									text="Menu"
									text-hidden
									tooltip-offset="0"
									@click="${this._openMobileMenu}">
								</d2l-labs-navigation-button-icon>
							</div>
							<div class="d2l-navigation-s-header-logo-area">
								<d2l-labs-navigation-link-icon
									class="d2l-navigation-s-home-icon"
									text="My Home"
									href="/d2l/lp/ouHome/defaultHome.d2l"
									text-hidden
									icon="tier1:home"
									tooltip-offset="0">
								</d2l-labs-navigation-link-icon>
								<d2l-labs-navigation-separator class="d2l-navigation-s-logo-divider"></d2l-labs-navigation-separator>
								<d2l-labs-navigation-link-image
									class="d2l-navigation-s-logo"
									src="https://dev-lsone-d2l-43zw6t1jnyf.machines-bridge.dev.brightspace.com/d2l/common/files/platform/logo_stacked.svg?v=20.26.1.14643"
									text="Example Site"
									href="/d2l/lp/ouHome/home.d2l?ou=6606"
									tooltip-offset="0">
								</d2l-labs-navigation-link-image>
							</div>
						</div>
					<div class="d2l-labs-navigation-header-right" slot="right">
						<div class="d2l-navigation-s-course-menu">
							<d2l-labs-navigation-dropdown-button-icon
								icon="tier3:classes"
								text="Select a course..."
								no-auto-open
								tooltip-offset="0"
								data-prl="/d2l/lp/courseSelector/6606/InitPartial"
								data-prid="d2l_1_27_262">
								<d2l-dropdown-content
									max-width="800"
									min-width="450"
									no-padding
									vertical-offset="0"
									popover="manual"
									dropdown-content>
									<div id="d2l_1_27_262" class="d2l-placeholder d2l-placeholder-live" aria-live="assertive"></div>
									</d2l-dropdown-content>
								</d2l-labs-navigation-dropdown-button-icon>
							</div>
							<d2l-labs-navigation-separator class="d2l-navigation-s-course-menu-divider"></d2l-labs-navigation-separator>
							<div class="d2l-navigation-s-notifications">
								<div class="d2l-navigation-s-notifications-wrapper">
									<div class="d2l-navigation-s-notification" data-category="messages" data-aria-message="You have new Messages">
										<d2l-labs-navigation-dropdown-button-icon
											icon="tier3:email"
											text="Message alerts"
											no-auto-open=""
											tooltip-offset="0"
											data-prl="/d2l/NavigationArea/6606/ActivityFeed/GetAlertsDaylight?Category=2"
											data-prid="d2l_1_28_611">
											<d2l-dropdown-content max-width="500" no-padding="" vertical-offset="0" popover="manual" dropdown-content="">
												<div id="d2l_1_28_611" class="d2l-placeholder d2l-placeholder-live" aria-live="assertive"></div>
											</d2l-dropdown-content>
										</d2l-labs-navigation-dropdown-button-icon>
									</div>
									<div class="d2l-navigation-s-notification" data-category="alerts" data-aria-message="You have new Subscriptions">
										<d2l-labs-navigation-dropdown-button-icon
											icon="tier3:discussions"
											text="Subscription alerts"
											no-auto-open=""
											tooltip-offset="0"
											data-prl="/d2l/NavigationArea/6606/ActivityFeed/GetAlertsDaylight?Category=0"
											data-prid="d2l_1_29_990">
											<d2l-dropdown-content no-padding="" vertical-offset="0" popover="manual" dropdown-content="">
												<div id="d2l_1_29_990" class="d2l-placeholder d2l-placeholder-live" aria-live="assertive"></div>
											</d2l-dropdown-content>
										</d2l-labs-navigation-dropdown-button-icon>
									</div>
									<div class="d2l-navigation-s-notification" data-category="grades" data-aria-message="You have new Updates">
										<d2l-labs-navigation-dropdown-button-icon
											icon="tier3:notification-bell"
											text="Update alerts"
											no-auto-open=""
											tooltip-offset="0"
											data-prl="/d2l/NavigationArea/6606/ActivityFeed/GetAlertsDaylight?Category=1"
											data-prid="d2l_1_30_267"
											has-notification="">
											<d2l-dropdown-content no-padding="" vertical-offset="0" popover="manual" dropdown-content="">
												<div id="d2l_1_30_267" class="d2l-placeholder d2l-placeholder-live" aria-live="assertive"></div>
											</d2l-dropdown-content>
										</d2l-labs-navigation-dropdown-button-icon>
									</div>
								</div>
								<div class="d2l-navigation-s-notifications-div"></div>
							</div>
							<d2l-labs-navigation-separator class="d2l-navigation-s-notifications-divider"></d2l-labs-navigation-separator>
							<div class="d2l-navigation-s-personal-menu">
								<d2l-labs-navigation-dropdown-button-custom opener-label="D2L Support, avatar">
									<span class="d2l-navigation-s-personal-menu-wrapper" slot="opener">
										<d2l-profile-image-base
											class="d2l-token-receiver"
											data-token-receiver-scope="core:*:*"
											href=""
											first-name="D2L"
											last-name="Support"
											color-id="169"
											size="medium"
											aria-hidden="true"
											style="--d2l-initials-background-color: #AB578A;">
										</d2l-profile-image-base>
										<span class="d2l-navigation-s-personal-menu-text">D2L Support</span>
									</span>
									<d2l-dropdown-content min-width="300" no-padding="" vertical-offset="0" popover="manual" dropdown-content="">
										<ul class="d2l-personal-tools-list">
											<li>
												<div class="d2l_1_31_486 d2l_1_32_897">
													<a class="d2l-link" label="" href="javascript:void(0);" onclick="D2L.O(&quot;__g1&quot;,0)();return false;">View as Student</a>
													<a class="d2l-link d2l_1_33_205 d2l_1_34_982" label="" id="ChangeLinkId" href="javascript:void(0);" onclick="D2L.O(&quot;__g1&quot;,1)();return false;" title="Change Role">Change</a>
													<img class="d2l-image d2l-hidden d2l_1_33_205" src="/d2l/img/0/Impersonate.RoleSwitch.progress.gif?v=20.26.1.14643" style="width:20px;height:20px;" alt="Changing Role" id="ProgressImage" title="Changing Role">
												</div>
												<div class="d2l-clear"></div>
												<div class="d2l_1_35_654 d2l_1_36_988 d2l_1_37_703 d2l_1_38_216 d2l-hidden" id="RoleContainer">
													<ul class="d2l-list d2l_1_39_631">
														<li>
															<a class="d2l-link d2l_1_40_563" label="" href="javascript:void(0);" onclick="D2L.O(&quot;__g1&quot;,2)();return false;">D2LAdmin</a>
														</li>
														<li>
															<a class="d2l-link d2l_1_40_563" label="" href="javascript:void(0);" onclick="D2L.O(&quot;__g1&quot;,105)();return false;">GCStudent</a>
														</li>
														<li>
															<a class="d2l-link d2l_1_40_563" label="" href="javascript:void(0);" onclick="D2L.O(&quot;__g1&quot;,106)();return false;">JS_Admin</a>
														</li>
													</ul>
												</div>
											</li>
											<li class="d2l-personal-tools-separated-item"><div class="d2l-personal-tools-category-item d2l-personal-tools-category-item-first"><span style="white-space:nowrap;"><a class="d2l-link" label="" href="/d2l/lp/profile/profile_edit.d2l?ou=6606" onclick="D2L.O(&quot;__g1&quot;,200)();">Profile</a></span></div></li>
											<li class="d2l-personal-tools-category-item"><span style="white-space:nowrap;"><a class="d2l-link" label="" href="/d2l/folio/main/Index" onclick="D2L.O(&quot;__g1&quot;,201)();">My Portfolio</a></span></li>
											<li class="d2l-personal-tools-category-item"><span style="white-space:nowrap;"><a class="d2l-link" label="" href="/d2l/Notifications/Settings?ou=6606" onclick="D2L.O(&quot;__g1&quot;,202)();">Notifications</a></span></li>
											<li class="d2l-personal-tools-category-item d2l-personal-tools-category-item-last"><span style="white-space:nowrap;"><a class="d2l-link" label="" href="/d2l/lp/preferences/preferences_main/preferences_main.d2l?ou=6606" onclick="D2L.O(&quot;__g1&quot;,201)();">Account Settings</a></span></li>
											<li class="d2l-personal-tools-separated-item"><span style="white-space:nowrap;"><a class="d2l-link d2l_1_31_486" label="" id="LocaleLinkId" href="javascript:void(0);" onclick="D2L.O(&quot;__g1&quot;,203)();return false;">English (United States)</a></span></li>
											<li class="d2l-personal-tools-separated-item"><span style="white-space:nowrap;"><a class="d2l-link d2l_1_31_486" label="" href="javascript:void(0);" onclick="D2L.O(&quot;__g1&quot;,204)();return false;">Log Out</a></span></li>
										</ul>
									</d2l-dropdown-content>
								</d2l-labs-navigation-dropdown-button-custom>
							</div>
							<div class="d2l-navigation-s-admin-menu">
								<div class="d2l-navigation-s-admin-menu-spacer"></div>
								<d2l-labs-navigation-dropdown-button-icon icon="tier3:gear" text="Admin Tools" no-auto-open="" tooltip-offset="0" data-prl="/d2l/lp/admintools/6606/dropdownpartial" data-prid="d2l_1_41_591"><d2l-dropdown-content max-width="960" min-width="200" no-padding="" vertical-offset="0" popover="manual" dropdown-content=""><div id="d2l_1_41_591" class="d2l-placeholder d2l-placeholder-live" aria-live="assertive"></div></d2l-dropdown-content></d2l-labs-navigation-dropdown-button-icon>
							</div>
						</div>
					</d2l-labs-navigation-main-header>
					<d2l-labs-navigation-main-footer class="d2l-branding-navigation-background-color d2l-visible-on-ancestor-target">
						<div slot="main">
							<div class="d2l-navigation-s-main-wrapper" has-edit-menu role="list" data-more="1">
								<div class="d2l-navigation-s-item" role="listitem"><a href="/d2l/le/6606/quickeval/" class="d2l-navigation-s-link">Quick Eval</a></div>
								<div class="d2l-navigation-s-item" role="listitem"><a href="/d2l/ap/InsightsPortal/6606/dashboards" class="d2l-navigation-s-link">Insights Portal</a></div>
								<div class="d2l-navigation-s-item" role="listitem"><a href="/d2l/datahub/dataexport/List" class="d2l-navigation-s-link">Data Hub</a></div>
								<div class="d2l-navigation-s-item" role="listitem"><a href="/d2l/le/calendar/6606" class="d2l-navigation-s-link">Calendar</a></div>
								<div class="d2l-navigation-s-item" role="listitem"><a href="/d2l/lms/news/main.d2l?ou=6606" class="d2l-navigation-s-link">Announcements</a></div>
								<div class="d2l-navigation-s-item" role="listitem"><a href="/d2l/lor/search/search.d2l?ou=6606" class="d2l-navigation-s-link">LOR</a></div>
								<div class="d2l-navigation-s-item" role="listitem"><a href="/d2l/awards/6606/" class="d2l-navigation-s-link">Awards</a></div>
								<div class="d2l-navigation-s-item" role="listitem" data-hidden="1"><a href="/d2l/lms/legacy/selfregistration.d2l?ou=6606" class="d2l-navigation-s-link">Self Registration</a></div>
								<div class="d2l-navigation-s-item" role="listitem" data-hidden="1"><a href="/d2l/cpd/main/" class="d2l-navigation-s-link">My CPD Records</a></div>
								<div class="d2l-navigation-s-item" role="listitem" data-hidden="1"><a href="/d2l/custom/config/6606/" class="d2l-navigation-s-link">Customization Configuration</a></div>
								<div class="d2l-navigation-s-item" role="listitem" data-hidden="1"><a href="/d2l/ext/rp/6606/lti/framedlaunch/381c63cd-b84c-41a0-b805-58530a752a1a" class="d2l-navigation-s-link">Brightspace App Finder</a></div>
								<div class="d2l-navigation-s-item" role="listitem" data-hidden="1"><a href="/d2l/ep/6606/dashboard/index" class="d2l-navigation-s-link">ePortfolio</a></div>
								<div class="d2l-navigation-s-item" role="listitem" data-hidden="1"><a href="/d2l/lp/manageFiles/main.d2l?ou=6606" class="d2l-navigation-s-link">Manage Files</a></div>
								<div class="d2l-navigation-s-item" role="listitem" data-hidden="1">
									<d2l-dropdown><button class="d2l-navigation-s-group d2l-dropdown-opener" aria-expanded="false"><span class="d2l-navigation-s-group-wrapper"><span class="d2l-navigation-s-group-text">Tests</span><d2l-icon icon="tier1:chevron-down"></d2l-icon></span></button><d2l-dropdown-menu popover="manual" dropdown-content="">
										<d2l-menu label="Tests" class="d2l-menu-mvc">
											<d2l-menu-item-link text="MVC Tests" href="/d2l/tests/desktop" class="d2l-navigation-s-menu-item-root" label="MVC Tests"></d2l-menu-item-link>
											<d2l-menu-item-link text="Legacy Tests" href="/d2l/lp/tests/index.d2l" class="d2l-navigation-s-menu-item-root" label="Legacy Tests"></d2l-menu-item-link>
											<d2l-menu-item-link text="REST Test Page" href="/d2l/lp/tests/rest/restTest.d2l" class="d2l-navigation-s-menu-item-root" label="REST Test Page"></d2l-menu-item-link>
										</d2l-menu>
									</d2l-dropdown-menu></d2l-dropdown>
								</div>
								<div class="d2l-navigation-s-item" role="listitem" data-hidden="1"><a href="/d2l/le/managerRole/view/" class="d2l-navigation-s-link">Manager Dashboard</a></div>
								<div class="d2l-navigation-s-item d2l-navigation-s-more" role="listitem">
									<d2l-dropdown><button class="d2l-navigation-s-group d2l-dropdown-opener" aria-expanded="false"><span class="d2l-navigation-s-group-wrapper"><span class="d2l-navigation-s-group-text">More</span><d2l-icon icon="tier1:chevron-down"></d2l-icon></span></button><d2l-dropdown-menu popover="manual" dropdown-content="">
										<d2l-menu label="More" class="d2l-menu-mvc">
											<d2l-menu-item-link text="Quick Eval" href="/d2l/le/6606/quickeval/" class="d2l-navigation-s-menu-item-root d2l-hidden" label="Quick Eval"></d2l-menu-item-link>
											<d2l-menu-item-link text="Insights Portal" href="/d2l/ap/InsightsPortal/6606/dashboards" class="d2l-navigation-s-menu-item-root d2l-hidden" label="Insights Portal"></d2l-menu-item-link>
											<d2l-menu-item-link text="Data Hub" href="/d2l/datahub/dataexport/List" class="d2l-navigation-s-menu-item-root d2l-hidden" label="Data Hub"></d2l-menu-item-link>
											<d2l-menu-item-link text="Calendar" href="/d2l/le/calendar/6606" class="d2l-navigation-s-menu-item-root d2l-hidden" label="Calendar"></d2l-menu-item-link>
											<d2l-menu-item-link text="Announcements" href="/d2l/lms/news/main.d2l?ou=6606" class="d2l-navigation-s-menu-item-root d2l-hidden" label="Announcements"></d2l-menu-item-link>
											<d2l-menu-item-link text="LOR" href="/d2l/lor/search/search.d2l?ou=6606" class="d2l-navigation-s-menu-item-root d2l-hidden" label="LOR"></d2l-menu-item-link>
											<d2l-menu-item-link text="Awards" href="/d2l/awards/6606/" class="d2l-navigation-s-menu-item-root d2l-hidden" label="Awards"></d2l-menu-item-link>
											<d2l-menu-item-link text="Learning Groups" href="/d2l/le/learningGroup/view/" class="d2l-navigation-s-menu-item-root d2l-hidden" label="Learning Groups"></d2l-menu-item-link>
											<d2l-menu-item-link text="Self Registration" href="/d2l/lms/legacy/selfregistration.d2l?ou=6606" class="d2l-navigation-s-menu-item-root" label="Self Registration"></d2l-menu-item-link>
											<d2l-menu-item-link text="My CPD Records" href="/d2l/cpd/main/" class="d2l-navigation-s-menu-item-root" label="My CPD Records"></d2l-menu-item-link>
											<d2l-menu-item-link text="Customization Configuration" href="/d2l/custom/config/6606/" class="d2l-navigation-s-menu-item-root" label="Customization Configuration"></d2l-menu-item-link>
											<d2l-menu-item-link text="Brightspace App Finder" href="/d2l/ext/rp/6606/lti/framedlaunch/381c63cd-b84c-41a0-b805-58530a752a1a" class="d2l-navigation-s-menu-item-root" label="Brightspace App Finder"></d2l-menu-item-link>
											<d2l-menu-item-link text="ePortfolio" href="/d2l/ep/6606/dashboard/index" class="d2l-navigation-s-menu-item-root" label="ePortfolio"></d2l-menu-item-link>
											<d2l-menu-item-link text="Manage Files" href="/d2l/lp/manageFiles/main.d2l?ou=6606" class="d2l-navigation-s-menu-item-root" label="Manage Files"></d2l-menu-item-link>
											<d2l-menu-item-link text="Manager Dashboard" href="/d2l/le/managerRole/view/" class="d2l-navigation-s-menu-item-root" label="Manager Dashboard" last="true"></d2l-menu-item-link>
										</d2l-menu>
									</d2l-dropdown-menu></d2l-dropdown>
								</div>
							</div>
							<div class="d2l-navigation-s-edit-menu">
								<d2l-dropdown-more text="Navbar Options" translucent visible-on-ancestor animation-type="opacity-transform"><d2l-dropdown-menu>
									<d2l-menu label="Navbar Actions Menu" class="d2l-menu-mvc">
										<d2l-menu-item text="Edit This Navbar" id="d2l_1_42_974" label="Edit This Navbar"></d2l-menu-item>
										<d2l-menu-item-link text="Manage All Course Navbars" href="/d2l/lp/navbars/6606/list" label="Manage All Course Navbars" last="true"></d2l-menu-item-link>
									</d2l-menu>
								</d2l-dropdown-menu></d2l-dropdown-more>
							</div>
						</div>
					</d2l-labs-navigation-main-footer>
		
		
					<div class="d2l-navigation-s-mobile-menu" data-state="closed" data-cprl="/d2l/lp/courseSelector/6606/InitPartial">
						<div class="d2l-navigation-s-mobile-menu-mask" @click="${this._closeMobileMenu}">
							<div class="d2l-navigation-s-mobile-menu-focus-trap-start d2l-offscreen">Menu Start</div>
							<p class="d2l-navigation-s-mobile-menu-first d2l-offscreen">Menu Start</p>
							<div class="d2l-navigation-s-mobile-menu-mask-close"><d2l-button-icon icon="tier1:close-large-thick" text="close" animation-type="opacity-transform" type="button"></d2l-button-icon></div>
						</div>
						<div class="d2l-navigation-s-mobile-menu-content">
							<d2l-labs-navigation-band></d2l-labs-navigation-band>
							<div class="d2l-navigation-s-mobile-menu-header">
								<div class="d2l-navigation-s-mobile-menu-branded-header">
									<div class="d2l-navigation-s-header-logo-area">
										<d2l-labs-navigation-link-icon class="d2l-navigation-s-home-icon" text="My Home" href="/d2l/lp/ouHome/defaultHome.d2l" text-hidden="" icon="tier1:home" tooltip-offset="0"></d2l-labs-navigation-link-icon>
										<d2l-labs-navigation-separator class="d2l-navigation-s-logo-divider"></d2l-labs-navigation-separator>
										<d2l-labs-navigation-link-image class="d2l-navigation-s-logo" src="https://dev-lsone-d2l-43zw6t1jnyf.machines-bridge.dev.brightspace.com//d2l/common/files/platform/logo_stacked.svg?v=20.26.1.14643" text="Example Site" href="/d2l/lp/ouHome/home.d2l?ou=6606" slim="" tooltip-offset="0"></d2l-labs-navigation-link-image>
									</div>
									<div class="d2l-navigation-s-gutter"></div>
									<div class="d2l-navigation-s-mobile-menu-course-selector"><d2l-labs-navigation-button-icon icon="tier3:classes" text="Select a course..." text-hidden="" tooltip-offset="0" @click="${this._openMobileCourseMenu}"></d2l-labs-navigation-button-icon></div>
								</div>
								<div class="d2l-navigation-s-mobile-menu-header-course-menu"><d2l-labs-navigation-button-icon icon="tier1:chevron-left" text="Example Site" text-hidden="" tooltip-offset="0" @click="${this._closeMobileCourseMenu}"></d2l-labs-navigation-button-icon></div>
							</div>
							<div class="d2l-navigation-s-mobile-menu-color-strip d2l-branding-navigation-background-color"></div>
							<div class="d2l-navigation-s-mobile-menu-course-menu">
								Course menu here
							</div>
							<div class="d2l-navigation-s-mobile-menu-nav">
									<d2l-menu label="Menu" class="d2l-menu-mvc">
										<d2l-menu-item-link text="Quick Eval" href="/d2l/le/6606/quickeval/" label="Quick Eval"></d2l-menu-item-link>
										<d2l-menu-item-link text="Insights Portal" href="/d2l/ap/InsightsPortal/6606/dashboards" label="Insights Portal"></d2l-menu-item-link>
										<d2l-menu-item-link text="Data Hub" href="/d2l/datahub/dataexport/List" label="Data Hub"></d2l-menu-item-link>
										<d2l-menu-item-link text="Calendar" href="/d2l/le/calendar/6606" label="Calendar"></d2l-menu-item-link>
										<d2l-menu-item-link text="Announcements" href="/d2l/lms/news/main.d2l?ou=6606" label="Announcements"></d2l-menu-item-link>
									<d2l-menu-item-link text="LOR" href="/d2l/lor/search/search.d2l?ou=6606" label="LOR"></d2l-menu-item-link>
									<d2l-menu-item-link text="Awards" href="/d2l/awards/6606/" label="Awards"></d2l-menu-item-link>
									<d2l-menu-item-link text="Learning Groups" href="/d2l/le/learningGroup/view/" label="Learning Groups"></d2l-menu-item-link>
									<d2l-menu-item-link text="Self Registration" href="/d2l/lms/legacy/selfregistration.d2l?ou=6606" label="Self Registration"></d2l-menu-item-link>
									<d2l-menu-item-link text="My CPD Records" href="/d2l/cpd/main/" label="My CPD Records"></d2l-menu-item-link>
									<d2l-menu-item-link text="Customization Configuration" href="/d2l/custom/config/6606/" label="Customization Configuration"></d2l-menu-item-link>
									<d2l-menu-item-link text="Brightspace App Finder" href="/d2l/ext/rp/6606/lti/framedlaunch/381c63cd-b84c-41a0-b805-58530a752a1a" label="Brightspace App Finder"></d2l-menu-item-link>
									<d2l-menu-item-link text="ePortfolio" href="/d2l/ep/6606/dashboard/index" label="ePortfolio"></d2l-menu-item-link>
									<d2l-menu-item-link text="Manage Files" href="/d2l/lp/manageFiles/main.d2l?ou=6606" label="Manage Files"></d2l-menu-item-link>
									<d2l-menu-item text="Tests" label="Tests">
										<d2l-menu class="d2l-menu-mvc" label="Tests">
											<d2l-menu-item-link text="MVC Tests" href="/d2l/tests/desktop" label="MVC Tests"></d2l-menu-item-link>
											<d2l-menu-item-link text="Legacy Tests" href="/d2l/lp/tests/index.d2l" label="Legacy Tests"></d2l-menu-item-link>
											<d2l-menu-item-link text="REST Test Page" href="/d2l/lp/tests/rest/restTest.d2l" label="REST Test Page" last="true"></d2l-menu-item-link>
										</d2l-menu>
									</d2l-menu-item>
									<d2l-menu-item-link text="Manager Dashboard" href="/d2l/le/managerRole/view/" label="Manager Dashboard"></d2l-menu-item-link>
									<d2l-menu-item-separator role="separator"></d2l-menu-item-separator>
									<d2l-menu-item text="Navbar Options" label="Navbar Options">
										<d2l-menu class="d2l-menu-mvc" label="Navbar Options">
											<d2l-menu-item text="Edit This Navbar" id="d2l_1_43_308" label="Edit This Navbar"></d2l-menu-item>
											<d2l-menu-item-link text="Manage All Course Navbars" href="/d2l/lp/navbars/6606/list" label="Manage All Course Navbars" last="true"></d2l-menu-item-link>
										</d2l-menu>
									</d2l-menu-item>
									<d2l-menu-item text="Admin Tools" label="Admin Tools" last="true">
										<d2l-menu class="d2l-menu-mvc" label="Admin Tools">
											<d2l-menu-item text="User Related" label="User Related">
												<d2l-menu class="d2l-menu-mvc" label="User Related">
													<d2l-menu-item-link text="Notifications" href="/d2l/Notifications/Admin/DefaultSettings" label="Notifications"></d2l-menu-item-link>
													<d2l-menu-item-link text="Profile Cards" href="/d2l/profilecardmanagement/view" label="Profile Cards"></d2l-menu-item-link>
													<d2l-menu-item-link text="User Attributes" href="/d2l/le/attributes/view/" label="User Attributes"></d2l-menu-item-link>
													<d2l-menu-item-link text="Users" href="/d2l/lp/manageUsers/main.d2l?ou=6606" label="Users" last="true"></d2l-menu-item-link>
												</d2l-menu>
											</d2l-menu-item>
											<d2l-menu-item text="Organization Related" label="Organization Related">
												<d2l-menu class="d2l-menu-mvc" label="Organization Related">
													<d2l-menu-item-link text="Audio/Video Note Editor" href="/d2l/wcs/mp/captions/list" label="Audio/Video Note Editor"></d2l-menu-item-link>
													<d2l-menu-item-link text="Branding Management" href="/d2l/lp/branding/home" label="Branding Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="Broken Links" href="/d2l/brokenLinks" label="Broken Links"></d2l-menu-item-link>
													<d2l-menu-item-link text="Competency Service Jobs" href="/d2l/lms/competencies/competency_service_jobs.d2l?ou=6606" label="Competency Service Jobs"></d2l-menu-item-link>
													<d2l-menu-item-link text="Config Variable Browser" href="/d2l/lp/configVariableBrowser" label="Config Variable Browser"></d2l-menu-item-link>
													<d2l-menu-item-link text="Content Service Data Purge" href="/d2l/contentservice/datapurge/purge" label="Content Service Data Purge"></d2l-menu-item-link>
													<d2l-menu-item-link text="Content Service Recycling Bin" href="/d2l/contentservice/undelete/undelete" label="Content Service Recycling Bin"></d2l-menu-item-link>
													<d2l-menu-item-link text="Content Styler" href="/d2l/le/content/6606/contentStyler/View" label="Content Styler"></d2l-menu-item-link>
													<d2l-menu-item-link text="Course Publisher" href="/d2l/lms/publish/fra/manage" label="Course Publisher"></d2l-menu-item-link>
													<d2l-menu-item-link text="Createspace" href="/d2l/createspace/6606/home" label="Createspace"></d2l-menu-item-link>
													<d2l-menu-item-link text="Customization Config" href="/d2l/custom/config/6606/" label="Customization Config"></d2l-menu-item-link>
													<d2l-menu-item-link text="Data Purge" href="/d2l/DataPurge/Manage" label="Data Purge"></d2l-menu-item-link>
													<d2l-menu-item-link text="External FAQs" href="/d2l/lms/faq/manage_external_faq.d2l?ext=1&amp;ou=6606" label="External FAQs"></d2l-menu-item-link>
													<d2l-menu-item-link text="External Learning Tools" href="/d2l/lms/lti/index" label="External Learning Tools"></d2l-menu-item-link>
													<d2l-menu-item-link text="External Links" href="/d2l/lms/links/manage_external_links.d2l?ext=1&amp;ou=6606" label="External Links"></d2l-menu-item-link>
													<d2l-menu-item-link text="Form Elements" href="/d2l/lp/legacy/dome.d2l?ou=6606" label="Form Elements"></d2l-menu-item-link>
													<d2l-menu-item-link text="Free-Range App Manager" href="/d2l/lp/apploader/manager/" label="Free-Range App Manager"></d2l-menu-item-link>
													<d2l-menu-item-link text="Global Announcements" href="/d2l/lms/news/main.d2l?global=1&amp;ou=6606" label="Global Announcements"></d2l-menu-item-link>
													<d2l-menu-item-link text="Google Workspace Administration" href="/d2l/im/gapps/ManageUserAccounts/View" label="Google Workspace Administration"></d2l-menu-item-link>
													<d2l-menu-item-link text="Homepage Management" href="/d2l/lp/homepages/6606/list" label="Homepage Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="Import/Export/Copy Components" href="/d2l/lms/importExport/import_export.d2l?ou=6606" label="Import/Export/Copy Components"></d2l-menu-item-link>
													<d2l-menu-item-link text="IMS Configuration" href="/d2l/lms/imsconfig/manage/roleMappings" label="IMS Configuration"></d2l-menu-item-link>
													<d2l-menu-item-link text="Language Management" href="/d2l/lp/Lang/admin/languages_manage.d2l?ou=6606" label="Language Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="Learning Group Management" href="/d2l/le/groupAdmin/view/" label="Learning Group Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="Learning Groups" href="/d2l/le/learningGroup/view/" label="Learning Groups"></d2l-menu-item-link>
													<d2l-menu-item-link text="Learning Outcomes" href="/d2l/le/6606/lo" label="Learning Outcomes"></d2l-menu-item-link>
													<d2l-menu-item-link text="Locale Management" href="/d2l/lp/managelocales/main.d2l?ou=6606" label="Locale Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="Locations" href="/d2l/le/locations/6606/Home" label="Locations"></d2l-menu-item-link>
													<d2l-menu-item-link text="Login Page Management" href="/d2l/lp/login/manage" label="Login Page Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="Mail Management" href="/d2l/lp/mailTemplates/mail_settings.d2l?ou=6606" label="Mail Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="Manage Extensibility" href="/d2l/lp/extensibility/home" label="Manage Extensibility"></d2l-menu-item-link>
													<d2l-menu-item-link text="Manage Workflow Sessions" href="/d2l/lms/accelerator/idw/sessions/manageSessions.d2l?ou=6606" label="Manage Workflow Sessions"></d2l-menu-item-link>
													<d2l-menu-item-link text="Media Library" href="/d2l/wcs/media-library/?ou=6606" label="Media Library"></d2l-menu-item-link>
													<d2l-menu-item-link text="Metadata Administration" href="/d2l/lp/metadata/admin/view/manage.d2l?ou=6606" label="Metadata Administration"></d2l-menu-item-link>
													<d2l-menu-item-link text="My CPD Records Administration" href="/d2l/cpd/admin" label="My CPD Records Administration"></d2l-menu-item-link>
													<d2l-menu-item-link text="Navigation &amp; Themes" href="/d2l/lp/navbars/6606/home" label="Navigation &amp; Themes"></d2l-menu-item-link>
													<d2l-menu-item-link text="Org Unit Editor" href="/d2l/lp/orgUnitEditor/6606" label="Org Unit Editor"></d2l-menu-item-link>
													<d2l-menu-item-link text="Organization Files" href="/d2l/lp/manageFiles/main.d2l?hideTree=1&amp;ou=6606" label="Organization Files"></d2l-menu-item-link>
													<d2l-menu-item-link text="Organization Tools" href="/d2l/lp/tools/org" label="Organization Tools"></d2l-menu-item-link>
													<d2l-menu-item-link text="Portfolio Category Management" href="/d2l/folio/main/tagging" label="Portfolio Category Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="Public Files" href="/d2l/lp/manageFiles/main.d2l?g=1&amp;ou=6606" label="Public Files"></d2l-menu-item-link>
													<d2l-menu-item-link text="Registration Forms" href="/d2l/lms/legacy/manageForms.d2l?ou=6606" label="Registration Forms"></d2l-menu-item-link>
													<d2l-menu-item-link text="Remote Plugins" href="/d2l/lms/remoteplugins/index.d2l?ou=6606" label="Remote Plugins"></d2l-menu-item-link>
													<d2l-menu-item-link text="Reporting" href="/d2l/lms/reporting/reports/report_list.d2l?ou=6606" label="Reporting"></d2l-menu-item-link>
													<d2l-menu-item-link text="Student Success System" href="/d2l/ap/s3/admin/Grid" label="Student Success System"></d2l-menu-item-link>
													<d2l-menu-item-link text="System Log" href="/d2l/logging" label="System Log" last="true"></d2l-menu-item-link>
												</d2l-menu>
											</d2l-menu-item>
											<d2l-menu-item text="Course Related"  label="Course Related">
												<d2l-menu class="d2l-menu-mvc" label="Course Related">
													<d2l-menu-item-link text="Attendance Schemes" href="/d2l/lms/attendance/schemes/scheme_list.d2l?orgSchemes=1&amp;ou=6606"  label="Attendance Schemes"></d2l-menu-item-link>
													<d2l-menu-item-link text="Bulk Course Import History" href="/d2l/le/conversion/bulkimport/history"  label="Bulk Course Import History"></d2l-menu-item-link>
													<d2l-menu-item-link text="Class Progress and User Progress" href="/d2l/le/progress/6606/defaults/Settings" label="Class Progress and User Progress"></d2l-menu-item-link>
													<d2l-menu-item-link text="Classlist Tab Management" href="/d2l/lms/classlist/admin/tabs/tabs_manage.d2l?ou=6606" label="Classlist Tab Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="Competencies" href="/d2l/lms/competencies/competency_list.d2l?ou=6606" label="Competencies"></d2l-menu-item-link>
													<d2l-menu-item-link text="Course Content Feedback" href="/d2l/lms/content/reports/course_content_feedback/courses_list.d2l?ou=6606" label="Course Content Feedback"></d2l-menu-item-link>
													<d2l-menu-item-link text="Courses" href="/d2l/platformTools/courses/6606?coursesTab=1" label="Courses"></d2l-menu-item-link>
													<d2l-menu-item-link text="Grade Schemes" href="/d2l/lms/grades/admin/schemes/schemes_list.d2l?ou=6606" label="Grade Schemes"></d2l-menu-item-link>
													<d2l-menu-item-link text="Learning Activity Library" href="/d2l/lms/accelerator/idw/admin/activities/list.d2l?fromCMC=0&amp;ou=6606" label="Learning Activity Library"></d2l-menu-item-link>
													<d2l-menu-item-link text="Rubrics" href="/d2l/lp/rubrics/list.d2l?ou=6606" label="Rubrics"></d2l-menu-item-link>
													<d2l-menu-item-link text="View Copy Course History" href="/d2l/le/conversion/copy/history/View?ou=6606" label="View Copy Course History" last="true"></d2l-menu-item-link>
												</d2l-menu>
											</d2l-menu-item>
											<d2l-menu-item text="ePortfolio" label="ePortfolio">
												<d2l-menu class="d2l-menu-mvc" label="ePortfolio">
													<d2l-menu-item-link text="Forms" href="/d2l/eP/forms/forms_list.d2l?ou=6606" label="Forms"></d2l-menu-item-link>
													<d2l-menu-item-link text="Sharing Groups" href="/d2l/eP/ePObjects/sharing/profiles_list.d2l?profileType=2&amp;ou=6606" label="Sharing Groups"></d2l-menu-item-link>
													<d2l-menu-item-link text="Tag Management" href="/d2l/lp/tagManagement/tags_list.d2l?ou=6606" label="Tag Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="Themes" href="/d2l/eP/themes/themes_list.d2l?ou=6606&amp;adm=1" label="Themes" last="true"></d2l-menu-item-link>
												</d2l-menu>
											</d2l-menu-item>
											<d2l-menu-item text="Learning Repository" label="Learning Repository">
												<d2l-menu class="d2l-menu-mvc" label="Learning Repository">
													<d2l-menu-item-link text="Manage Repositories" href="/d2l/lor/admin/lors_list.d2l?ou=6606" label="Manage Repositories"></d2l-menu-item-link>
													<d2l-menu-item-link text="Publish" href="/d2l/lor/publish/publish.d2l?ou=6606" label="Publish"></d2l-menu-item-link>
													<d2l-menu-item-link text="Search" href="/d2l/lor/search/search.d2l?ou=6606" label="Search" last="true"></d2l-menu-item-link>
												</d2l-menu>
											</d2l-menu-item>
											<d2l-menu-item text="SIS Integration" label="SIS Integration">
												<d2l-menu class="d2l-menu-mvc" label="SIS Integration">
													<d2l-menu-item-link text="Crosslistings Management" href="/d2l/lms/crosslistings/crosslisting_list.d2l?ou=6606" label="Crosslistings Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="IPSIS Administration" href="/d2l/im/ipsis/admin/console/landing" label="IPSIS Administration"></d2l-menu-item-link>
													<d2l-menu-item-link text="IPSIS Section Association" href="/d2l/im/ipsis/sa/6606/CourseSearch/Search/SISSection/List" label="IPSIS Section Association"></d2l-menu-item-link>
													<d2l-menu-item-link text="SIS Course Merge" href="/d2l/im/ipsis/SISCourseMerge/" label="SIS Course Merge" last="true"></d2l-menu-item-link>
												</d2l-menu>
											</d2l-menu-item>
											<d2l-menu-item text="Security" label="Security">
												<d2l-menu class="d2l-menu-mvc" label="Security">
													<d2l-menu-item-link text="D2L WAYF Page Administration" href="/d2l/im/ipas/admin/config/IdentityProviders" label="D2L WAYF Page Administration"></d2l-menu-item-link>
													<d2l-menu-item-link text="OpenID Connect" href="/d2l/lp/auth/oidc/health/healthpage" label="OpenID Connect"></d2l-menu-item-link>
													<d2l-menu-item-link text="Password Policy" href="/d2l/lp/auth/6606/pwdrestrictions/Edit" label="Password Policy"></d2l-menu-item-link>
													<d2l-menu-item-link text="Roles and Permissions" href="/d2l/lp/security/role_list.d2l?ou=6606" label="Roles and Permissions"></d2l-menu-item-link>
													<d2l-menu-item-link text="SAML Administration" href="/d2l/lp/auth/saml/manage" label="SAML Administration"></d2l-menu-item-link>
													<d2l-menu-item-link text="Trusted Sites" href="/d2l/lp/externalUrls/allowlist/6606" label="Trusted Sites" last="true"></d2l-menu-item-link>
												</d2l-menu>
											</d2l-menu-item>
											<d2l-menu-item text="Product/Tool Administration" label="Product/Tool Administration">
												<d2l-menu class="d2l-menu-mvc" label="Product/Tool Administration">
													<d2l-menu-item-link text="Bulk Tool Configuration" href="/d2l/tools/BulkCourseCreate/Configuration/View" label="Bulk Tool Configuration"></d2l-menu-item-link>
													<d2l-menu-item-link text="Consumption Dashboard" href="/d2l/le/consumption/dashboard" label="Consumption Dashboard"></d2l-menu-item-link>
													<d2l-menu-item-link text="Integrity Advocate Settings" href="/d2l/integrityadvocate/admin/home?returnUrl=" label="Integrity Advocate Settings"></d2l-menu-item-link>
													<d2l-menu-item-link text="JavaScript Management" href="/d2l/custom/JavaScriptManagement/home" label="JavaScript Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="View Product Versions" href="/d2l/lp/versions/main.d2l?ou=6606" label="View Product Versions" last="true"></d2l-menu-item-link>
												</d2l-menu>
											</d2l-menu-item>
											<d2l-menu-item text="D2L Administration" label="D2L Administration" last="true">
												<d2l-menu class="d2l-menu-mvc" label="D2L Administration">
													<d2l-menu-item-link text="Custom Login Logic Configuration" href="/d2l/lp/cll/RoleBased" label="Custom Login Logic Configuration"></d2l-menu-item-link>
													<d2l-menu-item-link text="File Utilities" href="/d2l/FileUtilities/MainPage" label="File Utilities"></d2l-menu-item-link>
													<d2l-menu-item-link text="Honeycomb" href="/d2l/opentelemetry/honeycomb" label="Honeycomb"></d2l-menu-item-link>
													<d2l-menu-item-link text="Logging Configuration" href="/d2l/lp/logging/configuration/assemblies_main.d2l?ou=6606" label="Logging Configuration"></d2l-menu-item-link>
													<d2l-menu-item-link text="Manager Dashboard Setup" href="/d2l/le/managerRole/configurationReport/view" label="Manager Dashboard Setup"></d2l-menu-item-link>
													<d2l-menu-item-link text="Plugin Management" href="/d2l/lp/plugins/extensionPointIndex.d2l?ou=6606" label="Plugin Management"></d2l-menu-item-link>
													<d2l-menu-item-link text="Queues" href="/d2l/common/admin/queues/" label="Queues"></d2l-menu-item-link>
													<d2l-menu-item-link text="Recurring Tasks" href="/d2l/tasks/recurring" label="Recurring Tasks"></d2l-menu-item-link>
													<d2l-menu-item-link text="Routing Information" href="/d2l/common/admin/routes/" label="Routing Information"></d2l-menu-item-link>
													<d2l-menu-item-link text="Scheduled Tasks" href="/d2l/tasks/scheduled/" label="Scheduled Tasks"></d2l-menu-item-link>
													<d2l-menu-item-link text="Search Diagnostics" href="/d2l/common/admin/search.d2l" label="Search Diagnostics"></d2l-menu-item-link>
													<d2l-menu-item-link text="Service Manager" href="/d2l/services" label="Service Manager"></d2l-menu-item-link>
													<d2l-menu-item-link text="SQS Queues" href="/d2l/common/admin/sqs/queues/" label="SQS Queues"></d2l-menu-item-link>
													<d2l-menu-item-link text="Time Zone Diagnostics" href="/d2l/common/admin/timezones.d2l" label="Time Zone Diagnostics"></d2l-menu-item-link>
													<d2l-menu-item-link text="Tools" href="/d2l/lp/tools/instance" label="Tools"></d2l-menu-item-link>
													<d2l-menu-item-link text="Turnitin Status" href="/d2l/le/dropbox/turnitin/status/home" label="Turnitin Status" last="true"></d2l-menu-item-link>
												</d2l-menu>
											</d2l-menu-item>
										</d2l-menu>
									</d2l-menu-item>
								</d2l-menu>
							</div>
						</div>
						<div class="d2l-navigation-s-mobile-menu-focus-trap-end d2l-offscreen">Menu End</div>
					</div>
				</d2l-labs-navigation>
			</nav>
			<slot></slot>
		</div>
		`;
	}

	_closeMobileCourseMenu() {
		const menu = this.renderRoot?.querySelector('.d2l-navigation-s-mobile-menu');
		if (!menu) return;

		menu.classList.remove('d2l-navigation-s-mobile-menu-show-course-menu');
	}

	_closeMobileMenu() {
		const menu = this.renderRoot?.querySelector('.d2l-navigation-s-mobile-menu');
		if (!menu) return;

		menu.setAttribute('data-state', 'transition');
		setTimeout(() => {
			this.dispatchEvent(new CustomEvent('d2l-mobile-menu-close', { bubbles: true, composed: true }));
			menu.setAttribute('data-state', 'closed');
		}, 350);
	}

	_openMobileCourseMenu() {
		const menu = this.renderRoot?.querySelector('.d2l-navigation-s-mobile-menu');
		if (!menu) return;

		menu.classList.add('d2l-navigation-s-mobile-menu-show-course-menu');
	}

	_openMobileMenu() {
		const menu = this.renderRoot?.querySelector('.d2l-navigation-s-mobile-menu');
		if (!menu) return;

		menu.setAttribute('data-state', 'transition');
		setTimeout(() => {
			this.dispatchEvent(new CustomEvent('d2l-mobile-menu-open', { bubbles: true, composed: true }));
			menu.setAttribute('data-state', 'opened');
		}, 50);
	}

}

customElements.define('d2l-full-nav', FullNav);
