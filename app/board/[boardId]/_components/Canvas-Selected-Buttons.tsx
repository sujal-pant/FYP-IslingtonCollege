'use client';

import { LucideIcon } from 'lucide-react';
import { ElementoviewProps } from '@/components/Element-View';
import { Button } from '@/components/ui/button';


/*
The CanvasSelectedButtons component renders a button with an icon and a label, 
where the button's style changes based on its isActive and isDisabled states.
If the onClick function is provided,  it triggers on button click. The ElementoviewProps component 
is used to display the label next to the button, with dynamic styling for active and disabled states
*/

// Defining the interface for the props to the CanvasSelectedButtons component
interface SelectedButtonsProps {
  Elementlabel: string;
  Elementicon: LucideIcon;
  onClick?: () => void; 
  isActive?: boolean;
  isDisabled?: boolean;
}

export const CanvasSelectedButtons = ({
  Elementlabel,
  Elementicon: Icon,
  onClick, 
  isActive,
  isDisabled,
}: SelectedButtonsProps) => (
    // Wrapping the button with the ElementoviewProps component to provide a label
  <ElementoviewProps label={Elementlabel} side="right" sideOffset={16}>
    <Button
      disabled={isDisabled}
      onClick={onClick}
      size="icon"
      variant={isActive ? 'ActiveBoard' : 'NotActiveBoard'}
    >
      <Icon />
    </Button>
  </ElementoviewProps>
);
