#!/usr/bin/env python3
"""Generate artistic SVG assets for 昭君：一路向北 game."""

import os

ASSETS_DIR = "/root/zhaojun-game/public/assets/images"

def write_svg(path, svg):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(svg)
    print(f"  ✅ {path}")

# ============================================================
# BACKGROUNDS (1280x720)
# ============================================================

def bg_prologue():
    """序章：大雁视角 — 深秋北方天空，一只大雁低飞"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2C3E50"/>
      <stop offset="40%" stop-color="#4A6B8A"/>
      <stop offset="70%" stop-color="#6B8FB5"/>
      <stop offset="100%" stop-color="#C4A882"/>
    </linearGradient>
    <radialGradient id="sun" cx="50%" cy="20%" r="40%">
      <stop offset="0%" stop-color="#D4A54A" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#D4A54A" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>
  <rect width="1280" height="720" fill="url(#sky)"/>
  <rect width="1280" height="720" fill="url(#sun)"/>
  <!-- 远处的山 -->
  <path d="M0 520 Q150 400 300 480 Q450 430 600 470 Q750 410 900 460 Q1050 420 1280 500 L1280 720 L0 720Z" fill="#3D5A80" opacity="0.4"/>
  <path d="M0 560 Q200 490 400 530 Q550 480 700 520 Q850 470 1000 510 Q1150 490 1280 540 L1280 720 L0 720Z" fill="#2C3E50" opacity="0.3"/>
  <!-- 地面 -->
  <rect x="0" y="600" width="1280" height="120" fill="#5A4A32" opacity="0.5" rx="0"/>
  <!-- 大雁 -->
  <g transform="translate(500, 200)" opacity="0.7">
    <path d="M0 0 Q-15 -8 -30 -5 Q-15 -3 0 0 Q15 -3 30 -5 Q15 -8 0 0Z" fill="#1a1a2e"/>
  </g>
  <g transform="translate(550, 180) scale(0.7)" opacity="0.5">
    <path d="M0 0 Q-12 -6 -24 -4 Q-12 -2 0 0 Q12 -2 24 -4 Q12 -6 0 0Z" fill="#1a1a2e"/>
  </g>
  <!-- 云 -->
  <g opacity="0.15" fill="white">
    <ellipse cx="200" cy="150" rx="80" ry="20"/>
    <ellipse cx="250" cy="145" rx="60" ry="15"/>
    <ellipse cx="900" cy="180" rx="100" ry="25"/>
    <ellipse cx="970" cy="175" rx="70" ry="18"/>
  </g>
  <!-- 飘落的羽毛 -->
  <g transform="translate(600, 300) rotate(15)" opacity="0.3">
    <ellipse cx="0" cy="0" rx="2" ry="10" fill="#D4A54A"/>
  </g>
</svg>'''

def bg_chapter01():
    """第一章：长安 — 未央宫偏殿，铜镜晨光"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8D5B7"/>
      <stop offset="40%" stop-color="#F5E6CC"/>
      <stop offset="100%" stop-color="#C9A96E"/>
    </linearGradient>
    <radialGradient id="sunlight" cx="80%" cy="10%" r="50%">
      <stop offset="0%" stop-color="#FFE4A0" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#FFE4A0" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8B7355"/>
      <stop offset="100%" stop-color="#6B5740"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="#D4C4A8"/>
  <rect width="1280" height="720" fill="url(#sunlight)"/>
  <!-- 宫墙 -->
  <rect x="0" y="100" width="1280" height="500" fill="url(#wall)"/>
  <!-- 窗棂 -->
  <rect x="400" y="150" width="480" height="380" fill="#4A3728" rx="3"/>
  <rect x="410" y="160" width="460" height="360" fill="#2A1F14" rx="2"/>
  <!-- 窗格 -->
  <line x1="640" y1="160" x2="640" y2="520" stroke="#5A4330" stroke-width="3"/>
  <line x1="410" y1="340" x2="870" y2="340" stroke="#5A4330" stroke-width="3"/>
  <line x1="410" y1="250" x2="870" y2="250" stroke="#5A4330" stroke-width="2"/>
  <line x1="410" y1="430" x2="870" y2="430" stroke="#5A4330" stroke-width="2"/>
  <!-- 透过窗的光 -->
  <rect x="412" y="162" width="226" height="86" fill="#FFE4A0" opacity="0.08"/>
  <rect x="642" y="162" width="226" height="86" fill="#FFE4A0" opacity="0.05"/>
  <!-- 铜镜 -->
  <ellipse cx="640" cy="480" rx="40" ry="45" fill="#B8860B" opacity="0.6"/>
  <ellipse cx="640" cy="480" rx="30" ry="34" fill="#DAA520" opacity="0.4"/>
  <line x1="640" y1="525" x2="640" y2="555" stroke="#8B6914" stroke-width="3"/>
  <!-- 铜镜划痕 -->
  <line x1="630" y1="470" x2="650" y2="485" stroke="#B8860B" stroke-width="0.5" opacity="0.6"/>
  <!-- 地面 -->
  <rect x="0" y="600" width="1280" height="120" fill="#4A3728"/>
  <!-- 地板纹理 -->
  <g stroke="#3A2A1A" stroke-width="1" opacity="0.3">
    <line x1="0" y1="620" x2="1280" y2="620"/>
    <line x1="0" y1="650" x2="1280" y2="650"/>
    <line x1="0" y1="680" x2="1280" y2="680"/>
  </g>
