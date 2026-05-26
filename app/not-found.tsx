import { EchelixLogo } from '@/components/HubShared';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-milk flex flex-col">
      <nav className="border-b hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-5 flex items-center">
          <a href="/" className="flex items-center gap-3">
            <EchelixLogo className="h-7 md:h-8 w-auto" />
          </a>
        </div>
      </nav>
      <main className="flex-1 flex items-center justify-center px-6 bg-wave relative">
        <div className="relative max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-sage mb-4">
            404 — Not Found
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-milk leading-tight mb-4">
            Off the beaten <em className="text-sea-foam not-italic">path</em>.
          </h1>
          <p className="text-sm text-grey-400 mb-8">
            We couldn&apos;t find what you were looking for. It may have moved
            or never existed.
          </p>
          <a href="/" className="btn-pill">
            Return home
          </a>
        </div>
      </main>
    </div>
  );
}
