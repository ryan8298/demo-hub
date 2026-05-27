import { HubNav, HubFooter, DemoGridSkeleton } from '@/components/HubShared';

/**
 * Skeleton shown while the Server Component refetches at the next
 * revalidation. Mirrors the real layout so there's zero layout shift
 * when the data arrives.
 */
export default function CustomerHubLoading() {
  return (
    <div className="min-h-screen text-milk">
      <HubNav label="Demo Hub" />
      <header className="bg-wave relative pt-44 pb-20 border-b hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10 animate-pulse">
          <div className="h-3 w-40 rounded-full bg-milk/10 mb-6" />
          <div className="h-16 md:h-20 w-3/4 rounded bg-milk/15 mb-4" />
          <div className="h-12 md:h-16 w-1/2 rounded bg-milk/15 mb-6" />
          <div className="h-4 w-full max-w-xl rounded bg-milk/10" />
          <div className="h-4 w-full max-w-md mt-2 rounded bg-milk/10" />
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-12 md:py-16">
        <DemoGridSkeleton />
      </main>
      <HubFooter />
    </div>
  );
}
