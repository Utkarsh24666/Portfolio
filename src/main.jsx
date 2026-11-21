import { StrictMode, lazy, Suspense, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DestinationContent, ProjectDetails } from "./components/ExperienceSections";
import { SiteChrome } from "./components/SiteChrome";
import { destinations } from "./data/portfolio";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const CityCanvas = lazy(() =>
  import("./components/CityCanvas").then((module) => ({ default: module.CityCanvas })),
);

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function App() {
  const [activeId, setActiveId] = useState("arrival");
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useCallback((id) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({
      behavior: getReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  useEffect(() => {
    const panels = destinations
      .map((destination) => document.getElementById(destination.id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { threshold: [0.25, 0.45, 0.65] },
    );
    panels.forEach((panel) => observer.observe(panel));

    const initialHash = window.location.hash.slice(1);
    if (destinations.some((destination) => destination.id === initialHash)) {
      requestAnimationFrame(() => document.getElementById(initialHash)?.scrollIntoView());
      setActiveId(initialHash);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (getReducedMotion()) return undefined;
    const context = gsap.context(() => {
      gsap.utils.toArray(".section-heading, .timeline-item, .skill-panel, .certificate-row, .contact-panel").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 22, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });
    });
    return () => context.revert();
  }, []);

  return (
    <div className="portfolio-app">
      <Suspense fallback={<div className="scene-fallback" role="status"><span className="scene-fallback__grid" /><p>BUILDING THE CITY</p></div>}>
        <CityCanvas activeId={activeId} onSelect={navigate} />
      </Suspense>
      <div className="atmosphere-grain" aria-hidden="true" />
      <SiteChrome activeId={activeId} onNavigate={navigate} />
      <main className="experience">
        {destinations.map((destination) => (
          <section
            className={`destination destination--${destination.id}`}
            id={destination.id}
            key={destination.id}
            aria-label={destination.name}
          >
            <div className="destination__veil" />
            <DestinationContent
              id={destination.id}
              onNavigate={navigate}
              onOpenProject={setSelectedProject}
            />
          </section>
        ))}
      </main>
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetails project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
