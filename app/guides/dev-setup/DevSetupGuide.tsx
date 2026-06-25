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

type Tool = {
  name: string;
  why: string;
  windows: string[];
  macos: string[];
  configNote?: string;
};

type Category = {
  label: string;
  tools: Tool[];
};

const categories: Category[] = [
  {
    label: 'พื้นฐาน Web Dev',
    tools: [
      {
        name: 'Git',
        why: 'Version control พื้นฐานที่ต้องมีก่อนอย่างอื่นทั้งหมด',
        windows: [
          'โหลดตัวติดตั้งจาก git-scm.com แล้วรันแบบ Next ตามค่า default',
          'ระหว่างติดตั้งเลือก "Git from the command line and also from 3rd-party software"',
        ],
        macos: [
          'ติดตั้ง Homebrew ก่อน (ดูหัวข้อ Terminal & Package Manager ด้านล่าง)',
          'brew install git',
        ],
        configNote: 'git config --global user.name "ชื่อ" และ git config --global user.email "อีเมล"',
      },
      {
        name: 'Terminal & Package Manager',
        why: 'Windows ใช้ WSL2 เพื่อให้ได้ Linux shell จริง ส่วน macOS ใช้ Homebrew เป็น package manager หลัก',
        windows: [
          'เปิด PowerShell (Admin) แล้วรัน: wsl --install',
          'รีสตาร์ทเครื่อง แล้วตั้งค่า Ubuntu ที่ติดมาด้วย (ตั้ง username/password)',
          'ติดตั้ง Windows Terminal จาก Microsoft Store เพื่อ UI ที่ดีขึ้น',
        ],
        macos: [
          'เปิด Terminal แล้วรัน: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
          'ทำตามคำสั่งท้ายการติดตั้งเพื่อเพิ่ม brew เข้า PATH (eval "$(/opt/homebrew/bin/brew shellenv)")',
        ],
      },
      {
        name: 'Node.js (ผ่าน Version Manager)',
        why: 'ใช้ nvm/fnm แทนการติดตั้ง Node ตรงๆ จะสลับเวอร์ชันต่อโปรเจกต์ได้ง่าย',
        windows: [
          'ติดตั้งผ่าน WSL: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash',
          'เปิด terminal ใหม่ แล้วรัน: nvm install --lts',
        ],
        macos: [
          'brew install nvm',
          'เพิ่ม nvm init เข้า ~/.zshrc ตามที่ brew info nvm แนะนำ',
          'nvm install --lts',
        ],
        configNote: 'nvm use --lts แล้วเช็คด้วย node -v และ npm -v',
      },
      {
        name: 'pnpm (Package Manager)',
        why: 'เร็วและประหยัด disk กว่า npm สำหรับโปรเจกต์ที่มี dependency เยอะ',
        windows: ['ใน WSL: corepack enable && corepack prepare pnpm@latest --activate'],
        macos: ['brew install pnpm'],
      },
      {
        name: 'VS Code',
        why: 'Editor หลัก พร้อม extension ครบสำหรับ Web Dev',
        windows: [
          'โหลดจาก code.visualstudio.com แล้วติดตั้งแบบปกติ',
          'ติดตั้ง extension "WSL" เพื่อเปิดโปรเจกต์จาก WSL ได้โดยตรง',
        ],
        macos: ['brew install --cask visual-studio-code'],
        configNote: 'Extension ที่แนะนำ: ESLint, Prettier, GitLens, Tailwind CSS IntelliSense',
      },
    ],
  },
  {
    label: 'Database & Docker',
    tools: [
      {
        name: 'Docker Desktop',
        why: 'รัน Database/Service แบบ container แทนการติดตั้งลงเครื่องตรงๆ',
        windows: [
          'โหลด Docker Desktop จาก docker.com (ต้องมี WSL2 ติดตั้งไว้ก่อน)',
          'ตอนติดตั้งเลือก "Use WSL 2 instead of Hyper-V"',
        ],
        macos: ['brew install --cask docker', 'เปิดแอป Docker.app ครั้งแรกเพื่อ initialize'],
      },
      {
        name: 'PostgreSQL / MySQL',
        why: 'รันผ่าน Docker เพื่อให้ตั้งค่า/ลบทิ้งง่าย ไม่เปื้อนเครื่อง',
        windows: ['docker run --name pg -e POSTGRES_PASSWORD=pass -p 5432:5432 -d postgres'],
        macos: ['docker run --name pg -e POSTGRES_PASSWORD=pass -p 5432:5432 -d postgres'],
        configNote: 'หรือใช้ docker-compose.yml ถ้ามีหลาย service ในโปรเจกต์เดียว',
      },
      {
        name: 'DB GUI Client',
        why: 'ดูข้อมูล/รัน query แบบไม่ต้องพิมพ์ SQL command line ตลอด',
        windows: ['โหลด TablePlus หรือ DBeaver Community จากเว็บไซต์โดยตรง'],
        macos: ['brew install --cask tableplus', 'หรือ brew install --cask dbeaver-community'],
      },
    ],
  },
  {
    label: 'Cloud & Deploy Tools',
    tools: [
      {
        name: 'GitHub CLI',
        why: 'จัดการ PR/Issue/Repo จาก terminal ได้โดยไม่ต้องสลับไปเว็บ',
        windows: ['ใน WSL: sudo apt install gh', 'gh auth login'],
        macos: ['brew install gh', 'gh auth login'],
      },
      {
        name: 'Vercel CLI',
        why: 'Deploy/ดู log/จัดการ env var ของโปรเจกต์ Next.js ที่ขึ้น Vercel',
        windows: ['npm i -g vercel', 'vercel login'],
        macos: ['npm i -g vercel', 'vercel login'],
        configNote: 'รัน vercel link ในโฟลเดอร์โปรเจกต์เพื่อผูกกับ Vercel project',
      },
      {
        name: 'AWS / GCP CLI',
        why: 'จำเป็นเมื่อโปรเจกต์ต้องยิงไปยัง Cloud Provider โดยตรง',
        windows: ['ใน WSL: curl เอา installer ตามเอกสารของ AWS CLI v2 หรือ Google Cloud SDK'],
        macos: ['brew install awscli', 'brew install --cask google-cloud-sdk'],
      },
    ],
  },
];

function CopyableCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [command]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
      <Typography
        component="code"
        sx={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: '0.8rem',
          backgroundColor: '#f2ede7',
          border: '1px solid',
          borderColor: 'divider',
          borderRight: 'none',
          px: 2,
          py: 1,
          flex: 1,
          whiteSpace: 'pre-wrap',
          color: 'text.primary',
        }}
      >
        {command}
      </Typography>
      <Tooltip title={copied ? 'คัดลอกแล้ว' : 'คัดลอกคำสั่ง'} placement="top">
        <IconButton
          onClick={handleCopy}
          aria-label="คัดลอกคำสั่ง"
          sx={{
            borderRadius: 0,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#f2ede7',
            color: copied ? 'secondary.main' : 'text.secondary',
            '&:hover': { backgroundColor: '#e8e4df' },
          }}
        >
          {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
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
        <Box sx={{ pt: { xs: 16, md: 22 }, pb: { xs: 8, md: 10 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 4, md: 10 } }}>
            <Typography
              component={Link}
              href="/"
              variant="caption"
              sx={{ display: 'inline-block', mb: 4, color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'secondary.main' } }}
            >
              ← กลับหน้าหลัก
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'secondary.main',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                '&::before': {
                  content: '""',
                  display: 'block',
                  width: 40,
                  height: '1px',
                  backgroundColor: 'secondary.main',
                },
              }}
            >
              Guides
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
              Dev Environment{' '}
              <Box component="span" sx={{ fontStyle: 'italic', color: 'secondary.main' }}>
                Setup Guide
              </Box>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560 }}>
              คู่มือเซ็ตเครื่องสำหรับเริ่มงาน Dev ตั้งแต่ศูนย์ — เลือกระบบปฏิบัติการของคุณแล้วทำตามลำดับขั้นด้านล่าง
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ px: { xs: 4, md: 10 }, pb: { xs: 12, md: 16 } }}>
          <Tabs
            value={os}
            onChange={(_, v) => handleOsChange(v)}
            sx={{ mb: { xs: 6, md: 8 }, borderBottom: '1px solid', borderColor: 'divider' }}
          >
            <Tab value="macos" label="macOS" />
            <Tab value="windows" label="Windows" />
          </Tabs>

          {categories.map((cat) => (
            <Box key={cat.label} sx={{ mb: { xs: 8, md: 10 } }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: 'secondary.main', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
              >
                {cat.label}
              </Typography>

              <Box>
                {cat.tools.map((tool, i) => (
                  <Box key={tool.name}>
                    <Box sx={{ py: { xs: 4, md: 5 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 8 } }}>
                      <Box sx={{ minWidth: { md: 260 } }}>
                        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500, textTransform: 'none', letterSpacing: 'normal', mb: 1 }}>
                          {tool.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tool.why}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {(os === 'windows' ? tool.windows : tool.macos).map((step, si) => (
                          <CopyableCommand key={si} command={step} />
                        ))}
                        {tool.configNote && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, textTransform: 'none', letterSpacing: 'normal' }}>
                            {tool.configNote}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {i < cat.tools.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Container>
      </Box>
      <Footer />
    </>
  );
}
