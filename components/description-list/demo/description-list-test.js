import '../../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { descriptionListStyles } from '../description-list-wrapper.js';

class TestDescriptionList extends LitElement {
	static get properties() {
		return {
			/**
			 * Type of test
			 * @type {'default'|'long'|'activity-display'|'slotted'}
			 */
			type: { type: String, reflect: true },
		};
	}

	static get styles() {
		return [descriptionListStyles, css`
			:host {
				display: block;
			}
		`];
	}

	constructor() {
		super();
		this.type = 'default';
	}

	render() {
		if (this.type === 'default') {
			return html`
				<d2l-dl-wrapper breakpoint="200">
					<dl>
						<dt>Course Name</dt>
						<dd>Brightspace 101B</dd>

						<dt>Course Code</dt>
						<dd>BSPC 101B</dd>

						<dt>Start Date</dt>
						<dd>June 14 2022</dd>

						<dt>Semester</dt>
						<dd>2022 Summer</dd>
					</dl>
				</d2l-dl-wrapper>
			`;
		}

		if (this.type === 'long') {
			return html`
				<d2l-dl-wrapper>
					<dl>
						<dt>Course Code That Represents The Course as a Short String</dt>
						<dd>A short string that represents the course, often with important information such as section or room number.</dd>

						<dt>Availability Dates</dt>
						<dd>The start and end date for the course. Learners can't access courses outside these dates.</dd>
					</dl>
				</d2l-dl-wrapper>
			`;
		}

		if (this.type === 'activity-display') {
			return html`
				<d2l-dl-wrapper>
					<dl>
						<dt>Submission type</dt>
						<dd>File submission</dd>

						<dt>Files allowed per submission</dt>
						<dd>Unlimited</dd>

						<dt>File extension</dt>
						<dd>PDF</dd>

						<dt>Allowed Submissions</dt>
						<dd>Only one submission allowed</dd>
					</dl>
				</d2l-dl-wrapper>
			`;
		}

		if (this.type === 'slotted') {
			return html`
				<d2l-dl-wrapper>
					<dl>
						<dt><d2l-icon icon="tier1:time"></d2l-icon>Slotted Term</dt>
						<dd>Slotted details <d2l-button-icon icon="tier1:edit" text="edit"></d2l-button-icon></dd>

						<dt><d2l-icon icon="tier1:user-progress"></d2l-icon>Slotted term</dt>
						<dd>Text-only details</dd>
					</dl>
				</d2l-dl-wrapper>
			`;
		}
	}
}

customElements.define('d2l-test-dl', TestDescriptionList);
