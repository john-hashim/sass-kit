import { Files, History, LayoutDashboard, Settings } from 'lucide-react'

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

export const FilesIcon: React.FC<NavIconProps> = ({ size = 14 }) => <Files {...iconProps(size)} />

export const ActivityLogIcon: React.FC<NavIconProps> = ({ size = 14 }) => (
  <History {...iconProps(size)} />
)

export const SettingsIcon: React.FC<NavIconProps> = ({ size = 14 }) => (
  <Settings {...iconProps(size)} />
)

export type NavIconComponent = React.FC<NavIconProps>
