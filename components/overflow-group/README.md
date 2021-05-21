# Overflow Groups

The `d2l-overflow-group` element can be used to add responsiveness to a set of buttons, links or menus. Items added to this container element will no longer wrap onto a second line when the container becomes to small but will be added too a dropdown menu with configurable styling.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/overflow-group/overflow-group.js';
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/dropdown/dropdown.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-button.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item.js';
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
