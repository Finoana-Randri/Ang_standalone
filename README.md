# Maison Essentielle

Base d’application e-commerce avec Next.js App Router, Payload CMS, PostgreSQL, Server Actions et Zustand.

## Démarrage avec Docker

```bash
cp .env.example .env
docker compose up --build
```

La boutique est disponible sur [http://localhost:3000](http://localhost:3000) et l’administration Payload sur [http://localhost:3000/admin](http://localhost:3000/admin). Créez le premier compte administrateur, puis ajoutez une catégorie, une image et un produit. Un produit doit être publié pour apparaître dans la boutique.

Les prix sont enregistrés en centimes : `2490` correspond à `24,90 €`.

## Démarrage local

```bash
cp .env.example .env
pnpm install
docker compose up -d postgres
pnpm dev
```

## Structure

```text
src/
├── access/                 # Règles d’accès partagées
├── app/
│   ├── (payload)/          # Administration et API Payload
│   └── (shop)/             # Boutique et panier
├── collections/
│   ├── catalog/            # Catégories et produits
│   ├── media/              # Images et fichiers
│   ├── orders/             # Commandes
│   └── users/              # Comptes d’administration
├── components/storefront/  # Composants de la boutique
├── features/checkout/      # État du parcours de commande
├── lib/                    # Accès Payload et formatage
└── store/                  # Panier Zustand
```

Les mutations du parcours de commande passent par `src/app/(shop)/panier/actions.ts`. Le serveur relit les produits, vérifie leur statut et leur stock, puis calcule les montants avant d’enregistrer une commande en attente. Le panier est conservé dans le navigateur avec Zustand.

## Commandes utiles

```bash
pnpm lint
pnpm generate:types
pnpm generate:importmap
pnpm payload migrate
```

En développement, l’adaptateur PostgreSQL de Payload met à jour le schéma automatiquement. Pour les autres environnements, utilisez les migrations Payload.
