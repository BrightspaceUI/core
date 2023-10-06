import '../../../components/colors/colors.js';
import '../../../components/list/list.js';
import '../../../components/list/list-item.js';
import '../../../components/list/list-item-content.js';
import '../../../components/list/list-controls.js';
import '../../../components/selection/selection-action.js';
import '../primary-secondary.js';
import { expect, fixture, focusElem, html, sendKeysElem } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

function createTemplate(opts) {
	const { footer, mobile, resizable, shading, secondaryFirst, storageKey, widthType } = { footer: true, mobile: false, resizable: true, secondaryFirst: false, ...opts };
	const styles = {
		border: '2px solid var(--d2l-color-mica)',
		height: mobile ? '300px' : '150px',
		position: 'relative',
		width: mobile ? '100px' : (widthType ? '1400px' : '769px')
	};
	return html`
		<div style="${styleMap(styles)}">
			<d2l-template-primary-secondary ?resizable="${resizable}" ?secondary-first="${secondaryFirst}" background-shading="${ifDefined(shading)}" width-type="${ifDefined(widthType)}" storage-key="${ifDefined(storageKey)}">
				<div style="${ifDefined(mobile ? undefined : 'border-bottom: 1px solid var(--d2l-color-mica);')}" slot="header">Header</div>Size
				<div slot="primary">
					We make it easy to provide timely and contextual feedback and assessments. Do it through inline
					annotations,
					our assessment hub, gradebook, video and audio feedback, and amazing rubrics. Grade assignments and give
					feedback on the go using a mobile app. Plus, assess any type of activity, including electronic and paper
					submissions, and observational assessments in the class and in the field.
				</div>
				<div slot="secondary">
					Students of all ages get more engaged when they share their progress, reflections, and learning
					experiences
					with their classmates, teacher, and parents.&#x202F;Our Portfolio tool, as well as built-in badges and
					certificates
					provide instant recognition and keep students motivated. Parents love them too.
				</div>
				${footer ? html`<div slot="footer">Footer</div>` : nothing}
			</d2l-template-primary-secondary>
		</div>
	`;
}

function createMobileTemplate(opts = {}) {
	opts.mobile = true;
	opts.resizable = false;
	return createTemplate(opts);
}

function createShortTemplate(opts) {
	const { mobile } = { mobile: false, ...opts };
	const styles = {
		border: '2px solid var(--d2l-color-mica)',
		height: mobile ? '300px' : '150px',
		position: 'relative',
		width: mobile ? '100px' : '1400px'
	};
	return html`
		<div style="${styleMap(styles)}">
			<d2l-template-primary-secondary resizable>
				<div style="${ifDefined(mobile ? undefined : 'border-bottom: 1px solid var(--d2l-color-mica);')}" slot="header">Header</div>Size
				<div style="background-color: gray;" slot="primary">
					We
				</div>
				<div style="background-color: gray;" slot="secondary">
					Students
				</div>
			</d2l-template-primary-secondary>
		</div>
	`;
}

async function moveDivider(handle, key, steps, clearFocus = false) {
	for (let i = 0; i < steps; i++) {
		await sendKeysElem(handle, 'press', key);
	}
	if (clearFocus) document.activeElement.blur();
}

