export interface NavItem {
  label: string;
  icon: IconType;
  href: string;
  active?: boolean;
}

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  chargePointId: string;
}

export interface StatusCardProps {
  icon: IconType;
  title: string;
  value: string;
  color: string;
}

export interface ConnectorData {
  id: number;
  status: string;
  statusColor: string;
  transaction: string;
  action: string;
}


// From react-icons library
export type IconType = React.ComponentType<IconBaseProps>;

export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  color?: string;
  title?: string;
}