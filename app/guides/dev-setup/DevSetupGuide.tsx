'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

type OS = 'windows' | 'macos';

type Step = { text: string; cmd?: boolean };

type Tool = {
  name: string;
  why: string;
  windows: Step[];
  macos: Step[];
  note?: string;
};

type Category = {
  id: string;
  label: string;
  tools: Tool[];
};

const categories: Category[] = [
  {
    id: '01',
    label: 'Terminal & Shell',
    tools: [
      {
        name: 'Terminal App',
        why: 'Windows → Windows Terminal (หน้าตาดี, multi-tab, WSL support). macOS → iTerm2 หรือ Ghostty',
        windows: [
          { text: '# ติดตั้งจาก Microsoft Store', cmd: false },
          { text: 'winget install --id Microsoft.WindowsTerminal', cmd: true },
        ],
        macos: [
          { text: 'brew install --cask iterm2', cmd: true },
          { text: '# หรือ Ghostty (เร็วกว่า, GPU-accelerated)', cmd: false },
          { text: 'brew install --cask ghostty', cmd: true },
        ],
      },
      {
        name: 'WSL 2 (Windows เท่านั้น)',
        why: 'Linux shell จริงๆ บน Windows — จำเป็นสำหรับ Docker, nvm, และ dev tools ส่วนใหญ่',
        windows: [
          { text: '# เปิด PowerShell (Admin)', cmd: false },
          { text: 'wsl --install', cmd: true },
          { text: '# รีสตาร์ทเครื่อง แล้ว distro จะ set up อัตโนมัติ', cmd: false },
          { text: '# ตั้ง username + password สำหรับ Ubuntu', cmd: false },
        ],
        macos: [
          { text: '# ไม่จำเป็น — macOS มี Unix shell อยู่แล้ว', cmd: false },
        ],
        note: 'หลังจาก WSL พร้อม ให้รัน command ทุกอย่างใน WSL terminal ไม่ใช่ PowerShell',
      },
      {
        name: 'Zsh + Oh My Zsh',
        why: 'Shell ที่ทันสมัยกว่า bash — plugins, autocomplete, theming ครบ',
        windows: [
          { text: '# ใน WSL terminal', cmd: false },
          { text: 'sudo apt update && sudo apt install zsh -y', cmd: true },
          { text: 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"', cmd: true },
        ],
        macos: [
          { text: '# macOS มี zsh เป็น default แล้ว ติดแค่ Oh My Zsh', cmd: false },
          { text: 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"', cmd: true },
        ],
        note: 'Plugin ที่แนะนำใน ~/.zshrc: plugins=(git zsh-autosuggestions zsh-syntax-highlighting)',
      },
      {
        name: 'Starship Prompt',
        why: 'Prompt สวยงามและเร็ว — แสดง git branch, node version, language ปัจจุบันอัตโนมัติ',
        windows: [
          { text: '# ใน WSL', cmd: false },
          { text: 'curl -sS https://starship.rs/install.sh | sh', cmd: true },
          { text: '# เพิ่มบรรทัดนี้ท้าย ~/.zshrc', cmd: false },
          { text: 'eval "$(starship init zsh)"', cmd: true },
        ],
        macos: [
          { text: 'brew install starship', cmd: true },
          { text: '# เพิ่มบรรทัดนี้ท้าย ~/.zshrc', cmd: false },
          { text: 'eval "$(starship init zsh)"', cmd: true },
        ],
      },
    ],
  },
  {
    id: '02',
    label: 'Package Manager & Runtime',
    tools: [
      {
        name: 'Homebrew (macOS)',
        why: 'Package manager หลักของ macOS — ติดตั้งเกือบทุกอย่างผ่าน brew ได้',
        windows: [
          { text: '# ไม่จำเป็น — Windows ใช้ winget หรือ scoop แทน', cmd: false },
        ],
        macos: [
          { text: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', cmd: true },
          { text: '# เพิ่ม brew เข้า PATH (Apple Silicon)', cmd: false },
          { text: 'eval "$(/opt/homebrew/bin/brew shellenv)"', cmd: true },
        ],
      },
      {
        name: 'Node.js via nvm',
        why: 'ใช้ nvm แทนการติดตั้ง Node ตรงๆ เพื่อสลับ version ต่อโปรเจกต์ได้',
        windows: [
          { text: '# ใน WSL terminal', cmd: false },
          { text: 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash', cmd: true },
          { text: '# เปิด terminal ใหม่', cmd: false },
          { text: 'nvm install --lts && nvm use --lts', cmd: true },
        ],
        macos: [
          { text: 'brew install nvm', cmd: true },
          { text: '# เพิ่มใน ~/.zshrc ตาม brew info nvm', cmd: false },
          { text: 'nvm install --lts && nvm use --lts', cmd: true },
        ],
        note: 'เช็คด้วย: node -v && npm -v',
      },
      {
        name: 'pnpm',
        why: 'Package manager ที่เร็วกว่าและประหยัด disk กว่า npm — แนะนำสำหรับ monorepo',
        windows: [
          { text: 'corepack enable && corepack prepare pnpm@latest --activate', cmd: true },
        ],
        macos: [
          { text: 'brew install pnpm', cmd: true },
        ],
        note: 'pnpm i แทน npm install, pnpm dlx แทน npx',
      },
      {
        name: 'Bun',
        why: 'Runtime + package manager ทางเลือกที่เร็วมาก — รัน TypeScript ได้ตรงๆ โดยไม่ต้อง transpile',
        windows: [
          { text: '# ใน WSL', cmd: false },
          { text: 'curl -fsSL https://bun.sh/install | bash', cmd: true },
        ],
        macos: [
          { text: 'brew install bun', cmd: true },
        ],
        note: 'bun run index.ts — ไม่ต้อง tsc, bun install เร็วกว่า npm ~25x',
      },
    ],
  },
  {
    id: '03',
    label: 'Editor & Extensions',
    tools: [
      {
        name: 'VS Code',
        why: 'Editor หลัก — ecosystem extension กว้างที่สุด, remote development, integrated terminal',
        windows: [
          { text: 'winget install --id Microsoft.VisualStudioCode', cmd: true },
          { text: '# ติดตั้ง extension "WSL" เพื่อเปิดโปรเจกต์จาก WSL', cmd: false },
          { text: 'code --install-extension ms-vscode-remote.remote-wsl', cmd: true },
        ],
        macos: [
          { text: 'brew install --cask visual-studio-code', cmd: true },
        ],
        note: 'Extensions แนะนำ: ESLint, Prettier, GitLens, Tailwind IntelliSense, Prisma, Error Lens',
      },
      {
        name: 'Cursor',
        why: 'VS Code fork ที่มี AI built-in (GPT-4o / Claude) — Tab completion + chat ใน editor เดียว',
        windows: [
          { text: '# โหลดจาก cursor.com แล้วติดตั้งแบบปกติ', cmd: false },
          { text: 'winget install --id Anysphere.Cursor', cmd: true },
        ],
        macos: [
          { text: 'brew install --cask cursor', cmd: true },
        ],
        note: 'Import settings จาก VS Code ได้ทันที: Cursor → Migrate from VS Code',
      },
      {
        name: 'Claude Code (CLI)',
        why: 'AI coding agent ที่รันใน terminal — อ่านไฟล์, แก้โค้ด, รัน command ในโปรเจกต์ได้',
        windows: [
          { text: '# ใน WSL', cmd: false },
          { text: 'npm install -g @anthropic-ai/claude-code', cmd: true },
          { text: 'claude', cmd: true },
        ],
        macos: [
          { text: 'npm install -g @anthropic-ai/claude-code', cmd: true },
          { text: 'claude', cmd: true },
        ],
        note: 'ต้องมี Anthropic API key หรือ login ผ่าน claude.ai ครั้งแรก',
      },
    ],
  },
  {
    id: '04',
    label: 'Git & Version Control',
    tools: [
      {
        name: 'Git',
        why: 'Version control พื้นฐาน — ต้องมีก่อนอย่างอื่นทั้งหมด',
        windows: [
          { text: '# ใน WSL (แนะนำ) หรือโหลด installer จาก git-scm.com', cmd: false },
          { text: 'sudo apt install git -y', cmd: true },
        ],
        macos: [
          { text: 'brew install git', cmd: true },
        ],
        note: 'git config --global user.name "ชื่อ" && git config --global user.email "อีเมล"',
      },
      {
        name: 'GitHub CLI',
        why: 'จัดการ PR / Issue / Repo จาก terminal — ไม่ต้องสลับไปเว็บ',
        windows: [
          { text: '# ใน WSL', cmd: false },
          { text: 'sudo apt install gh -y', cmd: true },
          { text: 'gh auth login', cmd: true },
        ],
        macos: [
          { text: 'brew install gh', cmd: true },
          { text: 'gh auth login', cmd: true },
        ],
        note: 'gh pr create, gh pr list, gh issue view — ใช้ใน repo ได้เลย',
      },
      {
        name: 'SSH Key Setup',
        why: 'ผูก SSH key กับ GitHub เพื่อ push โดยไม่ต้องพิมพ์ password ทุกครั้ง',
        windows: [
          { text: '# ใน WSL', cmd: false },
          { text: 'ssh-keygen -t ed25519 -C "your@email.com"', cmd: true },
          { text: 'cat ~/.ssh/id_ed25519.pub', cmd: true },
          { text: '# copy output ไปวางใน GitHub → Settings → SSH Keys', cmd: false },
        ],
        macos: [
          { text: 'ssh-keygen -t ed25519 -C "your@email.com"', cmd: true },
          { text: 'pbcopy < ~/.ssh/id_ed25519.pub', cmd: true },
          { text: '# วางใน GitHub → Settings → SSH Keys', cmd: false },
        ],
        note: 'เช็คด้วย: ssh -T git@github.com',
      },
    ],
  },
  {
    id: '05',
    label: 'Database & Docker',
    tools: [
      {
        name: 'Docker Desktop',
        why: 'รัน Database / Service เป็น container — ไม่เปื้อนเครื่อง ลบทิ้งง่าย',
        windows: [
          { text: '# ต้องมี WSL2 ก่อน', cmd: false },
          { text: 'winget install --id Docker.DockerDesktop', cmd: true },
          { text: '# เลือก "Use WSL 2 instead of Hyper-V" ระหว่างติดตั้ง', cmd: false },
        ],
        macos: [
          { text: 'brew install --cask docker', cmd: true },
          { text: '# เปิด Docker.app ครั้งแรกเพื่อ initialize', cmd: false },
        ],
      },
      {
        name: 'MySQL (Docker)',
        why: 'สำหรับ Local development — แยก port ต่อโปรเจกต์ได้ไม่ชนกัน',
        windows: [
          { text: 'docker run --name mysql-dev -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8', cmd: true },
        ],
        macos: [
          { text: 'docker run --name mysql-dev -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8', cmd: true },
        ],
        note: 'docker-compose.yml ดีกว่าถ้ามีหลาย service — version, port, volume ชัดเจน',
      },
      {
        name: 'DB GUI Client',
        why: 'ดูข้อมูลและรัน query ผ่าน UI — TablePlus สำหรับ macOS, DBeaver ข้ามแพลตฟอร์ม',
        windows: [
          { text: 'winget install --id dbeaver.dbeaver', cmd: true },
        ],
        macos: [
          { text: 'brew install --cask tableplus', cmd: true },
          { text: '# หรือ DBeaver (ฟรี, ข้ามแพลตฟอร์ม)', cmd: false },
          { text: 'brew install --cask dbeaver-community', cmd: true },
        ],
      },
    ],
  },
  {
    id: '06',
    label: 'Cloud & Deploy',
    tools: [
      {
        name: 'Vercel CLI',
        why: 'Deploy / pull env / ดู log ของโปรเจกต์ Next.js ที่ขึ้น Vercel จาก terminal',
        windows: [
          { text: 'npm i -g vercel', cmd: true },
          { text: 'vercel login', cmd: true },
          { text: '# ผูกโปรเจกต์', cmd: false },
          { text: 'vercel link && vercel env pull', cmd: true },
        ],
        macos: [
          { text: 'npm i -g vercel', cmd: true },
          { text: 'vercel login', cmd: true },
          { text: 'vercel link && vercel env pull', cmd: true },
        ],
        note: 'vercel dev — รัน local ด้วย env เดียวกับ Vercel production',
      },
      {
        name: 'PM2',
        why: 'Process manager สำหรับ Node.js บน server — auto-restart, log, cluster mode',
        windows: [
          { text: '# ใน WSL หรือ server', cmd: false },
          { text: 'npm i -g pm2', cmd: true },
          { text: 'pm2 start server.js --name api', cmd: true },
          { text: 'pm2 startup && pm2 save', cmd: true },
        ],
        macos: [
          { text: 'npm i -g pm2', cmd: true },
          { text: 'pm2 start server.js --name api', cmd: true },
          { text: 'pm2 startup && pm2 save', cmd: true },
        ],
        note: 'pm2 logs api, pm2 monit — monitor realtime',
      },
      {
        name: 'Railway CLI',
        why: 'Deploy backend / database บน Railway cloud จาก terminal',
        windows: [
          { text: '# ใน WSL', cmd: false },
          { text: 'curl -fsSL cli.new | sh', cmd: true },
          { text: 'railway login', cmd: true },
        ],
        macos: [
          { text: 'brew install railwayapp/railway/railway', cmd: true },
          { text: 'railway login', cmd: true },
        ],
        note: 'railway up — deploy, railway logs — ดู log production',
      },
    ],
  },
];

function CommandBlock({ step }: { step: Step }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(step.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [step.text]);

  if (!step.cmd) {
    return (
      <Typography
        sx={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '0.75rem',
          color: 'text.secondary',
          py: 0.5,
          pl: 0.5,
          opacity: 0.6,
        }}
      >
        {step.text}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
      <Box
        sx={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '0.8rem',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRight: 'none',
          px: 2,
          py: 1,
          flex: 1,
          whiteSpace: 'pre-wrap',
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box component="span" sx={{ color: '#4ade80', flexShrink: 0, userSelect: 'none' }}>$</Box>
        {step.text}
      </Box>
      <Tooltip title={copied ? 'copied!' : 'copy'} placement="top">
        <IconButton
          onClick={handleCopy}
          aria-label="copy command"
          size="small"
          sx={{
            borderRadius: 0,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            color: copied ? '#4ade80' : 'text.secondary',
            px: 1.5,
            '&:hover': { borderColor: '#4ade80', color: '#4ade80', backgroundColor: 'background.paper' },
            transition: 'all 0.15s',
          }}
        >
          {copied ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default function DevSetupGuide() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const osParam = searchParams.get('os');
  const os: OS = osParam === 'windows' ? 'windows' : 'macos';

  const handleOsChange = (value: OS) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('os', value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ pt: { xs: 16, md: 22 }, pb: { xs: 8, md: 10 }, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
          <Container maxWidth="lg" sx={{ px: { xs: 4, md: 10 } }}>
            <Typography
              component={Link}
              href="/"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 4,
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.7rem',
                color: 'text.secondary',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                '&:hover': { color: '#4ade80' },
                transition: 'color 0.2s',
              }}
            >
              ← cd ..
            </Typography>

            <Typography
              sx={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.7rem',
                color: '#4ade80',
                mb: 2,
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: 'text.secondary', opacity: 0.4 }}>//</Box> guides
            </Typography>

            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 2 }}>
              Dev Environment{' '}
              <Box component="span" sx={{ color: '#4ade80' }}>
                Setup Guide
              </Box>
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mb: 0 }}>
              คู่มือเซ็ตเครื่องสำหรับ Web Dev ตั้งแต่ศูนย์ — เลือก OS แล้วทำตามลำดับ
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ px: { xs: 4, md: 10 }, pb: { xs: 12, md: 16 } }}>
          {/* OS Tabs */}
          <Tabs
            value={os}
            onChange={(_, v) => handleOsChange(v)}
            sx={{
              mt: { xs: 6, md: 8 },
              mb: { xs: 6, md: 8 },
              borderBottom: '1px solid',
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'none',
                color: 'text.secondary',
                minHeight: 40,
                px: 0,
                mr: 4,
              },
              '& .Mui-selected': { color: '#4ade80 !important' },
              '& .MuiTabs-indicator': { backgroundColor: '#4ade80' },
            }}
          >
            <Tab value="macos" label="macOS" />
            <Tab value="windows" label="Windows (WSL2)" />
          </Tabs>

          {/* Categories */}
          {categories.map((cat) => (
            <Box key={cat.id} sx={{ mb: { xs: 10, md: 14 } }}>
              {/* Category header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '0.6rem',
                    color: '#4ade80',
                    opacity: 0.5,
                    letterSpacing: '0.05em',
                    flexShrink: 0,
                  }}
                >
                  {cat.id}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {cat.label}
                </Typography>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: 'divider' }} />
              </Box>

              {/* Tools */}
              {cat.tools.map((tool, i) => (
                <Box key={tool.name}>
                  <Box
                    sx={{
                      py: { xs: 4, md: 5 },
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: { xs: 3, md: 8 },
                    }}
                  >
                    {/* Left: name + why */}
                    <Box sx={{ minWidth: { md: 240 }, maxWidth: { md: 240 } }}>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-geist-mono), monospace',
                          fontSize: '0.9rem',
                          fontWeight: 400,
                          color: 'text.primary',
                          mb: 1,
                        }}
                      >
                        {tool.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {tool.why}
                      </Typography>
                    </Box>

                    {/* Right: steps */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      {(os === 'windows' ? tool.windows : tool.macos).map((step, si) => (
                        <CommandBlock key={si} step={step} />
                      ))}
                      {tool.note && (
                        <Box
                          sx={{
                            mt: 0.5,
                            px: 2,
                            py: 1,
                            borderLeft: '2px solid',
                            borderColor: '#4ade80',
                            opacity: 0.7,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-geist-mono), monospace',
                              fontSize: '0.7rem',
                              color: 'text.secondary',
                              letterSpacing: '0.02em',
                            }}
                          >
                            {tool.note}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  {i < cat.tools.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          ))}
        </Container>
      </Box>
      <Footer />
    </>
  );
}
