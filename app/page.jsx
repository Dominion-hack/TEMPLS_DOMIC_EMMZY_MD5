"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [pages, setPages] = useState([]);
  const [cssFiles, setCssFiles] = useState([]);
  const [jsFiles, setJsFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [technologies, setTechnologies] = useState([]);

  const scrapeWebsite = async () => {
    if (!url) {
      alert("Enter a website URL");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Failed");
        return;
      }

      setPages(data.pages || []);
      setCssFiles(data.cssFiles || []);
      setJsFiles(data.jsFiles || []);
      setImages(data.images || []);
      setTechnologies(data.technologies || []);
    } catch (err) {
      alert("Failed to analyze website");
    }

    setLoading(false);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <main className="container">
      <div className="card">
        <h1>NEX SCRAPER 🔥</h1>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button onClick={scrapeWebsite}>
          {loading ? "Analyzing..." : "Analyze Website"}
        </button>

        {pages.length > 0 && (
          <>
            <h2>📄 Pages Found</h2>

            {pages.map((page, index) => (
              <div key={index}>
                <h3>{page.url}</h3>

                <button
                  className="copyBtn"
                  onClick={() => copyText(page.html)}
                >
                  Copy HTML
                </button>

                <pre>{page.html}</pre>
              </div>
            ))}

            <h2>🎨 CSS Files</h2>

            {cssFiles.length > 0 ? (
              <>
                <button
                  className="copyBtn"
                  onClick={() =>
                    copyText(cssFiles.join("\n"))
                  }
                >
                  Copy CSS List
                </button>

                <pre>{cssFiles.join("\n")}</pre>
              </>
            ) : (
              <pre>No file available.</pre>
            )}

            <h2>⚡ JavaScript Files</h2>

            {jsFiles.length > 0 ? (
              <>
                <button
                  className="copyBtn"
                  onClick={() =>
                    copyText(jsFiles.join("\n"))
                  }
                >
                  Copy JS List
                </button>

                <pre>{jsFiles.join("\n")}</pre>
              </>
            ) : (
              <pre>No file available.</pre>
            )}

            <h2>🖼 Images</h2>

            {images.length > 0 ? (
              <>
                <button
                  className="copyBtn"
                  onClick={() =>
                    copyText(images.join("\n"))
                  }
                >
                  Copy Images
                </button>

                <pre>{images.join("\n")}</pre>
              </>
            ) : (
              <pre>No file available.</pre>
            )}

            <h2>🔍 Technologies</h2>

            {technologies.length > 0 ? (
              <pre>{technologies.join("\n")}</pre>
            ) : (
              <pre>No technology detected.</pre>
            )}

            <h2>🖥 server.js</h2>
            <pre>No file available.</pre>

            <h2>🗄 Database</h2>
            <pre>No file available.</pre>
          </>
        )}
      </div>
    </main>
  );
}