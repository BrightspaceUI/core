# Tabs

## d2l-tabs

The `d2l-tabs` element is a web component for tabbed content. It provides the `d2l-tab-panel` component for the content, renders tabs responsively, and provides virtual scrolling for large tab lists.

![Tabs](./screenshots/tabs.png?raw=true)

```html
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

**Tabs Properties:**

| Property | Type | Description |
|--|--|--|
| `max-to-show` | Number | Used to limit the max-width/number of tabs to initially display |

**Tab Panel Properties:**

| Property | Type | Description |
|--|--|--|
| `text` | String, required | The text used for the tab, as well as labelling the panel |
| `no-padding` | Boolean | Used to opt out of default padding/whitespace around the panel |
| `selected` | Boolean | Used to select the tab |

**Events:**

- `d2l-tab-panel-selected`: dispatched when a tab is selected

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
