import '../../button/button.js';
import '../tabs2.js';
import '../tab-panel.js';
import '../tab.js';
import { clickElem, expect, fixture, focusElem, html, sendKeysElem } from '@brightspace-ui/testing';

const noPanelSelectedFixture = html`
    <d2l-tabs2>
        <d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
        <d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
        <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
    </d2l-tabs2>
`;

const panelSelectedFixture = html`
    <d2l-tabs2>
        <d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
        <d2l-tab id="biology" text="Biology" selected slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
        <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
    </d2l-tabs2>
`;

const oneTabFixture = html`
    <d2l-tabs2>
        <d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
    </d2l-tabs2>
`;

const skeletonFixture = html`
    <d2l-tabs2 skeleton>
        <d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
        <d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
        <d2l-tab id="physics" text="Physics" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="physics" slot="panels">Tab content for Physics</d2l-tab-panel>
        <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
    </d2l-tabs2>
`;

const skeletonNoTextFixture = html`
    <d2l-tabs2 skeleton>
        <d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
        <d2l-tab id="biology" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
        <d2l-tab id="physics" text="Physics" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="physics" slot="panels">Tab content for Physics</d2l-tab-panel>
        <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
    </d2l-tabs2>
`;

const ellipsisFixture = html`
    <d2l-tabs2>
        <d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
        <d2l-tab id="earth-sciences" text="Earth &amp; Planetary Sciences" selected slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="earth-sciences" slot="panels">Tab content for Earth &amp; Planetary Sciences</d2l-tab-panel>
        <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
    </d2l-tabs2>
`;

const actionSlotFixture = html`
    <d2l-tabs2>
        <d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
        <d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
        <d2l-button slot="ext">Search</d2l-button>
    </d2l-tabs2>
`;

const noPaddingFixture = html`
    <d2l-tabs2>
        <d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="all" no-padding style="background-color: orange;" slot="panels">Tab content for All</d2l-tab-panel>
        <d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
    </d2l-tabs2>
`;

const nextFixture = html`
    <d2l-tabs2>
        <d2l-tab id="all-courses" text="All Courses" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="all-courses" slot="panels">Tab content for All</d2l-tab-panel>
        <d2l-tab id="biology" text="Biology" selected slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
        <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
        <d2l-tab id="geology" text="Geology" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="geology" slot="panels">Tab content for Geology</d2l-tab-panel>
    </d2l-tabs2>
`;

const previousFixture = html`
    <d2l-tabs2>
        <d2l-tab id="all-courses" text="All Courses" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="all-courses" slot="panels">Tab content for All</d2l-tab-panel>
        <d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
        <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
        <d2l-tab id="geology" text="Geology" selected slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="geology" slot="panels">Tab content for Geology</d2l-tab-panel>
    </d2l-tabs2>
`;

const maxToShowFixture = html`
    <d2l-tabs2 max-to-show="2">
        <d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
        <d2l-tab id="biology" text="Biology" selected slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
        <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
    </d2l-tabs2>
`;

const keyboardFixture = html`
    <d2l-tabs2>
        <d2l-tab id="all-courses" text="All Courses" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="all-courses" slot="panels">Tab content for All</d2l-tab-panel>
        <d2l-tab id="biology" text="Biology" selected slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
        <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
        <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
    </d2l-tabs2>
`;

const viewport = { width: 376 };

