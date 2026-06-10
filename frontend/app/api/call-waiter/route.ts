import { NextResponse } from "next/server";

import { serverReadClient } from "@/sanity/lib/serverClient";

type CallWaiterPayload = {
  slug?: string;
  table?: string;
  locale?: string;
};

type TenantWaiterConfig = {
  _id: string;
  name: string;
  allowWaiterCall?: boolean;
  telegramChatId?: string;
  telegramThreadId?: number;
};

function normalizeTable(raw?: string) {
  const value = (raw || "").trim().slice(0, 24);
  return value || null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CallWaiterPayload;
    const slug = (body.slug || "").trim();

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const tenant = await serverReadClient.fetch<TenantWaiterConfig | null>(
      `*[_type == "tenant" && slug.current == $slug && isActive != false][0]{
        _id,
        name,
        allowWaiterCall,
        telegramChatId,
        telegramThreadId
      }`,
      { slug },
    );

    if (!tenant || !tenant.allowWaiterCall || !tenant.telegramChatId) {
      return NextResponse.json(
        { error: "Waiter call is not enabled" },
        { status: 400 },
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json(
        { error: "Telegram bot is not configured" },
        { status: 500 },
      );
    }

    const table = normalizeTable(body.table);
    const isEn = (body.locale || "").toLowerCase().startsWith("en");
    const now = new Date().toLocaleTimeString(isEn ? "en-GB" : "hr-HR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const messageLines = [
      isEn ? "<b>Waiter call</b>" : "<b>Poziv konobaru</b>",
      `${isEn ? "Venue" : "Lokal"}: <b>${escapeHtml(tenant.name)}</b>`,
      `${isEn ? "Table" : "Stol"}: <b>${escapeHtml(table || (isEn ? "Unknown" : "Nepoznato"))}</b>`,
      `${isEn ? "Time" : "Vrijeme"}: ${now}`,
      `${isEn ? "Menu" : "Meni"}: /menu/${slug}`,
    ];

    const telegramPayload: {
      chat_id: string;
      text: string;
      parse_mode: "HTML";
      disable_web_page_preview: boolean;
      message_thread_id?: number;
    } = {
      chat_id: tenant.telegramChatId,
      text: messageLines.join("\n"),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    };

    if (tenant.telegramThreadId && tenant.telegramThreadId > 0) {
      telegramPayload.message_thread_id = tenant.telegramThreadId;
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(telegramPayload),
      },
    );

    if (!telegramResponse.ok) {
      return NextResponse.json(
        { error: "Telegram send failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
