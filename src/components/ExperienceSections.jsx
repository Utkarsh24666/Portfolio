import { motion } from "framer-motion";
import { certificates, contact, education, experiences, projects, publicAsset, skillGroups } from "../data/portfolio";

const sectionCopy = {
  finance: {
    eyebrow: "01 / THE FINANCIAL DISTRICT",
    title: <>Capital, context<br /><em>&amp; clarity.</em></>,
    intro: "An interest in how markets move, how businesses operate, and how financial information can support better decisions.",
  },
  data: {
    eyebrow: "02 / THE DATA LAB",
    title: <>Find the signal<br /><em>in the noise.</em></>,
    intro: "Dashboards, structured research, and workflow experiments that turn information into something easier to explore.",
  },
  strategy: {
    eyebrow: "03 / THE STRATEGY BOARDROOM",
    title: <>Research with<br /><em>a point of view.</em></>,
    intro: "Business projects and comparative research shaped by curiosity, clear presentation, and practical problem-solving.",
  },
  creative: {
    eyebrow: "04 / THE CREATIVE STUDIO",
    title: <>Make it useful.<br /><em>Make it matter.</em></>,
    intro: "Creative thinking across brand building, digital experiences, design tools, and a handmade business venture.",
  },
  journey: {
    eyebrow: "05 / THE JOURNEY",
    title: <>Learning by<br /><em>doing.</em></>,
    intro: "A foundation in commerce, practical experience with financial records and audit support, and an MBA focused on finance and business analytics.",
  },
  archive: {
    eyebrow: "06 / THE ARCHIVE",
    title: <>A toolkit for<br /><em>what’s next.</em></>,
    intro: "A mix of analytical, finance, communication, and creative tools—selected to move from raw information to clear outcomes.",
  },
};

