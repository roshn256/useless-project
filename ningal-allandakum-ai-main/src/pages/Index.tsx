import Hero from "@/components/Hero";
import HungryDetector from "@/components/HungryDetector";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Vishanal Mood Detector",
    description: "AI detects your 'visham' (hungry-angry) mood and roasts you in Malayalam with a chocolatey reminder.",
    applicationCategory: "EntertainmentApplication",
    inLanguage: "en",
    url: "/",
  };

  return (
    <>
      <main>
        <Hero />
        <section id="how-it-works" className="mx-auto mt-16 max-w-4xl px-6">
          <h2 className="text-2xl font-bold">How it works</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <article className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="font-semibold">1) Upload or Webcam</h3>
              <p className="mt-1 text-sm text-muted-foreground">Use your webcam or a selfie to begin.</p>
            </article>
            <article className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="font-semibold">2) On-device Analysis</h3>
              <p className="mt-1 text-sm text-muted-foreground">We crunch pixels locally to estimate your Hungry–Angry score.</p>
            </article>
            <article className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="font-semibold">3) Malayalam Roast</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get a spicy quote and a chocolatey nudge. Laugh responsibly.</p>
            </article>
          </div>
        </section>
        <HungryDetector />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
};

export default Index;
