import type { CSSProperties } from 'vue'

// Cast plain style objects to CSSProperties for TypeScript compatibility.
// Without this, properties like `flexDirection: 'column'` are inferred as `string`
// rather than the specific CSS literal type Vue expects.
export function css(s: Record<string, string | number | undefined | null>): CSSProperties {
  return s as CSSProperties
}
