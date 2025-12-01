// Import all components used in the showcase
import '../../components/alert/alert.js';
import '../../components/breadcrumbs/breadcrumbs.js';
import '../../components/button/button.js';
import '../../components/button/button-icon.js';
import '../../components/button/button-subtle.js';
import '../../components/calendar/calendar.js';
import '../../components/card/card.js';
import '../../components/card/card-content-meta.js';
import '../../components/card/card-content-title.js';
import '../../components/card/card-footer-link.js';
import '../../components/collapsible-panel/collapsible-panel.js';
import '../../components/count-badge/count-badge.js';
import '../../components/dialog/dialog.js';
import '../../components/dropdown/dropdown.js';
import '../../components/dropdown/dropdown-content.js';
import '../../components/dropdown/dropdown-menu.js';
import '../../components/dropdown/dropdown-more.js';
import '../../components/expand-collapse/expand-collapse-content.js';
import '../../components/filter/filter.js';
import '../../components/filter/filter-dimension-set.js';
import '../../components/filter/filter-dimension-set-value.js';
import '../../components/form/form.js';
import '../../components/icons/icon.js';
import '../../components/inputs/input-checkbox.js';
import '../../components/inputs/input-date.js';
import '../../components/inputs/input-date-range.js';
import '../../components/inputs/input-fieldset.js';
import '../../components/inputs/input-radio.js';
import '../../components/inputs/input-search.js';
import '../../components/inputs/input-text.js';
import '../../components/inputs/input-textarea.js';
import '../../components/link/link.js';
import '../../components/list/list.js';
import '../../components/list/list-item.js';
import '../../components/menu/menu.js';
import '../../components/menu/menu-item.js';
import '../../components/meter/meter-linear.js';
import '../../components/more-less/more-less.js';
import '../../components/object-property-list/object-property-list.js';
import '../../components/object-property-list/object-property-list-item.js';
import '../../components/progress/progress.js';
import '../../components/status-indicator/status-indicator.js';
import '../../components/switch/switch.js';
import '../../components/tabs/tabs.js';
import '../../components/tabs/tab-panel.js';
import '../../components/tag-list/tag-list.js';
import '../../components/tag-list/tag-list-item.js';
import '../../components/typography/typography.js';

import { css, html, LitElement } from 'lit';
import { descriptionListStyles } from '../../components/description-list/description-list-wrapper.js';
import { inputLabelStyles } from '../../components/inputs/input-label-styles.js';
import { repeat } from 'lit/directives/repeat.js';
import { selectStyles } from '../../components/inputs/input-select-styles.js';
import { tableStyles } from '../../components/table/table-wrapper.js';

/**
 * Main component showcase application
 */
class ComponentShowcaseApp extends LitElement {

	static get properties() {
		return {
			_activePage: { type: String },
			_showCompletedTasks: { type: Boolean },
			_projectFilters: { type: Object },
			_projectView: { type: String },
			_showAlert: { type: Boolean },
			_showNewProjectDialog: { type: Boolean },
			_searchValue: { type: String },
			_notificationSettings: { type: Object },
			_darkMode: { type: Boolean },
			_compactView: { type: Boolean },
			_showTooltips: { type: Boolean }
		};
	}

	static get styles() {
		return [
			descriptionListStyles,
			inputLabelStyles,
			selectStyles,
			tableStyles,
			css`
			:host {
				display: block;
				height: 100vh;
			}

			.app-container {
				display: flex;
				width: 100%;
				height: 100%;
			}

			.side-nav {
				width: 250px;
				background-color: #f9fafb;
				border-right: 1px solid #e3e9f1;
				overflow-y: auto;
				flex-shrink: 0;
			}

			.main-content {
				flex: 1;
				overflow-y: auto;
				padding: 30px;
			}

			.page {
				display: none;
			}

			.page.active {
				display: block;
			}

			.header-section {
				margin-bottom: 30px;
			}

			.stats-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
				gap: 20px;
				margin-bottom: 30px;
			}

			.action-bar {
				display: flex;
				gap: 12px;
				align-items: center;
				margin-bottom: 20px;
				flex-wrap: wrap;
			}

			.content-section {
				margin-bottom: 40px;
			}

			.filter-bar {
				display: flex;
				gap: 12px;
				margin-bottom: 20px;
				align-items: flex-end;
				flex-wrap: wrap;
			}

			.cards-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
				gap: 20px;
				margin-bottom: 30px;
			}

			d2l-card {
				width: 100%;
			}

            d2l-calendar {
                background-color: #ffffff;
                max-width: 400px;
            }

			.form-section {
				max-width: 800px;
			}

			.card-header-flex {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.stat-display {
				display: flex;
				align-items: center;
				gap: 12px;
			}

			.team-avatar {
				width: 80px;
				height: 80px;
				border-radius: 50%;
				background-color: #d3d9e3;
				margin: 0 auto 12px;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.team-avatar d2l-icon {
				width: 40px;
				height: 40px;
			}

			.team-card-content {
				text-align: center;
			}

			.team-role {
				color: #6e7477;
				margin-bottom: 12px;
			}

			.task-row {
				display: flex;
				gap: 12px;
				align-items: center;
				width: 100%;
			}

			.task-content {
				flex: 1;
			}

			.task-meta {
				color: #6e7477;
			}

			.completed-task {
				opacity: 0.6;
			}

			.danger-zone {
				margin-top: 60px;
				padding-top: 30px;
				border-top: 1px solid #e3e9f1;
			}

			.danger-heading {
				color: #cd2026;
			}

			.action-buttons {
				margin-top: 30px;
				display: flex;
				gap: 12px;
			}
		`];
	}

