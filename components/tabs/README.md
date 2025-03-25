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

The `d2l-tabs` element is a web component for tabbed content. It provides the `d2l-tab` component for simple tab content, and the `d2l-tab-panel` component for the panel content. It also provides the `TabMixin` for custom tabs. It renders tabs responsively and provides virtual scrolling for large tab lists.

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
  import '@brightspace-ui/core/components/tabs/tab.js';
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
</script>

<d2l-tabs>
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
### Tab Panel Properties
| Property | Type | Description |
|--|--|--|
| `text` | String, required | The text used for the tab and for labelling the corresponding panel |
| `id` | String, required | Unique identifier for the tab |
| `selected` | Boolean | Use to select the tab |

### Events
- `d2l-tab-content-change`: Dispatched when the text attribute is changed. Triggers virtual scrolling calculations in parent d2l-tabs.
- `d2l-tab-selected`: Dispatched when a tab is selected
<!-- docs: end hidden content -->

### Custom Tabs

The `TabMixin` can be used to create custom tab openers which use the same structure within `d2l-tabs` as above. It is important to call the `dispatchContentChangeEvent` function in `TabMixin` when content changes in the consumer in order to properly trigger calculations.

## Tab Panels [d2l-tab-panel]
Selecting a tab in the tab bar causes the relevant tab panel to be displayed. Tab panels can contain text, form controls, rich media, or just about anything else. There is an optional “slot” available for related controls such as a Settings button.

<!-- docs: demo code properties name:d2l-tab-panel sandboxTitle:'Tab Panels' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tabs/tab.js';
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
</script>

<d2l-tabs>
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
### Tab Panel Properties
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
- Using the roles of `tablist` and `tab` appropriately in order to facilitate screen reader information (e.g., "tab, 2 of 7")
- Using `aria-selected` to indicate `tab` selection state
- Using `aria-labelledby` and `aria-controls` in order to match the `tab` with the `tabpanel` for screen reader users