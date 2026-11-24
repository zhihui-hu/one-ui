"""One UI logo v1: concepts in the one-* family icon shell (shared with acbe/One Mail)."""
import base64, math, pathlib

HERE = pathlib.Path(__file__).parent
ACBE = HERE.parents[3] / "one-user" / "docs" / "brand" / "acbe"
# Reuse the family shell (squircle, vertical gradient, sheen, rim, drop shadow).
src = (ACBE / "v2" / "build.py").read_text().split("# One colour for all four")[0]
ns: dict = {"__file__": str(ACBE / "v2" / "build.py")}
exec(compile(src, "acbe-v2", "exec"), ns)
icon, f = ns["icon"], ns["f"]

INK = ("#4A4E57", "#16181D", "#000000")
BLUE = ("#3D8BFB", "#1A4FE8", "#0B1E5C")
W = "#fff"


def squircle(cx, cy, w, h, n=5.0, steps=160):
    """Superellipse |x/a|^n + |y/b|^n = 1 — the continuous Apple-style corner."""
    a, b = w / 2, h / 2
    pts = []
    for i in range(steps):
        t = 2 * math.pi * i / steps
        c, s = math.cos(t), math.sin(t)
        x = a * math.copysign(abs(c) ** (2 / n), c)
        y = b * math.copysign(abs(s) ** (2 / n), s)
        pts.append(f"{f(cx + x)} {f(cy + y)}")
    return "M" + "L".join(pts) + "Z"


def metaball(x1, y1, r1, x2, y2, r2, v=0.5, handle=2.4):
    """Neck path joining two circles (same maths as acbe ③ 出发)."""
    d = math.hypot(x2 - x1, y2 - y1)
    a = math.atan2(y2 - y1, x2 - x1)
    u1 = math.acos((r1 * r1 + d * d - r2 * r2) / (2 * r1 * d)) if d < r1 + r2 else 0
    u2 = math.acos((r2 * r2 + d * d - r1 * r1) / (2 * r2 * d)) if d < r1 + r2 else 0
    spread = math.acos((r1 - r2) / d)
    a1 = a + u1 + (spread - u1) * v
    a2 = a - u1 - (spread - u1) * v
    a3 = a + math.pi - u2 - (math.pi - u2 - spread) * v
    a4 = a - math.pi + u2 + (math.pi - u2 - spread) * v
    p = lambda cx, cy, r, t: (cx + r * math.cos(t), cy + r * math.sin(t))
    p1, p2, p3, p4 = p(x1, y1, r1, a1), p(x1, y1, r1, a2), p(x2, y2, r2, a3), p(x2, y2, r2, a4)
    total = r1 + r2
    k = min(v * handle, math.hypot(p1[0] - p3[0], p1[1] - p3[1]) / total) * min(1, d * 2 / total)
    hp = lambda pt, t, h: (pt[0] + h * math.cos(t), pt[1] + h * math.sin(t))
    c1, c2 = hp(p1, a1 - math.pi / 2, r1 * k), hp(p2, a2 + math.pi / 2, r1 * k)
    c3, c4 = hp(p3, a3 + math.pi / 2, r2 * k), hp(p4, a4 - math.pi / 2, r2 * k)
    m = lambda pt: f"{f(pt[0])} {f(pt[1])}"
    return f"M{m(p1)}C{m(c1)} {m(c3)} {m(p3)}L{m(p4)}C{m(c4)} {m(c2)} {m(p2)}Z"


# ---- concepts: each returns white glyph markup on the 1024 canvas ----------

def stack():
    """① 叠层：两块连续圆角卡片错位叠放，后一块半透明 —— 组件、层级、毛玻璃。"""
    back = squircle(578, 446, 380, 380)
    front = squircle(446, 578, 380, 380)
    return (f'<path d="{back}" fill="{W}" opacity=".38"/>'
            f'<path d="{front}" fill="{W}"/>')


def one_dot():
    """② 一点：连续圆角外框里只放一个实心圆 —— One + 容器，最克制。"""
    frame = squircle(512, 512, 520, 520)
    return (f'<path d="{frame}" fill="none" stroke="{W}" stroke-width="64"/>'
            f'<circle cx="512" cy="512" r="104" fill="{W}"/>')


def toggle():
    """③ 开关：一个打开的开关 —— 最经典的 UI 原件，旋钮带动效暗示。"""
    r = 165
    track = (f'<rect x="{512-310}" y="{512-r}" width="620" height="{2*r}" rx="{r}" '
             f'fill="{W}" opacity=".32"/>')
    knob = f'<circle cx="{512+310-r}" cy="512" r="{r-34}" fill="{W}"/>'
    ghost = f'<circle cx="{512-310+r}" cy="512" r="{r-34}" fill="none" stroke="{W}" stroke-width="20" opacity=".55"/>'
    return track + ghost + knob