</svg>'''

def bg_chapter02():
    """第二章：渭水 — 渭河渡口，灰蓝色天际"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6B7B8D"/>
      <stop offset="50%" stop-color="#8899A8"/>
      <stop offset="100%" stop-color="#A0B0BA"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5A7A8A"/>
      <stop offset="100%" stop-color="#3A5A6A"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#sky)"/>
  <!-- 远山 -->
  <path d="M0 350 Q200 280 400 330 Q600 290 800 320 Q1000 280 1280 340 L1280 720 L0 720Z" fill="#5A6A78" opacity="0.5"/>
  <!-- 河水 -->
  <rect x="0" y="380" width="1280" height="200" fill="url(#water)" opacity="0.7"/>
  <!-- 水波 -->
  <g stroke="#6A8A9A" stroke-width="1" fill="none" opacity="0.3">
    <path d="M0 400 Q50 395 100 400 Q150 405 200 400 Q250 395 300 400 Q350 405 400 400 Q450 395 500 400 Q550 405 600 400 Q650 395 700 400 Q750 405 800 400 Q850 395 900 400 Q950 405 1000 400 Q1050 395 1100 400 Q1150 405 1200 400 Q1250 395 1280 400"/>
    <path d="M0 450 Q50 445 100 450 Q150 455 200 450 Q250 445 300 450 Q350 455 400 450 Q450 445 500 450 Q550 455 600 450 Q650 445 700 450 Q750 455 800 450 Q850 445 900 450 Q950 455 1000 450 Q1050 445 1100 450 Q1150 455 1200 450 Q1250 445 1280 450"/>
    <path d="M0 500 Q50 495 100 500 Q150 505 200 500 Q250 495 300 500 Q350 505 400 500 Q450 495 500 500 Q550 505 600 500 Q650 495 700 500 Q750 505 800 500 Q850 495 900 500 Q950 505 1000 500 Q1050 495 1100 500 Q1150 505 1200 500 Q1250 495 1280 500"/>
  </g>
  <!-- 河岸 -->
  <path d="M0 580 Q200 570 400 575 Q600 580 800 572 Q1000 578 1280 575 L1280 720 L0 720Z" fill="#6B5B4A"/>
  <!-- 马车队 -->
  <g transform="translate(300, 540)">
    <rect x="0" y="0" width="60" height="35" fill="#4A3A2A" rx="3"/>
    <circle cx="15" cy="38" r="8" fill="#3A2A1A" stroke="#5A4A3A" stroke-width="1"/>
    <circle cx="45" cy="38" r="8" fill="#3A2A1A" stroke="#5A4A3A" stroke-width="1"/>
    <line x1="30" y1="0" x2="40" y2="-15" stroke="#5A4A3A" stroke-width="2"/>
  </g>
  <g transform="translate(450, 545) scale(0.85)">
    <rect x="0" y="0" width="55" height="30" fill="#3A2A1A" rx="3"/>
    <circle cx="12" cy="33" r="7" fill="#3A2A1A" stroke="#4A3A2A" stroke-width="1"/>
    <circle cx="42" cy="33" r="7" fill="#3A2A1A" stroke="#4A3A2A" stroke-width="1"/>
  </g>
</svg>'''

