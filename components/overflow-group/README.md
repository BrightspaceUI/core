# Overflow Groups
The `d2l-overflow-group` element can be used to add responsiveness to a set of buttons, links or menus. 

<!-- docs: demo autoSize:false display:block size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/overflow-group/overflow-group.js';
</script>
<d2l-overflow-group>
	<d2l-button>New</d2l-button>
	<d2l-dropdown>
		<d2l-dropdown-button text="Explore Topics" class="d2l-dropdown-opener"></button>
		<d2l-dropdown-menu id="dropdown" >
			<d2l-menu label="Astronomy">
				<d2l-menu-item text="Introduction"></d2l-menu-item>
				<d2l-menu-item text="Searching for the Heavens"></d2l-menu-item>
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
</d2l-overflow-group>
```

## Overflow Group [d2l-overflow-group]
Items added to this container element will no longer wrap onto a second line when the container becomes too small, but will be added to a dropdown menu with configurable styling.

<!-- docs: start hidden content -->
![Overflow Group](./screenshots/overflow-group.png?raw=true)
<!-- docs: end hidden content -->

<!-- docs: demo live name:d2l-overflow-group autoSize:false display:block size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/overflow-group/overflow-group.js';
</script>
<d2l-overflow-group max-to-show="3">
	<d2l-button>New</d2l-button>
	<d2l-dropdown>
		<d2l-dropdown-button text="Explore Topics" class="d2l-dropdown-opener"></button>
		<d2l-dropdown-menu id="dropdown" >
			<d2l-menu label="Astronomy">
				<d2l-menu-item text="Introduction"></d2l-menu-item>
				<d2l-menu-item text="Searching for the Heavens"></d2l-menu-item>
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
</d2l-overflow-group>
```

<!-- docs: start hidden content -->
### Properties:

| Property | Type | Description |
|--|--|--|
| `auto-show` | Boolean | Automatically determine the min and maximum number of items to show based on which elements have classes `d2l-button-group-show` and `d2l-button-group-no-show`. Please consult the design team when using this attribute. |
| `min-to-show` | Number | The minimum number of elements to always show. Please consult the design team when using this attribute. |
| `max-to-show` | Number | The maximum number of elements to show |
| `opener-style` | String | Set the style of the oferflow menu `default` renders a `d2l-button` while `subtle` will render a `d2l-button-subtle`|
| `opener-type` | String | Set the opener type to `default` or `icon`, which will permanently render the dropdown menu symbol as `...` |

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->
