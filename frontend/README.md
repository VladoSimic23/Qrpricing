# QR Cjenik Frontend

Multi-tenant aplikacija za digitalne menije kafica i restorana.

## Sto je implementirano

- Next.js app router aplikacija
- Sanity Studio na ruti `/studio` (za super-admina)
- Multi-tenant modeli u Sanity:
  - `tenant`
  - `tenantMember`
  - `menuCategory`
  - `menuItem`
- Klijentski login preko Clerk
- Privatni dashboard na `/dashboard`
- Javni meni po slugu na `/menu/[slug]`

## Arhitektura

- Jedan Sanity projekt za sve klijente
- Svaki dokument menija je vezan uz `tenant`
- Svaki korisnik je mapiran na tenant preko `tenantMember.clerkUserId`
- Dashboard uvijek cita i pise podatke tenant-scopeano

## Potrebne varijable

Kopiraj `.env.example` u `.env.local` i upisi vrijednosti.

```bash
cp .env.example .env.local
```

Minimalno:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `SANITY_API_WRITE_TOKEN`

Opcionalno:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` (default: `9sower69`)
- `NEXT_PUBLIC_SANITY_DATASET` (default: `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` (default u kodu)
- `SUPER_ADMIN_CLERK_USER_ID` (ako zelis zakljucati `/studio` samo na svoj user)

## Pokretanje

```bash
npm install
npm run dev
```

## Prvi koraci

1. Otvori `/sign-up` i napravi korisnika.
2. Otvori `/dashboard` i kreiraj prvi tenant.
3. Dodaj kategorije i artikle.
4. Pogledaj javni meni na `/menu/[slug]`.
5. Kao admin koristi `/studio` za globalno upravljanje.

## Napomena za produkciju

Za potpuno sigurnu produkciju preporuceno je dodatno:

1. Dodati role dozvole (owner/editor/viewer) i provjere u svim server akcijama.
2. Dodati audit log i soft-delete.
3. Dodati validacije da `menuItem.category` mora pripadati istom tenantu.
