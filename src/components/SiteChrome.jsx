import { useState } from "react";
import { destinations } from "../data/portfolio";

export function SiteChrome({ activeId, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = destinations.find((destination) => destination.id === activeId) || destinations[0];
  const navigate = (id) => {
    setMenuOpen(false);
    onNavigate(id);
  };
  return (
    <>
      <header className="topbar">
        <a className="brand" href="#arrival" onClick={(event) => { event.preventDefault(); navigate("arrival"); }}>
          <span className="brand-mark">UC</span>
          <span className="brand-name">UTKARSH CHADHA<sup>®</sup></span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="destination-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{active.short}</span><span aria-hidden="true">{menuOpen ? "×" : "＋"}</span>
        </button>
        <nav className={`destination-menu${menuOpen ? " destination-menu--open" : ""}`} id="destination-menu" aria-label="Portfolio destinations">
          {destinations.map((destination) => (
            <button
              type="button"
              key={destination.id}
              className={destination.id === activeId ? "is-active" : ""}
              aria-current={destination.id === activeId ? "location" : undefined}
              onClick={() => navigate(destination.id)}
            >
              <span>{destination.number}</span>{destination.short}
            </button>
          ))}
        </nav>
        <a className="connect-link" href="mailto:chadhautkarsh06@gmail.com">Let’s connect <span aria-hidden="true">↗</span></a>
      </header>
      <div className="scene-label" aria-live="polite">
        <span className="scene-label__number">{active.number}</span>
        <span>{active.name.toUpperCase()}</span>
      </div>
      <div className="city-instruction"><span className="instruction-dot" /> SELECT A LIT BUILDING TO EXPLORE</div>
    </>
  );
}
