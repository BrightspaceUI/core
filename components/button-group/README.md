# Button Groups

## d2l-button-group

The `d2l-button-group` element can be used to add responsiveness to a set of buttons adding them to an overflow menu instead of pushing them on to the next line.


![Button Group](./screenshots/button-group.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/button-group/button-group.js';
</script>
<d2l-button-group id="min" min-to-show="3">
	<d2l-button>New</d2l-button>
	<d2l-dropdown>
		<d2l-dropdown-button text="Explore Topics" class="d2l-dropdown-opener" ></button>
		<d2l-dropdown-menu id="dropdown" >
			<d2l-menu label="Astronomy">
				<d2l-menu-item text="Introduction"></d2l-menu-item>
				<d2l-menu-item text="Searching for the Heavens "></d2l-menu-item>
				<d2l-menu-item text="The Solar System"></d2l-menu-item>
				<d2l-menu-item text="Stars &amp; Galaxies"></d2l-menu-item>
				<d2l-menu-item text="The Night Sky"></d2l-menu-item>
				<d2l-menu-item text="The Universe"></d2l-menu-item>
			</d2l-menu>
		</d2l-dropdown-menu>
	</d2l-dropdown>
	<d2l-button>Copy</d2l-button>
	<d2l-button>Import</d2l-button>
	<d2l-button>Delete</d2l-button>
	<d2l-link href="http://www.desire2learn.com">D2L</d2l-link>
</d2l-button-group>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `auto-show` | Boolean | Automatically determine the min and maximum number of items to show based on which elements have classes `d2l-button-group-show` and `d2l-button-group-no-show`. Please consult the design team when using this attribute. |
| `min-to-show` | Number | The minimum number of elements to always show. Please consult the design team when using this attribute. |
| `max-to-show` | Number | The maximum number of elements to show |
| `subtle` | Boolean | Styles the dropdown menu in the button-group as a subtle button for action button groups |
| `opener-type` | String | Currently the only option for this is `icon`, which will permanently render the dropdown menu symbol as `...` |

Looking for an enhancement not listed here? Create a GitHub issue!
