import { LayoutDashboard } from 'lucide-react'

export interface NavIconProps {
  size?: number
}

const STROKE_WIDTH = 1.5

const iconProps = (size: number) => ({
  'aria-hidden': true,
  focusable: false,
  size,
  strokeWidth: STROKE_WIDTH,
  style: { flexShrink: 0 },
})

export const DashboardIcon: React.FC<NavIconProps> = ({ size = 14 }) => (
  <LayoutDashboard {...iconProps(size)} />
)

export type NavIconComponent = React.FC<NavIconProps>
