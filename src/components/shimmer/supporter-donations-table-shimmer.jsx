'use client';

export function SupporterDonationsTableShimmer() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((index) => (
        <tr key={index} className="border-b border-border">
          {/* SL */}
          <td className="p-4">
            <div className="h-4 w-6 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
          {/* Name */}
          <td className="p-4">
            <div className="h-5 w-32 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
          {/* Email */}
          <td className="p-4">
            <div className="h-5 w-40 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
          {/* Address */}
          <td className="p-4">
            <div className="h-5 w-48 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
          {/* Amount */}
          <td className="p-4">
            <div className="h-5 w-24 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
          {/* Type */}
          <td className="p-4">
            <div className="h-4 w-20 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
          {/* Tier */}
          <td className="p-4">
            <div className="h-4 w-28 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
          {/* Status */}
          <td className="p-4">
            <div className="h-6 w-16 bg-teal-400/10 rounded-full animate-pulse"></div>
          </td>
          {/* Created */}
          <td className="p-4">
            <div className="h-5 w-32 bg-teal-400/10 rounded animate-pulse"></div>
          </td>
        </tr>
      ))}
    </>
  );
}
