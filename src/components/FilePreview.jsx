import { Check, Copy, DownloadSimple, X } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

export function FilePreview({ files, onClose, onExport }) {
  const paths = useMemo(() => Object.keys(files), [files]);
  const [activePath, setActivePath] = useState(paths[0]);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard?.writeText(files[activePath]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="file-preview-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Generated project files"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span className="eyebrow">Generated project files</span>
            <h2>Ready for refinement</h2>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={copy}>
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button type="button" className="primary-button" onClick={onExport}>
              <DownloadSimple size={17} />
              Export blueprint
            </button>
            <button type="button" className="icon-button" aria-label="Close preview" onClick={onClose}>
              <X size={19} />
            </button>
          </div>
        </header>
        <div className="file-preview-body">
          <nav>
            {paths.map((path) => (
              <button
                key={path}
                type="button"
                className={path === activePath ? "active" : ""}
                onClick={() => setActivePath(path)}
              >
                {path}
              </button>
            ))}
          </nav>
          <div className="code-pane">
            <div className="code-title">{activePath}</div>
            <pre>{files[activePath]}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}
