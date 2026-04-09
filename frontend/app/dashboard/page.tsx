import { revalidatePath } from "next/cache";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { DashboardItemTabs } from "./DashboardItemTabs";

import {
  getCurrentMembership,
  getCurrentUserProfile,
  requireSignedInUserId,
  toSlug,
} from "@/lib/tenant";
import {
  getServerWriteClient,
  serverReadClient,
} from "@/sanity/lib/serverClient";

type Category = {
  _id: string;
  title: string;
  sortOrder: number;
};

type Subcategory = {
  _id: string;
  title: string;
  sortOrder: number;
  categoryId: string;
};

type MenuItem = {
  _id: string;
  name: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  categoryTitle: string;
  description?: string;
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
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!title) {
    throw new Error("Naziv kategorije je obavezan.");
  }

  const writeClient = getServerWriteClient();
  await writeClient.create({
    _type: "menuCategory",
    tenant: { _type: "reference", _ref: membership.tenant._id },
    title,
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
  const description = String(formData.get("description") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const currency = String(formData.get("currency") || "EUR").trim();
  const price = Number(formData.get("price") || 0);
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const imageFile = formData.get("image") as File | null;
  const subCategoryId = String(formData.get("subCategoryId") || "").trim();

  if (!name || !categoryId) {
    throw new Error("Naziv artikla i kategorija su obavezni.");
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
  await writeClient.patch(categoryId).set({ title, sortOrder }).commit();

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
  await writeClient.patch(subCategoryId).set({ title, sortOrder }).commit();

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
  const description = String(formData.get("description") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const subCategoryId = String(formData.get("subCategoryId") || "").trim();
  const currency = String(formData.get("currency") || "EUR").trim();
  const price = Number(formData.get("price") || 0);
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isAvailable = formData.get("isAvailable") === "true";

  if (!itemId || !name || !categoryId) {
    throw new Error("ID artikla, naziv i kategorija su obavezni.");
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
    description,
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

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const membership = await getCurrentMembership();

  if (!membership?.tenant?._id) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <h1 className="text-3xl font-semibold">Postavi svoj prvi lokal</h1>
        <p className="text-slate-600">
          Nakon ovog koraka dobit ces privatni dashboard i javni URL menija.
        </p>
        <form action={createTenantAction} className="flex flex-col gap-3">
          <input
            name="name"
            required
            placeholder="Naziv lokala"
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
          <button
            type="submit"
            className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white"
          >
            Kreiraj tenant
          </button>
        </form>
      </main>
    );
  }

  const [categories, menuItems] = await Promise.all([
    serverReadClient.fetch<Category[]>(
      `*[_type == "menuCategory" && tenant._ref == $tenantId] | order(sortOrder asc, title asc){
        _id,
        title,
        sortOrder
      }`,
      { tenantId: membership.tenant._id },
    ),
    serverReadClient.fetch<MenuItem[]>(
      `*[_type == "menuItem" && tenant._ref == $tenantId] | order(category->sortOrder asc, sortOrder asc, name asc){
        _id,
        name,
        price,
        currency,
        isAvailable,
        "categoryId": category._ref,
        "categoryTitle": category->title,
        "subCategoryId": subCategory._ref,
        "subCategoryTitle": subCategory->title,
        description,
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
      sortOrder,
      "categoryId": category._ref
    }`,
    { tenantId: membership.tenant._id },
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
      <section className="rounded-2xl bg-slate-950 p-8 text-white">
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

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold">Dodaj kategoriju</h2>
          <form
            action={createCategoryAction}
            className="mt-4 flex flex-col gap-3"
          >
            <input
              name="title"
              required
              placeholder="Npr. Kava"
              className="rounded-xl border border-slate-300 px-4 py-3"
            />
            <input
              name="sortOrder"
              type="number"
              defaultValue={0}
              className="rounded-xl border border-slate-300 px-4 py-3"
            />
            <button
              type="submit"
              className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white"
            >
              Spremi kategoriju
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold">Dodaj artikl</h2>
          <form
            action={createMenuItemAction}
            className="mt-4 flex flex-col gap-3"
            encType="multipart/form-data"
          >
            <input
              name="name"
              required
              placeholder="Npr. Cappuccino"
              className="rounded-xl border border-slate-300 px-4 py-3"
            />
            <textarea
              name="description"
              placeholder="Opis artikla"
              className="rounded-xl border border-slate-300 px-4 py-3"
            />
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              className="rounded-xl border border-slate-300 px-4 py-3"
            />
            <input
              name="currency"
              defaultValue="EUR"
              className="rounded-xl border border-slate-300 px-4 py-3"
            />
            <select
              name="categoryId"
              required
              className="rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Odaberi kategoriju</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            <select
              name="subCategoryId"
              className="rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Bez podkategorije</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {categories.find((c) => c._id === sub.categoryId)?.title} /{" "}
                  {sub.title}
                </option>
              ))}
            </select>
            <input
              name="sortOrder"
              type="number"
              defaultValue={0}
              className="rounded-xl border border-slate-300 px-4 py-3"
            />
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Slika artikla (opcijski)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white"
              disabled={categories.length === 0}
            >
              Spremi artikl
            </button>
          </form>
          {categories.length === 0 && (
            <p className="mt-3 text-sm text-amber-700">
              Prvo kreiraj barem jednu kategoriju.
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2 items-start">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold">Kategorije</h2>
          <ul className="mt-4 space-y-3">
            {categories.map((category) => (
              <li
                key={category._id}
                className="rounded-lg bg-slate-100 px-3 py-3"
              >
                <form action={updateCategoryAction} className="grid gap-2">
                  <input type="hidden" name="categoryId" value={category._id} />
                  <div className="text-xs text-slate-600">Uredi kategoriju</div>
                  <div className="grid gap-2 sm:grid-cols-[1fr_120px_auto_auto]">
                    <input
                      name="title"
                      defaultValue={category.title}
                      required
                      className="rounded border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      name="sortOrder"
                      type="number"
                      defaultValue={category.sortOrder}
                      className="rounded border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      type="submit"
                      className="rounded bg-blue-500 px-3 py-2 text-xs text-white transition hover:bg-blue-600"
                    >
                      Spremi
                    </button>
                    <button
                      formAction={deleteCategoryAction}
                      className="rounded bg-red-500 px-3 py-2 text-xs text-white transition hover:bg-red-600"
                    >
                      Obriši
                    </button>
                  </div>
                </form>
              </li>
            ))}
            {categories.length === 0 && (
              <li className="text-sm text-slate-500">Nema kategorija jos.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Artikli po kategorijama
          </h2>
          <DashboardItemTabs
            categories={categories}
            subcategories={subcategories}
            menuItems={menuItems}
            updateItemAction={updateMenuItemAction}
            deleteItemAction={deleteMenuItemAction}
            createSubcategoryAction={createSubcategoryAction}
            updateSubcategoryAction={updateSubcategoryAction}
            deleteSubcategoryAction={deleteSubcategoryAction}
          />
        </div>
      </section>
    </main>
  );
}
