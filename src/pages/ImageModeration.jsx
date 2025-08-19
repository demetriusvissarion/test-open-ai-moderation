import { useState } from "react";
import { NavLink } from "react-router-dom";

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function ImageModeration() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");

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
    setErr("");
    setRes(null);
    setImageUrl("");
    setLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
      const r = await fetch("/.netlify/functions/moderate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Moderation failed");
      setRes(j);
    } catch (e2) {
      setErr(e2.message || String(e2));
    } finally {
      setLoading(false);
    }
  };

  const r0 = res?.results?.[0];
  const flagged = r0?.flagged;
  const scores = r0?.category_scores || {};
  const categories = Object.keys(scores).sort(
    (a, b) => (scores[b] ?? 0) - (scores[a] ?? 0)
  );

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <NavLink to="/" className="btn-secondary">
          ← Back to Home
        </NavLink>
      </div>

      <div className="card">
        <form className="row-gap" onSubmit={onSubmit}>
          <div>
            <label className="label">Image (image only)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <button className="btn-success" disabled={loading || !file}>
            {loading ? "Uploading…" : "Upload & Moderate image"}
          </button>
        </form>

        {imageUrl && (
          <div className="preview" style={{ marginTop: 12 }}>
            <a
              className="link"
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
            >
              Image URL
            </a>
            <img src={imageUrl} alt="uploaded" />
          </div>
        )}

        {err && <p style={{ color: "#ff8080", marginTop: 12 }}>Error: {err}</p>}

        {r0 && (
          <div style={{ marginTop: 16 }}>
            <span
              className={`badge ${flagged ? "bad" : "ok"}`}
              style={{ marginRight: 8 }}
            >
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
                <pre className="json">{JSON.stringify(res, null, 2)}</pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