	constructor() {
		super();
		this._activePage = 'dashboard';
		this._showCompletedTasks = false;
		this._projectFilters = { status: ['active'], category: ['design'] };
		this._projectView = 'grid';
		this._showAlert = true;
		this._showNewProjectDialog = false;
		this._searchValue = '';
		this._notificationSettings = {
			emailTasks: true,
			dailySummary: true,
			pushNotifications: false
		};
		this._darkMode = false;
		this._compactView = true;
		this._showTooltips = true;
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('hashchange', this._handleHashChange.bind(this));
		this._handleHashChange();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('hashchange', this._handleHashChange.bind(this));
	}

	render() {
		return html`
			<div class="app-container">
				<nav class="side-nav">
					<component-showcase-nav .activePage="${this._activePage}"></component-showcase-nav>
				</nav>
				<main class="main-content">
					${this._activePage === 'dashboard' ? this._renderDashboard() : ''}
					${this._activePage === 'projects' ? this._renderProjects() : ''}
					${this._activePage === 'tasks' ? this._renderTasks() : ''}
					${this._activePage === 'team' ? this._renderTeam() : ''}
					${this._activePage === 'settings' ? this._renderSettings() : ''}
				${this._activePage === 'reports' ? this._renderReports() : ''}
			</main>
		</div>

		<d2l-dialog
			id="new-project-dialog"
			title-text="Create New Project"
			?opened="${this._showNewProjectDialog}"
			@d2l-dialog-close="${this._handleDialogClose}">
			<div>
				<d2l-input-text label="Project Name" placeholder="Enter project name..." required></d2l-input-text>
				<d2l-input-textarea label="Description" placeholder="Describe your project..." rows="3"></d2l-input-textarea>
				<label>
					<span class="d2l-input-label">Category</span>
					<select class="d2l-input-select">
						<option value="">Select a category...</option>
						<option value="design">Design</option>
						<option value="development">Development</option>
						<option value="marketing">Marketing</option>
					</select>
				</label>
				<d2l-input-date label="Start Date" value="2025-11-25"></d2l-input-date>
			</div>
			<d2l-button slot="footer" primary data-dialog-action="create">Create Project</d2l-button>
			<d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
		</d2l-dialog>
	`;
	}
	_getFilterCount() {
		return this._projectFilters.status.length + this._projectFilters.category.length;
	}
	_getFilteredProjects() {
		const allProjects = [
			{ title: 'Website Redesign', statusState: 'success', statusText: 'Active', description: 'Complete overhaul of company website with modern design and improved UX.', tags: ['Design', 'Frontend', 'Q4 2025'] },
			{ title: 'Mobile App Development', statusState: 'default', statusText: 'In Progress', description: 'Native mobile application for iOS and Android platforms.', tags: ['Mobile', 'iOS', 'Android'] },
			{ title: 'API Integration', statusState: 'alert', statusText: 'Blocked', description: 'Integration with third-party APIs for data synchronization.', tags: ['Backend', 'API'] }
		];

		if (!this._searchValue) {
			return allProjects;
		}

		const searchLower = this._searchValue.toLowerCase();
		return allProjects.filter(project => {
			return project.title.toLowerCase().includes(searchLower) ||
				project.description.toLowerCase().includes(searchLower) ||
				project.tags.some(tag => tag.toLowerCase().includes(searchLower));
		});
	}
	_handleAlertClose() {
		this._showAlert = false;
	}
	_handleBulkAction(e) {
		const action = e.target.getAttribute('data-action');
		alert(`Bulk action: ${action}`);
	}
	_handleCancelSettings() {
		if (confirm('Discard unsaved changes?')) {
			// Reset to defaults
			this._darkMode = false;
			this._compactView = true;
			this._showTooltips = true;
			this._notificationSettings = {
				emailTasks: true,
				dailySummary: true,
				pushNotifications: false
			};
		}
	}
	_handleDeleteAccount() {
		if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
			alert('Account deletion initiated. You will receive a confirmation email.');
		}
	}
	_handleDialogClose() {
		this._showNewProjectDialog = false;
	}
	_handleDownloadReport() {
		alert('Downloading report... (In a real app, this would generate and download a PDF/CSV file)');
	}
	_handleEditTask(e) {
		const title = e.target.getAttribute('data-title');
		alert(`Editing task: ${title}`);
	}
	_handleEditTeam() {
		alert('Opening team editor...');
	}
	_handleFilterChange(e) {
		const { dimensionKey, valueKey, selected } = e.detail;

		if (dimensionKey === 'status') {
			if (selected) {
				if (!this._projectFilters.status.includes(valueKey)) {
					this._projectFilters.status = [...this._projectFilters.status, valueKey];
				}
			} else {
				this._projectFilters.status = this._projectFilters.status.filter(v => v !== valueKey);
			}
		} else if (dimensionKey === 'category') {
			if (selected) {
				if (!this._projectFilters.category.includes(valueKey)) {
					this._projectFilters.category = [...this._projectFilters.category, valueKey];
				}
			} else {
				this._projectFilters.category = this._projectFilters.category.filter(v => v !== valueKey);
			}
		}

		this.requestUpdate();
		console.log('Filters updated:', this._projectFilters); // eslint-disable-line no-console
	}
	_handleFilterProjects() {
		alert('Filter panel expanded - use the filter component above the projects list');
	}

	_handleHashChange() {
		const hash = window.location.hash.slice(1);
		if (hash) {
			this._activePage = hash;
		} else {
			this._activePage = 'dashboard';
		}
		this.requestUpdate();
	}

	_handleInviteMember() {
		alert('Opening member invitation dialog...');
	}
	// Event handlers for interactive elements
	_handleLearnMore(e) {
		e.preventDefault();
		alert('System maintenance details:\n\nScheduled: Tonight at 11 PM EST\nDuration: 2 hours\nAffected systems: All project management features\n\nPlease save your work before this time.');
	}

	_handleNewProject() {
		this._showNewProjectDialog = true;
	}
	_handleNewTask() {
		alert('Opening new task dialog...');
	}
	_handleNotificationChange(e) {
		const key = e.target.getAttribute('data-type');
		this._notificationSettings = {
			...this._notificationSettings,
			[key]: e.target.checked
		};
		console.log('Notification settings updated:', this._notificationSettings); // eslint-disable-line no-console
	}
	_handleSaveSettings() {
		alert('Settings saved successfully!\\n\\n' +
			`Dark Mode: ${this._darkMode}\\n` +
			`Compact View: ${this._compactView}\\n` +
			`Show Tooltips: ${this._showTooltips}\\n` +
			`Notifications: ${JSON.stringify(this._notificationSettings, null, 2)}`
		);
	}
	_handleSearchProjects(e) {
		this._searchValue = e.detail.value;
	}

	_handleSwitchChange(e) {
		const type = e.target.getAttribute('data-type');
		if (type === 'darkMode') {
			this._darkMode = e.target.on;
		} else if (type === 'compactView') {
			this._compactView = e.target.on;
		} else if (type === 'showTooltips') {
			this._showTooltips = e.target.on;
		}
	}
	_handleViewProfile(e) {
		const name = e.target.getAttribute('data-name');
		alert(`Viewing profile for: ${name}`);
	}

	_renderDashboard() {
		return html`
			<div class="page active">
				<div class="header-section">
					<d2l-breadcrumbs>
						<d2l-breadcrumb text="Home" href="#"></d2l-breadcrumb>
						<d2l-breadcrumb text="Dashboard"></d2l-breadcrumb>
					</d2l-breadcrumbs>
					<h1 class="d2l-heading-1">Project Dashboard</h1>
					<p class="d2l-body-standard">Welcome back! Here's an overview of your projects and tasks.</p>
				</div>

			${this._showAlert ? html`
				<d2l-alert type="warning" has-close-button @d2l-alert-close="${this._handleAlertClose}">
					<span>System maintenance scheduled for tonight at 11 PM EST. <d2l-link @click="${this._handleLearnMore}">Learn more</d2l-link></span>
				</d2l-alert>
			` : ''}				<div class="stats-grid">
					<d2l-card>
						<div slot="content">
							<h3 class="d2l-heading-3">Active Projects</h3>
							<div class="stat-display">
								<div class="d2l-heading-1">12</div>
								<d2l-status-indicator state="default" text="In Progress"></d2l-status-indicator>
							</div>
							<d2l-meter-linear value="75" max="100" text="75% Complete" text-inline></d2l-meter-linear>
						</div>
					</d2l-card>
					<d2l-card>
						<div slot="content">
							<h3 class="d2l-heading-3">Pending Tasks</h3>
							<div class="stat-display">
								<div class="d2l-heading-1">24</div>
								<d2l-count-badge number="8" text="New"></d2l-count-badge>
							</div>
							<d2l-progress value="60" max="100"></d2l-progress>
						</div>
					</d2l-card>

					<d2l-card>
						<div slot="content">
							<h3 class="d2l-heading-3">Team Members</h3>
							<div class="d2l-heading-1">42</div>
							<d2l-status-indicator state="success" text="All Active"></d2l-status-indicator>
						</div>
					</d2l-card>
				</div>

				<div class="content-section">
					<h2 class="d2l-heading-2">Recent Projects</h2>
					<div class="action-bar">
						<d2l-button primary @click="${this._handleNewProject}">New Project</d2l-button>
						<d2l-input-search 
						label="Search Projects" 
						placeholder="Search projects..."
						.value="${this._searchValue}"
						@d2l-input-search-searched="${this._handleSearchProjects}"></d2l-input-search>
						<d2l-button-icon icon="tier1:filter" text="Filter" @click="${this._handleFilterProjects}"></d2l-button-icon>
						<d2l-dropdown>
							<d2l-button-subtle text="Sort By" slot="opener"></d2l-button-subtle>
							<d2l-dropdown-menu>
								<d2l-menu label="Sort Options">
									<d2l-menu-item text="Date Created"></d2l-menu-item>
									<d2l-menu-item text="Last Modified"></d2l-menu-item>
									<d2l-menu-item text="Name"></d2l-menu-item>
									<d2l-menu-item text="Status"></d2l-menu-item>
								</d2l-menu>
							</d2l-dropdown-menu>
						</d2l-dropdown>
				</div>

				<div class="cards-grid">
					${this._getFilteredProjects().map(project =>
						this._renderProjectCard(project.title, project.statusState, project.statusText, project.description, project.tags)
					)}
				</div>
				${this._getFilteredProjects().length === 0 ? html`
					<p class="d2l-body-standard" style="text-align: center; color: #6e7477; margin-top: 40px;">
						No projects found matching "${this._searchValue}"
					</p>
				` : ''}
			</div>				<d2l-collapsible-panel panel-title="Recent Activity">
					<d2l-list>
						<d2l-list-item>
							<div class="d2l-body-compact">
								<strong>Sarah Johnson</strong> completed task "Design mockups" in Website Redesign
								<div class="d2l-body-small task-meta">2 hours ago</div>
							</div>
						</d2l-list-item>
						<d2l-list-item>
							<div class="d2l-body-compact">
								<strong>Mike Chen</strong> added 3 new tasks to Mobile App Development
								<div class="d2l-body-small task-meta">5 hours ago</div>
							</div>
						</d2l-list-item>
						<d2l-list-item>
							<div class="d2l-body-compact">
								<strong>Emily Rodriguez</strong> commented on API Integration
								<div class="d2l-body-small task-meta">1 day ago</div>
							</div>
						</d2l-list-item>
					</d2l-list>
				</d2l-collapsible-panel>
			</div>
		`;
	}

	_renderProjectCard(title, statusState, statusText, description, tags) {
		return html`
			<d2l-card>
				<div slot="header">
					<d2l-card-content-meta>
						<div class="card-header-flex">
							<d2l-status-indicator state="${statusState}" text="${statusText}"></d2l-status-indicator>
							<d2l-dropdown-more text="More actions">
								<d2l-dropdown-menu>
									<d2l-menu label="Actions">
										<d2l-menu-item text="Edit"></d2l-menu-item>
										<d2l-menu-item text="Share"></d2l-menu-item>
										<d2l-menu-item text="Archive"></d2l-menu-item>
									</d2l-menu>
								</d2l-dropdown-menu>
							</d2l-dropdown-more>
						</div>
					</d2l-card-content-meta>
				</div>
				<div slot="content">
					<d2l-card-content-title>${title}</d2l-card-content-title>
					<p class="d2l-body-compact">${description}</p>
				</div>
				<div slot="footer">
					<d2l-tag-list>
						${tags.map(tag => html`<d2l-tag-list-item text="${tag}"></d2l-tag-list-item>`)}
					</d2l-tag-list>
					<d2l-card-footer-link href="#" icon="tier1:awards" text="View Details" secondary></d2l-card-footer-link>
				</div>
			</d2l-card>
		`;
	}

	_renderProjects() {
		return html`
			<div class="page ${this._activePage === 'projects' ? 'active' : ''}">
				<div class="header-section">
					<d2l-breadcrumbs>
						<d2l-breadcrumb text="Home" href="#"></d2l-breadcrumb>
						<d2l-breadcrumb text="Projects"></d2l-breadcrumb>
					</d2l-breadcrumbs>
					<h1 class="d2l-heading-1">All Projects</h1>
				</div>

				<div class="filter-bar">
					<d2l-filter label="Filters" total-selected-option-count="${this._getFilterCount()}" @d2l-filter-change="${this._handleFilterChange}">
						<d2l-filter-dimension-set key="status" text="Status">
							<d2l-filter-dimension-set-value key="active" text="Active" ?selected="${this._projectFilters.status.includes('active')}"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="completed" text="Completed" ?selected="${this._projectFilters.status.includes('completed')}"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="archived" text="Archived" ?selected="${this._projectFilters.status.includes('archived')}"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
						<d2l-filter-dimension-set key="category" text="Category">
							<d2l-filter-dimension-set-value key="design" text="Design" ?selected="${this._projectFilters.category.includes('design')}"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="development" text="Development" ?selected="${this._projectFilters.category.includes('development')}"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="marketing" text="Marketing" ?selected="${this._projectFilters.category.includes('marketing')}"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
				</div>

				<d2l-tabs>
					<d2l-tab-panel text="Grid View" selected>
					<div class="cards-grid">
					<d2l-card>
						<div slot="content">
							<d2l-card-content-title>E-commerce Platform</d2l-card-content-title>
							<p class="d2l-body-compact">Building a scalable e-commerce solution.</p>
						</div>
						<div slot="footer">
							<d2l-meter-linear value="45" max="100" text="45% Complete"></d2l-meter-linear>
						</div>
					</d2l-card>
					<d2l-card>
						<div slot="content">
							<d2l-card-content-title>Marketing Campaign</d2l-card-content-title>
							<p class="d2l-body-compact">Q4 2025 digital marketing initiative.</p>
						</div>
						<div slot="footer">
							<d2l-meter-linear value="80" max="100" text="80% Complete"></d2l-meter-linear>
						</div>
					</d2l-card>
					<d2l-card>
						<div slot="content">
							<d2l-card-content-title>Data Migration</d2l-card-content-title>
							<p class="d2l-body-compact">Migrating legacy systems to cloud infrastructure.</p>
						</div>
						<div slot="footer">
							<d2l-meter-linear value="30" max="100" text="30% Complete"></d2l-meter-linear>
						</div>
					</d2l-card>
					</div>
					</d2l-tab-panel>
					<d2l-tab-panel text="List View">
						<d2l-table-wrapper>
							<table class="d2l-table">
								<thead>
									<tr>
										<th>Project Name</th>
										<th>Status</th>
										<th>Progress</th>
										<th>Team Size</th>
										<th>Due Date</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>E-commerce Platform</td>
										<td><d2l-status-indicator state="default" text="In Progress"></d2l-status-indicator></td>
										<td>45%</td>
										<td>8</td>
										<td>Dec 15, 2025</td>
									</tr>
									<tr>
										<td>Marketing Campaign</td>
										<td><d2l-status-indicator state="success" text="On Track"></d2l-status-indicator></td>
										<td>80%</td>
										<td>5</td>
										<td>Nov 30, 2025</td>
									</tr>
									<tr>
										<td>Data Migration</td>
										<td><d2l-status-indicator state="alert" text="At Risk"></d2l-status-indicator></td>
										<td>30%</td>
										<td>6</td>
										<td>Jan 10, 2026</td>
									</tr>
								</tbody>
							</table>
						</d2l-table-wrapper>
					</d2l-tab-panel>
				</d2l-tabs>
			</div>
		`;
	}

	_renderReports() {
		return html`
			<div class="page ${this._activePage === 'reports' ? 'active' : ''}">
				<div class="header-section">
					<d2l-breadcrumbs>
						<d2l-breadcrumb text="Home" href="#"></d2l-breadcrumb>
						<d2l-breadcrumb text="Reports"></d2l-breadcrumb>
					</d2l-breadcrumbs>
					<h1 class="d2l-heading-1">Analytics & Reports</h1>
				</div>

				<d2l-tabs>
					<d2l-tab-panel text="Overview" selected>
						<h2 class="d2l-heading-2">Project Performance</h2>
						
						<d2l-dl-wrapper>
							<dl>
								<dt>Total Projects</dt>
								<dd>42</dd>
								<dt>Active Projects</dt>
								<dd>12</dd>
								<dt>Completed This Month</dt>
								<dd>8</dd>
								<dt>Average Completion Time</dt>
								<dd>45 days</dd>
								<dt>Success Rate</dt>
								<dd>94%</dd>
							</dl>
						</d2l-dl-wrapper>

						<h2 class="d2l-heading-2" style="margin-top: 30px;">Team Productivity</h2>
						
						<d2l-object-property-list>
							<d2l-object-property-list-item text="Tasks Completed Today" value="18"></d2l-object-property-list-item>
							<d2l-object-property-list-item text="Average Tasks per Member" value="3.2"></d2l-object-property-list-item>
							<d2l-object-property-list-item text="On-Time Completion Rate" value="87%"></d2l-object-property-list-item>
						</d2l-object-property-list>
					</d2l-tab-panel>

					<d2l-tab-panel text="Timeline">
						<h2 class="d2l-heading-2">Project Timeline</h2>
						<p class="d2l-body-standard">View project milestones and deadlines.</p>
						
						<d2l-calendar selected-value="2025-11-25"></d2l-calendar>
					</d2l-tab-panel>

					<d2l-tab-panel text="Export">
						<h2 class="d2l-heading-2">Export Data</h2>
						
						<d2l-input-fieldset label="Select Report Type">
							<d2l-input-checkbox checked>Project Summary</d2l-input-checkbox>
							<d2l-input-checkbox checked>Task Details</d2l-input-checkbox>
							<d2l-input-checkbox>Team Activity</d2l-input-checkbox>
							<d2l-input-checkbox>Time Tracking</d2l-input-checkbox>
						</d2l-input-fieldset>

						<d2l-input-date-range label="Date Range" start-value="2025-11-01" end-value="2025-11-30"></d2l-input-date-range>

						<d2l-button-icon icon="tier1:download" text="Download Report" primary style="margin-top: 20px;" @click="${this._handleDownloadReport}"></d2l-button-icon>
				</d2l-tab-panel>
			</d2l-tabs>

			<d2l-more-less height="100px" style="margin-top: 30px;">
				<h3 class="d2l-heading-3">Detailed Metrics</h3>
				<p class="d2l-body-standard">
					This section contains additional detailed metrics and analysis about project performance,
					team productivity, and resource allocation. The data shows comprehensive trends over the
					past quarter and includes predictive analytics for upcoming months.
				</p>
					<p class="d2l-body-standard">
						Key insights include improved task completion rates, better resource utilization,
						and enhanced team collaboration. Areas for improvement have been identified in
						project estimation accuracy and communication efficiency.
					</p>
					<p class="d2l-body-standard">
						Recommendations include investing in better project management tools, conducting
						regular team training sessions, and implementing more frequent check-ins for
						long-running projects.
					</p>
				</d2l-more-less>
			</div>
		`;
	}
	_renderSettings() {
		return html`
			<div class="page ${this._activePage === 'settings' ? 'active' : ''}">
				<div class="header-section">
					<d2l-breadcrumbs>
						<d2l-breadcrumb text="Home" href="#"></d2l-breadcrumb>
						<d2l-breadcrumb text="Settings"></d2l-breadcrumb>
					</d2l-breadcrumbs>
					<h1 class="d2l-heading-1">Settings</h1>
				</div>

				<div class="form-section">
					<h2 class="d2l-heading-2">Profile Settings</h2>
					
					<d2l-input-text label="Full Name" value="John Doe" required></d2l-input-text>
					<d2l-input-text label="Email Address" type="email" value="john.doe@example.com" required></d2l-input-text>
					<d2l-input-textarea label="Bio" placeholder="Tell us about yourself..." rows="4"></d2l-input-textarea>

					<h2 class="d2l-heading-2" style="margin-top: 30px;">Notification Preferences</h2>
					
					<d2l-input-checkbox ?checked="${this._notificationSettings.emailTasks}" @change="${this._handleNotificationChange}" data-type="emailTasks">Email notifications for new tasks</d2l-input-checkbox>
					<d2l-input-checkbox ?checked="${this._notificationSettings.dailySummary}" @change="${this._handleNotificationChange}" data-type="dailySummary">Daily summary emails</d2l-input-checkbox>
					<d2l-input-checkbox ?checked="${this._notificationSettings.pushNotifications}" @change="${this._handleNotificationChange}" data-type="pushNotifications">Browser push notifications</d2l-input-checkbox>

					<h2 class="d2l-heading-2" style="margin-top: 30px;">Display Settings</h2>
					
					<d2l-switch text="Dark Mode" text-position="start" ?on="${this._darkMode}" @change="${this._handleSwitchChange}" data-type="darkMode"></d2l-switch>
					<d2l-switch text="Compact View" text-position="start" ?on="${this._compactView}" @change="${this._handleSwitchChange}" data-type="compactView"></d2l-switch>
					<d2l-switch text="Show Tooltips" text-position="start" ?on="${this._showTooltips}" @change="${this._handleSwitchChange}" data-type="showTooltips"></d2l-switch>					<h2 class="d2l-heading-2" style="margin-top: 30px;">Advanced Settings</h2>
					
					<d2l-input-fieldset label="Default Project View">
						<d2l-input-radio name="view" value="grid" checked label="Grid View"></d2l-input-radio>
						<d2l-input-radio name="view" value="list" label="List View"></d2l-input-radio>
						<d2l-input-radio name="view" value="kanban" label="Kanban Board"></d2l-input-radio>
					</d2l-input-fieldset>

					<label style="display: block; margin-top: 12px;">
						<span class="d2l-input-label">Date Format</span>
						<select class="d2l-input-select">
							<option value="mdy" selected>MM/DD/YYYY</option>
							<option value="dmy">DD/MM/YYYY</option>
							<option value="ymd">YYYY-MM-DD</option>
						</select>
					</label>

					<d2l-input-date label="Account Created" value="2024-01-15" disabled></d2l-input-date>

					<div class="action-buttons">
						<d2l-button primary @click="${this._handleSaveSettings}">Save Changes</d2l-button>
						<d2l-button @click="${this._handleCancelSettings}">Cancel</d2l-button>
					</div>
				</div>

				<div class="danger-zone">
					<h2 class="d2l-heading-2 danger-heading">Danger Zone</h2>
					<d2l-alert type="critical">
						<strong>Warning:</strong> These actions are irreversible. Please proceed with caution.
					</d2l-alert>
					<d2l-button style="margin-top: 12px;" @click="${this._handleDeleteAccount}">Delete Account</d2l-button>
				</div>
			</div>
		`;
	}
	_renderTaskItem(title, meta, statusState, statusText, checked) {
		return html`
			<d2l-list-item>
				<div class="task-row">
					<d2l-input-checkbox ?checked="${checked}"></d2l-input-checkbox>
					<div class="task-content">
						<div class="d2l-body-standard"><strong>${title}</strong></div>
						<div class="d2l-body-small task-meta">${meta}</div>
					</div>
					<d2l-status-indicator state="${statusState}" text="${statusText}"></d2l-status-indicator>
					<d2l-button-icon icon="tier1:edit" text="Edit" @click="${this._handleEditTask}" data-title="${title}"></d2l-button-icon>
				</div>
			</d2l-list-item>
		`;
	}
	_renderTasks() {
		return html`
			<div class="page ${this._activePage === 'tasks' ? 'active' : ''}">
				<div class="header-section">
					<d2l-breadcrumbs>
						<d2l-breadcrumb text="Home" href="#"></d2l-breadcrumb>
						<d2l-breadcrumb text="Tasks"></d2l-breadcrumb>
					</d2l-breadcrumbs>
					<h1 class="d2l-heading-1">Task Management</h1>
				</div>

				<div class="action-bar">
					<d2l-dropdown>
						<d2l-button text="Bulk Actions" slot="opener"></d2l-button>
						<d2l-dropdown-menu>
							<d2l-menu label="Bulk Actions">
								<d2l-menu-item text="Mark Complete" @d2l-menu-item-select="${this._handleBulkAction}" data-action="complete"></d2l-menu-item>
								<d2l-menu-item text="Assign" @d2l-menu-item-select="${this._handleBulkAction}" data-action="assign"></d2l-menu-item>
								<d2l-menu-item text="Delete" @d2l-menu-item-select="${this._handleBulkAction}" data-action="delete"></d2l-menu-item>
							</d2l-menu>
						</d2l-dropdown-menu>
					</d2l-dropdown>
				</div>
				<d2l-list separators="between">
					${this._renderTaskItem('Update user documentation', 'Website Redesign • Due: Nov 28, 2025', 'default', 'To Do', false)}
					${this._renderTaskItem('Review API endpoints', 'API Integration • Due: Nov 26, 2025', 'success', 'Complete', true)}
					${this._renderTaskItem('Design mobile wireframes', 'Mobile App Development • Due: Dec 1, 2025', 'default', 'In Progress', false)}
					${this._renderTaskItem('Performance testing', 'E-commerce Platform • Due: Nov 25, 2025', 'alert', 'Overdue', false)}
				</d2l-list>

				<h3 class="d2l-heading-3" style="margin-top: 20px;">Completed Tasks (15)</h3>
				<d2l-button-subtle text="${this._showCompletedTasks ? 'Hide' : 'Show'} Completed Tasks" @click="${this._toggleCompletedTasks}"></d2l-button-subtle>
				<d2l-expand-collapse-content id="completed-tasks" ?expanded="${this._showCompletedTasks}">
					<d2l-list separators="between">
						<d2l-list-item>
							<div class="task-row">
								<d2l-input-checkbox checked></d2l-input-checkbox>
								<div class="task-content completed-task">
									<div class="d2l-body-standard">Setup project repository</div>
									<div class="d2l-body-small task-meta">Completed on Nov 20, 2025</div>
								</div>
							</div>
						</d2l-list-item>
						<d2l-list-item>
							<div class="task-row">
								<d2l-input-checkbox checked></d2l-input-checkbox>
								<div class="task-content completed-task">
									<div class="d2l-body-standard">Create initial mockups</div>
									<div class="d2l-body-small task-meta">Completed on Nov 18, 2025</div>
								</div>
							</div>
						</d2l-list-item>
					</d2l-list>
				</d2l-expand-collapse-content>
			</div>
		`;
	}

	_renderTeam() {
		return html`
			<div class="page ${this._activePage === 'team' ? 'active' : ''}">
				<div class="header-section">
					<d2l-breadcrumbs>
						<d2l-breadcrumb text="Home" href="#"></d2l-breadcrumb>
						<d2l-breadcrumb text="Team"></d2l-breadcrumb>
					</d2l-breadcrumbs>
					<h1 class="d2l-heading-1">Team Members</h1>
				</div>

				<div class="action-bar">
					<d2l-button primary>Invite Member</d2l-button>
					<d2l-input-search label="Search team members" placeholder="Search by name or role..."></d2l-input-search>
				</div>

				<div class="cards-grid">
					${this._renderTeamCard('Sarah Johnson', 'Product Manager', ['Design', 'UX'])}
					${this._renderTeamCard('Mike Chen', 'Senior Developer', ['Frontend', 'React'])}
					${this._renderTeamCard('Emily Rodriguez', 'Backend Engineer', ['Backend', 'Node.js'])}
				</div>

				<h2 class="d2l-heading-2" style="margin-top: 40px;">Team Structure</h2>
				<d2l-menu label="Team Structure">
					<d2l-menu-item text="Engineering Team">
						<d2l-menu>
							<d2l-menu-item text="Frontend Team (5 members)"></d2l-menu-item>
							<d2l-menu-item text="Backend Team (6 members)"></d2l-menu-item>
							<d2l-menu-item text="QA Team (3 members)"></d2l-menu-item>
						</d2l-menu>
					</d2l-menu-item>
					<d2l-menu-item text="Design Team">
						<d2l-menu>
							<d2l-menu-item text="UX Designers (4 members)"></d2l-menu-item>
							<d2l-menu-item text="Visual Designers (3 members)"></d2l-menu-item>
						</d2l-menu>
					</d2l-menu-item>
				</d2l-menu>
			</div>
		`;
	}
	_renderTeamCard(name, role, skills) {
		return html`
			<d2l-card>
				<div slot="content" class="team-card-content">
					<div class="team-avatar">
						<d2l-icon icon="tier1:profile"></d2l-icon>
					</div>
					<h3 class="d2l-heading-3">${name}</h3>
					<div class="d2l-body-compact team-role">${role}</div>
					<d2l-tag-list>
						${skills.map(skill => html`<d2l-tag-list-item text="${skill}"></d2l-tag-list-item>`)}
					</d2l-tag-list>
				</div>
				<div slot="footer">
					<d2l-button-subtle text="View Profile" @click="${this._handleViewProfile}" data-name="${name}"></d2l-button-subtle>
				</div>
			</d2l-card>
		`;
	}
	_toggleCompletedTasks() {
		this._showCompletedTasks = !this._showCompletedTasks;
	}

}customElements.define('component-showcase-app', ComponentShowcaseApp);