def bg_chapter03():
    """第三章：秦岭 — 雨中山路"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2A3A3A"/>
      <stop offset="50%" stop-color="#3A4A4A"/>
      <stop offset="100%" stop-color="#4A5A4A"/>
    </linearGradient>
    <filter id="rain-blur"><feGaussianBlur stdDeviation="0.5"/></filter>
  </defs>
  <rect width="1280" height="720" fill="url(#sky)"/>
  <!-- 远山 -->
  <path d="M0 400 Q200 300 500 350 Q700 280 900 320 Q1100 300 1280 380 L1280 720 L0 720Z" fill="#2A3A2A" opacity="0.6"/>
  <path d="M0 450 Q300 380 600 420 Q800 370 1000 400 Q1200 380 1280 440 L1280 720 L0 720Z" fill="#1A2A1A" opacity="0.5"/>
  <!-- 树木 -->
  <g fill="#1A2A1A" opacity="0.7">
    <polygon points="100,450 130,250 160,450"/>
    <polygon points="300,430 340,240 380,430"/>
    <polygon points="500,440 530,280 560,440"/>
    <polygon points="800,420 840,260 880,420"/>
    <polygon points="1000,430 1030,270 1060,430"/>
    <polygon points="1150,440 1175,300 1200,440"/>
  </g>
  <!-- 山路 -->
  <path d="M200 720 Q300 600 500 550 Q700 520 900 500 Q1100 490 1280 500" stroke="#3A2A1A" stroke-width="3" fill="none"/>
  <!-- 路面泥泞 -->
  <path d="M300 580 Q400 560 500 550 Q600 540 700 530" stroke="#4A3A2A" stroke-width="2" fill="none" opacity="0.5"/>
  <!-- 马车 -->
  <g transform="translate(550, 510)">
    <rect x="0" y="0" width="50" height="30" fill="#3A2A1A" rx="2"/>
    <circle cx="12" cy="33" r="7" fill="#2A1A0A" stroke="#4A3A2A" stroke-width="1"/>
    <circle cx="38" cy="33" r="7" fill="#2A1A0A" stroke="#4A3A2A" stroke-width="1"/>
  </g>
  <!-- 雨丝 -->
  <g stroke="#6A8A9A" stroke-width="0.5" opacity="0.3">
    <line x1="50" y1="0" x2="40" y2="30"/>
    <line x1="150" y1="50" x2="140" y2="80"/>
    <line x1="250" y1="20" x2="240" y2="50"/>
    <line x1="350" y1="70" x2="340" y2="100"/>
    <line x1="450" y1="10" x2="440" y2="40"/>
    <line x1="550" y1="40" x2="540" y2="70"/>
    <line x1="650" y1="60" x2="640" y2="90"/>
    <line x1="750" y1="0" x2="740" y2="30"/>
    <line x1="850" y1="30" x2="840" y2="60"/>
    <line x1="950" y1="50" x2="940" y2="80"/>
    <line x1="1050" y1="15" x2="1040" y2="45"/>
    <line x1="1150" y1="45" x2="1140" y2="75"/>
    <line x1="1250" y1="25" x2="1240" y2="55"/>
  </g>
</svg>'''

def bg_chapter04():
    """第四章：黄河 — 黄河渡口"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8A7A5A"/>
      <stop offset="40%" stop-color="#A0906A"/>
      <stop offset="100%" stop-color="#B0A07A"/>
    </linearGradient>
    <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8A7A3A"/>
      <stop offset="100%" stop-color="#6A5A2A"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#sky)"/>
  <!-- 对岸山影 -->
  <path d="M0 300 Q200 240 400 280 Q600 230 800 260 Q1000 220 1280 290 L1280 720 L0 720Z" fill="#7A6A4A" opacity="0.4"/>
  <!-- 黄河 -->
  <rect x="0" y="330" width="1280" height="250" fill="url(#river)" opacity="0.8"/>
  <!-- 波浪 -->
  <g stroke="#9A8A4A" stroke-width="2" fill="none" opacity="0.4">
    <path d="M0 360 Q40 350 80 360 Q120 370 160 360 Q200 350 240 360 Q280 370 320 360 Q360 350 400 360 Q440 370 480 360 Q520 350 560 360 Q600 370 640 360 Q680 350 720 360 Q760 370 800 360 Q840 350 880 360 Q920 370 960 360 Q1000 350 1040 360 Q1080 370 1120 360 Q1160 350 1200 360 Q1240 370 1280 360"/>
    <path d="M0 420 Q50 410 100 420 Q150 430 200 420 Q250 410 300 420 Q350 430 400 420 Q450 410 500 420 Q550 430 600 420 Q650 410 700 420 Q750 430 800 420 Q850 410 900 420 Q950 430 1000 420 Q1050 410 1100 420 Q1150 430 1200 420 Q1250 410 1280 420"/>
    <path d="M0 480 Q60 470 120 480 Q180 490 240 480 Q300 470 360 480 Q420 490 480 480 Q540 470 600 480 Q660 490 720 480 Q780 470 840 480 Q900 490 960 480 Q1020 470 1080 480 Q1140 490 1200 480 Q1260 470 1280 480"/>
  </g>
  <!-- 渡船 -->
  <g transform="translate(500, 390)">
    <path d="M0 0 L80 0 L70 25 L10 25Z" fill="#5A4A2A"/>
    <rect x="25" y="-5" width="30" height="20" fill="#4A3A1A" rx="2"/>
  </g>
  <!-- 抬车的壮汉 -->
  <g transform="translate(300, 550)">
    <rect x="0" y="-40" width="60" height="35" fill="#4A3A2A" rx="2"/>
    <circle cx="10" cy="-42" r="6" fill="#5A4A3A"/>
    <circle cx="50" cy="-42" r="6" fill="#5A4A3A"/>
    <line x1="10" y1="-36" x2="10" y2="-15" stroke="#5A4A3A" stroke-width="2"/>
    <line x1="50" y1="-36" x2="50" y2="-15" stroke="#5A4A3A" stroke-width="2"/>
  </g>
  <!-- 岸边 -->
  <path d="M0 580 Q200 570 400 575 Q600 580 800 572 Q1000 578 1280 575 L1280 720 L0 720Z" fill="#7A6A4A"/>
</svg>'''

def bg_chapter05():
    """第五章：雁门关 — 铁灰色城门"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4A4A5A"/>
      <stop offset="50%" stop-color="#6A6A7A"/>
      <stop offset="100%" stop-color="#8A8A8A"/>
    </linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5A5A5A"/>
      <stop offset="100%" stop-color="#3A3A3A"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#sky)"/>
  <!-- 关城 -->
  <rect x="350" y="150" width="580" height="450" fill="url(#wall)"/>
  <!-- 城齿 -->
  <g fill="#4A4A4A">
    <rect x="350" y="130" width="40" height="30"/>
    <rect x="410" y="130" width="40" height="30"/>
    <rect x="470" y="130" width="40" height="30"/>
    <rect x="530" y="130" width="40" height="30"/>
    <rect x="590" y="130" width="40" height="30"/>
    <rect x="650" y="130" width="40" height="30"/>
    <rect x="710" y="130" width="40" height="30"/>
    <rect x="770" y="130" width="40" height="30"/>
    <rect x="830" y="130" width="40" height="30"/>
    <rect x="890" y="130" width="40" height="30"/>
  </g>
  <!-- 城门 -->
  <rect x="540" y="400" width="200" height="200" fill="#1A1A1A" rx="100 100 0 0"/>
  <!-- 门缝 -->
  <line x1="640" y1="400" x2="640" y2="600" stroke="#2A2A2A" stroke-width="2"/>
  <!-- 门钉 -->
  <g fill="#5A5A5A">
    <circle cx="580" cy="460" r="3"/>
    <circle cx="620" cy="460" r="3"/>
    <circle cx="660" cy="460" r="3"/>
    <circle cx="700" cy="460" r="3"/>
    <circle cx="580" cy="500" r="3"/>
    <circle cx="620" cy="500" r="3"/>
    <circle cx="660" cy="500" r="3"/>
    <circle cx="700" cy="500" r="3"/>
  </g>
  <!-- 城墙延伸 -->
  <rect x="0" y="250" width="350" height="350" fill="#4A4A4A"/>
  <rect x="930" y="250" width="350" height="350" fill="#4A4A4A"/>
  <!-- 荒原 -->
  <rect x="0" y="600" width="1280" height="120" fill="#5A5A4A"/>
  <!-- 风沙 -->
  <g stroke="#8A8A7A" stroke-width="0.5" opacity="0.2">
    <line x1="100" y1="300" x2="80" y2="310"/>
    <line x1="200" y1="350" x2="170" y2="365"/>
    <line x1="1000" y1="320" x2="1030" y2="330"/>
    <line x1="1100" y1="280" x2="1130" y2="290"/>
  </g>
</svg>'''

