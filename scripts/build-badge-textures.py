"""Build deterministic badge artwork from the real source photo; no generative edits."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/models/badge"
OUT.mkdir(parents=True, exist_ok=True)
PHOTO = ROOT / "assets/Profile/IMG_9526.JPG"
FONT_ROOT = Path("/System/Library/Fonts/Supplemental")

def font(size, bold=False):
    return ImageFont.truetype(str(FONT_ROOT / ("Arial Bold.ttf" if bold else "Arial.ttf")), size)

def paper():
    image = Image.new("RGB", (1024, 1536), "#f6f4ee")
    draw = ImageDraw.Draw(image)
    # Quiet printed security lines; no synthetic photo content.
    for x in range(-700, 1700, 56):
        draw.line((x, 0, x + 1100, 1536), fill="#eae9e3", width=1)
    for x, y in [(88, 1200), (990, 1240), (920, 80)]:
        for radius in (45, 60, 75):
            draw.arc((x-radius, y-radius, x+radius, y+radius), 20, 320, fill="#e0e4df", width=2)
    return image

real = Image.open(PHOTO).convert("RGB")
# Hand-picked face-and-shoulders crop from the actual 600 x 900 original.
# Never alter, redraw, retouch or generate the face.
portrait = real.crop((195, 215, 323, 350))
portrait.save(OUT / "portrait-original-crop.png")
front = paper()
print_portrait = portrait.filter(ImageFilter.UnsharpMask(radius=0.55, percent=85, threshold=3))
front.paste(print_portrait.resize((674, 710), Image.Resampling.LANCZOS), (175, 125))
draw = ImageDraw.Draw(front)
draw.text((172, 858), "Nattapart", font=font(102, True), fill="#282a29")
draw.text((172, 975), "Worakun", font=font(102, True), fill="#282a29")
draw.text((172, 1104), "Inventory Data Analyst", font=font(39), fill="#6b6c66")
draw.rounded_rectangle((412, 1210, 612, 1378), 26, fill="#c1b296", outline="#a7977b", width=3)
for x in (466, 556):
    draw.line((x, 1215, x, 1372), fill="#9b8b70", width=3)
for y in (1265, 1322):
    draw.line((416, y, 608, y), fill="#9b8b70", width=3)
draw.rounded_rectangle((467, 1265, 554, 1323), 12, outline="#9b8b70", width=3)
x = 180
for i in range(112):
    width = 2 + ((i * 17 + 3) % 5)
    draw.rectangle((x, 1432, x + width, 1477), fill="#63655f")
    x += width + 2
    if x > 850:
        break
front.save(OUT / "front.png", optimize=True)

back = paper()
draw = ImageDraw.Draw(back)
draw.text((110, 130), "NW", font=font(190, True), fill="#b36b44")
draw.text((114, 382), "DATA & OPERATIONS", font=font(38, True), fill="#494d47")
draw.line((114, 464, 910, 464), fill="#c9cdc2", width=3)
for y, text in [(530, "Curious by nature."), (592, "Precise by training."), (860, "CHEMISTRY  /  ANALYTICS"), (934, "Bangkok, Thailand")]:
    draw.text((114, y), text, font=font(38), fill="#686d62")
draw.text((114, 1370), "EARTHONDEV", font=font(37, True), fill="#b36b44")
back.save(OUT / "back.png", optimize=True)
print(f"Saved badge artwork to {OUT}")
