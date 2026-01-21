'use client';

export function PollsTableShimmer() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((index) => (
        <tr key={index} className="border-b border-border">
          <td className="p-4">
            <div className="space-y-2">
              <div className="h-5 w-56 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-40 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-32 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </td>
          <td className="p-4">
            <div className="h-5 w-12 bg-gray-700 rounded animate-pulse"></div>
          </td>
          <td className="p-4">
            <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
          </td>
          <td className="p-4">
            <div className="h-5 w-32 bg-gray-700 rounded animate-pulse"></div>
          </td>
          <td className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