def bg_chapter06():
    """第六章：草原 — 一望无际的草原"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A3A6A"/>
      <stop offset="30%" stop-color="#2A5A8A"/>
      <stop offset="60%" stop-color="#4A8ABA"/>
      <stop offset="100%" stop-color="#7ABA8A"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#sky)"/>
  <!-- 云朵 -->
  <g fill="white" opacity="0.3">
    <ellipse cx="200" cy="120" rx="100" ry="30"/>
    <ellipse cx="260" cy="115" rx="70" ry="20"/>
    <ellipse cx="800" cy="150" rx="120" ry="35"/>
    <ellipse cx="880" cy="145" rx="80" ry="22"/>
    <ellipse cx="1050" cy="100" rx="90" ry="25"/>
  </g>
  <!-- 远山 -->
  <path d="M0 350 Q200 300 400 330 Q600 280 800 310 Q1000 290 1280 340 L1280 720 L0 720Z" fill="#3A6A3A" opacity="0.3"/>
  <!-- 草原 -->
  <path d="M0 380 Q200 360 400 370 Q600 365 800 375 Q1000 360 1280 370 L1280 720 L0 720Z" fill="#4A8A3A" opacity="0.4"/>
  <path d="M0 420 Q200 410 400 415 Q600 405 800 420 Q1000 408 1280 415 L1280 720 L0 720Z" fill="#5A9A4A" opacity="0.3"/>
  <!-- 草 -->
  <g stroke="#6AAA5A" stroke-width="1" opacity="0.4">
    <line x1="100" y1="450" x2="100" y2="430"/>
    <line x1="200" y1="460" x2="205" y2="440"/>
    <line x1="350" y1="445" x2="345" y2="425"/>
    <line x1="500" y1="455" x2="502" y2="435"/>
    <line x1="650" y1="448" x2="648" y2="428"/>
    <line x1="800" y1="458" x2="803" y2="438"/>
    <line x1="950" y1="450" x2="948" y2="430"/>
    <line x1="1100" y1="460" x2="1102" y2="440"/>
  </g>
  <!-- 远处车队 -->
  <g transform="translate(700, 390)" opacity="0.4">
    <rect x="0" y="-15" width="20" height="12" fill="#3A2A1A"/>
    <circle cx="5" cy="-1" r="3" fill="#2A1A0A"/>
    <circle cx="15" cy="-1" r="3" fill="#2A1A0A"/>
  </g>
  <!-- 鹰 -->
  <g transform="translate(300, 80)" opacity="0.5">
    <path d="M0 0 L-20 -5 L-10 2Z" fill="#1A1A2E"/>
    <path d="M0 0 L20 -5 L10 2Z" fill="#1A1A2E"/>
  </g>
</svg>'''

def bg_chapter07():
    """第七章：暴风雪"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A1A2A"/>
      <stop offset="30%" stop-color="#2A2A3A"/>
      <stop offset="60%" stop-color="#3A3A4A"/>
      <stop offset="100%" stop-color="#4A4A5A"/>
    </linearGradient>
    <filter id="snow-blur"><feGaussianBlur stdDeviation="1"/></filter>
  </defs>
  <rect width="1280" height="720" fill="url(#sky)"/>
  <!-- 远处黑线（暴风雪线） -->
  <rect x="200" y="250" width="900" height="5" fill="#0A0A1A" opacity="0.8" rx="2"/>
  <rect x="100" y="300" width="1100" height="8" fill="#0A0A1A" opacity="0.5" rx="2"/>
  <!-- 风雪中的地形 -->
  <path d="M0 500 Q300 460 600 480 Q900 450 1280 490 L1280 720 L0 720Z" fill="#3A3A4A" opacity="0.5"/>
  <path d="M0 550 Q400 520 800 540 Q1100 510 1280 550 L1280 720 L0 720Z" fill="#2A2A3A" opacity="0.6"/>
  <!-- 马车剪影 -->
  <g transform="translate(500, 490)" opacity="0.5">
    <rect x="0" y="-20" width="40" height="25" fill="#1A1A2A"/>
    <circle cx="8" cy="7" r="6" fill="#1A1A2A"/>
    <circle cx="32" cy="7" r="6" fill="#1A1A2A"/>
  </g>
  <!-- 雪花 -->
  <g fill="white" opacity="0.4">
    <circle cx="100" cy="100" r="2"/>
    <circle cx="200" cy="50" r="1.5"/>
    <circle cx="300" cy="150" r="2"/>
    <circle cx="400" cy="80" r="1"/>
    <circle cx="500" cy="120" r="2.5"/>
    <circle cx="600" cy="60" r="1.5"/>
    <circle cx="700" cy="180" r="2"/>
    <circle cx="800" cy="90" r="1"/>
    <circle cx="900" cy="140" r="2"/>
    <circle cx="1000" cy="70" r="1.5"/>
    <circle cx="1100" cy="110" r="2"/>
    <circle cx="1200" cy="160" r="1.5"/>
    <circle cx="150" cy="250" r="1"/>
    <circle cx="350" cy="300" r="2"/>
    <circle cx="550" cy="280" r="1.5"/>
    <circle cx="750" cy="350" r="2"/>
    <circle cx="950" cy="260" r="1"/>
    <circle cx="1150" cy="320" r="1.5"/>
  </g>
  <!-- 风线 -->
  <g stroke="#6A6A7A" stroke-width="0.5" opacity="0.15">
    <line x1="0" y1="200" x2="80" y2="195"/>
    <line x1="200" y1="350" x2="300" y2="342"/>
    <line x1="500" y1="280" x2="620" y2="270"/>
    <line x1="800" y1="230" x2="920" y2="222"/>
    <line x1="1000" y1="380" x2="1100" y2="372"/>
  </g>
