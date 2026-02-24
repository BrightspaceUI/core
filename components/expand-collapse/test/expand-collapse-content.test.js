import { defineCE, expect, fixture, html, oneEvent, runConstructor, waitUntil } from '@brightspace-ui/testing';
import { LitElement, nothing } from 'lit';
import { states } from '../expand-collapse-content.js';

const tagName = defineCE(
	class extends LitElement {
		static get properties() {
			return {
				transitions: { type: Boolean }, //test transition logic
				empty: { type: Boolean },
				expanded: { type: Boolean }
			};
		}

		constructor() {
			super();
			this.transitions = false;
			this.empty = false;
			this.expanded = false;
			this.hasExpanded = false;
			this.hasCollapsed = false;
		}
		render() {
			/* eslint-disable lit/no-private-properties	*/
			return html`
				<d2l-expand-collapse-content
					._reduceMotion="${!this.transitions}"
					@d2l-expand-collapse-content-collapse="${this.onCollapse}"
					@d2l-expand-collapse-content-expand="${this.onExpand}"
					?expanded="${this.expanded}">${this.empty ? nothing : 'Content'}</d2l-expand-collapse-content>
			`;
			/* eslint-enable lit/no-private-properties */
		}
		async updated(changedProperties) {
			super.updated(changedProperties);
			if (changedProperties.has('transitions') && this.transitions) {
				const content = this.shadowRoot.querySelector('d2l-expand-collapse-content');
				await content.updateComplete;
				content.shadowRoot.querySelector('.d2l-expand-collapse-content-container').style.transition = 'height 100ms ease-in-out, opacity 100ms ease-in-out';
			}
		}

		onCollapse() {
			this.hasCollapsed = true;
		}

		onExpand() {
			this.hasExpanded = true;
		}
	}
);

describe('d2l-expand-collapse-content', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-expand-collapse-content');
		});

	});

	describe('events', () => {

		[true, false].forEach(expand => {
			const event =  expand ? 'd2l-expand-collapse-content-expand' : 'd2l-expand-collapse-content-collapse';

			async function changeState(content) {
				setTimeout(() => content.expanded = expand);
				return oneEvent(content, event);
			}

			it(`does not fire ${event} on first update`, async() => {
				const content = await fixture(`<${tagName}${expand ? ' expanded' : ''}></${tagName}>`);
				expect(content[`has${expand ? 'Expanded' : 'Collapsed'}`]).to.be.false;
			});

			it(`should fire ${event} event with complete promise`, async() => {
				const content = (await fixture(`<${tagName}${expand ? '' : ' expanded'}></${tagName}>`)).shadowRoot.querySelector('d2l-expand-collapse-content');

				const e = await changeState(content);

				await e.detail[`${expand ? 'expand' : 'collapse'}Complete`];
				expect(content._state).to.equal(expand ? states.EXPANDED : states.COLLAPSED);
			});

			it(`should fire ${event} event with transition states`, async() => {
				const content = (await fixture(`<${tagName}${expand ? '' : ' expanded'} transitions></${tagName}>`)).shadowRoot.querySelector('d2l-expand-collapse-content');


				const e = await changeState(content);

				expect(content._state).to.equal(expand ? states.PREEXPANDING : states.PRECOLLAPSING);

				const transitionState = (expand ? states.EXPANDING : states.COLLAPSING);
				await waitUntil(() => content._state === transitionState, `never reached state: ${transitionState}`);;

				await e.detail[`${expand ? 'expand' : 'collapse'}Complete`];
				expect(content._state).to.equal(expand ? states.EXPANDED : states.COLLAPSED);
			});

			it(`should finish ${event} transition when empty`, async() => {
				const content = (await fixture(`<${tagName}${expand ? '' : ' expanded'} transitions empty></${tagName}>`)).shadowRoot.querySelector('d2l-expand-collapse-content');

				const e = await changeState(content);
				await e.detail[`${expand ? 'expand' : 'collapse'}Complete`];
				expect(content._state).to.equal(expand ? states.EXPANDED : states.COLLAPSED);
			});
		});
	});
});
