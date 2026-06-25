import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req) {
  try {
    const { url } = await req.json();

    const baseUrl = new URL(url);
    const visited = new Set();

    const cssFiles = [];
    const jsFiles = [];
    const images = [];
    const pages = [];
    const technologies = [];
    const htmlFiles = [];

    async function fetchPage(pageUrl) {
      if (visited.has(pageUrl) || visited.size >= 5) return;

      visited.add(pageUrl);

      const response = await fetch(pageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const html = await response.text();

      const foundHtmlFiles =
        html.match(/[A-Za-z0-9._-]+\.html/g) || [];

      htmlFiles.push(...foundHtmlFiles);

      pages.push({
        url: pageUrl,
        html
      });

      const $ = cheerio.load(html);

      $('link[rel="stylesheet"]').each((i, el) => {
        const href = $(el).attr("href");

        if (!href) return;

        try {
          cssFiles.push(
            new URL(href, pageUrl).href
          );
        } catch {}
      });

      $("script[src]").each((i, el) => {
        const src = $(el).attr("src");

        if (!src) return;

        try {
          jsFiles.push(
            new URL(src, pageUrl).href
          );
        } catch {}
      });

      $("img[src]").each((i, el) => {
        const src = $(el).attr("src");

        if (!src) return;

        try {
          images.push(
            new URL(src, pageUrl).href
          );
        } catch {}
      });

      if (html.includes("__NEXT_DATA__"))
        technologies.push("Next.js");

      if (
        html.includes("react") ||
        html.includes("_reactRootContainer")
      )
        technologies.push("React");

      if (html.includes("wp-content"))
        technologies.push("WordPress");

      const links = [];

      $("a[href]").each((i, el) => {
        const href = $(el).attr("href");

        if (!href) return;

        try {
          const absolute = new URL(
            href,
            pageUrl
          );

          if (
            absolute.hostname ===
              baseUrl.hostname &&
            !visited.has(absolute.href)
          ) {
            links.push(
              absolute.href
            );
          }
        } catch {}
      });

      for (const link of links.slice(0, 5)) {
        await fetchPage(link);
      }
    }

    await fetchPage(url);

    return NextResponse.json({
      success: true,

      pages,

      cssFiles: [
        ...new Set(cssFiles)
      ],

      jsFiles: [
        ...new Set(jsFiles)
      ],

      images: [
        ...new Set(images)
      ],

      htmlFiles: [
        ...new Set(htmlFiles)
      ],

      technologies: [
        ...new Set(technologies)
      ]
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message
    });
  }
}