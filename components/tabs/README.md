# Tabs
Tabs are used to present related information in mutually exclusive panels, allowing users to view just one panel at a time.

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tabs/tab.js';
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
</script>

<d2l-tabs text="Courses">
  <d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
  <d2l-tab id="biology" text="Biology" slot="tabs" selected></d2l-tab>
  <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
  <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
  <d2l-tab id="earth-sciences" text="Earth Sciences" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="earth-sciences" slot="panels">Tab content for Earth Sciences</d2l-tab-panel>
  <d2l-tab id="physics" text="Physics" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="physics" slot="panels">Tab content for Physics</d2l-tab-panel>
  <d2l-tab id="math" text="Math" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="math" slot="panels">Tab content for Math</d2l-tab-panel>
  <d2l-tab id="community" text="Community" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="community" slot="panels">Tab content for Community</d2l-tab-panel>
</d2l-tabs>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use tabs to separate related content
* Group content into tabs in a logical, predictable way
* Use short tab names for easier scanning
<!-- docs: end dos -->

<!-- docs: start donts -->
* Avoid placing critical information or tasks on any but the default tab, since users may not discover them
* Don’t use tab names as page headings
* Don’t nest tabs within tabs
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Tabs [d2l-tabs]

The `d2l-tabs` element is a web component for tabbed content, providing layout and responsive scrolling behaviour. The `d2l-tab` element is a simple tab handle that renders text, and is matched with a `d2l-tab-panel` element to contain the corresponding content. They are paired using an `id` on the tab handle and corresponding `labelled-by` on the `d2l-tab-panel`.

<!-- docs: demo code properties name:d2l-tabs sandboxTitle:'Tab' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tabs/tab.js';
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
  import '@brightspace-ui/core/components/button/button-icon.js';
</script>

<d2l-tabs text="Course">
  <d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
  <d2l-tab id="biology" text="Biology" slot="tabs" selected></d2l-tab>
  <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
  <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
  <d2l-tab id="earth-sciences" text="Earth Sciences" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="earth-sciences" slot="panels">Tab content for Earth Sciences</d2l-tab-panel>
  <d2l-tab id="physics" text="Physics" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="physics" slot="panels">Tab content for Physics</d2l-tab-panel>
  <d2l-tab id="math" text="Math" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="math" slot="panels">Tab content for Math</d2l-tab-panel>
  <d2l-tab id="community" text="Community" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="community" slot="panels">Tab content for Community</d2l-tab-panel>
  <d2l-button-icon slot="ext" icon="tier1:gear" text="Settings"></d2l-button-icon>
</d2l-tabs>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | ACCESSIBILITY: Accessible text for the tablist |
| `max-to-show` | Number | Used to limit the max-width/number of tabs to initially display |

<!-- docs: end hidden content -->

## Tab [d2l-tab]

An element that displays the corresponding tab panel when selected.

<!-- docs: demo code properties name:d2l-tab sandboxTitle:'Tab' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/count-badge/count-badge.js';
  import '@brightspace-ui/core/components/tabs/tab.js';
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
</script>

<d2l-tabs text="Courses">
  <d2l-tab id="all" text="All" slot="tabs" selected></d2l-tab>
  <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
  <d2l-tab id="biology" text="Biology" slot="tabs">
    <d2l-count-badge number="100" size="small" text="100 new notifications" type="notification" slot="after"></d2l-count-badge>
  </d2l-tab>
  <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
  <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
  <d2l-tab id="earth-sciences" text="Earth Sciences" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="earth-sciences" slot="panels">Tab content for Earth Sciences</d2l-tab-panel>
  <d2l-tab id="physics" text="Physics" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="physics" slot="panels">Tab content for Physics</d2l-tab-panel>
  <d2l-tab id="math" text="Math" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="math" slot="panels">Tab content for Math</d2l-tab-panel>
  <d2l-tab id="community" text="Community" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="community" slot="panels">Tab content for Community</d2l-tab-panel>