function ProjectCard({ project, onOpen }) {
  return (
    <article className="project-card">
      <div className={`project-card__art project-card__art--${project.number}`}>
        <span className="project-card__index">{project.number}</span>
        <span className="project-card__rule" />
        <span className="project-card__category">{project.category}</span>
        <div className="project-card__bars" aria-hidden="true">
          {[36, 54, 42, 67, 58, 84, 73].map((height, index) => (
            <i key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
      <div className="project-card__body">
        <p className="eyebrow">{project.category}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-list">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="project-card__actions">
          <button type="button" className="text-link" onClick={() => onOpen(project)}>
            Project notes <span aria-hidden="true">↗</span>
          </button>
          {project.externalUrl && (
            <a className="text-link" href={project.externalUrl} target="_blank" rel="noreferrer">
              {project.linkLabel} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ProjectModal({ project, onClose }) {
  if (!project) return null;
  return (
    <motion.div
      className="modal-backdrop"
      role="presentation"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close project details">×</button>
        <p className="eyebrow">{project.number} / {project.category}</p>
        <h2 id="modal-title">{project.title}</h2>
        <p>{project.description}</p>
        <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        {project.externalUrl && (
          <a className="gold-button" href={project.externalUrl} target="_blank" rel="noreferrer">
            {project.linkLabel} <span aria-hidden="true">↗</span>
          </a>
        )}
      </motion.section>
    </motion.div>
  );
}

export function ProjectDetails({ project, onClose }) {
  return <ProjectModal project={project} onClose={onClose} />;
}

function WorkSection({ id, onOpen }) {
  const copy = sectionCopy[id];
  const collection = projects.filter((project) => project.destination === id);
  return (
    <div className="destination-layout destination-layout--work">
      <div className="section-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 className="display-title">{copy.title}</h2>
        <p className="section-intro">{copy.intro}</p>
      </div>
      <div className="project-grid">
        {collection.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}
      </div>
      {id === "finance" && <p className="section-note">Finance and market-analysis work includes academic and portfolio research.</p>}
      {id === "data" && <p className="section-note">Some projects are academic or portfolio demonstrations. Ask me for details, methods, or supporting material.</p>}
    </div>
  );
}

function JourneySection() {
  return (
    <div className="destination-layout destination-layout--journey">
      <div className="section-heading">
        <p className="eyebrow">{sectionCopy.journey.eyebrow}</p>
        <h2 className="display-title">{sectionCopy.journey.title}</h2>
        <p className="section-intro">{sectionCopy.journey.intro}</p>
      </div>
      <div className="timeline">
        {experiences.map((item) => (
          <article className="timeline-item" key={item.role}>
            <p className="eyebrow">{item.date}</p>
            <div><h3>{item.role}</h3><p className="timeline-item__company">{item.company}</p><p>{item.detail}</p></div>
          </article>
        ))}
      </div>
      <div className="education-block">
        <p className="eyebrow">EDUCATION</p>
        {education.map((item) => (
          <article className="education-item" key={item.name}>
            <span>{item.date}</span><div><h3>{item.name}</h3><p>{item.institution}</p></div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ArchiveSection() {
  return (
    <div className="destination-layout destination-layout--archive">
      <div className="section-heading">
        <p className="eyebrow">{sectionCopy.archive.eyebrow}</p>
        <h2 className="display-title">{sectionCopy.archive.title}</h2>
        <p className="section-intro">{sectionCopy.archive.intro}</p>
      </div>
      <div className="skills-grid">
        {skillGroups.map((group) => (
          <article className="glass-panel skill-panel" key={group.title}>
            <p className="eyebrow">CAPABILITY</p><h3>{group.title}</h3>
            <div className="tag-list">{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          </article>
        ))}
      </div>
      <div className="certificate-list">
        <div className="certificate-list__heading"><p className="eyebrow">CONTINUOUS LEARNING</p><h3>Certificates &amp; short courses</h3></div>
        {certificates.map((certificate, index) => (
          <a className="certificate-row" href={publicAsset(`assets/${certificate.file}`)} target="_blank" rel="noreferrer" key={certificate.file}>
            <span className="certificate-row__number">{String(index + 1).padStart(2, "0")}</span>
            <span className="certificate-row__name"><strong>{certificate.name}</strong><small>{certificate.detail}</small></span>
            <span className="certificate-row__open">View ↗</span>
          </a>
        ))}
        <p className="section-note">Short-course certificates are listed as courses, not as formal academic degrees.</p>
      </div>
    </div>
  );
}

function ConnectionSection() {
  return (
    <div className="destination-layout destination-layout--connection">
      <div className="connection-copy">
        <p className="eyebrow">07 / THE CONNECTION</p>
        <h2 className="display-title">Let’s make<br /><em>something matter.</em></h2>
        <p className="section-intro">For opportunities, collaborations, project discussions, or simply a thoughtful conversation—I’d be happy to connect.</p>
      </div>
      <div className="contact-panel glass-panel">
        <p className="eyebrow">REACH OUT</p>
        <a href={`mailto:${contact.email}`}><span>Email</span><strong>{contact.email} ↗</strong></a>
        <a href={`tel:${contact.phoneLink}`}><span>Phone</span><strong>{contact.phone} ↗</strong></a>
        <a href={contact.linkedIn} target="_blank" rel="noreferrer"><span>LinkedIn</span><strong>Connect ↗</strong></a>
        <a href={contact.resume} target="_blank" rel="noreferrer"><span>Résumé</span><strong>Open PDF ↗</strong></a>
        <a href={contact.resume} download><span>Download</span><strong>Résumé PDF ↓</strong></a>
      </div>
      <footer className="site-footer">
        <span>© 2026 UTKARSH CHADHA</span><span>DESIGNED WITH CURIOSITY · BUILT TO EXPLORE</span><span>PUNE, INDIA</span>
      </footer>
    </div>
  );
}

function ArrivalSection({ onNavigate }) {
  return (
    <div className="arrival-layout">
      <div className="arrival-copy">
        <p className="eyebrow">UTKARSH CHADHA® · FINANCE × ANALYTICS</p>
        <p className="arrival-overline">BEYOND THE SURFACE</p>
        <p className="arrival-disciplines">Finance × Analytics × Strategy × Creativity</p>
        <h1 className="display-title">Curious by<br /><em>nature.</em><br />Driven by insight.</h1>
        <p className="arrival-intro">I’m Utkarsh — an MBA candidate at MIT-WPU, exploring the space where finance, data, and business decisions meet. I turn numbers into narratives and ideas into practical outcomes.</p>
        <div className="arrival-actions">
          <button className="gold-button" type="button" onClick={() => onNavigate("data")}>Explore my work <span aria-hidden="true">↗</span></button>
          <a className="quiet-link" href={contact.resume} target="_blank" rel="noreferrer">View résumé <span aria-hidden="true">↗</span></a>
        </div>
        <p className="arrival-location">PUNE, INDIA <span /> MBA · FINANCE &amp; BUSINESS ANALYTICS</p>
      </div>
      <figure className="portrait-card">
        <img src={publicAsset("profile.png")} alt="Portrait of Utkarsh Chadha" />
        <figcaption><span>UTKARSH CHADHA</span><span>FINANCE × ANALYTICS</span></figcaption>
      </figure>
      <div className="arrival-scroll"><span /> SCROLL TO EXPLORE</div>
    </div>
  );
}

export function DestinationContent({ id, onNavigate, onOpenProject }) {
  if (id === "arrival") return <ArrivalSection onNavigate={onNavigate} />;
  if (["finance", "data", "strategy", "creative"].includes(id)) {
    return <WorkSection id={id} onOpen={onOpenProject} />;
  }
  if (id === "journey") return <JourneySection />;
  if (id === "archive") return <ArchiveSection />;
  if (id === "connection") return <ConnectionSection />;
  return null;
}