describe('d2l-tabs', () => {

    describe('basic', () => {

        it('no panel selected', async() => {
            const elem = await fixture(noPanelSelectedFixture, { viewport });
            await expect(elem).to.be.golden();
        });

        it('panel selected', async() => {
            const elem = await fixture(panelSelectedFixture, { viewport });
            await expect(elem).to.be.golden();
        });

        it('one tab', async() => {
            const elem = await fixture(oneTabFixture, { viewport });
            await expect(elem).to.be.golden();
        });

        it('skeleton', async() => {
            const elem = await fixture(skeletonFixture, { viewport });
            await expect(elem).to.be.golden();
        });

        it('skeleton no text', async() => {
            const elem = await fixture(skeletonNoTextFixture, { viewport });
            await expect(elem).to.be.golden();
        });

        it('ellipsis', async() => {
            const elem = await fixture(ellipsisFixture, { viewport });
            await expect(elem).to.be.golden();
        });

        it('non-selected tab focus', async() => {
            const elem = await fixture(noPanelSelectedFixture, { viewport });
            await sendKeysElem(elem, 'press', 'ArrowRight');
            await expect(elem).to.be.golden();
        });

        it('selected tab focus', async() => {
            const elem = await fixture(panelSelectedFixture, { viewport });
            await focusElem(elem);
            await expect(elem).to.be.golden();
        });

        it('action slot', async() => {
            const elem = await fixture(actionSlotFixture, { viewport });
            await expect(elem).to.be.golden();
        });

        it('no padding', async() => {
            const elem = await fixture(noPaddingFixture, { viewport });
            await expect(elem).to.be.golden();
        });

    });

    describe('overflow', () => {

        ['ltr', 'rtl'].forEach((dir) => {

            const rtl = dir === 'rtl';

            describe(dir, () => {

                it('scroll next', async() => {
                    const elem = await fixture(nextFixture, { viewport, rtl });
                    await expect(elem).to.be.golden();
                });

                it('scrolls next on click', async() => {
                    const elem = await fixture(nextFixture, { viewport, rtl });
                    await clickElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button'));
                    await expect(elem).to.be.golden();
                });

                it('scroll previous', async() => {
                    const elem = await fixture(previousFixture, { viewport, rtl });
                    await expect(elem).to.be.golden();
                });

                it('scrolls previous on click', async() => {
                    const elem = await fixture(previousFixture, { viewport, rtl });
                    await clickElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-previous-container button'));
                    await expect(elem).to.be.golden();
                });

                it('action slot', async() => {
                    const elem = await fixture(actionSlotFixture, { viewport, rtl });
                    await expect(elem).to.be.golden();
                });

                it('focus next', async() => {
                    const elem = await fixture(nextFixture, { viewport, rtl });
                    await focusElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button'));
                    await expect(elem).to.be.golden();
                });

                it('focus previous', async() => {
                    const elem = await fixture(previousFixture, { viewport, rtl });
                    await focusElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-previous-container button'));
                    await expect(elem).to.be.golden();
                });
            });

        });

    });

    describe('max-to-show', () => {

        let elem;
        beforeEach(async() => {
            elem = await fixture(maxToShowFixture, { viewport });
        });

        it('initial', async() => {
            await expect(elem).to.be.golden();
        });

        it('expands on focus to overflow', async() => {
            await sendKeysElem(elem, 'press', 'ArrowRight');
            await expect(elem).to.be.golden();
        });

        it('expands on scroll next click', async() => {
            await clickElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button'));
            await expect(elem).to.be.golden();
        });

    });

    describe('keyboard', () => {

        it('focuses next on right arrow', async() => {
            const elem = await fixture(keyboardFixture, { viewport });
            await sendKeysElem(elem, 'press', 'ArrowRight');
            await expect(elem).to.be.golden();
        });

        it('focuses previous on left arrow', async() => {
            const elem = await fixture(keyboardFixture, { viewport });
            await sendKeysElem(elem, 'press', 'ArrowLeft');
            await expect(elem).to.be.golden();
        });

        it('focuses first on right arrow from last', async() => {
            const elem = await fixture(keyboardFixture, { viewport });
            await sendKeysElem(elem, 'press', 'ArrowRight+ArrowRight');
            await expect(elem).to.be.golden();
        });

        it('focuses last on left arrow from first', async() => {
            const elem = await fixture(keyboardFixture, { viewport });
            await sendKeysElem(elem, 'press', 'ArrowLeft+ArrowLeft');
            await expect(elem).to.be.golden();
        });

        ['Space', 'Enter'].forEach((key) => {
            it(`selects on ${key}`, async() => {
                const elem = await fixture(html`
                    <d2l-tabs2>
                        <d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
                        <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
                    </d2l-tabs2>
                `, { viewport });
                await sendKeysElem(elem, 'press', `ArrowRight+${key}`);
                await expect(elem).to.be.golden();
            });
        });

    });

});
