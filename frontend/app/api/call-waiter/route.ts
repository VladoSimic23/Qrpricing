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

type TelegramApiResponse = {
  ok: boolean;
  description?: string;
};

function normalizeTable(raw: unknown) {
  const value = String(raw ?? "")
    .trim()
    .slice(0, 24);
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
    let body: CallWaiterPayload = {};
    try {
      body = (await request.json()) as CallWaiterPayload;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim()
        : String(body.slug || "").trim();

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
    const locale =
      typeof body.locale === "string" ? body.locale : String(body.locale || "");
    const isEn = locale.toLowerCase().startsWith("en");
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

    const sendTelegramMessage = async (payload: typeof telegramPayload) => {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      let telegramResult: TelegramApiResponse | null = null;
      try {
        telegramResult = (await response.json()) as TelegramApiResponse;
      } catch {
        telegramResult = null;
      }

      return { response, telegramResult };
    };

    let { response: telegramResponse, telegramResult } =
      await sendTelegramMessage(telegramPayload);

    const threadError =
      tenant.telegramThreadId &&
      !telegramResponse.ok &&
      (telegramResult?.description || "")
        .toLowerCase()
        .includes("message thread not found");

    if (threadError) {
      const fallbackPayload = { ...telegramPayload };
      delete fallbackPayload.message_thread_id;
      ({ response: telegramResponse, telegramResult } =
        await sendTelegramMessage(fallbackPayload));
    }

    if (!telegramResponse.ok) {
      const description =
        telegramResult?.description || "Unknown Telegram error";
      const detailedDescription =
        telegramResponse.status === 401
          ? `${description} (Telegram bot token is invalid or revoked)`
          : description;
      console.error("[call-waiter] Telegram send failed", {
        slug,
        tenantId: tenant._id,
        status: telegramResponse.status,
        description: detailedDescription,
      });

      return NextResponse.json(
        { error: `Telegram send failed: ${detailedDescription}` },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[call-waiter] Unexpected error", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
