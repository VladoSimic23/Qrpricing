import { revalidatePath } from "next/cache";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { DashboardSectionsTabs } from "./DashboardSectionsTabs";
import { FormActionButton } from "./FormActionButton";

import {
  getCurrentMembership,
  getCurrentUserProfile,
  requireSignedInUserId,
  toSlug,
} from "@/lib/tenant";
import { normalizeCurrency } from "@/lib/pricing";
import {
  getServerWriteClient,
  serverReadClient,
} from "@/sanity/lib/serverClient";

type Category = {
  _id: string;
  title: string;
  titleEn?: string;
  sortOrder: number;
};

type Subcategory = {
  _id: string;
  title: string;
  titleEn?: string;
  sortOrder: number;
  categoryId: string;
};

type MenuItem = {
  _id: string;
  name: string;
  nameEn?: string;
  price: number;
  currency: "EUR" | "BAM";
  isAvailable: boolean;
  categoryTitle: string;
  description?: string;
  descriptionEn?: string;
  categoryId: string;
  sortOrder: number;
  imageUrl?: string;
  subCategoryId?: string;
  subCategoryTitle?: string;
};

async function createTenantAction(formData: FormData) {
  "use server";

  const userId = await requireSignedInUserId();
  const writeClient = getServerWriteClient();
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    throw new Error("Naziv lokala je obavezan.");
  }

  const existingMembership = await serverReadClient.fetch<{
    _id: string;
  } | null>(`*[_type == "tenantMember" && clerkUserId == $userId][0]{_id}`, {
    userId,
  });

  if (existingMembership) {
    revalidatePath("/dashboard");
    return;
  }

  let slug = toSlug(name);
  if (!slug) {
    slug = `lokal-${Math.random().toString(36).slice(2, 8)}`;
  }

  const slugCount = await serverReadClient.fetch<number>(
    `count(*[_type == "tenant" && slug.current == $slug])`,
    { slug },
  );

  const finalSlug =
    slugCount > 0 ? `${slug}-${Math.random().toString(36).slice(2, 6)}` : slug;

  const profile = await getCurrentUserProfile();
  const tenant = await writeClient.create({
    _type: "tenant",
    name,
    slug: { _type: "slug", current: finalSlug },
    isActive: true,
  });

  await writeClient.create({
    _type: "tenantMember",
    tenant: { _type: "reference", _ref: tenant._id },
    clerkUserId: userId,
    email: profile.email,
    role: "owner",
  });

  revalidatePath("/dashboard");
}

