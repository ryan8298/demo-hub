// =============================================================================
//  Catalog PDF generator · sales leave-behind
//
//  Builds two branded PDFs from the live demo catalog and uploads them to
//  Supabase Storage at DETERMINISTIC (upserted) paths so the public URLs in
//  lib/site.ts stay stable across regenerations:
//
//    catalog/echelix-solution-catalog.pdf   — customer audience (no ACR)
//    catalog/echelix-cosell-catalog.pdf     — microsoft audience (with ACR)
//
//  Re-run whenever the catalog content changes:
//    node scripts/gen-catalog-pdf.mjs
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';

// --- env loader (mirrors gen-arch-diagrams.mjs) ---
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
  }
}
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

// --- brand palette ---
const NAVY = '#1A2B4A';
const SAGE = '#5E7D55';
const ACCENT = '#0E7C7B';
const INK = '#2B2B2B';
const MUTE = '#6B6B6B';
const RULE = '#D8D2C7';

const OUT_DIR = path.resolve(process.cwd(), 'public/catalog');
fs.mkdirSync(OUT_DIR, { recursive: true });

const LOGO_PATH = path.resolve(process.cwd(), 'public/echelix-logo.png');
const HAS_LOGO = fs.existsSync(LOGO_PATH);

// ---------------------------------------------------------------------------
//  Data
// ---------------------------------------------------------------------------
async function fetchDemos(audience) {
  const url = `${SUPABASE_URL}/rest/v1/demos?select=*&audience=cs.{${audience}}&order=title.asc`;
  const res = await fetch(url, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!res.ok) throw new Error(`fetch demos (${audience}) failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// ---------------------------------------------------------------------------
//  PDF building
// ---------------------------------------------------------------------------
const PAGE = { margin: 56, width: 595.28, height: 841.89 }; // A4 portrait (pt)
const CONTENT_W = PAGE.width - PAGE.margin * 2;

function buildPdf({ demos, title, subtitle, withAcr }) {
  const doc = new PDFDocument({ size: 'A4', margin: PAGE.margin, bufferPages: true });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  // ---- Cover ----
  doc.rect(0, 0, PAGE.width, PAGE.height).fill('#FFFFFF');
  // Navy header band — the logo is a white wordmark, so it needs a dark
  // backing to be visible on the otherwise-white cover.
  doc.rect(0, 0, PAGE.width, 150).fill(NAVY);
  if (HAS_LOGO) {
    try { doc.image(LOGO_PATH, PAGE.margin, 52, { width: 150 }); } catch { /* ignore */ }
  } else {
    doc.fillColor('#FFFFFF').font('Times-Bold').fontSize(28).text('ECHELIX', PAGE.margin, 62);
  }
  doc.fillColor(NAVY).font('Times-Bold').fontSize(40)
    .text(title, PAGE.margin, 300, { width: CONTENT_W });
  doc.fillColor(ACCENT).font('Helvetica').fontSize(13)
    .text(subtitle, PAGE.margin, doc.y + 12, { width: CONTENT_W, characterSpacing: 0.5 });
  doc.fillColor(MUTE).font('Helvetica').fontSize(10)
    .text('Modernize. Build Agentic Apps. Deliver Business Value.', PAGE.margin, 700);
  doc.fillColor(MUTE).fontSize(9)
    .text(
      `${demos.length} solutions · Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · echelix.app`,
      PAGE.margin, 716
    );
  doc.moveTo(PAGE.margin, 690).lineTo(PAGE.width - PAGE.margin, 690).lineWidth(1).strokeColor(RULE).stroke();

  // ---- One section per demo ----
  for (const d of demos) {
    doc.addPage();
    renderDemo(doc, d, withAcr);
  }

  // ---- Footer page numbers ----
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    if (i === range.start) continue; // skip cover
    doc.fillColor(MUTE).font('Helvetica').fontSize(8);
    doc.text(
      `Echelix ${withAcr ? 'Co-Sell ' : ''}Solution Catalog`,
      PAGE.margin, PAGE.height - 38, { width: CONTENT_W / 2, lineBreak: false }
    );
    doc.text(
      `${i - range.start} / ${range.count - 1}`,
      PAGE.width - PAGE.margin - 60, PAGE.height - 38, { width: 60, align: 'right', lineBreak: false }
    );
  }

  doc.end();
  return done;
}

function ensureSpace(doc, h) {
  if (doc.y + h > PAGE.height - PAGE.margin - 24) doc.addPage();
}

function heading(doc, label) {
  ensureSpace(doc, 28);
  doc.fillColor(SAGE).font('Helvetica-Bold').fontSize(8)
    .text(label.toUpperCase(), { characterSpacing: 1.2 });
  doc.moveDown(0.35);
}

function body(doc, text) {
  if (!text) return;
  doc.fillColor(INK).font('Helvetica').fontSize(10).text(String(text), { width: CONTENT_W, lineGap: 2 });
  doc.moveDown(0.7);
}

function renderDemo(doc, d, withAcr) {
  // Header block
  doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(8)
    .text((d.industry || 'Solution').toUpperCase(), { characterSpacing: 1 });
  doc.moveDown(0.2);
  doc.fillColor(NAVY).font('Times-Bold').fontSize(22).text(d.title, { width: CONTENT_W });
  doc.moveDown(0.4);
  if (d.description) {
    doc.fillColor(INK).font('Helvetica').fontSize(11).text(d.description, { width: CONTENT_W, lineGap: 2 });
  }
  doc.moveDown(0.5);
  doc.moveTo(PAGE.margin, doc.y).lineTo(PAGE.width - PAGE.margin, doc.y).lineWidth(0.75).strokeColor(RULE).stroke();
  doc.moveDown(0.7);

  // KPI strip
  const kpis = Array.isArray(d.kpi_metrics) ? d.kpi_metrics.slice(0, 3) : [];
  if (kpis.length) {
    const colW = CONTENT_W / kpis.length;
    const top = doc.y;
    kpis.forEach((k, i) => {
      const x = PAGE.margin + i * colW;
      doc.fillColor(NAVY).font('Times-Bold').fontSize(17).text(String(k.value || ''), x, top, { width: colW - 10 });
      doc.fillColor(MUTE).font('Helvetica').fontSize(8).text(String(k.label || ''), x, doc.y + 1, { width: colW - 10 });
    });
    doc.x = PAGE.margin;
    doc.y = top + 52;
    doc.moveDown(0.3);
  }

  if (d.problem_statement) { heading(doc, 'The challenge'); body(doc, d.problem_statement); }
  if (d.target_audience_description) { heading(doc, "Who it's for"); body(doc, d.target_audience_description); }

  const caps = Array.isArray(d.ai_capabilities) ? d.ai_capabilities.slice(0, 5) : [];
  if (caps.length) {
    heading(doc, 'AI capabilities');
    caps.forEach((c) => {
      ensureSpace(doc, 24);
      doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text(`• ${c.label || ''}`, { width: CONTENT_W, continued: !!c.description });
      if (c.description) doc.font('Helvetica').fillColor(MUTE).text(` — ${c.description}`, { width: CONTENT_W });
    });
    doc.moveDown(0.6);
  }

  if (d.roi_summary) { heading(doc, 'Business value'); body(doc, d.roi_summary); }

  const stack = Array.isArray(d.tech_stack) ? d.tech_stack : [];
  if (stack.length) { heading(doc, 'Built on'); body(doc, stack.join('  ·  ')); }

  if (withAcr && d.acr_breakdown) {
    ensureSpace(doc, 60);
    const top = doc.y;
    doc.roundedRect(PAGE.margin, top, CONTENT_W, 4, 0); // spacer
    doc.fillColor(SAGE).font('Helvetica-Bold').fontSize(8).text('MICROSOFT CO-SELL · AZURE ACR', PAGE.margin, top + 6, { characterSpacing: 1.2 });
    doc.moveDown(0.35);
    doc.fillColor(INK).font('Helvetica-Oblique').fontSize(9.5).text(String(d.acr_breakdown), { width: CONTENT_W, lineGap: 2 });
  }
}

// ---------------------------------------------------------------------------
//  Upload
// ---------------------------------------------------------------------------
async function upload(filename, buf) {
  const storagePath = `catalog/${filename}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/demo-assets/${storagePath}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/pdf',
      'x-upsert': 'true', // stable path — overwrite previous catalog
      'Cache-Control': '3600',
    },
    body: buf,
  });
  if (!res.ok) throw new Error(`upload ${filename} failed: ${res.status} ${await res.text()}`);
  return `${SUPABASE_URL}/storage/v1/object/public/demo-assets/${storagePath}`;
}

