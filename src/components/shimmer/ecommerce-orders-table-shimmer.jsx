'use client';

export function EcommerceOrdersTableShimmer() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((index) => (
        <tr key={index} className="border-b border-border">
          {/* Order ID */}
          <td className="p-4">
            <div className="h-5 w-24 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
          {/* Customer */}
          <td className="p-4">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-teal-400/10 rounded animate-pulse"></div>
              <div className="h-3 w-40 bg-teal-400/10 rounded animate-pulse"></div>
            </div>
          </td>
          {/* Status */}
          <td className="p-4">
            <div className="h-6 w-20 bg-teal-400/10 rounded-full animate-pulse"></div>
          </td>
          {/* Payment */}
          <td className="p-4">
            <div className="h-6 w-16 bg-teal-400/10 rounded-full animate-pulse"></div>
          </td>
          {/* Total */}
          <td className="p-4">
            <div className="h-5 w-20 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
          {/* Date */}
          <td className="p-4">
            <div className="h-5 w-32 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
          {/* Actions */}
          <td className="p-4 text-right">
            <div className="h-8 w-8 bg-teal-400/10 rounded ml-auto animate-pulse"></div>
          </td>
        </tr>
      ))}
    </>
  );
}
