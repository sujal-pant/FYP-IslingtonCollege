import Image from 'next/image';

/**
 * This component is displayed when a search query returns no results.
 */

export const EmptySearch = () => (
  <div className="h-full flex flex-col items-center justify-start text-center space-y-4 pt-16">
    <div className="animate-bounce">
      <Image src="/empty-search.svg" height={140} width={140} alt="No Results Found" />
    </div>

    <h2 className="text-2xl font-semibold text-gray-900">Oops! No Results Found</h2>
    
    <p className="text-gray-600 text-sm max-w-sm">
      Try a different keyword or refine your search.
    </p>
  </div>
);
