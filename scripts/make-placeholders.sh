#!/usr/bin/env bash
# ============================================================
#  مولّد صور Placeholder لمتجر VOUTIQUE
#  يُنشئ ملفات SVG خفيفة داخل public/images
#  شغّليه من جذر المشروع:   bash scripts/make-placeholders.sh
#  استبدلي أي ملف بصورة حقيقية بنفس الاسم متى شئت.
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PRODUCTS="$ROOT/public/images/products"
CATEGORIES="$ROOT/public/images/categories"
mkdir -p "$PRODUCTS" "$CATEGORIES"

header() {
  # $1=id  $2=لون البداية  $3=لون النهاية
  cat <<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="صورة توضيحية">
  <defs>
    <linearGradient id="bg$1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="$2"/>
      <stop offset="100%" stop-color="$3"/>
    </linearGradient>
    <linearGradient id="obj$1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.92"/>
      <stop offset="55%" stop-color="#B78A9B" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#7F5867" stop-opacity="0.72"/>
    </linearGradient>
    <radialGradient id="glow$1" cx="50%" cy="38%" r="52%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg$1)"/>
  <circle cx="400" cy="330" r="250" fill="url(#glow$1)"/>
SVG
}

footer() {
  cat <<'SVG'
  <ellipse cx="400" cy="682" rx="150" ry="20" fill="#3B2B2F" opacity="0.10"/>
  <text x="400" y="754" text-anchor="middle" font-family="Segoe UI, Tahoma, sans-serif"
        font-size="26" letter-spacing="9" fill="#3B2B2F" opacity="0.38">VOUTIQUE</text>
</svg>
SVG
}

shape() {
  # $1=id  $2=نوع الشكل
  local id="$1" kind="$2"
  case "$kind" in
    bottle)
      cat <<SVG
  <rect x="368" y="150" width="64" height="58" rx="10" fill="#C9A86A" opacity="0.9"/>
  <rect x="352" y="196" width="96" height="40" rx="12" fill="#C9A86A" opacity="0.7"/>
  <path d="M300 246 h200 a44 44 0 0 1 44 44 v300 a48 48 0 0 1-48 48 H304 a48 48 0 0 1-48-48 V290 a44 44 0 0 1 44-44 z" fill="url(#obj$id)"/>
  <rect x="330" y="380" width="140" height="120" rx="14" fill="#FFFFFF" opacity="0.35"/>
SVG
      ;;
    tall)
      cat <<SVG
  <rect x="378" y="120" width="44" height="70" rx="8" fill="#C9A86A" opacity="0.9"/>
  <rect x="362" y="182" width="76" height="34" rx="10" fill="#C9A86A" opacity="0.7"/>
  <path d="M330 224 h140 a38 38 0 0 1 38 38 v336 a44 44 0 0 1-44 44 H336 a44 44 0 0 1-44-44 V262 a38 38 0 0 1 38-38 z" fill="url(#obj$id)"/>
  <rect x="352" y="360" width="96" height="150" rx="12" fill="#FFFFFF" opacity="0.32"/>
SVG
      ;;
    jar)
      cat <<SVG
  <rect x="292" y="212" width="216" height="52" rx="18" fill="#C9A86A" opacity="0.85"/>
  <path d="M300 262 h200 a40 40 0 0 1 40 40 v244 a52 52 0 0 1-52 52 H312 a52 52 0 0 1-52-52 V302 a40 40 0 0 1 40-40 z" fill="url(#obj$id)"/>
  <ellipse cx="400" cy="400" rx="86" ry="52" fill="#FFFFFF" opacity="0.30"/>
SVG
      ;;
    tube)
      cat <<SVG
  <rect x="366" y="140" width="68" height="56" rx="10" fill="#C9A86A" opacity="0.88"/>
  <path d="M336 200 h128 l26 92 v272 a54 54 0 0 1-54 54 H364 a54 54 0 0 1-54-54 V292 z" fill="url(#obj$id)"/>
  <rect x="352" y="366" width="96" height="126" rx="12" fill="#FFFFFF" opacity="0.32"/>
SVG
      ;;
    lipstick)
      cat <<SVG
  <path d="M356 168 h88 v104 h-88 z" fill="#C9A86A" opacity="0.9"/>
  <path d="M356 168 q44 -52 88 0 z" fill="#A88948"/>
  <rect x="334" y="272" width="132" height="70" rx="12" fill="#FFFFFF" opacity="0.55"/>
  <rect x="330" y="342" width="140" height="266" rx="26" fill="url(#obj$id)"/>
SVG
      ;;
    box)
      cat <<SVG
  <rect x="238" y="286" width="324" height="300" rx="20" fill="url(#obj$id)"/>
  <rect x="222" y="248" width="356" height="70" rx="16" fill="#C9A86A" opacity="0.85"/>
  <rect x="376" y="248" width="48" height="338" fill="#E8C9D4" opacity="0.85"/>
  <path d="M400 248 q-70 -78 -104 -34 q-24 34 104 34 z" fill="#E8C9D4" opacity="0.9"/>
  <path d="M400 248 q70 -78 104 -34 q24 34 -104 34 z" fill="#E8C9D4" opacity="0.9"/>
SVG
      ;;
    bar)
      cat <<SVG
  <rect x="246" y="304" width="308" height="212" rx="46" fill="url(#obj$id)"/>
  <ellipse cx="400" cy="386" rx="96" ry="44" fill="#FFFFFF" opacity="0.34"/>
  <circle cx="400" cy="424" r="36" fill="#C9A86A" opacity="0.55"/>
