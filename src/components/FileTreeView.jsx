import {
  BracketsCurly,
  File,
  FileJs,
  FileMd,
  Folder,
  FolderOpen,
} from "@phosphor-icons/react";

function FileRow({ path }) {
  const depth = path.split("/").length - 1;
  const name = path.split("/").at(-1);
  const Icon = name.endsWith(".md")
    ? FileMd
    : name.endsWith(".js")
      ? FileJs
      : name.endsWith(".json") || name.endsWith(".yaml")
        ? BracketsCurly
        : File;
  return (
    <div className="file-row" style={{ "--depth": depth }}>
      <Icon size={17} />
      <span>{path}</span>
    </div>
  );
}

export function FileTreeView({ files }) {
  const paths = Object.keys(files);
  return (
    <section className="alternate-view">
      <div className="alternate-heading">
        <div>
          <span className="eyebrow">File tree</span>
          <h2>Generated structure</h2>
          <p>Skills stay focused; plugins package distribution and live integrations.</p>
        </div>
        <div className="structure-stat">
          <strong>{paths.length}</strong>
          <span>generated files</span>
        </div>
      </div>
      <div className="file-tree-card">
        <div className="tree-root">
          <FolderOpen size={20} weight="duotone" />
          <strong>research-toolkit/</strong>
        </div>
        <div className="tree-section">
          <div className="tree-folder"><Folder size={17} /> skills/</div>
          {paths.filter((path) => path.startsWith("skills/")).map((path) => (
            <FileRow key={path} path={path} />
          ))}
        </div>
        <div className="tree-section">
          <div className="tree-folder"><Folder size={17} /> distribution/</div>
          {paths.filter((path) => !path.startsWith("skills/")).map((path) => (
            <FileRow key={path} path={path} />
          ))}
        </div>
      </div>
    </section>
  );
}