def blocks():
    """④ 拼块：2×2 组件块，其中一块是圆 —— 组件库里“那个不一样的”。"""
    s, g = 236, 52
    o = 512 - s - g / 2
    out = []
    for i, (cx, cy) in enumerate([(o + s / 2, o + s / 2), (o + s * 1.5 + g, o + s / 2),
                                  (o + s / 2, o + s * 1.5 + g), (o + s * 1.5 + g, o + s * 1.5 + g)]):
        if i == 1:
            out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{s/2}" fill="{W}"/>')
        else:
            out.append(f'<path d="{squircle(cx, cy, s, s)}" fill="{W}" opacity="{1 if i == 2 else .55}"/>')
    return "".join(out)


def spring():
    """⑤ 弹簧：一个圆连同两个渐隐残影斜向弹出 —— Motion 动效。"""
    out = []
    for (cx, cy, r, op) in [(330, 694, 92, .22), (430, 594, 128, .45), (590, 434, 196, 1)]:
        out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{W}" opacity="{op}"/>')
    return "".join(out)


def merge():
    """⑥ 融入：圆通过 metaball 颈部流进一块方形 —— 组件装进你的代码库；与 acbe ③ 同源。"""
    sq = squircle(600, 600, 360, 360)
    neck = metaball(370, 370, 132, 560, 560, 150, v=0.55)
    return (f'<path d="{sq}" fill="{W}"/><circle cx="370" cy="370" r="132" fill="{W}"/>'
            f'<path d="{neck}" fill="{W}"/>')


def glass():
    """⑦ 玻璃：圆与连续圆角方块交叠，交集最亮 —— 毛玻璃层叠。"""
    sq = squircle(588, 588, 400, 400)
    return (f'<defs><clipPath id="gq"><path d="{sq}"/></clipPath></defs>'
            f'<path d="{sq}" fill="{W}" opacity=".35"/>'
            f'<circle cx="420" cy="420" r="210" fill="{W}" opacity=".35"/>'
            f'<circle cx="420" cy="420" r="210" fill="{W}" clip-path="url(#gq)"/>')


CONCEPTS = [stack, one_dot, toggle, blocks, spring, merge, glass]


def uri(svg):
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode()).decode()


def flat(glyph, color):
    g = glyph.replace(f'"{W}"', f'"{color}"')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="160 160 704 704">{g}</svg>'


cards = []
for i, fn in enumerate(CONCEPTS, 1):
    glyph = fn()
    title, note = fn.__doc__.split("：", 1)
    full = icon(*INK, glyph)
    fav = icon(*INK, glyph, full=False)
    blue = icon(*BLUE, glyph)
    (HERE / f"oneui-{i}-{fn.__name__}.svg").write_text(full)
    mark_dark, mark_light = flat(glyph, "#16181D"), flat(glyph, "#F2F2F3")
    cards.append(f'''<section class="card"><div class="heroes"><img class="hero" src="{uri(full)}"><img class="hero" src="{uri(blue)}"></div>
  <h3>{title}</h3><p>{note}</p>
  <div class="sizes"><img src="{uri(fav)}" width="32"><img src="{uri(fav)}" width="20"><img src="{uri(fav)}" width="16"></div>
  <div class="lock light"><img src="{uri(mark_dark)}" width="26"><b>One UI</b></div>
  <div class="lock dark"><img src="{uri(mark_light)}" width="26"><b>One UI</b></div></section>''')

(HERE / "preview.html").write_text(f'''<!doctype html><meta charset="utf-8"><title>One UI logo v1</title>
<style>
body{{margin:0;background:#f6f6f7;color:#16181d;font-family:-apple-system,"PingFang SC",sans-serif}}
header{{padding:24px 24px 0}} h1{{font-size:20px;margin:0}} header p{{color:#5b616e;font-size:13px;margin:6px 0 0}}
.grid{{padding:16px 24px 40px;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}}
.card{{background:#fff;border:1px solid #e7e7ea;border-radius:14px;padding:16px}}
.heroes{{display:flex;gap:10px}} .hero{{width:112px;display:block}}
h3{{font-size:15px;margin:10px 0 2px}} p{{font-size:12px;line-height:1.6;color:#5b616e;margin:0 0 10px;min-height:3.2em}}
.sizes{{display:flex;align-items:end;gap:12px;margin-bottom:8px}}
.lock{{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:10px;margin-top:6px}}
.lock b{{font:700 18px/1 "SF Pro Rounded",ui-rounded,-apple-system,sans-serif;letter-spacing:-.01em}}
.light{{background:#f6f6f7}} .dark{{background:#141518;color:#f2f2f3}}
</style>
<header><h1>One UI · logo v1</h1><p>7 个方向，统一用 one-* 家族图标外壳（与 智慧跨境 / One Mail 相同）。每个方向：墨黑 / One Mail 蓝、32·20·16 px 小尺寸、顶栏单色图形 + 字标。</p></header>
<div class="grid">{"".join(cards)}</div>
''')
print("ok", len(cards))
