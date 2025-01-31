import { ElementoviewProps } from '@/components/Element-View'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Defining the props for the UserAvatar component.
interface UserAvatarProps {
  src?: string  
  userName?: string 
  fallback?: string  
  borderColor?: string  
}

// UserAvatar component renders an avatar with optional fallback and custom border color.
export const UserAvatar = ({
  src,        
  userName,   
  fallback,   
  borderColor, 
}: UserAvatarProps) => (
  // Wrapping the Avatar in an ElementoviewProps component with a label for better accessibility.
  <ElementoviewProps label={userName || 'Teammate'} side="bottom" sideOffset={18}>
    <Avatar className="h-8 w-8 border-2" style={{ borderColor }}> 
      <AvatarImage src={src} /> 
      <AvatarFallback className="text-xs font-semibold">
        {fallback}  
      </AvatarFallback>
    </Avatar>
  </ElementoviewProps>
)
