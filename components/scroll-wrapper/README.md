# Scroll Containers
Scroll containers can be used to control how content acts when overflowing its container.

## Horizontal Scroll Wrapper [d2l-scroll-wrapper]

The `d2l-scroll-wrapper` element can be used to wrap content which may overflow its horizontal boundaries, providing left/right scroll buttons.

<!-- docs: demo code properties name:d2l-scroll-wrapper -->
```html
<script type="module">
  import '@brightspace-ui/core/components/scroll-wrapper/scroll-wrapper.js';
</script>
<!-- docs: start hidden content -->
<style>
	div {
		max-width: 100%;
	}
	p {
		user-select: none;
		white-space: nowrap;
	}
</style>
<!-- docs: end hidden content -->
<div>
	<d2l-scroll-wrapper>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci repellat cum totam! Enim, sunt. Numquam voluptate, velit quisquam ipsa molestias laudantium odit reiciendis nisi corporis voluptatibus, voluptatum sunt natus, accusantium magnam consequatur fugit officiis minima voluptatem consequuntur nam, earum necessitatibus! Cupiditate ullam repellendus, eius iure voluptas at commodi consectetur, quia, adipisci possimus, ex mollitia. Labore harum error consectetur officiis aut optio, temporibus iste nobis ducimus cumque laudantium rem pariatur. Ut repudiandae id, consequuntur quasi quis pariatur autem corporis perferendis facilis eius similique voluptatibus iusto deleniti odio officia numquam tenetur excepturi, aspernatur sunt minima aut fugiat ipsam.</p>
	</d2l-scroll-wrapper>
</div>
```

<!-- docs: start hidden content -->
### Properties
| Property | Type | Description |
|---|---|---|
| `hide-actions` | Boolean, default: `false` | Whether to hide left/right scroll buttons |

### Variables

| Variable | Type | Description |
|---|---|---|
| `--d2l-scroll-wrapper-overflow-y` | [Any valid overflow-y setting](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-y), defaults to `visible` | Set the `overflow-y` property of the inner scroll wrapper |

<!-- docs: end hidden content -->
