/**
 * Builds Next.js standalone bundle and copies files into hostinger-deploy/
 * Upload that folder via FTP to your Hostinger Node.js app root.
 *
 * Usage: node scripts/prepare-hostinger-deploy.js
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = __dirname.replace(/[\\/]scripts$/, "");
const deployDir = path.join(root, "hostinger-deploy");

function rm(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function cp(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

console.log("📦 Building Next.js (standalone)…");
execSync("npm run build", { cwd: root, stdio: "inherit", shell: true });

const standalone = path.join(root, ".next", "standalone");
if (!fs.existsSync(standalone)) {
  console.error("❌ .next/standalone not found. Check next.config output: standalone");
  process.exit(1);
}

console.log("📁 Preparing hostinger-deploy/ …");
rm(deployDir);
fs.mkdirSync(deployDir, { recursive: true });

cp(standalone, deployDir);
cp(path.join(root, ".next", "static"), path.join(deployDir, ".next", "static"));
cp(path.join(root, "public"), path.join(deployDir, "public"));

fs.mkdirSync(path.join(deployDir, "public", "uploads"), { recursive: true });

const hostingerPkg = {
  name: "gos-mart-menu",
  version: "1.0.0",
  private: true,
  scripts: {
    start: "node server.js",
  },
  engines: {
    node: ">=18.17.0",
  },
};
fs.writeFileSync(
  path.join(deployDir, "package.json"),
  JSON.stringify(hostingerPkg, null, 2)
);

const readme = `# Upload this folder to Hostinger Node.js app root via FTP/File Manager.

Startup command in hPanel: npm start  (runs node server.js)
Set environment variables from .env.production.example in hPanel → Node.js → Environment variables.

Before first deploy, run db:setup locally with production DATABASE_URL (Neon).
`;
fs.writeFileSync(path.join(deployDir, "README-DEPLOY.txt"), readme);

console.log("\n✅ Ready: hostinger-deploy/");
console.log("   Upload contents via FTP to your Node.js application folder on Hostinger.");
console.log("   Do NOT upload .env files — set vars in hPanel instead.\n");