async function createCategoryAction(formData: FormData) {
  "use server";

  const membership = await getCurrentMembership();
  if (!membership?.tenant?._id) {
    throw new Error("Nemas pristup tenantu.");
  }

  const title = String(formData.get("title") || "").trim();
  const titleEn = String(formData.get("titleEn") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!title) {
    throw new Error("Naziv kategorije je obavezan.");
  }

  const writeClient = getServerWriteClient();
  await writeClient.create({
    _type: "menuCategory",
    tenant: { _type: "reference", _ref: membership.tenant._id },
    title,
    ...(titleEn ? { titleEn } : {}),
    sortOrder,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/menu/${membership.tenant.slug}`);
}

async function createMenuItemAction(formData: FormData) {
  "use server";

  const membership = await getCurrentMembership();
  if (!membership?.tenant?._id) {
    throw new Error("Nemas pristup tenantu.");
  }

  const name = String(formData.get("name") || "").trim();
  const nameEn = String(formData.get("nameEn") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const descriptionEn = String(formData.get("descriptionEn") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const currency = normalizeCurrency(String(formData.get("currency") || "EUR"));
  const price = Number(formData.get("price") || 0);
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const imageFile = formData.get("image") as File | null;
  const subCategoryId = String(formData.get("subCategoryId") || "").trim();

  if (!name || !categoryId) {
    throw new Error("Naziv artikla i kategorija su obavezni.");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Cijena mora biti broj veci ili jednak nuli.");
  }

  if (
    !membership.tenant.exchangeRateEurToBam ||
    membership.tenant.exchangeRateEurToBam <= 0
  ) {
    throw new Error(
      "Prvo unesi trenutni tecaj EUR -> KM u dashboard postavkama.",
    );
  }

  const categoryExists = await serverReadClient.fetch<number>(
    `count(*[_type == "menuCategory" && _id == $categoryId && tenant._ref == $tenantId])`,
    { categoryId, tenantId: membership.tenant._id },
  );

  if (!categoryExists) {
    throw new Error("Odabrana kategorija ne pripada tvom tenantu.");
  }

  if (subCategoryId) {
    const subcategoryExists = await serverReadClient.fetch<number>(
      `count(*[_type == "menuSubcategory" && _id == $subCategoryId && tenant._ref == $tenantId && category._ref == $categoryId])`,
      { subCategoryId, tenantId: membership.tenant._id, categoryId },
    );

    if (!subcategoryExists) {
      throw new Error("Podkategorija ne pripada odabranoj kategoriji.");
    }
  }

  const writeClient = getServerWriteClient();

  let imageRef:
    | { _type: string; asset: { _type: string; _ref: string } }
    | undefined;
  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      throw new Error("Datoteka mora biti slika (JPEG, PNG, WebP...).");
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error("Slika ne smije biti veća od 5MB.");
    }
    const asset = await writeClient.assets.upload("image", imageFile, {
      filename: imageFile.name,
    });
    imageRef = {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
  }

  await writeClient.create({
    _type: "menuItem",
    tenant: { _type: "reference", _ref: membership.tenant._id },
    category: { _type: "reference", _ref: categoryId },
    name,
    description,
    ...(nameEn ? { nameEn } : {}),
    ...(descriptionEn ? { descriptionEn } : {}),
    price,
    currency,
    isAvailable: true,
    sortOrder,
    ...(imageRef ? { image: imageRef } : {}),
    ...(subCategoryId
      ? { subCategory: { _type: "reference", _ref: subCategoryId } }
      : {}),
  });

  revalidatePath("/dashboard");
  revalidatePath(`/menu/${membership.tenant.slug}`);
}

async function updateCategoryAction(formData: FormData) {
  "use server";

  const membership = await getCurrentMembership();
  if (!membership?.tenant?._id) {
    throw new Error("Nemas pristup tenantu.");
  }

  const categoryId = String(formData.get("categoryId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const titleEn = String(formData.get("titleEn") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!categoryId || !title) {
    throw new Error("ID kategorije i naziv su obavezni.");
  }

  const categoryExists = await serverReadClient.fetch<number>(
    `count(*[_type == "menuCategory" && _id == $categoryId && tenant._ref == $tenantId])`,
    { categoryId, tenantId: membership.tenant._id },
  );

  if (!categoryExists) {
    throw new Error("Kategorija ne postoji.");
  }

  const writeClient = getServerWriteClient();
  await writeClient
    .patch(categoryId)
    .set({ title, sortOrder, titleEn })
    .commit();

  revalidatePath("/dashboard");
  revalidatePath(`/menu/${membership.tenant.slug}`);
}

async function deleteCategoryAction(formData: FormData) {
  "use server";

  const membership = await getCurrentMembership();
  if (!membership?.tenant?._id) {
    throw new Error("Nemas pristup tenantu.");
  }

  const categoryId = String(formData.get("categoryId") || "").trim();

  if (!categoryId) {
    throw new Error("ID kategorije je obavezan.");
  }

  const categoryExists = await serverReadClient.fetch<number>(
    `count(*[_type == "menuCategory" && _id == $categoryId && tenant._ref == $tenantId])`,
    { categoryId, tenantId: membership.tenant._id },
  );

  if (!categoryExists) {
    throw new Error("Kategorija ne postoji.");
  }

  const writeClient = getServerWriteClient();
  await writeClient.delete(categoryId);

  revalidatePath("/dashboard");
  revalidatePath(`/menu/${membership.tenant.slug}`);
}

async function createSubcategoryAction(formData: FormData) {
  "use server";

  const membership = await getCurrentMembership();
  if (!membership?.tenant?._id) {
    throw new Error("Nemas pristup tenantu.");
  }

  const categoryId = String(formData.get("categoryId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const titleEn = String(formData.get("titleEn") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!categoryId || !title) {
    throw new Error("Kategorija i naziv podkategorije su obavezni.");
  }

  const categoryExists = await serverReadClient.fetch<number>(
    `count(*[_type == "menuCategory" && _id == $categoryId && tenant._ref == $tenantId])`,
    { categoryId, tenantId: membership.tenant._id },
  );

  if (!categoryExists) {
    throw new Error("Kategorija ne postoji.");
  }

  const writeClient = getServerWriteClient();
  await writeClient.create({
    _type: "menuSubcategory",
    tenant: { _type: "reference", _ref: membership.tenant._id },
    category: { _type: "reference", _ref: categoryId },
    title,
    ...(titleEn ? { titleEn } : {}),
    sortOrder,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/menu/${membership.tenant.slug}`);
}

async function updateSubcategoryAction(formData: FormData) {
  "use server";

  const membership = await getCurrentMembership();
  if (!membership?.tenant?._id) {
    throw new Error("Nemas pristup tenantu.");
  }

  const subCategoryId = String(formData.get("subCategoryId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const titleEn = String(formData.get("titleEn") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!subCategoryId || !title) {
    throw new Error("ID podkategorije i naziv su obavezni.");
  }

  const subcategoryExists = await serverReadClient.fetch<number>(
    `count(*[_type == "menuSubcategory" && _id == $subCategoryId && tenant._ref == $tenantId])`,
    { subCategoryId, tenantId: membership.tenant._id },
  );

  if (!subcategoryExists) {
    throw new Error("Podkategorija ne postoji.");
  }

  const writeClient = getServerWriteClient();
  await writeClient
    .patch(subCategoryId)
    .set({ title, sortOrder, titleEn })
    .commit();

  revalidatePath("/dashboard");
  revalidatePath(`/menu/${membership.tenant.slug}`);
}

async function deleteSubcategoryAction(formData: FormData) {
  "use server";

  const membership = await getCurrentMembership();
  if (!membership?.tenant?._id) {
    throw new Error("Nemas pristup tenantu.");
  }

  const subCategoryId = String(formData.get("subCategoryId") || "").trim();

  if (!subCategoryId) {
    throw new Error("ID podkategorije je obavezan.");
  }

  const subcategoryExists = await serverReadClient.fetch<number>(
    `count(*[_type == "menuSubcategory" && _id == $subCategoryId && tenant._ref == $tenantId])`,
    { subCategoryId, tenantId: membership.tenant._id },
  );

  if (!subcategoryExists) {
    throw new Error("Podkategorija ne postoji.");
  }

  const writeClient = getServerWriteClient();
  await writeClient.delete(subCategoryId);

  revalidatePath("/dashboard");
  revalidatePath(`/menu/${membership.tenant.slug}`);
}

async function updateMenuItemAction(formData: FormData) {
  "use server";

  const membership = await getCurrentMembership();
  if (!membership?.tenant?._id) {
    throw new Error("Nemas pristup tenantu.");
  }

  const itemId = String(formData.get("itemId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const nameEn = String(formData.get("nameEn") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const descriptionEn = String(formData.get("descriptionEn") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const subCategoryId = String(formData.get("subCategoryId") || "").trim();
  const currency = normalizeCurrency(String(formData.get("currency") || "EUR"));
  const price = Number(formData.get("price") || 0);
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isAvailable = formData.get("isAvailable") === "true";

  if (!itemId || !name || !categoryId) {
    throw new Error("ID artikla, naziv i kategorija su obavezni.");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Cijena mora biti broj veci ili jednak nuli.");
  }

  if (
    !membership.tenant.exchangeRateEurToBam ||
    membership.tenant.exchangeRateEurToBam <= 0
  ) {
    throw new Error(
      "Prvo unesi trenutni tecaj EUR -> KM u dashboard postavkama.",
    );
  }

  const itemExists = await serverReadClient.fetch<number>(
    `count(*[_type == "menuItem" && _id == $itemId && tenant._ref == $tenantId])`,
    { itemId, tenantId: membership.tenant._id },
  );

  if (!itemExists) {
    throw new Error("Artikl ne postoji.");
  }

  const categoryExists = await serverReadClient.fetch<number>(
    `count(*[_type == "menuCategory" && _id == $categoryId && tenant._ref == $tenantId])`,
    { categoryId, tenantId: membership.tenant._id },
  );

  if (!categoryExists) {
    throw new Error("Odabrana kategorija ne pripada tvom tenantu.");
  }

  if (subCategoryId) {
    const subcategoryExists = await serverReadClient.fetch<number>(
      `count(*[_type == "menuSubcategory" && _id == $subCategoryId && tenant._ref == $tenantId && category._ref == $categoryId])`,
      { subCategoryId, tenantId: membership.tenant._id, categoryId },
    );
    if (!subcategoryExists) {
      throw new Error("Podkategorija ne pripada odabranoj kategoriji.");
    }
  }

  const writeClient = getServerWriteClient();

  const imageFile = formData.get("image") as File | null;

  let patchBuilder = writeClient.patch(itemId).set({
    name,
    nameEn,
    description,
    descriptionEn,
    price,
    currency,
    sortOrder,
    isAvailable,
    category: { _type: "reference", _ref: categoryId },
  });

  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      throw new Error("Datoteka mora biti slika (JPEG, PNG, WebP...).");
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error("Slika ne smije biti veća od 5MB.");
    }
    const asset = await writeClient.assets.upload("image", imageFile, {
      filename: imageFile.name,
    });
    patchBuilder = patchBuilder.set({
      image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
    });
  }

  if (subCategoryId) {
    patchBuilder = patchBuilder.set({
      subCategory: { _type: "reference", _ref: subCategoryId },
    });
  } else {
    patchBuilder = patchBuilder.unset(["subCategory"]);
  }

  await patchBuilder.commit();

  revalidatePath("/dashboard");
  revalidatePath(`/menu/${membership.tenant.slug}`);
}

async function deleteMenuItemAction(formData: FormData) {
  "use server";

  const membership = await getCurrentMembership();
  if (!membership?.tenant?._id) {
    throw new Error("Nemas pristup tenantu.");
  }

  const itemId = String(formData.get("itemId") || "").trim();

  if (!itemId) {
    throw new Error("ID artikla je obavezan.");
  }

  const itemExists = await serverReadClient.fetch<number>(
    `count(*[_type == "menuItem" && _id == $itemId && tenant._ref == $tenantId])`,
    { itemId, tenantId: membership.tenant._id },
  );

  if (!itemExists) {
    throw new Error("Artikl ne postoji.");
  }

  const writeClient = getServerWriteClient();
  await writeClient.delete(itemId);

  revalidatePath("/dashboard");
  revalidatePath(`/menu/${membership.tenant.slug}`);
}

async function updateExchangeRateAction(formData: FormData) {
  "use server";

  const membership = await getCurrentMembership();
  if (!membership?.tenant?._id) {
    throw new Error("Nemas pristup tenantu.");
  }

  const exchangeRate = Number(formData.get("exchangeRateEurToBam") || 0);
  if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
    throw new Error("Tecaj mora biti pozitivan broj.");
  }

  const writeClient = getServerWriteClient();
  await writeClient
    .patch(membership.tenant._id)
    .set({ exchangeRateEurToBam: exchangeRate })
    .commit();

  revalidatePath("/dashboard");
  revalidatePath(`/menu/${membership.tenant.slug}`);
}

async function updateTenantLogoAction(formData: FormData) {
  "use server";

  const membership = await getCurrentMembership();
  if (!membership?.tenant?._id) {
    throw new Error("Nemas pristup tenantu.");
  }

  const logoFile = formData.get("logo") as File | null;
  const hideDigitalMenuHeader = formData.get("hideDigitalMenuHeader") === "on";
  const showPricesBam = formData.get("showPricesBam") === "on";
  const showPricesEur = formData.get("showPricesEur") === "on";

  const writeClient = getServerWriteClient();
  let patchBuilder = writeClient.patch(membership.tenant._id);

  if (logoFile && logoFile.size > 0) {
    if (!logoFile.type.startsWith("image/")) {
      throw new Error("Datoteka mora biti slika (JPEG, PNG, WebP...).");
    }
    if (logoFile.size > 5 * 1024 * 1024) {
      throw new Error("Logo ne smije biti veci od 5MB.");
    }
    const asset = await writeClient.assets.upload("image", logoFile, {
      filename: logoFile.name,
    });
    patchBuilder = patchBuilder.set({
      logo: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
    });
  }

  patchBuilder = patchBuilder.set({
    hideDigitalMenuHeader,
    showPricesBam,
    showPricesEur,
  });

  await patchBuilder.commit();

  revalidatePath("/dashboard");
  revalidatePath(`/menu/${membership.tenant.slug}`);
}

async function updateTenantNameAction(formData: FormData) {
  "use server";

  const membership = await getCurrentMembership();
  if (!membership?.tenant?._id) {
    throw new Error("Nemas pristup tenantu.");
  }
  if (membership.role !== "owner") {
    throw new Error("Samo vlasnik moze mijenjati naziv restorana.");
  }

  const name = String(formData.get("name") || "").trim();
  if (!name) {
    throw new Error("Naziv restorana je obavezan.");
  }

  const writeClient = getServerWriteClient();
  await writeClient.patch(membership.tenant._id).set({ name }).commit();

  revalidatePath("/dashboard");
  revalidatePath(`/menu/${membership.tenant.slug}`);
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const membership = await getCurrentMembership();

  if (!membership?.tenant?._id) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <h1 className="text-3xl font-semibold text-slate-900">
          Postavi svoj prvi lokal
        </h1>
        <p className="text-slate-600">
          Nakon ovog koraka dobit ces privatni dashboard i javni URL menija.
        </p>
        <form
          action={createTenantAction}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <input
            name="name"
            required
            placeholder="Naziv lokala"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <FormActionButton
            idleLabel="Kreiraj tenant"
            loadingLabel="Kreiram..."
            className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          />
          <p className="text-xs text-slate-500">
            Nakon klika pricekaj poruku u gumbu dok traje spremanje.
          </p>
        </form>
      </main>
    );
  }

  const [categories, menuItems] = await Promise.all([
    serverReadClient.fetch<Category[]>(
      `*[_type == "menuCategory" && tenant._ref == $tenantId] | order(sortOrder asc, title asc){
        _id,
        title,
        titleEn,
        sortOrder
      }`,
      { tenantId: membership.tenant._id },
    ),
    serverReadClient.fetch<MenuItem[]>(
      `*[_type == "menuItem" && tenant._ref == $tenantId] | order(category->sortOrder asc, sortOrder asc, name asc){
        _id,
        name,
        nameEn,
        price,
        currency,
        isAvailable,
        "categoryId": category._ref,
        "categoryTitle": category->title,
        "subCategoryId": subCategory._ref,
        "subCategoryTitle": subCategory->title,
        description,
        descriptionEn,
        sortOrder,
        "imageUrl": image.asset->url
      }`,
      { tenantId: membership.tenant._id },
    ),
  ]);
  const subcategories = await serverReadClient.fetch<Subcategory[]>(
    `*[_type == "menuSubcategory" && tenant._ref == $tenantId] | order(category->sortOrder asc, sortOrder asc, title asc){
      _id,
      title,
      titleEn,
      sortOrder,
      "categoryId": category._ref
    }`,
    { tenantId: membership.tenant._id },
  );

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-lg sm:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          {membership.tenant.name}
        </h1>
        <p className="mt-2 text-slate-200">
          Javni meni:
          <Link className="underline" href={`/menu/${membership.tenant.slug}`}>
            /menu/{membership.tenant.slug}
          </Link>
        </p>
      </section>

      <DashboardSectionsTabs
        tenantId={membership.tenant._id}
        tenantName={membership.tenant.name}
        tenantExchangeRate={membership.tenant.exchangeRateEurToBam || 0}
        tenantLogo={membership.tenant.logo}
        hideDigitalMenuHeader={membership.tenant.hideDigitalMenuHeader}
        showPricesBam={membership.tenant.showPricesBam ?? true}
        showPricesEur={membership.tenant.showPricesEur ?? true}
        categories={categories}
        subcategories={subcategories}
        menuItems={menuItems}
        updateExchangeRateAction={updateExchangeRateAction}
        updateTenantLogoAction={updateTenantLogoAction}
        createCategoryAction={createCategoryAction}
        createMenuItemAction={createMenuItemAction}
        updateCategoryAction={updateCategoryAction}
        deleteCategoryAction={deleteCategoryAction}
        updateMenuItemAction={updateMenuItemAction}
        deleteMenuItemAction={deleteMenuItemAction}
        updateTenantNameAction={updateTenantNameAction}
        createSubcategoryAction={createSubcategoryAction}
        updateSubcategoryAction={updateSubcategoryAction}
        deleteSubcategoryAction={deleteSubcategoryAction}
      />
    </main>
  );
}