// ---------------------------------------------------------------------------
//  Run
// ---------------------------------------------------------------------------
console.log('\n=== Catalog PDF generator ===\n');

const [customerDemos, cosellDemos] = await Promise.all([
  fetchDemos('customer'),
  fetchDemos('microsoft'),
]);

const jobs = [
  {
    demos: customerDemos,
    file: 'echelix-solution-catalog.pdf',
    title: 'Solution Catalog',
    subtitle: 'AGENTIC ENTERPRISE SOLUTIONS · BUILT ON ECHELIX LATTICE + AZURE',
    withAcr: false,
  },
  {
    demos: cosellDemos,
    file: 'echelix-cosell-catalog.pdf',
    title: 'Microsoft Co-Sell Catalog',
    subtitle: 'AGENTIC SOLUTIONS · AZURE CONSUMPTION (ACR) SIZING INCLUDED',
    withAcr: true,
  },
];

for (const job of jobs) {
  console.log(`▸ ${job.file}  (${job.demos.length} demos)`);
  const buf = await buildPdf(job);
  fs.writeFileSync(path.join(OUT_DIR, job.file), buf);
  console.log(`   pdf  · ${(buf.length / 1024).toFixed(1)} KB`);
  const publicUrl = await upload(job.file, buf);
  console.log(`   ✓ uploaded  ${publicUrl}\n`);
}

console.log('=== Done ===');
