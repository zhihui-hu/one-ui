// renders public/og/<lang>.png; run from the repo root: node docs/brand/og/build.mjs
// satori has no cjk glyphs, so text is matched against noto sans sc unicode-range slices
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

const FONT_DIR = join(process.cwd(), "../one-user/web/node_modules/@fontsource/noto-sans-sc");
const WEIGHTS = [400, 700];

const CARDS = {
  en: {
    title: "One UI",
    tagline: "Animated React components for shadcn",
    body: "Free and open source. Built with Tailwind CSS and Motion; you own the code.",
  },
  zh: {
    title: "One UI",
    tagline: "shadcn 动画 React 组件",
    body: "免费开源。基于 Tailwind CSS 和 Motion 构建，代码归你所有。",
  },
};

const HOST = "ui.huzhihui.com";

async function slicesFor(text) {
  const css = await readFile(join(FONT_DIR, "700.css"), "utf8");
  const codes = new Set([...text].map((c) => c.codePointAt(0)));
  const ids = [];
  for (const block of css.split("@font-face").slice(1)) {
    const id = block.match(/files\/noto-sans-sc-([a-z0-9-]+?)-700-normal\.woff\)/)?.[1];
    const range = block.match(/unicode-range:\s*([^;]+);/)?.[1];
    if (!id || !range) continue;
    const hit = range.split(",").some((part) => {
      const [from, to = from] = part.trim().replace(/^U\+/i, "").split("-");
      const lo = parseInt(from, 16), hi = parseInt(to, 16);
      for (const c of codes) if (c >= lo && c <= hi) return true;
      return false;
    });
    if (hit) ids.push(id);
  }
  const fonts = [];
  for (const id of ids)
    for (const weight of WEIGHTS)
      fonts.push({
        name: `noto-${id}`,
        weight,
        style: "normal",
        data: await readFile(join(FONT_DIR, "files", `noto-sans-sc-${id}-${weight}-normal.woff`)),
      });
  return { fonts, family: ids.map((id) => `noto-${id}`).join(", ") };
}

const mark = `data:image/svg+xml;base64,${(await readFile("public/logos/oneui-stack.svg")).toString("base64")}`;

for (const [lang, card] of Object.entries(CARDS)) {
  const { fonts, family } = await slicesFor(Object.values(card).join("") + HOST);
  const response = new ImageResponse(
    h("div", {
      style: {
        width: "100%", height: "100%", display: "flex", alignItems: "center",
        background: "#121212", color: "#fff", fontFamily: family, padding: "0 96px", gap: 72,
      },
    },
      h("div", { style: { display: "flex", flexDirection: "column", flex: 1, gap: 20 } },
        h("div", { style: { fontSize: 104, fontWeight: 700, letterSpacing: -3, lineHeight: 1 } }, card.title),
        h("div", { style: { fontSize: 50, fontWeight: 700, color: "#FC4C01", lineHeight: 1.2 } }, card.tagline),
        h("div", { style: { fontSize: 30, fontWeight: 400, color: "rgba(255,255,255,0.6)", lineHeight: 1.45, maxWidth: 640 } }, card.body),
        h("div", { style: { marginTop: 40, fontSize: 26, fontWeight: 400, color: "rgba(255,255,255,0.4)" } }, HOST),
      ),
      h("img", { src: mark, width: 340, height: 340 }),
    ),
    { width: 1200, height: 630, fonts },
  );
  await writeFile(`public/og/${lang}.png`, Buffer.from(await response.arrayBuffer()));
  console.log(`public/og/${lang}.png`);
}
