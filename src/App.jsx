import { useState } from "react";
import "./App.css";

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function App() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const uploadToCloudinary = async (f) => {
    const fd = new FormData();
    fd.append("file", f);
    fd.append("upload_preset", PRESET);
    const r = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
      { method: "POST", body: fd }
    );
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error?.message || "Upload failed");
    return j.secure_url;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setImageUrl("");
    setLoading(true);
    try {
      const url = file ? await uploadToCloudinary(file) : "";
      setImageUrl(url);
      const resp = await fetch("/.netlify/functions/moderate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          imageUrl: url,
          caption: caption.trim() || undefined,
        }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || "Moderation failed");
      setResult(json);
    } catch (e2) {
      setError(e2.message || String(e2));
    } finally {
      setLoading(false);
    }
  };

  const r = result?.results?.[0];
  const flagged = r?.flagged;
  const scores = r?.category_scores || {};
  const categories = Object.keys(scores).sort(
    (a, b) => (scores[b] ?? 0) - (scores[a] ?? 0)
  );

  return (
    <div className="app-shell">
      <div className="wrapper">
        <div className="container">
          <h1>OpenAI Moderation Tester</h1>

          <div className="card grid">
            {/* LEFT: form + preview */}
            <form className="row-gap" onSubmit={onSubmit}>
              <div>
                <label className="label">Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <label className="label">Caption (optional)</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe the image…"
                />
              </div>
              <button disabled={loading}>
                {loading ? "Checking…" : "Upload & Moderate"}
              </button>
            </form>

            <div className="preview">
              {imageUrl && (
                <>
                  <a
                    className="link"
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Image URL
                  </a>
                  <img src={imageUrl} alt="uploaded" />
                </>
              )}
              {error && <p style={{ color: "#ff8080" }}>Error: {error}</p>}
            </div>
          </div>

          {/* RESULTS */}
          {r && (
            <div className="card" style={{ marginTop: 16 }}>
              <span className={`badge ${flagged ? "bad" : "ok"}`}>
                {flagged ? "FLAGGED" : "NOT FLAGGED"}
              </span>

              <div className="results">
                <div className="section-title">Per-category scores</div>
                <div className="row-gap">
                  {categories.map((k) => {
                    const pct = Math.round((scores[k] || 0) * 100);
                    return (
                      <div className="bar-row" key={k}>
                        <div className="bar-head">
                          <span>{k}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="track">
                          <div className="fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <details>
                  <summary className="section-title">Raw JSON</summary>
                  <pre className="json">{JSON.stringify(result, null, 2)}</pre>
                </details>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
