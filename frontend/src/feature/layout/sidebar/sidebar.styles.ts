export const NAV_ICON_SIZE = 16
export const NAV_LABEL_GAP = 8
export const ITEM_GAP = 10
export const TOPBAR_HEIGHT = 56

/** Simple fade/slide used by text labels when the sidebar expands. */
export const expandedTextStyle = (expanded: boolean): React.CSSProperties => ({
  whiteSpace: 'nowrap',
  opacity: expanded ? 1 : 0,
  transform: expanded ? 'translateX(0)' : 'translateX(-10px)',
  transition: 'opacity 160ms ease, transform 160ms ease',
})
