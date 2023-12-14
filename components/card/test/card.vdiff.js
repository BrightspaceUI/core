import '../../button/button.js';
import '../../button/button-icon.js';
import '../../dropdown/dropdown-more.js';
import '../../dropdown/dropdown-content.js';
import '../../tooltip/tooltip.js';
import '../card.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';

function createCardTemplate(opts) {
	const { alignCenter, content, subtle } = { alignCenter: false, subtle: false, ...opts };
	return html`
		<d2l-card style="height: 260px; width: 210px;" ?align-center="${alignCenter}" ?subtle="${subtle}">
			${content}
		</d2l-card>
	`;
}
function createLinkCardTemplate(opts) {
	return html`
		<d2l-card style="height: 260px; width: 210px;" text="Link Text" href="javascript:void(0);">
			${opts.content}
		</d2l-card>
	`;
}
function createHeader(text) {
	return html`
		<div slot="header" style="background-color: orange; height: 95px;">${text}</div>
	`;
}
function createMultiLinkCardTemplate(opts) {
	const { shinyFooter, mainCardContent } = { shinyFooter: false, ...opts };
	return html`
		<div style="padding: 10px; width: 500px;">
			${createLinkCardTemplate({ content: mainCardContent })}
			${createLinkCardTemplate({ content: html`
				${createHeader('Header 2')}
				<div slot="content">Content 2</div>
				${ shinyFooter ? html`<d2l-button slot="footer" style="width: 100%;">Shiny</d2l-button>` : html`<div slot="footer">Footer 2</div>`}
			` })}
		</div>
	`;
}

const simpleContent = html`
	${createHeader('Header')}
	<div slot="content">Content</div>
`;
const simpleContentWithFooter = html`
	${createHeader('Header')}
	<div slot="content">Content</div>
	<div slot="footer">Footer</div>
`;

const actionButton = html`<d2l-button-icon slot="actions" translucent text="gear" icon="tier1:gear"></d2l-button-icon>`;
const actionContent = html`
	${createHeader()}
	${actionButton}
	<d2l-button-icon slot="actions" translucent text="pin" icon="tier1:pin-filled"></d2l-button-icon>
	<div slot="content">Content</div>
`;

const linkContent = html`
	${createHeader()}
	${actionButton}
	<div slot="content">Content</div>
	<d2l-button slot="footer" style="width: 100%;">Shiny</d2l-button>
`;

const dropdownContent = (opened) => html`
	${createHeader('Header 1')}
	<d2l-dropdown-more slot="actions" translucent text="Open!">
			<d2l-dropdown-content ?opened="${opened}">
				<div>Super fancy dropdown features that should overlap the adjacent card. It should also overlap this card's content and footer.</div>
			</d2l-dropdown-content>
	</d2l-dropdown-more>
	<div slot="content">Content 1</div>
	<div slot="footer">Footer 1</div>
`;

const tooltipContent = html`
	${createHeader('Header 1')}
	<div slot="content">Content 1</div>
	<div slot="footer">
		<d2l-button id="shiny-button" style="width: 100%;">Shiny</d2l-button>
		<d2l-tooltip class="vdiff-include" position="top" for="shiny-button">Shiny tooltip text that should overlap the adjacent card.</d2l-tooltip>
	</div>
`;

describe('card', () => {
	[
		{ name: 'header-content', template: createCardTemplate({ content: simpleContent }) },
		{ name: 'footer', template: createCardTemplate({ content: simpleContentWithFooter }) },
		{ name: 'align-center', template: createCardTemplate({ content: simpleContentWithFooter, alignCenter: true }) },
		{ name: 'badge', template: createCardTemplate({ content: html`${simpleContent}
			<div slot="badge">
				<div style="background-color: white; border: 1px solid black; border-radius: 6px; display: inline-block; line-height: 1rem; padding: 0.3rem; width: 60px;">Badge</div>
			</div>`
		}) },
		{ name: 'actions', template: createCardTemplate({ content: actionContent }) },
		{ name: 'actions-rtl', rtl: true, template: createCardTemplate({ content: actionContent }) },
		{ name: 'actions-focus', template: createCardTemplate({ content: actionContent }), action: elem => focusElem(elem.querySelector('d2l-button-icon')) },
		{ name: 'no-link-focus', template: createCardTemplate({ content: simpleContent }), action: elem => clickElem(elem) },
		{ name: 'link', template: createLinkCardTemplate({ content: linkContent }) },
		{ name: 'link-focus', template: createLinkCardTemplate({ content: linkContent }), action: elem => clickElem(elem) },
		{ name: 'link-actions-focus', template: createLinkCardTemplate({ content: linkContent }), action: elem => focusElem(elem.querySelector('d2l-button-icon')) },
		{ name: 'link-footer-focus', template: createLinkCardTemplate({ content: linkContent }), action: elem => focusElem(elem.querySelector('d2l-button')) },
		{ name: 'with-dropdown', template: createMultiLinkCardTemplate({ mainCardContent: dropdownContent() }) },
		{ name: 'with-dropdown-open', template: createMultiLinkCardTemplate({ mainCardContent: dropdownContent(true) }) },
		{ name: 'with-dropdown-adjacent-hover', template: createMultiLinkCardTemplate({ mainCardContent: dropdownContent(true) }), action: elem => hoverElem(elem.querySelector('d2l-card:nth-child(2) [slot="header"]')) },
		{ name: 'with-tooltip', template: createMultiLinkCardTemplate({ mainCardContent: tooltipContent, shinyFooter: true }) },
		{ name: 'with-tooltip-focus', template: createMultiLinkCardTemplate({ mainCardContent: tooltipContent, shinyFooter: true }), action: async(elem) => {
			focusElem(elem.querySelector('#shiny-button'));
			await oneEvent(elem, 'd2l-tooltip-show');
		} },
	].forEach(({ name, template, action, rtl }) => {
		it(name, async() => {
			const elem = await fixture(template, { rtl });
			if (action) await action(elem);
			await expect(elem).to.be.golden();
		});
	});

	it('subtle', async() => {
		const elem = await fixture(html`
			<div style="background-color: #f6f7f8; padding: 20px; width: 300px">
				${createCardTemplate({ content: simpleContent, subtle: true })}
			</div>
		`);
		await expect(elem.querySelector('d2l-card')).to.be.golden();
	});
});