SVG
      ;;
    dropper)
      cat <<SVG
  <rect x="374" y="128" width="52" height="90" rx="10" fill="#3B2B2F" opacity="0.55"/>
  <rect x="352" y="206" width="96" height="34" rx="10" fill="#C9A86A" opacity="0.8"/>
  <path d="M322 240 h156 a34 34 0 0 1 34 34 v296 a46 46 0 0 1-46 46 H334 a46 46 0 0 1-46-46 V274 a34 34 0 0 1 34-34 z" fill="url(#obj$id)"/>
  <rect x="384" y="300" width="32" height="230" rx="16" fill="#FFFFFF" opacity="0.42"/>
SVG
      ;;
    *)
      cat <<SVG
  <circle cx="400" cy="400" r="180" fill="url(#obj$id)"/>
SVG
      ;;
  esac
}

make_svg() {
  # $1=مسار الملف  $2=الشكل  $3=لون البداية  $4=لون النهاية
  local id
  id="$(basename "$1" .svg | tr -cd '[:alnum:]')"
  { header "$id" "$3" "$4"; shape "$id" "$2"; footer; } > "$1"
}

# ── صور المنتجات ──
make_svg "$PRODUCTS/rose-perfume.svg"      bottle   "#F7E7EC" "#E8C9D4"
make_svg "$PRODUCTS/white-musk.svg"        tall     "#FBF6F8" "#EBD6DF"
make_svg "$PRODUCTS/jasmine-night.svg"     bottle   "#F3E9F0" "#DDBBC9"
make_svg "$PRODUCTS/amber-silk.svg"        tall     "#F8EFE3" "#E7D3B6"
make_svg "$PRODUCTS/vanilla-bloom.svg"     bottle   "#FBF4EC" "#EEDCC6"
make_svg "$PRODUCTS/oud-royal.svg"         tall     "#F0E6EA" "#D2B7C2"
make_svg "$PRODUCTS/classic-men.svg"       bottle   "#EDEAF0" "#CFC7D6"
make_svg "$PRODUCTS/oud-men.svg"           tall     "#EFE7E4" "#D3C2BB"
make_svg "$PRODUCTS/sport-men.svg"         bottle   "#E8EEF2" "#C6D6DF"
make_svg "$PRODUCTS/leather-men.svg"       tall     "#F0E9E4" "#D7C4B4"
make_svg "$PRODUCTS/moisturizer.svg"       jar      "#FAF7F4" "#F0E4EA"
make_svg "$PRODUCTS/vitamin-c-serum.svg"   dropper  "#FDF4E9" "#F2DCC2"
make_svg "$PRODUCTS/face-mask.svg"         jar      "#F6EFF6" "#E3D3E4"
make_svg "$PRODUCTS/sunscreen.svg"         tube     "#FDF7EA" "#F3E4C4"
make_svg "$PRODUCTS/hair-oil.svg"          dropper  "#F8F2E8" "#EBDCC4"
make_svg "$PRODUCTS/hair-set.svg"          tube     "#F4EFF6" "#DFD2E6"
make_svg "$PRODUCTS/body-scrub.svg"        jar      "#FAF1EE" "#EDD6CF"
make_svg "$PRODUCTS/body-lotion.svg"       tube     "#FBF6F4" "#EEDDD8"
make_svg "$PRODUCTS/lipstick.svg"          lipstick "#FBEEF1" "#EFCBD6"
make_svg "$PRODUCTS/mascara.svg"           tall     "#F1EDF2" "#D6CEDC"
make_svg "$PRODUCTS/foundation.svg"        dropper  "#FBF3EC" "#EEDCC8"
make_svg "$PRODUCTS/blush.svg"             jar      "#FCEDF1" "#F2CCD8"
make_svg "$PRODUCTS/eyeshadow-palette.svg" box      "#F7EEF3" "#E5CBD8"
make_svg "$PRODUCTS/honey-soap.svg"        bar      "#FBF4E7" "#EFDDBF"
make_svg "$PRODUCTS/deodorant.svg"         tall     "#EFF3F5" "#D2DEE4"
make_svg "$PRODUCTS/hand-cream.svg"        tube     "#FAF4F6" "#EBD8DF"
make_svg "$PRODUCTS/shower-gel.svg"        tall     "#F2F6F4" "#D6E3DC"
make_svg "$PRODUCTS/gift-perfume-set.svg"  box      "#F9EDF2" "#EBC9D6"
make_svg "$PRODUCTS/gift-care-set.svg"     box      "#F8F1EC" "#E9D6C6"
make_svg "$PRODUCTS/gift-box-luxe.svg"     box      "#F5EDF4" "#DFC6DC"
make_svg "$PRODUCTS/placeholder.svg"       bottle   "#FAF7F4" "#EBD6DF"

# ── صور التصنيفات ──
make_svg "$CATEGORIES/perfumes.svg"      bottle   "#F7E7EC" "#E1BECD"
make_svg "$CATEGORIES/perfumes-men.svg"  tall     "#EBE9F0" "#C7C0D2"
make_svg "$CATEGORIES/care.svg"          jar      "#F7F1EE" "#E4D2CB"
make_svg "$CATEGORIES/makeup.svg"        lipstick "#FBEDF2" "#EDC4D3"
make_svg "$CATEGORIES/hygiene.svg"       bar      "#F4F7F5" "#D6E2DB"
make_svg "$CATEGORIES/gifts.svg"         box      "#F8EDF3" "#E6C6D8"

echo "تم إنشاء $(ls "$PRODUCTS" | wc -l) صورة منتج و $(ls "$CATEGORIES" | wc -l) صورة تصنيف."
