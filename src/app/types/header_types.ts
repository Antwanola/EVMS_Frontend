import { ChargePoint } from "./ocpp";

export interface NavItem {
  label: string;
  icon: IconType;
  href: string;
  active?: boolean;
  children?: string[] 
}

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  chargePoint: ChargePoint | null;
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