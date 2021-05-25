# Tabs

Tabs are used to present related information in mutually exclusive panels, allowing users to view just one panel at a time.

```html
<!-- docs: demo -->
<script type="module">
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
</script>

<d2l-tabs max-to-show="3">
  <d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
  <d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
  <d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
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

## Tabs Component

The `d2l-tabs` element is a web component for tabbed content. It provides the `d2l-tab-panel` component for the content, renders tabs responsively, and provides virtual scrolling for large tab lists.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
</script>

<d2l-tabs max-to-show="3">
  <d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
  <d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
  <d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
  <d2l-tab-panel text="Earth Sciences">Tab content for Earth Sciences</d2l-tab-panel>
  <d2l-tab-panel text="Physics">Tab content for Physics</d2l-tab-panel>
  <d2l-tab-panel text="Math">Tab content for Math</d2l-tab-panel>
  <d2l-tab-panel text="Community">Tab content for Community</d2l-tab-panel>
</d2l-tabs>
```

## Tab Panel

The `d2l-tab-panel` component is used to contain the tab content.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
</script>

<d2l-tabs>
  <d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
</d2l-tabs>
```
