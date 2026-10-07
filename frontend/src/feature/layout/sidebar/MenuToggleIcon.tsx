/** Hamburger that morphs smoothly into an X. */
export const MenuToggleIcon: React.FC<{ open: boolean }> = ({ open }) => {
  const bar: React.CSSProperties = {
    position: 'absolute',
    left: 3,
    right: 3,
    height: 1.5,
    borderRadius: 2,
    backgroundColor: 'currentColor',
    transition: 'transform 200ms ease-in-out, opacity 150ms ease',
  }
  return (
    <span style={{ position: 'relative', display: 'block', width: 22, height: 22 }}>
      <span
        style={{
          ...bar,
          top: 6,
          transform: open ? 'translateY(5px) rotate(45deg)' : 'none',
        }}
      />
      <span
        style={{
          ...bar,
          top: 11,
          opacity: open ? 0 : 1,
          transform: open ? 'scaleX(0.4)' : 'none',
        }}
      />
      <span
        style={{
          ...bar,
          top: 16,
          transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none',
        }}
      />
    </span>
  )
}
