# Object Property List

Object property lists are simple dot-separated lists of text, displayed sequentially on a single line. They are used to convey additional information or metadata about an object.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/object-property-list/object-property-list.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item-link.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item-tooltip-help.js';
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>

<d2l-object-property-list>
  <d2l-status-indicator slot="status" state="default" text="Status"></d2l-status-indicator>
  <d2l-object-property-list-item text="Example item"></d2l-object-property-list-item>
  <d2l-object-property-list-item text="Example item with icon" icon="tier1:grade"></d2l-object-property-list-item>
  <d2l-object-property-list-item-link text="Example link" href="https://www.d2l.com/"></d2l-object-property-list-item-link>
  <d2l-object-property-list-item-link text="Example link with icon" href="https://www.d2l.com/" icon="tier1:alert"></d2l-object-property-list-item-link>
  <d2l-object-property-list-item-tooltip-help text="Example tooltip help with icon" icon="tier1:grade">
    These are extra details
  </d2l-object-property-list-item-tooltip-help>
</d2l-object-property-list>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use object property lists to represent properties and/or metadata related to an object
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use this pattern to display more than 3-4 items
* Don't put unsupported elements inside an object property list
<!-- docs: end donts -->
<!-- docs: end best practices -->

## List [d2l-object-property-list]

An object property list can be defined using `d2l-object-property-list` and a combination of items (e.g., `d2l-object-property-list-item`, `d2l-object-property-list-item-link`).

<!-- docs: demo code properties name:d2l-object-property-list sandboxTitle:'Object Property List' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/object-property-list/object-property-list.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item-link.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item-tooltip-help.js';
</script>

<d2l-object-property-list>
  <d2l-object-property-list-item text="Example item"></d2l-object-property-list-item>
  <d2l-object-property-list-item-link text="Example link" href="https://www.d2l.com/"></d2l-object-property-list-item-link>
  <d2l-object-property-list-item-tooltip-help text="Example link">
    These are extra details
  </d2l-object-property-list-item-tooltip-help>
</d2l-object-property-list>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `skeleton-count` | Number | Number of skeleton items to insert if in skeleton mode |
<!-- docs: end hidden content -->

### Word wrap

The object property list is designed to wrap in an inline manner if the items are wider than the container.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/object-property-list/object-property-list.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item.js';
</script>

<d2l-object-property-list>
  <d2l-object-property-list-item icon="tier1:grade" text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci repellat cum totam! Enim, sunt."></d2l-object-property-list-item>
  <d2l-object-property-list-item icon="tier1:alert" text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci repellat cum totam! Enim, sunt."></d2l-object-property-list-item>
</d2l-object-property-list>
```

## Text Item [d2l-object-property-list-item]

The `d2l-object-property-list-item` component is the basic type of item for an object property list, displaying text and an optional leading icon.

<!-- docs: demo code properties name:d2l-object-property-list-item sandboxTitle:'Object Property List Item' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/object-property-list/object-property-list.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item.js';
</script>

<d2l-object-property-list>
  <d2l-object-property-list-item text="Example item"></d2l-object-property-list-item>
  <d2l-object-property-list-item text="Example item with icon" icon="tier1:grade"></d2l-object-property-list-item>
</d2l-object-property-list>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text displayed by the item |
| `icon` | String | [Preset icon key](../icons#preset-icons) (e.g. `tier1:gear`) |
<!-- docs: end hidden content -->

## Link Item [d2l-object-property-list-item-link]

The `d2l-object-property-list-item-link` component is a link item for the object property list. It displays text as a hyperlink, with an optional leading icon.

<!-- docs: demo code properties name:d2l-object-property-list-item-link sandboxTitle:'Object Property List Link Item' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/object-property-list/object-property-list.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item-link.js';
</script>

<d2l-object-property-list>
  <d2l-object-property-list-item-link text="Example link" href="https://www.d2l.com/"></d2l-object-property-list-item-link>
  <d2l-object-property-list-item-link text="Example link with icon" href="https://www.d2l.com/" icon="tier1:alert"></d2l-object-property-list-item-link>
</d2l-object-property-list>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text displayed by the item |
| `icon` | String | [Preset icon key](../icons#preset-icons) (e.g. `tier1:gear`) |
| `download` | Boolean | Download a URL instead of navigating to it |
| `href` | String, required | The URL the item link navigates to |
| `target` | String | Where to display the linked URL |
<!-- docs: end hidden content -->

## Help Tooltip Item [d2l-object-property-list-item-tooltip-help]

The `d2l-object-property-list-item-tooltip-help` component is an item for the object property list which is used to also display additional information for users. It displays text as a help tooltip, with an optional leading icon.

<!-- docs: demo code properties name:d2l-object-property-list-item-tooltip-help sandboxTitle:'Object Property List Help Tooltip Item' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/object-property-list/object-property-list.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item-tooltip-help.js';
</script>

<d2l-object-property-list>
  <d2l-object-property-list-item-tooltip-help text="Example item">
	These are extra details
  </d2l-object-property-list-item-tooltip-help>
  <d2l-object-property-list-item-tooltip-help text="Example item with icon" icon="tier1:grade">
	These are extra details
  </d2l-object-property-list-item-tooltip-help>
  <d2l-object-property-list-item-tooltip-help text="Example item with custom icon">
	These are extra details
	<d2l-icon-custom slot="icon">
		<svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
		<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
		<path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
		</svg>
	</d2l-icon-custom>
  </d2l-object-property-list-item-tooltip-help>
</d2l-object-property-list>
```

<!-- docs: start hidden content -->
### Slots

| Slot | Type | Description |
|--|--|--|
| `default` | required | Default content placed inside of the tooltip |
| `icon` | optional | Optional slot for a custom icon |

### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text displayed by the item |
| `icon` | String | [Preset icon key](../icons#preset-icons) (e.g. `tier1:gear`) |
<!-- docs: end hidden content -->

## Status Slot

Object property lists can optionally contain a single `d2l-status-indicator` inserted into the `status` slot.

<!-- docs: demo code properties name:d2l-status-indicator sandboxTitle:'Status Indicator' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/object-property-list/object-property-list.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item.js';
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>

<d2l-object-property-list>
  <d2l-status-indicator slot="status" state="default" text="Status"></d2l-status-indicator>
  <d2l-object-property-list-item text="Example item"></d2l-object-property-list-item>
  <d2l-object-property-list-item text="Example item with icon" icon="tier1:grade"></d2l-object-property-list-item>
</d2l-object-property-list>
```

<!-- docs: start hidden content -->
## Future Improvements

* add more types of items (specifically, a `tooltip-help` item)

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->
