import '../../button/button.js';
import '../../button/button-icon.js';
import '../../switch/switch-visibility.js';
import '../page-footer.js';
import { html, nothing } from 'lit';

const defaultContents = html`
	<d2l-button primary>Save and Close</d2l-button>
	<d2l-button>Save</d2l-button>
	<d2l-switch-visibility></d2l-switch-visibility>
`;
const endContents = html`
	<d2l-button slot="end">Clear</d2l-button>
	<d2l-button-icon slot="end" icon="d2l-tier1:chevron-right" text="Next"></d2l-button-icon>
`;

// d2l-page provides the top padding (built into floating-buttons)
const wrap = content => html`<div style="padding-top: 0.75rem;">${content}</div>`;

export function createFooter({
	emptyDefault = false,
	hasEnd = false,
} = {}) {
	return wrap(html`
		<div style="padding-top: 0.75rem;">
			<d2l-page-footer>
				${emptyDefault ? nothing : defaultContents}
				${hasEnd ? endContents : nothing}
			</d2l-page-footer>
		</div>
	`);
}

export const pageFooterFixtures = {
	default: createFooter(),
	withEnd: createFooter({ hasEnd: true }),
	onlyEnd: createFooter({ emptyDefault: true }),
};
