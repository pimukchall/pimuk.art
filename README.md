# pimuk.art

Portfolio website ส่วนตัวของ Pimuk Artharnnarong — Full-Stack Developer & Enterprise Architect

**Live:** https://www.pimuk.art

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI Library | MUI v9 (Material UI) |
| Styling | Emotion + MUI Theme |
| Font | Cormorant Garamond, Noto Sans Thai |
| Analytics | Vercel Analytics + Speed Insights |
| Hosting | Vercel |
| Language | TypeScript |

---

## Project Structure

```
app/
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── ServicesSection.tsx
│   ├── WorkSection.tsx
│   ├── EducationSection.tsx
│   ├── ContactSection.tsx
│   └── Footer.tsx
├── icon.tsx          # Favicon (generated via ImageResponse)
├── layout.tsx        # Root layout + Analytics
├── page.tsx          # Single-page composition
├── theme.ts          # MUI theme config (colors, typography)
├── ThemeRegistry.tsx # MUI SSR setup สำหรับ Next.js
└── globals.css
public/
└── profile.jpg       # Profile photo
```

---

## Commands

### Development

```bash
# ติดตั้ง dependencies
npm install

# รัน dev server (http://localhost:3000)
npm run dev

# ตรวจ TypeScript + build
npm run build

# รัน production build locally
npm run start

# Lint
npm run lint
```

### Vercel

```bash
# Login
vercel login

# Link project กับ Vercel (ครั้งแรก)
vercel link

# Deploy preview
vercel

# Deploy production
vercel --prod

# ดู deployment ล่าสุด
vercel ls

# ดู logs
vercel logs <deployment-url>
```

---

## Theme

Brand colors ที่ใช้ตลอดทั้งไซต์:

| Token | Hex | Usage |
|---|---|---|
| `primary.main` | `#1a1a1a` | Text, buttons, favicon bg |
| `secondary.main` | `#c9a96e` | Accent, highlights, favicon text |
| `background.default` | `#fafaf8` | Page background |
| `divider` | `#e8e4df` | Borders, lines |

---

## Security Notes

- ไม่มีไฟล์ที่มีข้อมูลส่วนตัวอยู่ใน repository
- `public/` มีเฉพาะ SVG assets และ `profile.jpg`
- ไม่มี `.env` ที่มี secrets (ไม่ต้องการ env vars สำหรับ frontend-only site)