</svg>'''

def bg_chapter08():
    """第八章：篝火 — 篝火夜"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
  <defs>
    <radialGradient id="firelight" cx="50%" cy="60%" r="40%">
      <stop offset="0%" stop-color="#FF6A1A" stop-opacity="0.3"/>
      <stop offset="30%" stop-color="#FFA040" stop-opacity="0.15"/>
      <stop offset="60%" stop-color="#FFD070" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="fire-core" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="20%" stop-color="#FFD070"/>
      <stop offset="50%" stop-color="#FF6A1A"/>
      <stop offset="100%" stop-color="#CC3300"/>
    </radialGradient>
  </defs>
  <!-- 夜空 -->
  <rect width="1280" height="720" fill="#0A0A1A"/>
  <!-- 星星 -->
  <g fill="white" opacity="0.6">
    <circle cx="100" cy="80" r="1.5"/>
    <circle cx="250" cy="50" r="1"/>
    <circle cx="400" cy="120" r="1.5"/>
    <circle cx="550" cy="40" r="1"/>
    <circle cx="700" cy="90" r="1.5"/>
    <circle cx="850" cy="60" r="1"/>
    <circle cx="1000" cy="130" r="1.5"/>
    <circle cx="1150" cy="70" r="1"/>
    <circle cx="180" cy="160" r="0.8"/>
    <circle cx="320" cy="200" r="1"/>
    <circle cx="950" cy="180" r="0.8"/>
    <circle cx="1080" cy="210" r="1"/>
  </g>
  <!-- 火光 -->
  <rect width="1280" height="720" fill="url(#firelight)"/>
  <!-- 地面 -->
  <path d="M0 550 Q200 530 400 540 Q600 545 800 535 Q1000 540 1280 545 L1280 720 L0 720Z" fill="#1A1A0A"/>
  <!-- 篝火 -->
  <g transform="translate(640, 520)">
    <!-- 木柴 -->
    <line x1="-20" y1="15" x2="20" y2="15" stroke="#3A2A0A" stroke-width="4" stroke-linecap="round"/>
    <line x1="-15" y1="15" x2="0" y2="-5" stroke="#3A2A0A" stroke-width="3" stroke-linecap="round"/>
    <line x1="15" y1="15" x2="5" y2="-8" stroke="#3A2A0A" stroke-width="3" stroke-linecap="round"/>
    <!-- 火焰 -->
    <ellipse cx="0" cy="-5" rx="15" ry="25" fill="url(#fire-core)" opacity="0.8"/>
    <ellipse cx="-5" cy="-10" rx="8" ry="18" fill="#FFA040" opacity="0.6"/>
    <ellipse cx="5" cy="-8" rx="6" ry="15" fill="#FFD070" opacity="0.5"/>
    <!-- 火星 -->
    <circle cx="-8" cy="-30" r="1.5" fill="#FF6A1A" opacity="0.6"/>
    <circle cx="6" cy="-35" r="1" fill="#FFA040" opacity="0.4"/>
    <circle cx="-2" cy="-40" r="1" fill="#FFD070" opacity="0.3"/>
  </g>
  <!-- 人物剪影 -->
  <g transform="translate(500, 500)" fill="#1A1A1A" opacity="0.7">
    <ellipse cx="0" cy="-20" rx="12" ry="18"/>
    <path d="M-12 -5 Q-20 10 -15 20" stroke="#1A1A1A" stroke-width="3" fill="none"/>
    <path d="M12 -5 Q20 10 15 20" stroke="#1A1A1A" stroke-width="3" fill="none"/>
  </g>
  <g transform="translate(780, 500)" fill="#1A1A1A" opacity="0.6" transform-origin="780 500">
    <ellipse cx="0" cy="-15" rx="10" ry="15"/>
    <path d="M-10 -5 Q-18 10 -12 18" stroke="#1A1A1A" stroke-width="3" fill="none"/>
  </g>
  <g transform="translate(570, 510)" fill="#1A1A1A" opacity="0.5">
    <ellipse cx="0" cy="-12" rx="8" ry="12"/>
  </g>
</svg>'''

