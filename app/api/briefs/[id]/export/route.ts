
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brief = await prisma.brief.findUnique({ where: { id } });
  if (!brief) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(`
      <html><head><meta charset="utf-8"/>
        <style>
          body{font-family:Arial, sans-serif; padding: 28px;}
          h1{font-size:24px; margin:0 0 10px;}
          h2{font-size:14px; margin:18px 0 6px; text-transform:uppercase; letter-spacing:.08em;}
          p,li{font-size:12px; line-height:1.55;}
          .brand{font-size:10px; color:#666; margin-bottom:10px;}
        </style>
      </head><body>
        <div class="brand">NomosX — The agentic think tank</div>
        ${brief.html}
      </body></html>
    `, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", printBackground: true, margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" } });
    return new NextResponse(Buffer.from(pdf as any), { headers: { "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=nomosx-brief.pdf" } });
  } finally {
    await browser.close();
  }
}
