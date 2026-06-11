# Pash Retail Group - Braze Demo E-commerce

This is a functional ecommerce demo tailored for SaaS sales and Braze Web SDK integrations, showcasing a premium fashion and lifestyle retail experience.

## Objective
To demonstrate the capabilities of Braze's Web SDK in a realistic, multi-brand ecommerce scenario, capturing user behaviors (product views, cart updates, checkouts) and seamlessly converting anonymous users into known segments with personalized journeys.

## Demo Flow
1. **Explore as Anonymous:** Navigate the catalog, view products (trigger `ecommerce.product_viewed`).
2. **View Premium Products:** View at least 2 premium products to trigger `premium_interest_detected` and see how the homepage banner adapts.
3. **Cart Interactions:** Add products to the cart to populate the lateral drawer and trigger `ecommerce.cart_updated`.
4. **Braze Demo Panel:** Visit the 'Braze Demo Panel' at the top right to verify all the backend tracking events and current local attributes happening in real-time.
5. **Identify User:** Click 'Mi perfil' or 'Identifícate' to log in as "Mati" or "Vale". Observe the seamless transition from anonymous to known user (`user_identified`).
6. **Simulate Abandonment & Checkout:** Use the demo panel to simulate a cart abandonment or process a simulated order (`ecommerce.checkout_started`, `ecommerce.order_placed`).
7. **Message Center:** Check the 'Centro de Mensajes' which acts as a placeholder for Braze Content Cards.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables (add your Braze keys)
cp .env.example .env

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Deploy (If configured on Github pages)
npm run build
npm run deploy
```

## Note on GitHub Pages Deployment
Inside `vite.config.ts`, uncomment and adjust the `base: '/your-repo-name/'` property to match your GitHub repository name before deploying via GitHub pages.
