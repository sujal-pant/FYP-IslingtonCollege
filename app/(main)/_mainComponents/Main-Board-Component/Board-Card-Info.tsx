import { Star } from 'lucide-react' // Importing the Star icon from the lucide-react library
import { cn } from '@/lib/utils' // Importing the utility function `cn` (likely used for conditionally applying class names)

interface BoardCardInfoProps { // Defining the interface for the props the component will receive
  title: string // Title of the board card
  authorLabel: string // Label for the author of the card
  createdAtLabel: string // Label for the creation date of the card
  isFavorite: boolean // Whether the card is marked as a favorite
  onClick: () => void // Function to be called when the star button is clicked
  disabled: boolean // Whether the button should be disabled
}

export const BoardCardInfo = ({
  title,
  authorLabel,
  createdAtLabel,
  isFavorite,
  onClick,
  disabled,
}: BoardCardInfoProps) => {
  
  // Event handler for the button click, preventing propagation and calling the onClick function passed from the parent
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation() // Prevents the event from bubbling up to parent elements
    event.preventDefault() // Prevents the default button behavior
    onClick() // Calls the onClick function passed from the parent
  }

  return (
    <div className="relative bg-white p-3"> {/* Container div with relative positioning, white background, and padding */}
      
      {/* Title of the board card, truncated if too long, with a font size of 13px */}
      <p className="text-[13px] truncate max-w-[calc(100%-20px)]">{title}</p> 

      {/* Author and creation date, hidden by default, visible on hover (group-hover behavior) */}
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
        {authorLabel}, {createdAtLabel}
      </p>

      {/* Button for marking the card as favorite */}
      <button
        disabled={disabled} // Disable the button if the disabled prop is true
        onClick={handleClick} // Handle the button click event
        className={cn(
          // Apply conditional styles for the button, change opacity on hover
          'opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-amber',
          disabled && 'cursor-not-allowed opacity-75' // If disabled, change cursor and opacity
        )}
      >
        {/* Star icon, its color changes if the card is marked as favorite */}
        <Star
          className={cn('h-4 w-4', isFavorite && 'fill-blue-600 text-blue-600')}
        />
      </button>
    </div>
  )
}