def bg_chapter09():
    """第九章：王庭 — 匈奴王庭"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4A6A8A"/>
      <stop offset="50%" stop-color="#7A9ABA"/>
      <stop offset="100%" stop-color="#9ABA9A"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#sky)"/>
  <!-- 远山 -->
  <path d="M0 400 Q200 350 400 380 Q600 340 800 370 Q1000 330 1280 380 L1280 720 L0 720Z" fill="#5A7A5A" opacity="0.3"/>
  <!-- 草原 -->
  <path d="M0 430 Q300 420 600 425 Q900 415 1280 430 L1280 720 L0 720Z" fill="#6A9A5A" opacity="0.3"/>
  <!-- 帐篷 -->
  <g transform="translate(500, 390)">
    <path d="M-60 40 L0 -20 L60 40Z" fill="#6A4A2A"/>
    <path d="M-55 40 L0 -15 L55 40Z" fill="#7A5A3A"/>
    <rect x="-3" y="20" width="6" height="20" fill="#4A2A1A"/>
    <path d="M-60 40 L-50 50 L50 50 L60 40Z" fill="#5A3A1A"/>
  </g>
  <g transform="translate(380, 400) scale(0.7)">
    <path d="M-50 35 L0 -15 L50 35Z" fill="#5A3A1A"/>
    <path d="M-45 35 L0 -10 L45 35Z" fill="#6A4A2A"/>
    <rect x="-2" y="15" width="4" height="18" fill="#3A1A0A"/>
  </g>
  <g transform="translate(700, 395) scale(0.8)">
    <path d="M-50 35 L0 -15 L50 35Z" fill="#5A3A1A"/>
    <path d="M-45 35 L0 -10 L45 35Z" fill="#6A4A2A"/>
    <rect x="-2" y="15" width="4" height="18" fill="#3A1A0A"/>
  </g>
  <!-- 旌旗 -->
  <g transform="translate(560, 350)">
    <line x1="0" y1="0" x2="0" y2="-40" stroke="#4A2A1A" stroke-width="2"/>
    <path d="M0 -40 L25 -35 L0 -30Z" fill="#8A2A1A" opacity="0.7"/>
  </g>
  <g transform="translate(440, 360)">
    <line x1="0" y1="0" x2="0" y2="-35" stroke="#4A2A1A" stroke-width="2"/>
    <path d="M0 -35 L20 -30 L0 -25Z" fill="#8A2A1A" opacity="0.6"/>
  </g>
  <!-- 远处的马车 -->
  <g transform="translate(300, 430)" opacity="0.4">
    <rect x="0" y="-12" width="18" height="10" fill="#3A2A1A"/>
    <circle cx="4" cy="0" r="3" fill="#2A1A0A"/>
    <circle cx="14" cy="0" r="3" fill="#2A1A0A"/>
  </g>
  <!-- 风痕 -->
  <g stroke="#8A9A8A" stroke-width="0.5" opacity="0.2">
    <line x1="100" y1="460" x2="160" y2="458"/>
    <line x1="800" y1="440" x2="880" y2="436"/>
    <line x1="600" y1="470" x2="660" y2="468"/>
  </g>
</svg>'''

def bg_chapter10():
    """终章：二十年后 — 青冢"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6A7A8A"/>
      <stop offset="30%" stop-color="#8A9AAA"/>
      <stop offset="60%" stop-color="#AABABA"/>
      <stop offset="100%" stop-color="#BACABA"/>
    </linearGradient>
    <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4A8A3A"/>
      <stop offset="100%" stop-color="#3A6A2A"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#sky)"/>
  <!-- 远山 -->
  <path d="M0 350 Q200 310 400 340 Q600 300 800 330 Q1000 290 1280 340 L1280 720 L0 720Z" fill="#6A8A5A" opacity="0.3"/>
  <!-- 草原 -->
  <path d="M0 400 Q200 390 400 395 Q600 385 800 395 Q1000 388 1280 395 L1280 720 L0 720Z" fill="#5A8A4A" opacity="0.3"/>
  <!-- 青冢 -->
  <g transform="translate(640, 430)">
    <ellipse cx="0" cy="10" rx="60" ry="25" fill="#3A6A2A"/>
    <ellipse cx="0" cy="5" rx="50" ry="35" fill="url(#grass)"/>
    <ellipse cx="0" cy="0" rx="40" ry="30" fill="#4A8A3A"/>
    <!-- 青草 > -->
    <g stroke="#5AAA4A" stroke-width="1.5">
      <line x1="-20" y1="-10" x2="-22" y2="-25"/>
      <line x1="-10" y1="-15" x2="-12" y2="-30"/>
      <line x1="5" y1="-18" x2="3" y2="-35"/>
      <line x1="15" y1="-12" x2="13" y2="-28"/>
      <line x1="-5" y1="-5" x2="-7" y2="-20"/>
      <line x1="25" y1="-5" x2="23" y2="-18"/>
    </g>
  </g>
  <!-- 远飞的大雁 -->
  <g transform="translate(800, 150)" opacity="0.3">
    <path d="M0 0 Q-10 -5 -20 -3 Q-10 -2 0 0 Q10 -2 20 -3 Q10 -5 0 0Z" fill="#2A3A4A"/>
  </g>
  <g transform="translate(830, 140) scale(0.7)" opacity="0.2">
    <path d="M0 0 Q-8 -4 -16 -3 Q-8 -2 0 0 Q8 -2 16 -3 Q8 -4 0 0Z" fill="#2A3A4A"/>
  </g>
  <!-- 石碑 -->
  <g transform="translate(640, 445)">
    <rect x="-4" y="-40" width="8" height="45" fill="#7A7A7A" rx="1"/>
    <rect x="-15" y="-45" width="30" height="8" fill="#7A7A7A" rx="1"/>
  </g>
  <!-- 地面 -->
  <path d="M0 520 Q200 510 400 515 Q600 512 800 518 Q1000 510 1280 515 L1280 720 L0 720Z" fill="#5A7A4A" opacity="0.3"/>