/**
 * Navigation component for the component showcase
 */
class ComponentShowcaseNav extends LitElement {

	static get properties() {
		return {
			activePage: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
				padding: 20px;
			}

			.nav-header {
				margin-bottom: 24px;
				padding-bottom: 16px;
				border-bottom: 1px solid #e3e9f1;
			}

			.nav-title {
				margin: 0 0 4px 0;
				font-size: 1.2rem;
				font-weight: 600;
				color: #202122;
			}

			.nav-subtitle {
				margin: 0;
				font-size: 0.8rem;
				color: #6e7477;
			}

			.nav-list {
				list-style: none;
				margin: 0;
				padding: 0;
			}

			.nav-item {
				margin-bottom: 4px;
			}

			.nav-link {
				display: flex;
				align-items: center;
				padding: 10px 12px;
				color: #202122;
				text-decoration: none;
				border-radius: 6px;
				font-size: 0.95rem;
				transition: background-color 0.2s;
				cursor: pointer;
			}

			.nav-link:hover {
				background-color: #f1f5fb;
			}

			.nav-link.active {
				background-color: #e3f0ff;
				color: #006fbf;
				font-weight: 600;
			}

			.nav-icon {
				margin-right: 12px;
				opacity: 0.7;
			}

			.nav-link.active .nav-icon {
				opacity: 1;
			}
		`;
	}

	constructor() {
		super();
		this.activePage = 'dashboard';
		this._navItems = [
			{ id: 'dashboard', label: 'Dashboard', icon: 'tier1:home' },
			{ id: 'projects', label: 'Projects', icon: 'tier1:folder' },
			{ id: 'tasks', label: 'Tasks', icon: 'tier1:assignments' },
			{ id: 'team', label: 'Team', icon: 'tier1:group' },
			{ id: 'reports', label: 'Reports', icon: 'tier1:reports' },
			{ id: 'settings', label: 'Settings', icon: 'tier1:gear' }
		];
	}

	render() {
		return html`
			<div class="nav-header">
				<div class="nav-title">Project Manager</div>
				<div class="nav-subtitle">Component Showcase</div>
			</div>
			<ul class="nav-list">
				${repeat(this._navItems, (item) => item.id, (item) => html`
					<li class="nav-item">
						<a
							href="#${item.id}"
							class="nav-link ${this.activePage === item.id ? 'active' : ''}"
							@click="${this._handleNavClick}" data-page="${item.id}">
							<d2l-icon class="nav-icon" icon="${item.icon}"></d2l-icon>
							${item.label}
						</a>
					</li>
				`)}
			</ul>
		`;
	}
	_handleNavClick(e) {
		e.preventDefault();
		const pageId = e.target.closest('a').getAttribute('data-page');
		window.location.hash = pageId;
	}

}

customElements.define('component-showcase-nav', ComponentShowcaseNav);
