import {
  ArrowRight,
  CheckCircle,
  CursorClick,
  Lightning,
  ListMagnifyingGlass,
  Package,
} from "@phosphor-icons/react";

const stages = [
  {
    icon: ListMagnifyingGlass,
    index: "01",
    title: "Discovery",
    copy: "Codex loads only each skill name and description into the catalog.",
    items: ["Match task intent", "Keep context cost low"],
  },
  {
    icon: CursorClick,
    index: "02",
    title: "Activation",
    copy: "A matching task loads the complete SKILL.md instructions.",
    items: ["Explicit $skill", "Implicit description match"],
  },
  {
    icon: Lightning,
    index: "03",
    title: "Execution",
    copy: "The workflow runs steps and calls configured tools or scripts.",
    items: ["Follow procedure", "Call MCP tools"],
  },
  {
    icon: Package,
    index: "04",
    title: "Resources",
    copy: "References and assets load only when their specific branch is needed.",
    items: ["Read references", "Use output assets"],
  },
];

export function RuntimeView() {
  return (
    <section className="alternate-view runtime-view">
      <div className="alternate-heading">
        <div>
          <span className="eyebrow">Runtime flow</span>
          <h2>Progressive disclosure</h2>
          <p>The graph is not loaded all at once. Context arrives in deliberate stages.</p>
        </div>
      </div>
      <div className="runtime-track">
        {stages.map(({ icon: Icon, index, title, copy, items }, stageIndex) => (
          <div className="runtime-step" key={title}>
            <div className="runtime-index">{index}</div>
            <div className="runtime-icon"><Icon size={24} weight="duotone" /></div>
            <h3>{title}</h3>
            <p>{copy}</p>
            <ul>
              {items.map((item) => (
                <li key={item}><CheckCircle size={15} weight="fill" /> {item}</li>
              ))}
            </ul>
            {stageIndex < stages.length - 1 && (
              <ArrowRight className="runtime-arrow" size={22} />
            )}
          </div>
        ))}
      </div>
      <div className="runtime-callout">
        <span>First-principles rule</span>
        <strong>MCP is a live dependency, not automatically a file inside every skill.</strong>
      </div>
    </section>
  );
}
