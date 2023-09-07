import '../../button/button-icon.js';
import '../../link/link.js';
import '../../status-indicator/status-indicator.js';
import '../../typography/typography.js';
import '../collapsible-panel.js';
import '../collapsible-panel-summary-item.js';
import { expect, fixture, focusElem, html, nextFrame, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const longTitle = 'Availability Dates and Conditions for the specific course and so on and so on';
const unbreakableTitle = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const longContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas odio ligula, aliquam efficitur sollicitudin non, dignissim quis nisl. Nullam rutrum, lectus sed finibus consectetur, dolor leo blandit lorem, vitae consectetur arcu enim ornare tortor.';

function createCollapsiblePanel(opts) {
	const defaults = {
		content: nothing,
		expanded: false,
		noSticky: true,
		paddingType: undefined,
		panelTitle: 'Availability Dates and Conditions',
		skeleton: false,
		type: undefined
	};
	const { content, expanded, noSticky, paddingType, panelTitle, skeleton, type } = { ...defaults, ...opts };
	const wrapperStyles = {
		margin: noSticky ? undefined : '800px 0',
		overflow: (type === 'inline' && noSticky) ? 'hidden' : undefined,
		padding: type !== 'inline' ? '1rem' : undefined,
		width: '600px'
	};
	return html`
		<div class="d2l-typography" style=${styleMap(wrapperStyles)}>
			<d2l-collapsible-panel ?expanded="${expanded}" ?no-sticky="${noSticky}" panel-title="${panelTitle}" padding-type="${ifDefined(paddingType)}" ?skeleton="${skeleton}" type="${ifDefined(type)}">
				${content}
				${longContent}
			</d2l-collapsible-panel>
		</div>
	`;
}

function createButton(opts) {
	const { icon } = { icon: 'tier1:fullscreen', ...opts };
	return html`<d2l-button-icon slot="actions" icon="${icon}"></d2l-button-icon>`;
}

function createSummary(opts) {
	const { skeleton } = { skeleton: false, ...opts };
	return html`<d2l-collapsible-panel-summary-item ?skeleton="${skeleton}" slot="summary" text="Availability starts 8/16/2022 and ends 8/12/2022"></d2l-collapsible-panel-summary-item>`;
}
function createLongSummary(opts) {
	const { lines } = { ...opts };
	return html`<d2l-collapsible-panel-summary-item slot="summary" lines="${ifDefined(lines)}" text="A really really really really really really really really really really really really really really really really long summary that will wrap but will be truncated with an ellipsis so that it only shows 2 lines."></d2l-collapsible-panel-summary-item>`;
}
function createUnbreakableSummary(opts) {
	const { lines } = { ...opts };
	return html`<d2l-collapsible-panel-summary-item slot="summary" lines="${ifDefined(lines)}" text="Areallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallylongunbreakablesummaryitemtext."></d2l-collapsible-panel-summary-item>`;
}

function createCustom(opts) {
	const { beforeIcon } = { beforeIcon: false, ...opts };
	return html`
		${ beforeIcon ? html`<d2l-icon icon="tier3:assignments" slot="before"></d2l-icon>` : nothing}
		${createButton()}
		${createButton({ icon: 'tier1:download' })}
		<div slot="header" style="align-items: center; display: flex; gap: 0.6rem;">
			<d2l-status-indicator state="none" text="Due Today"></d2l-status-indicator>
			<p class="d2l-body-small">Posts: 1 thread, 1 reply</p>
			<d2l-link small href="https://www.d2l.com" target="blank">Link</d2l-link>
		</div>
	`;
}

function createCustomWithSummary() {
	return html`
		${createButton()}
		${createButton({ icon: 'tier1:download' })}
		<div slot="header" style="align-items: center; display: flex; gap: 0.6rem;">
			<d2l-status-indicator state="none" text="Pending Evaluation"></d2l-status-indicator>
			<p class="d2l-body-small">Submitted On: Jul 20, 2021 - 2:23 PM</p>
			<d2l-link small href="https://www.d2l.com" target="blank">Link to post</d2l-link>
		</div>
		${createSummary()}
		<d2l-collapsible-panel-summary-item slot="summary" text="1 release condition"></d2l-collapsible-panel-summary-item>
		<d2l-collapsible-panel-summary-item slot="summary" text="Hidden by special access"></d2l-collapsible-panel-summary-item>
	`;
}

async function focusPanel(elem) {
	await focusElem(elem.querySelector('d2l-collapsible-panel'));
}

async function scrollTo(elem, y) {
	const position = elem.getBoundingClientRect();
	window.scrollTo(0, position.top + y);
	await nextFrame();
}

describe('collapsible-panel', () => {
	[
		{ category: 'default' },
		{ category: 'subtle', type: 'subtle' },
		{ category: 'inline', type: 'inline' },
	].forEach(({ category, type }) => {
		[
			{ name: 'collapsed' },
			{ name: 'collapsed-rtl', rtl: true },
			{ name: 'focus', action: focusPanel },
			{ name: 'focus-rtl', rtl: true, action: focusPanel },
			{ name: 'expanded', opts: { expanded: true } },
			{ name: 'expanded-rtl', rtl: true, opts: { expanded: true } },
			{ name: 'expanded-focus', opts: { expanded: true }, action: focusPanel },
			{ name: 'expanded-sticky-top', opts: { expanded: true, noSticky: false }, action: elem => scrollTo(elem, 0) },
			{ name: 'expanded-sticky-scrolled', opts: { expanded: true, noSticky: false }, action: elem => scrollTo(elem, 35) },
			{ name: 'summary', opts: { content: createSummary() } },
			{ name: 'summary-rtl', rtl: true, opts: { content: createSummary() } },
			{ name: 'summary-expanded', opts: { content: createSummary(), expanded: true } },
			{ name: 'summary-focus', opts: { content: createSummary() }, action: focusPanel },
			{ name: 'large-padding', opts: { paddingType: 'large' } },
			{ name: 'large-padding-summary', opts: { paddingType: 'large', content: createSummary() } },
			{ name: 'large-padding-expanded', opts: { paddingType: 'large', expanded: true } },
			{ name: 'long', opts: { content: createButton(), panelTitle: unbreakableTitle } },
		].forEach(({ name, opts, action, rtl }) => {
			it(`${category}-${name}`, async() => {
				const elem = await fixture(createCollapsiblePanel({ type, ...opts }), { rtl });
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});

	[
		{ name: 'default-title-wrap', opts: { panelTitle: longTitle } },
		{ name: 'default-title-wrap-rtl', rtl: true, opts: { panelTitle: longTitle } },
		{ name: 'default-title-wrap-focus', opts: { panelTitle: longTitle }, action: focusPanel },
		{ name: 'default-title-wrap-focus-rtl', rtl: true, opts: { panelTitle: longTitle }, action: focusPanel },
		{ name: 'default-expand-event', action: async(elem) => {
			const panel = elem.querySelector('d2l-collapsible-panel');
			panel.expanded = true;
			await oneEvent(panel, 'd2l-collapsible-panel-expand');
		} },
		{ name: 'summary-item-text-wrapping', opts: { content: createLongSummary() } },
		{ name: 'summary-item-text-lines', opts: { content: createLongSummary({ lines: 2 }) } },
		{ name: 'summary-item-text-lines-unbreakable', opts: { content: createUnbreakableSummary({ lines: 2 }) } },
		{ name: 'skeleton', opts: { skeleton: true, content: html`${createSummary({ skeleton: true })}${createSummary()}` } },
		{ name: 'custom', opts: { content: createCustom() } },
		{ name: 'custom-rtl', rtl: true, opts: { content: createCustom() } },
		{ name: 'custom-before', opts: { content: createCustom({ beforeIcon: true }) } },
		{ name: 'custom-before-rtl', rtl: true, opts: { content: createCustom({ beforeIcon: true }) } },
		{ name: 'custom-expanded', opts: { expanded: true, content: createCustom() } },
		{ name: 'custom-expanded-rtl', rtl: true, opts: { expanded: true, content: createCustom() } },
		{ name: 'custom-summary', opts: { content: createCustomWithSummary(), panelTitle: 'Submission 1' } },
		{ name: 'custom-summary-rtl', rtl: true, opts: { content: createCustomWithSummary(), panelTitle: 'Submission 1' } },
		{ name: 'custom-summary-expanded', opts: { expanded: true, content: createCustomWithSummary(), panelTitle: 'Submission 1' } },
	].forEach(({ name, opts, action, rtl }) => {
		it(name, async() => {
			const elem = await fixture(createCollapsiblePanel(opts), { rtl });
			if (action) await action(elem);
			await expect(elem).to.be.golden();
		});
	});
});
