/**
 * Global loading UI — shown during initial route-segment data fetches.
 * Kept minimal so it doesn't compete with route-specific loading UIs.
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="spinner mx-auto" />
        <p className="mt-4 text-grey-400 text-xs uppercase tracking-[0.25em]">
          Loading
        </p>
      </div>
    </div>
  );
}
