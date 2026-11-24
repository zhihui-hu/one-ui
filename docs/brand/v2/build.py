"""One UI logo v2: refine ① 叠层 — proportions, depth, colours; export site assets."""
import base64, json, pathlib, re

HERE = pathlib.Path(__file__).parent
V1 = HERE.parent / "v1" / "build.py"
src = V1.read_text().split("# ---- concepts")[0]
ns: dict = {"__file__": str(V1)}
exec(compile(src, "oneui-v1", "exec"), ns)
icon, f, squircle = ns["icon"], ns["f"], ns["squircle"]
W = "#fff"


def stack(size=380, offset=132, back=0.38, back_scale=1.0, n=5.0, flip=False, three=False, fill=W):
    """Front card bottom-left, back card(s) up-right, the pair centred on 512."""
    dx = offset / 2 * (-1 if flip else 1)
    cards = []
    if three:
        bs = size * back_scale
        cards.append((512 + dx * 2, 512 - abs(dx) * 2, bs * back_scale, back * 0.55))
    bs = size * back_scale
    cards.append((512 + dx, 512 - abs(dx), bs, back))
    cards.append((512 - dx, 512 + abs(dx), size, 1))
    if three:  # recentre the trio
        shift = abs(dx) / 2
        cards = [(x - (shift if not flip else -shift), y + shift, s, o) for x, y, s, o in cards]
    out = []
    for x, y, s, o in cards:
        op = "" if o == 1 else f' opacity="{o}"'
        out.append(f'<path d="{squircle(x, y, s, s, n=n)}" fill="{fill}"{op}/>')
    return "".join(out)


SHAPES = [
    ("base", "基准", "v1 原样：两块等大，错位 132，后层 38%。", dict()),
    ("tight", "紧凑", "错位缩到 100，两层更像一个整体，小尺寸更稳。", dict(offset=100, size=400)),
    ("loose", "舒展", "错位拉到 168，层次感最强，但图形变散。", dict(offset=168, size=350)),
    ("small-back", "前大后小", "后层缩到 82%，像卡片从后面浮上来，有纵深。", dict(back_scale=0.82, offset=150)),
    ("deep", "深后层", "后层不透明度提到 55%，小尺寸更清楚，但玻璃感弱一点。", dict(back=0.55)),
    ("three", "三层", "再加一层更淡的卡片，“很多组件”的意思更足，但更复杂。", dict(three=True, size=330, offset=110)),
    ("round", "更圆", "超椭圆指数 5 → 4，角更圆润，更接近 iOS 图标里的卡片。", dict(n=4.0)),
    ("flip", "左上", "后层放到左上，前层在右下，阅读方向从左上落到右下。", dict(flip=True)),
]

COLORS = [
    ("ink", "墨黑", ("#4A4E57", "#16181D", "#000000")),
    ("blue", "One Mail 蓝", ("#3D8BFB", "#1A4FE8", "#0B1E5C")),
    ("indigo", "靛紫", ("#5E7BFF", "#2B3FD6", "#0E1757")),
    ("violet", "葡萄紫", ("#A77BFF", "#6A3BE0", "#24104F")),
    ("graphite", "石墨白", ("#FFFFFF", "#E9EAEE", "#8A8F99")),
]


def uri(svg):
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode()).decode()


def flat(glyph, color, view="180 180 664 664"):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}">{glyph.replace(chr(34) + W + chr(34), chr(34) + color + chr(34))}</svg>'


def card(full, fav, title, note, glyph, extra=""):
    return f'''<section class="card"><img class="hero" src="{uri(full)}">
  <h3>{title}</h3><p>{note}</p>
  <div class="sizes"><img src="{uri(fav)}" width="32"><img src="{uri(fav)}" width="20"><img src="{uri(fav)}" width="16">
  <span class="lock light"><img src="{uri(flat(glyph, "#16181D"))}" width="22"><b>One UI</b></span>
  <span class="lock dark"><img src="{uri(flat(glyph, "#F2F2F3"))}" width="22"><b>One UI</b></span></div>{extra}</section>'''


def graphite_glyph(glyph):
    """White shell needs a dark glyph."""
    return glyph.replace(f'"{W}"', '"#16181D"')


if __name__ == "__main__":
    shape_cards = []
    for slug, title, note, kw in SHAPES:
        g = stack(**kw)
        full, fav = icon(*COLORS[0][2], g), icon(*COLORS[0][2], g, full=False)
        (HERE / f"oneui-stack-{slug}.svg").write_text(full)
        shape_cards.append(card(full, fav, title, note, g))

    base = stack()
    color_cards = []
    for slug, title, colors in COLORS:
        g = graphite_glyph(base) if slug == "graphite" else base
        full, fav = icon(*colors, g), icon(*colors, g, full=False)
        (HERE / f"oneui-stack-base-{slug}.svg").write_text(full)
        color_cards.append(card(full, fav, title, "", base))

    page = f'''<!doctype html><meta charset="utf-8"><title>One UI logo v2 · 叠层</title>
<style>
body{{margin:0;background:#f6f6f7;color:#16181d;font-family:-apple-system,"PingFang SC",sans-serif}}
header,h2{{padding:0 24px}} header{{padding-top:24px}} h1{{font-size:20px;margin:0}} header p{{color:#5b616e;font-size:13px;margin:6px 0 0}}
h2{{font-size:15px;margin:24px 0 0}}
.grid{{padding:12px 24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}}
.card{{background:#fff;border:1px solid #e7e7ea;border-radius:14px;padding:16px}}
.hero{{width:120px;display:block}} h3{{font-size:14px;margin:8px 0 2px}} p{{font-size:12px;line-height:1.6;color:#5b616e;margin:0 0 10px;min-height:1em}}
.sizes{{display:flex;flex-wrap:wrap;align-items:center;gap:10px}}
.lock{{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:9px}}
.lock b{{font:700 15px/1 "SF Pro Rounded",ui-rounded,-apple-system,sans-serif}}
.light{{background:#f6f6f7}} .dark{{background:#141518;color:#f2f2f3}}
</style>
<header><h1>① 叠层 — 细化</h1><p>先看形状（统一墨黑），再看基准形状的 5 种颜色。每张卡：大图标、32·20·16 px、顶栏单色图形 + 字标（浅 / 深）。</p></header>
<h2>形状</h2><div class="grid">{"".join(shape_cards)}</div>
<h2>颜色（基准形状）</h2><div class="grid">{"".join(color_cards)}</div>
'''
    # the preview pane refuses large snapshots, so each image is inlined once
    uris: dict = {}
    page = re.sub(r'src="(data:image/svg\+xml;base64,[^"]+)"',
                  lambda m: f'data-k="{uris.setdefault(m.group(1), len(uris))}"', page)
    page += ('<script>const U=' + json.dumps(list(uris)) +
             ';document.querySelectorAll("img[data-k]").forEach(i=>i.src=U[+i.dataset.k])</script>\n')
    (HERE / "preview.html").write_text(page)

    # site assets: the shelled icon works on light and dark pages alike
    public = HERE.parents[2] / "public" / "logos"
    base_ink = icon(*COLORS[0][2], base)
    (public / "oneui-stack.svg").write_text(base_ink)
    (public / "oneui-stack-favicon.svg").write_text(icon(*COLORS[0][2], base, full=False))
    (public / "oneui-stack-mark.svg").write_text(flat(base, "currentColor"))
    print("ok")
