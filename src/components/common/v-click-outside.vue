<script lang="ts">
import type { DirectiveBinding } from 'vue'

type ClickOutsideElement = HTMLElement & {
  clickOutsideEvent?: (event: MouseEvent) => void
}

export default {
  mounted(el: ClickOutsideElement, binding: DirectiveBinding<(event: MouseEvent) => void>) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: ClickOutsideElement) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  },
}
</script>
