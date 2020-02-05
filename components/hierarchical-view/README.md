# Hierarchical View

### HierarchicalViewMixin

This mixin allows for nested views within components. To use, apply the mixin and add the `d2l-hierarchical-view-content` class to the hierarchical content in your component. Apply the hierarchical styles by including `super.styles` in your styles getter.

```js
import { HierarchicalViewMixin } from '@brightspace-ui/core/components/hierarchical-view/hierarchical-view-mixin.js';
class MyComponent extends HierarchicalViewMixin(LitElement) {
  static get styles() {
		return [ super.styles, css`
			:host {
				display: inline-block;
			}
		`];
	}

	render() {
		return html`
			<div class="d2l-hierarchical-view-content">
				<slot></slot>
			</div>
		`;
	}
}
```

**Methods:**

- `show`: to show child, hiding the parent (e.g., `child.show()`)
- `hide`: to hide child, showing the parent (e.g., `child.hide()`)
- `getActiveView`: get the currently active hierarchical view
- `getRootView`: get the root hierarchical view
- `isActive`: whether the specified hierarchical view is the active view
- `resize`: force resize of the hierarchical view (useful if initially not displayed when attached)

**Events:**

- `d2l-hierarchical-view-show-start`: dispatched when child view will be shown (before animation begins)
- `d2l-hierarchical-view-show-complete`: dispatched when child view is shown (when animation ends)
- `d2l-hierarchical-view-hide-start`: dispatched when child view will be hidden (before animation begins)
- `d2l-hierarchical-view-hide-complete`: dispatched when child view is hidden (when animation ends)

## d2l-hierarchical-view

The `d2l-hierarchical-view` component uses the `d2l-hierarchical-view-mixin` for nesting components.
For example:

```html
<script type="module">
  import '@brightspace-ui/core/components/hierarchical-view/hierarchical-view.js';
</script>
<d2l-hierarchical-view id="view1">
  <div style="min-height: 200px;">
    <div class="buttons">
      <button onclick="showSubView('view2a');">view 2a</button>
      <button onclick="showSubView('view2b');">view 2b</button>
    </div>
    view 1
    <div class="info">min-height: 200</div>
    <div>
      <d2l-hierarchical-view id="view2a">
        <div style="min-height: 400px;">
          <div class="buttons">
            <button onclick="showParentView('view2a');">view 1 (parent)</button>
            <button onclick="showSubView('view3');">view 3</button>
          </div>
          view 2a
          <div class="info">min-height: 400</div>
          <d2l-hierarchical-view id="view3">
            <div style="min-height: 300px;">
              <div class="buttons">
                <button onclick="showParentView('view3');">view 2a (parent)</button>
              </div>
              view 3
              <div class="info">min-height: 300</div>
            </div>
          </d2l-hierarchical-view>
        </div>
      </d2l-hierarchical-view>
      <d2l-hierarchical-view id="view2b">
        <div style="min-height: 200px;">
          <div class="buttons">
            <button onclick="showParentView('view2b');">view 1 (parent)</button>
          </div>
          view 2b
          <div class="info">min-height: 200</div>
        </div>
      </d2l-hierarchical-view>
    </div>
  </div>
</d2l-hierarchical-view>
```

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
