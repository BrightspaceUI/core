# View Switcher
A segmented component to switch between views. Use a view switcher to change between the presentation of a single set of information. It is not recommended to use the switcher to change the information being presented.

## View Switcher [d2l-view-switcher]

<!-- docs: demo code properties name:d2l-view-switcher sandboxTitle:'View Switcher' autoSize:false  -->
```html
<script type="module">
  import '@brightspace-ui/core/components/view-switcher/view-switcher.js';
  import '@brightspace-ui/core/components/view-switcher/view-switcher-button.js';
</script>

<d2l-view-switcher label="Layout Options">
	<d2l-view-switcher-button key="list" text="List"></d2l-view-switcher-button>
	<d2l-view-switcher-button selected key="tiles" text="Tiles"></d2l-view-switcher-button>
	<d2l-view-switcher-button key="table" text="Table"></d2l-view-switcher-button>
</d2l-view-switcher>
```
<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `label` | String, required | Sets an accessible label for the switcher. |
<!-- docs: end hidden content -->

## View Switcher Button [d2l-view-switcher-button]

<!-- docs: demo code properties name:d2l-view-switcher-button autoSize:false -->
```html
<script type="module">
  import '@brightspace-ui/core/components/view-switcher/view-switcher.js';
  import '@brightspace-ui/core/components/view-switcher/view-switcher-button.js';
</script>

<d2l-view-switcher label="Layout Options">
	<d2l-view-switcher-button key="list" text="List"></d2l-view-switcher-button>
	<d2l-view-switcher-button selected key="tiles" text="Tiles"></d2l-view-switcher-button>
</d2l-view-switcher>
```

<!-- docs: start hidden content -->
### Properties
| Property | Type | Description |
|---|---|---|
|`key` | String, required | Key for the button. |
|`text`| String, required  | Text for the button. |
|`selected`| Boolean, default: `false` | Indicates if the item is selected. |

### Events
* `d2l-view-switcher-select`: Dispatched when the item is selected
<!-- docs: end hidden content -->
