import { useState } from "react";

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function App() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const upload = async () => {
    if (!file) return;
    setErr("");
    setUrl("");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", PRESET);
      const r = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
        { method: "POST", body: fd }
      );
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error?.message || "Upload failed");
      setUrl(j.secure_url);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{ maxWidth: 560, margin: "2rem auto", fontFamily: "system-ui" }}
    >
      <h1>Cloudinary Upload Test</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        disabled={!file || busy}
        onClick={upload}
        style={{ marginLeft: 8 }}
      >
        {busy ? "Uploading…" : "Upload"}
      </button>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {url && (
        <>
          <p>
            URL:{" "}
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </p>
          <img
            src={url}
            alt="uploaded"
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
        </>
      )}
    </div>
  );
}
