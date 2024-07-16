
# Tabs
Tabs are used to present related information in mutually exclusive panels, allowing users to view just one panel at a time.

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
</script>

<d2l-tabs>
  <d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
  <d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
  <d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
  <d2l-tab-panel text="Earth Sciences">Tab content for Earth Sciences</d2l-tab-panel>
  <d2l-tab-panel text="Physics">Tab content for Physics</d2l-tab-panel>
  <d2l-tab-panel text="Math">Tab content for Math</d2l-tab-panel>
  <d2l-tab-panel text="Community">Tab content for Community</d2l-tab-panel>
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

## Tab [d2l-tabs]

The `d2l-tabs` element is a web component for tabbed content. It provides the `d2l-tab-panel` component for the content, renders tabs responsively, and provides virtual scrolling for large tab lists.

<!-- docs: demo code properties name:d2l-tabs sandboxTitle:'Tab' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
</script>

<d2l-tabs>
  <d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
  <d2l-tab-panel selected text="Biology" >Tab content for Biology</d2l-tab-panel>
  <d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
  <d2l-tab-panel text="Earth Sciences">Tab content for Earth Sciences</d2l-tab-panel>
  <d2l-tab-panel text="Physics">Tab content for Physics</d2l-tab-panel>
  <d2l-tab-panel text="Math">Tab content for Math</d2l-tab-panel>
  <d2l-tab-panel text="Community">Tab content for Community</d2l-tab-panel>
</d2l-tabs>
```

<!-- docs: start hidden content -->
### Tabs Properties

| Property | Type | Description |
|--|--|--|
| `max-to-show` | Number | Used to limit the max-width/number of tabs to initially display |

<!-- docs: end hidden content -->

## Tab Panels [d2l-tab-panel]
Selecting a tab in the tab bar causes the relevant tab panel to be displayed. Tab panels can contain text, form controls, rich media, or just about anything else. There is an optional “slot” available for related controls such as a Settings button.

<!-- docs: demo code properties name:d2l-tab-panel sandboxTitle:'Tab Panels' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
  import '@brightspace-ui/core/components/button/button-icon.js';
</script>

<d2l-tabs>
  <d2l-tab-panel selected text="All">Tab content for All</d2l-tab-panel>
  <d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
  <d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
  <d2l-tab-panel text="Earth Sciences">Tab content for Earth Sciences</d2l-tab-panel>
  <d2l-tab-panel text="Physics">Tab content for Physics</d2l-tab-panel>
  <d2l-tab-panel text="Math">Tab content for Math</d2l-tab-panel>
  <d2l-tab-panel text="Community">Tab content for Community</d2l-tab-panel>
  <d2l-button-icon slot="ext" icon="tier1:gear" text="Settings"></d2l-button-icon>
</d2l-tabs>
```

<!-- docs: start hidden content -->
### Tab Panel Properties
| Property | Type | Description |
|--|--|--|
| `text` | String, required | The text used for the tab, as well as labelling the panel |
| `no-padding` | Boolean | Used to opt out of default padding/whitespace around the panel |
| `selected` | Boolean | Used to select the tab |

### Events
- `d2l-tab-panel-selected`: dispatched when a tab is selected
<!-- docs: end hidden content -->