</svg>'''

# ============================================================
# COLLECTIBLE ICONS (200x200)
# ============================================================

def icon_bronze_mirror():
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <defs>
    <radialGradient id="mirror-grad" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#FFD700"/>
      <stop offset="60%" stop-color="#DAA520"/>
      <stop offset="100%" stop-color="#8B6914"/>
    </radialGradient>
  </defs>
  <rect width="200" height="200" fill="#1A1A2A" rx="15"/>
  <ellipse cx="100" cy="95" rx="55" ry="60" fill="url(#mirror-grad)"/>
  <ellipse cx="100" cy="95" rx="45" ry="50" fill="none" stroke="#B8860B" stroke-width="1.5" opacity="0.5"/>
  <line x1="85" y1="80" x2="110" y2="105" stroke="#8B6914" stroke-width="1" opacity="0.5"/>
  <rect x="93" y="155" width="14" height="25" fill="#8B6914" rx="2"/>
  <text x="100" y="190" font-family="serif" font-size="11" fill="#DAA520" text-anchor="middle" opacity="0.6">铜镜</text>
</svg>'''

def icon_wei_stone():
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <defs>
    <radialGradient id="stone-grad" cx="40%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#8A9A8A"/>
      <stop offset="60%" stop-color="#6A7A6A"/>
      <stop offset="100%" stop-color="#4A5A4A"/>
    </radialGradient>
  </defs>
  <rect width="200" height="200" fill="#1A1A2A" rx="15"/>
  <ellipse cx="100" cy="100" rx="55" ry="45" fill="url(#stone-grad)"/>
  <ellipse cx="95" cy="90" rx="15" ry="10" fill="#7A8A7A" opacity="0.3"/>
  <ellipse cx="105" cy="105" rx="20" ry="12" fill="#5A6A5A" opacity="0.2"/>
  <text x="100" y="175" font-family="serif" font-size="11" fill="#7A8A7A" text-anchor="middle" opacity="0.6">渭河石</text>
</svg>'''

def icon_forest_leaf():
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="#1A1A2A" rx="15"/>
  <g transform="translate(100, 100) rotate(-20)">
    <path d="M0 0 Q-20 -30 -10 -50 Q0 -40 10 -50 Q20 -30 0 0Z" fill="#3A8A3A"/>
    <path d="M0 0 Q-15 -25 -8 -42 Q0 -35 8 -42 Q15 -25 0 0Z" fill="#4A9A4A"/>
    <line x1="0" y1="0" x2="-5" y2="5" stroke="#2A5A2A" stroke-width="1.5"/>
    <line x1="0" y1="0" x2="5" y2="5" stroke="#2A5A2A" stroke-width="1.5"/>
    <line x1="-3" y1="0" x2="-3" y2="-10" stroke="#2A5A2A" stroke-width="0.8"/>
    <line x1="0" y1="0" x2="0" y2="-12" stroke="#2A5A2A" stroke-width="0.8"/>
    <line x1="3" y1="0" x2="3" y2="-10" stroke="#2A5A2A" stroke-width="0.8"/>
  </g>
  <text x="100" y="175" font-family="serif" font-size="11" fill="#5AAA5A" text-anchor="middle" opacity="0.6">山树叶</text>
</svg>'''

def icon_yellow_river_sand():
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="#1A1A2A" rx="15"/>
  <rect x="30" y="60" width="140" height="80" fill="#8A7A3A" rx="5"/>
  <g fill="#6A5A2A" opacity="0.5">
    <circle cx="55" cy="80" r="4"/>
    <circle cx="70" cy="95" r="3"/>
    <circle cx="90" cy="85" r="5"/>
    <circle cx="110" cy="100" r="3.5"/>
    <circle cx="130" cy="78" r="4"/>
    <circle cx="150" cy="92" r="3"/>
    <circle cx="65" cy="110" r="3"/>
    <circle cx="100" cy="115" r="4"/>
    <circle cx="140" cy="108" r="3"/>
  </g>
  <rect x="30" y="60" width="140" height="80" fill="none" stroke="#9A8A4A" stroke-width="1" rx="5"/>
  <text x="100" y="175" font-family="serif" font-size="11" fill="#8A7A4A" text-anchor="middle" opacity="0.6">黄河砂</text>
</svg>'''

def icon_goose_feather():
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="#1A1A2A" rx="15"/>
  <g transform="translate(100, 100) rotate(15)">
    <path d="M0 -40 Q15 -30 20 -15 Q22 -5 18 5 Q12 15 0 20" fill="#6A6A7A" opacity="0.8"/>
    <path d="M0 -40 Q-10 -32 -12 -20 Q-13 -10 -8 2 Q-4 12 0 20" fill="#5A5A6A" opacity="0.7"/>
    <line x1="0" y1="-40" x2="0" y2="20" stroke="#4A4A5A" stroke-width="1.5"/>
    <!-- 羽丝 -->
    <g stroke="#7A7A8A" stroke-width="0.5" opacity="0.6">
      <line x1="2" y1="-30" x2="12" y2="-28"/>
      <line x1="3" y1="-20" x2="16" y2="-18"/>
      <line x1="3" y1="-10" x2="14" y2="-8"/>
      <line x1="2" y1="0" x2="12" y2="2"/>
      <line x1="-2" y1="-30" x2="-10" y2="-28"/>
      <line x1="-2" y1="-20" x2="-12" y2="-18"/>
      <line x1="-2" y1="-10" x2="-10" y2="-8"/>
      <line x1="-1" y1="0" x2="-8" y2="2"/>
    </g>
  </g>
  <text x="100" y="175" font-family="serif" font-size="11" fill="#7A7A8A" text-anchor="middle" opacity="0.6">雁羽</text>
</svg>'''