describe('primary-secondary', () => {

	describe('desktop', () => {
		[
			{ name: 'fixed', template: createTemplate({ resizable: false }) },
			{ name: 'fixed-secondary-first', template: createTemplate({ resizable: false, secondaryFirst: true }) },
			{ name: 'resizable', template: createTemplate() },
			{ name: 'expanded', template: createTemplate(), action: elem => moveDivider(elem, 'ArrowLeft', 10, true) },
			{ name: 'collapsed', template: createTemplate(), action: elem => moveDivider(elem, 'ArrowRight', 5, true) },
			{ name: 'focus', template: createTemplate(), action: focusElem },
			{ name: 'focus-expanded', template: createTemplate(), action: elem => moveDivider(elem, 'ArrowLeft', 10) },
			{ name: 'focus-expanded-rtl', rtl: true, template: createTemplate(), action: elem => moveDivider(elem, 'ArrowRight', 10) },
			{ name: 'focus-expanded-secondary-first', template: createTemplate({ secondaryFirst: true }), action: elem => moveDivider(elem, 'ArrowRight', 10) },
			{ name: 'focus-expanded-rtl-secondary-first', rtl: true, template: createTemplate({ secondaryFirst: true }), action: elem => moveDivider(elem, 'ArrowLeft', 10) },
			{ name: 'focus-collapsed', template: createTemplate(), action: elem => moveDivider(elem, 'ArrowRight', 5) },
			{ name: 'focus-collapsed-rtl', rtl: true, template: createTemplate(), action: elem => moveDivider(elem, 'ArrowLeft', 5) },
			{ name: 'focus-collapsed-secondary-first', template: createTemplate({ secondaryFirst: true }), action: elem => moveDivider(elem, 'ArrowLeft', 5) },
			{ name: 'focus-collapsed-rtl-secondary-first', rtl: true, template: createTemplate({ secondaryFirst: true }), action: elem => moveDivider(elem, 'ArrowRight', 5) },
			{ name: 'background-shading-primary', template: createTemplate({ shading: 'primary' }) },
			{ name: 'background-shading-primary-rtl', rtl: true, template: createTemplate({ shading: 'primary' }) },
			{ name: 'background-shading-secondary', template: createTemplate({ shading: 'secondary' }) },
			{ name: 'background-shading-secondary-rtl', rtl: true, template: createTemplate({ shading: 'secondary' }) },
			{ name: 'hidden-footer', template: createTemplate({ footer: false, resizable: false }) },
			{ name: 'width-fullscreen', template: createTemplate({ footer: false, resizable: false, widthType: 'fullscreen' }) },
			{ name: 'width-normal', template: createTemplate({ footer: false, resizable: false, widthType: 'normal' }) },
			{ name: 'width-normal-collapsed', template: createTemplate({ footer: false, widthType: 'normal' }), action: elem => moveDivider(elem, 'ArrowRight', 5) },
			{ name: 'short-content', template: createShortTemplate() },
		].forEach(({ name, template, action, rtl }) => {
			it(name, async() => {
				const elem = await fixture(template, { rtl, viewport: { width: 1450 } });
				const primarySecondary = elem.querySelector('d2l-template-primary-secondary');
				if (action) await action(primarySecondary.shadowRoot.querySelector('.d2l-template-primary-secondary-divider'));
				await expect(primarySecondary).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('mobile', () => {
		[
			{ name: 'default', template: createMobileTemplate() },
			{ name: 'focus', template: createMobileTemplate(), action: focusElem },
			{ name: 'rtl', rtl: true, template: createMobileTemplate() },
			{ name: 'focus-rtl', rtl: true, template: createMobileTemplate(), action: focusElem },
			{ name: 'expanded', template: createMobileTemplate(), action: elem => moveDivider(elem, 'ArrowUp', 5, true) },
			{ name: 'middle', template: createMobileTemplate(), action: elem => moveDivider(elem, 'ArrowUp', 1, true) },
			{ name: 'collapsed', template: createMobileTemplate(), action: elem => moveDivider(elem, 'ArrowDown', 5, true) },
			{ name: 'hidden-footer', template: createMobileTemplate({ footer: false }) },
			{ name: 'hidden-footer-expanded', template: createMobileTemplate({ footer: false }), action: elem => moveDivider(elem, 'ArrowUp', 5, true) },
			{ name: 'hidden-footer-collapsed', template: createMobileTemplate({ footer: false }), action: elem => moveDivider(elem, 'ArrowDown', 5, true) },
			{ name: 'short-content', template: createShortTemplate({ mobile: true }) },
		].forEach(({ name, template, action, rtl }) => {
			it(name, async() => {
				const elem = await fixture(template, { rtl, viewport: { width: 400 } });
				const primarySecondary = elem.querySelector('d2l-template-primary-secondary');
				if (action) await action(primarySecondary.shadowRoot.querySelector('.d2l-template-primary-secondary-divider'));
				await expect(primarySecondary).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('persist', () => {
		it('divider size on reload', async() => {
			const elem = await fixture(createTemplate({ storageKey: 'persist.vdiff' }), { viewport: { width: 1450 } });
			const handle = elem.querySelector('d2l-template-primary-secondary').shadowRoot.querySelector('.d2l-template-primary-secondary-divider');

			await moveDivider(handle, 'ArrowRight', 10);
			const newElem = await fixture(createTemplate({ storageKey: 'persist.vdiff' }), { viewport: { width: 1450 } });
			await expect(newElem.querySelector('d2l-template-primary-secondary')).to.be.golden({ margin: 0 });
		});
	});

	describe('stacking', () => {
		it('opt-in', async() => {
			const elem = await fixture(html`
				<div style="border: 2px solid var(--d2l-color-mica); height: 350px; position: relative; width: 750px;">
					<d2l-template-primary-secondary>
						<div style="border-bottom: 1px solid var(--d2l-color-mica);" slot="header">Header
							<div style="
								background-color: yellow;
								border: 1px solid var(--d2l-color-mica);
								height: 250px;
								left: 70px;
								position: fixed;
								top: 50px;
								width: 600px;
								z-index: 100000;">
							</div>
						</div>
						<div slot="primary">
							<d2l-list item-count="50" extend-separators>
								<d2l-list-controls slot="controls">
									<d2l-selection-action icon="tier1:plus-default" text="Action"></d2l-selection-action>
								</d2l-list-controls>
								<d2l-list-item selectable key="primary-1" label="Item 1">
									<d2l-list-item-content>
										<div>Primary Item 1</div>
										<div slot="supporting-info">Supporting Info for item 1</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item selectable selected key="primary-2" label="Item 2">
									<d2l-list-item-content>
										<div>Primary Item 2</div>
										<div slot="supporting-info">Supporting Info for item 2</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item selectable key="primary-3" label="Item 3">
									<d2l-list-item-content>
										<div>Primary Item 3</div>
										<div slot="supporting-info">Supporting Info for item 3</div>
									</d2l-list-item-content>
								</d2l-list-item>
							</d2l-list>
						</div>
						<div slot="secondary">
							<d2l-list item-count="50" extend-separators>
								<d2l-list-controls slot="controls">
									<d2l-selection-action icon="tier1:plus-default" text="Action"></d2l-selection-action>
								</d2l-list-controls>
								<d2l-list-item selectable selected key="secondary-1" label="Item 1">
									<d2l-list-item-content>
										<div>Secondary Item 1</div>
										<div slot="supporting-info">Supporting Info for item 1</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item selectable key="secondary-2" label="Item 2">
									<d2l-list-item-content>
										<div>Secondary Item 2</div>
										<div slot="supporting-info">Supporting Info for item 2</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item selectable key="secondary-3" label="Item 3">
									<d2l-list-item-content>
										<div>Secondary Item 3</div>
										<div slot="supporting-info">Supporting Info for item 3</div>
									</d2l-list-item-content>
								</d2l-list-item>
							</d2l-list>
						</div>
						<div slot="footer">Footer</div>
					</d2l-template-primary-secondary>
				</div>
			`);

			await expect(elem).to.be.golden({ margin: 0 });
		});
	});
});