</d2l-tabs>
```

<!-- docs: start hidden content -->
### Properties
| Property | Type | Description |
|--|--|--|
| `id` | String, required | Unique identifier for the tab |
| `text` | String, required | The text used for the tab and for labelling the corresponding panel |
| `selected` | Boolean | Use to select the tab |

### Slots

| Slot | Description |
|--|--|
| `before` | Slot for content to be displayed before the tab text. Supports `d2l-icon`, `d2l-icon-custom`, and `d2l-count-badge`. Only the *first* item assigned to this slot will be shown. |
| `after` | Slot for content to be displayed after the tab text. Supports `d2l-icon`, `d2l-icon-custom`, and `d2l-count-badge`. Only the *last* item assigned to this slot will be shown. |

### Events
- `d2l-tab-content-change`: Dispatched when the text attribute is changed. Triggers virtual scrolling calculations in parent `d2l-tabs`.
- `d2l-tab-selected`: Dispatched when a tab is selected
<!-- docs: end hidden content -->

### Removing a Tab

A `tab` can be removed from the DOM using any regular method (e.g., `removeChild`). In order for the removal animation to be shown, the `hideTab` helper method in `d2l-tabs` must be used. An example of this is shown below, which waits for the promise in `hideTab` to resolve and then removes the tab and panel from the DOM. Ensure that when a `tab` is removed, the corresponding panel is also removed.

```
const tabs = this.shadowRoot.querySelector('d2l-tabs');
const tab = tabs.querySelector('d2l-tab');
Promise.resolve(tabs.hideTab((tab))).then(() => {
  const panel = tabs.querySelector(`d2l-tab-panel[labelled-by="${tab.id}"]`);
  if (panel) tabs.removeChild(panel);
  tabs.removeChild(tab);
});
```

### Custom Tabs

The `TabMixin` can be used to create custom tabs. It is IMPORTANT to call the `dispatchContentChangeEvent` function in `TabMixin` when content changes in the consumer in order to properly trigger calculations. Ensure that there is only one element in any custom tab to focus on, else the focus and keyboard navigation behaviors become confusing for users. Note that the parent `d2l-tabs` element handles `tabindex` focus management, and so consumers should not be rendering focusable elements within custom tabs.

Before creating a custom tab, ensure that the case is not covered by using a standard `d2l-tab` with content in the `before` and/or `after` slot(s).

<!-- docs: demo code sandboxTitle:'TabMixin' display:block-->
```html
<script type="module">
  import { css, html, LitElement, unsafeCSS } from 'lit';
  import { getFocusPseudoClass } from '@brightspace-ui/core/helpers/focus.js';
  import { TabMixin } from '@brightspace-ui/core/components/tabs/tab-mixin.js';

  class TabCustom extends TabMixin(LitElement) {

    static get styles() {
      const styles = [ css`
        .d2l-tab-custom-content {
          margin: 0.5rem;
          overflow: clip;
          overflow-clip-margin: 1em;
          padding: 0.1rem;
          white-space: nowrap;
        }
        :host(:first-child) .d2l-tab-custom-content {
          margin-inline-start: 0;
        }
        :host(:${unsafeCSS(getFocusPseudoClass())}) .d2l-tab-custom-content {
          border-radius: 0.3rem;
          color: var(--d2l-color-celestine);
          outline: 2px solid var(--d2l-color-celestine);
        }
      `];

      super.styles && styles.unshift(super.styles);
      return styles;
    }

    renderContent() {
      return html`
        <div class="d2l-tab-custom-content">
          <slot @slotchange="${this.#handleSlotchange}"></slot>
        </div>
      `;
    }

    #handleSlotchange() {
      this.dispatchContentChangeEvent();
    }
  }

  customElements.define('d2l-tab-custom', TabCustom);
</script>
<script type="module">
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
  import '@brightspace-ui/core/components/count-badge/count-badge.js';
</script>

<d2l-tabs text="Courses">
  <d2l-tab-custom id="all" slot="tabs"><div style="color: purple;">All</div></d2l-tab-custom>
  <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
  <d2l-tab-custom id="biology" slot="tabs" selected>
    Biology <d2l-count-badge number="100" size="small" text="100 new notifications" type="notification"></d2l-count-badge>
  </d2l-tab-custom>
  <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
  <d2l-tab-custom id="chemistry" slot="tabs">Chemistry</d2l-tab-custom>
  <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
</d2l-tabs>
```

## Tab Panels [d2l-tab-panel]
Selecting a tab in the tab bar causes the related tab panel to be displayed. Tab panels can contain text, form controls, rich media, or just about anything else. There is an optional “slot” available for related controls such as a Settings button.

<!-- docs: demo code properties name:d2l-tab-panel sandboxTitle:'Tab Panels' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tabs/tab.js';
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
</script>

<d2l-tabs text="Courses">
  <d2l-tab id="all" text="All" slot="tabs" selected></d2l-tab>
  <d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
  <d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
  <d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
  <d2l-tab id="earth-sciences" text="Earth Sciences" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="earth-sciences" slot="panels">Tab content for Earth Sciences</d2l-tab-panel>
  <d2l-tab id="physics" text="Physics" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="physics" slot="panels">Tab content for Physics</d2l-tab-panel>
  <d2l-tab id="math" text="Math" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="math" slot="panels">Tab content for Math</d2l-tab-panel>
  <d2l-tab id="community" text="Community" slot="tabs"></d2l-tab>
  <d2l-tab-panel labelled-by="community" slot="panels">Tab content for Community</d2l-tab-panel>
</d2l-tabs>
```

<!-- docs: start hidden content -->
### Properties
| Property | Type | Description |
|--|--|--|
| `labelled-by` | String, required | Id of the tab that labels this panel |
| `no-padding` | Boolean | Used to opt out of default padding/whitespace around the panel |
| `text` | String | DEPRECATED: The text used for the tab, as well as labelling the panel. Required if not using d2l-tab/d2l-tab-panel implementation. |
| `selected` | Boolean | DEPRECATED: Use to select the tab. Do NOT set if using the d2l-tab/d2l-tab-panel implementation. |

### Events
- `d2l-tab-panel-selected`: DEPRECATED: Dispatched when a tab is selected
<!-- docs: end hidden content -->

## Accessibility

The `tabs` components were built following [W3C best practices for Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) with Manual Activation. Important features include:
- Following recommended keyboard control patterns (with the exception of the "Optional" Home, End, and Delete key patterns)
- Using the roles of `tablist` and `tab` appropriately in order to facilitate screen reader information (e.g., "tab, 2 of 7") and adding an `aria-label` to the `tablist`
- Using `aria-selected` to indicate `tab` selection state
- Using `aria-labelledby` and `aria-controls` in order to match the `tab` with the `tabpanel` for screen reader users
