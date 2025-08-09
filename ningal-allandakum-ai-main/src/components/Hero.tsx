import heroBg from "@/assets/hero-choco-bg.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPos({ x, y });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <header className="relative w-full">
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border bg-card/60 backdrop-blur",
          "shadow-[var(--shadow-elegant)]"
        )}
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-label="Chocolate themed hero background"
      >
        {/* Ambient glow following cursor (signature moment) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, hsl(var(--accent) / 0.12), transparent 50%)`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Vishanal Mood Detector — Hungry Angry AI Roast
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            "Visham aanal… ningal ningal allandakum!" Use your webcam or a selfie
            and get roasted in Malayalam with a chocolatey reminder.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a href="#detector">
              <Button variant="hero" size="lg" aria-label="Start the roast">
                Start the roast
              </Button>
            </a>
            <a href="#how-it-works" className="hidden sm:block">
              <Button variant="choco" size="lg" aria-label="How it works">
                How it works
              </Button>
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground/80">
            Camera stays on-device. No uploads. Pure roast.
          </p>
        </div>
        {/* Visually hidden image for SEO */}
        <img src={heroBg} alt="Playful chocolate and caramel abstract background" className="sr-only" />
      </section>
    </header>
  );
};

export default Hero;
