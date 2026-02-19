'use client';

export function EcommerceCustomersTableShimmer() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((index) => (
        <tr key={index} className="border-b border-border">
          {/* Name */}
          <td className="p-4">
            <div className="h-5 w-32 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
          {/* Contact */}
          <td className="p-4">
            <div className="space-y-2">
              <div className="h-4 w-40 bg-teal-400/10 rounded animate-pulse"></div>
              <div className="h-3 w-32 bg-teal-400/10 rounded animate-pulse"></div>
            </div>
          </td>
          {/* Location */}
          <td className="p-4">
            <div className="space-y-2">
              <div className="h-4 w-36 bg-teal-400/10 rounded animate-pulse"></div>
              <div className="h-3 w-24 bg-teal-400/10 rounded animate-pulse"></div>
            </div>
          </td>
          {/* Joined */}
          <td className="p-4">
            <div className="h-5 w-28 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
          {/* Actions */}
          <td className="p-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <div className="h-8 w-8 bg-teal-400/10 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-teal-400/10 rounded animate-pulse"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