def icon_eagle_feather():
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="#1A1A2A" rx="15"/>
  <g transform="translate(100, 100) rotate(-10)">
    <path d="M0 -45 Q18 -35 25 -18 Q28 -5 22 8 Q14 18 0 25" fill="#E8E8F0" opacity="0.9"/>
    <path d="M0 -45 Q-12 -35 -15 -22 Q-16 -10 -10 3 Q-5 14 0 25" fill="#D8D8E0" opacity="0.8"/>
    <line x1="0" y1="-45" x2="0" y2="25" stroke="#C8C8D0" stroke-width="1.5"/>
    <!-- 羽丝 -->
    <g stroke="#F0F0F8" stroke-width="0.5" opacity="0.7">
      <line x1="2" y1="-35" x2="15" y2="-33"/>
      <line x1="3" y1="-25" x2="20" y2="-22"/>
      <line x1="4" y1="-12" x2="18" y2="-10"/>
      <line x1="3" y1="0" x2="15" y2="2"/>
      <line x1="-2" y1="-35" x2="-12" y2="-33"/>
      <line x1="-3" y1="-25" x2="-14" y2="-22"/>
      <line x1="-3" y1="-12" x2="-12" y2="-10"/>
      <line x1="-2" y1="0" x2="-10" y2="2"/>
    </g>
  </g>
  <text x="100" y="175" font-family="serif" font-size="11" fill="#D8D8E0" text-anchor="middle" opacity="0.6">白鹰羽</text>
</svg>'''

def icon_snowflake():
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="#1A1A2A" rx="15"/>
  <g transform="translate(100, 100)">
    <line x1="0" y1="-45" x2="0" y2="45" stroke="#A0C0D0" stroke-width="1.5"/>
    <line x1="-39" y1="-22.5" x2="39" y2="22.5" stroke="#A0C0D0" stroke-width="1.5"/>
    <line x1="-39" y1="22.5" x2="39" y2="-22.5" stroke="#A0C0D0" stroke-width="1.5"/>
    <!-- 分枝 -->
    <g stroke="#A0C0D0" stroke-width="1">
      <line x1="0" y1="-30" x2="-8" y2="-35"/>
      <line x1="0" y1="-30" x2="8" y2="-35"/>
      <line x1="0" y1="30" x2="-8" y2="35"/>
      <line x1="0" y1="30" x2="8" y2="35"/>
      <line x1="-26" y1="-15" x2="-31" y2="-22"/>
      <line x1="-26" y1="-15" x2="-22" y2="-8"/>
      <line x1="26" y1="15" x2="31" y2="22"/>
      <line x1="26" y1="15" x2="22" y2="8"/>
    </g>
    <circle cx="0" cy="0" r="3" fill="#A0C0D0" opacity="0.5"/>
  </g>
  <text x="100" y="175" font-family="serif" font-size="11" fill="#8AB0C0" text-anchor="middle" opacity="0.6">雪花</text>
</svg>'''

def icon_campfire_charcoal():
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="#1A1A2A" rx="15"/>
  <g transform="translate(100, 95)">
    <!-- 炭 -->
    <path d="M-35 -5 Q-30 -20 -15 -18 Q-5 -25 10 -20 Q20 -22 30 -15 Q35 -5 30 5 Q25 15 15 15 Q5 20 -10 18 Q-20 20 -30 12 Q-35 8 -35 -5Z" fill="#2A1A0A"/>
    <!-- 余烬 -->
    <ellipse cx="-15" cy="-8" rx="6" ry="4" fill="#6A2A0A" opacity="0.6"/>
    <ellipse cx="5" cy="-12" rx="5" ry="3" fill="#8A3A0A" opacity="0.5"/>
    <ellipse cx="20" cy="-5" rx="4" ry="3" fill="#4A1A0A" opacity="0.7"/>
    <ellipse cx="-5" cy="5" rx="7" ry="4" fill="#5A2A0A" opacity="0.4"/>
    <!-- 暗红光芒 -->
    <circle cx="-15" cy="-8" r="10" fill="#8A2A0A" opacity="0.2"/>
    <circle cx="5" cy="-12" r="8" fill="#8A3A0A" opacity="0.15"/>
  </g>
  <text x="100" y="175" font-family="serif" font-size="11" fill="#5A3A2A" text-anchor="middle" opacity="0.6">篝火炭</text>
</svg>'''

# ============================================================
# MAIN
# ============================================================

bg_paths = {
    "prologue/bg.svg": bg_prologue(),
    "chapter-01/bg.svg": bg_chapter01(),
    "chapter-02/bg.svg": bg_chapter02(),
    "chapter-03/bg.svg": bg_chapter03(),
    "chapter-04/bg.svg": bg_chapter04(),
    "chapter-05/bg.svg": bg_chapter05(),
    "chapter-06/bg.svg": bg_chapter06(),
    "chapter-07/bg.svg": bg_chapter07(),
    "chapter-08/bg.svg": bg_chapter08(),
    "chapter-09/bg.svg": bg_chapter09(),
    "chapter-10/bg.svg": bg_chapter10(),
}

icon_paths = {
    "collectibles/bronze_mirror.svg": icon_bronze_mirror(),
    "collectibles/wei_stone.svg": icon_wei_stone(),
    "collectibles/forest_leaf.svg": icon_forest_leaf(),
    "collectibles/yellow_river_sand.svg": icon_yellow_river_sand(),
    "collectibles/goose_feather.svg": icon_goose_feather(),
    "collectibles/eagle_feather.svg": icon_eagle_feather(),
    "collectibles/snowflake.svg": icon_snowflake(),
    "collectibles/campfire_charcoal.svg": icon_campfire_charcoal(),
}

print("🎨 生成背景图...")
for rel, svg in bg_paths.items():
    write_svg(f"{ASSETS_DIR}/{rel}", svg)

print("🎨 生成收集品图标...")
for rel, svg in icon_paths.items():
    write_svg(f"{ASSETS_DIR}/{rel}", svg)

print(f"\n✅ 全部生成完毕！共 {len(bg_paths)} 张背景 + {len(icon_paths)} 个图标")