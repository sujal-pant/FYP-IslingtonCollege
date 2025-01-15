'use client';

import { LucideIcon } from 'lucide-react';

import { ElementoviewProps } from '@/components/Element-View';
import { Button } from '@/components/ui/button';

interface SelectedButtonsProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void; // Make optional if it might not be passed
  isActive?: boolean;
  isDisabled?: boolean;
}

export const CanvasSelectedButtons = ({
  label,
  icon: Icon,
  onClick, // Default to a no-op
  isActive,
  isDisabled,
}: SelectedButtonsProps) => (
  <ElementoviewProps label={label} side="right" sideOffset={14}>
    <Button
      disabled={isDisabled}
      onClick={onClick}
      size="icon"
      variant={isActive ? 'boardActive' : 'board'}
    >
      <Icon />
    </Button>
  </ElementoviewProps>
);
