# Fastify-Drizzle-BE

## To run project

1. Clone the repository
2. Install dependencies
3. Set up environment variables based on EnvSchema
4. Run migrations with command npm run db:migration:run
5. Run docker-compose with command npm run local:env
6. Start the server with command npm run local
7. To open drizzle.studio use command npm run db:migration:studio


## Realtime (Socket.IO + Redis)

### Environment variables

Add these variables to your environment (e.g., .env):

```env
# WebSocket server
WS_HOST=0.0.0.0
WS_PORT=4001

# Redis connection
REDIS_URL=redis://localhost:6379

# Auth (Cognito used by API and WS for JWT validation)
AWS_REGION=us-east-1
AWS_USER_POOL_ID=your_pool_id

# Frontend origin for CORS (WS server)
FRONTEND_URL=http://localhost:3000
```

### Run commands

- API (REST):
  - Local: `npm run local`
  - Production build: `npm run build && npm run production`

- WebSocket server:
  - Local: `npm run ws:local`
  - Production build: `npm run build && npm run ws:prod`

### How it works

- API publishes comment events to Redis channels `comments:post:<postId>` after create/update (and delete when implemented).
- WS server subscribes to `comments:post:*` and emits `comments:event` to room `post:<postId>`.
- Clients join/leave rooms using `join_post` / `leave_post` events and must provide a valid JWT on connection.


## Local usage

npm run seed:pricing-plans - to insert pricing plans to db

## Stripe Integration

This project implements a comprehensive Stripe subscription system with the following features:

### Overview

The Stripe integration handles subscription management including:
- Customer creation and management
- Checkout session creation for new subscriptions
- Subscription plan changes and upgrades/downgrades
- Subscription cancellation
- Payment failure handling
- Webhook event processing for real-time updates

### Environment Variables

Required Stripe environment variables:
```env
STRIPE_SECRET_KEY=sk_test_...          # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...        # Webhook endpoint secret
FRONTEND_URL=http://localhost:3000     # Frontend URL for redirects
```


#### Services
- **StripeService** (`src/services/stripe/stripe.service.ts`): Core Stripe API wrapper
- **IStripeService** (`src/types/IStripeService.ts`): Service interface definition

#### Key Components

1. **Customer Management**
   - Automatically creates Stripe customers when users initiate checkout
   - Stores customer ID in user profile for future reference
   - Handles customer portal sessions for self-service billing

2. **Subscription Flow**
   - Users select pricing plans from `/user/subscriptions/pricing-plans`
   - Checkout sessions created via `/user/subscriptions/checkout-session`
   - Webhook events automatically create/update local subscription records

3. **Webhook Processing** (`src/api/routes/public/webhooks/stripe/`)
   - Handles real-time Stripe events
   - Implements idempotency to prevent duplicate processing
   - Processes subscription lifecycle events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`

### API Endpoints

#### User Subscription Routes (`/user/subscriptions`)

**GET `/pricing-plans`**
- Returns available subscription plans
- Response: Array of pricing plan objects

**POST `/checkout-session`**
- Creates Stripe checkout session for new subscription
- Automatically creates Stripe customer if not exists

**PATCH `/change-subscription`**
- Changes existing subscription to different plan
- Uses proration for billing adjustments

#### Webhook Endpoint (`/public/webhooks/stripe`)

**POST `/`**
- Processes Stripe webhook events
- Validates webhook signatures
- Handles subscription lifecycle events
- Implements duplicate event prevention

### Webhook Events Handled

1. **`customer.subscription.created`**
   - Creates new subscription record in database
   - Links subscription to user via metadata

2. **`customer.subscription.updated`**
   - Updates existing subscription with new plan/status
   - Handles plan changes and status updates

3. **`customer.subscription.deleted`**
   - Marks subscription as cancelled
   - Preserves subscription history

4. **`invoice.payment_failed`**
   - Handles failed payment scenarios
   - Can trigger dunning management

### Security Features

- Webhook signature verification using Stripe webhook secrets
- Idempotency protection against duplicate webhook processing
- Authentication required for user subscription endpoints
- Webhook endpoint bypasses authentication (as required by Stripe)

### Error Handling

- Comprehensive error handling for Stripe API failures
- Webhook signature validation with detailed error responses
- Graceful handling of missing customer data
- Database transaction safety for subscription operations


### Testing

For testing, use Stripe test mode with test keys and webhook endpoints. The system supports:
- Test card numbers for payment simulation
- Webhook testing via Stripe CLI or dashboard
- Test customer and subscription creation

