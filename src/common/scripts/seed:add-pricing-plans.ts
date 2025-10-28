import 'src/services/env/env.service';

import { getDb } from 'src/services/drizzle/drizzle.service';
import pino from 'pino';
import { pricingPlanTable } from 'src/services/drizzle/schema';

const logger = pino();

(async () => {
  try {
    const db = await getDb(
      {
        host: process.env.PGHOST || '',
        port: parseInt(process.env.PGPORT || ''),
        db: process.env.PGDATABASE || '',
        user: process.env.PGUSERNAME || '',
        pwd: process.env.PGPASSWORD || '',
        logsEnabled: process.env.NODE_ENV == 'local'
      }
    );

    const pricingPlansData = [
      {
        id: '11c45571-cbad-4ae3-8d7d-ada7ae668a9d',
        stripePriceId: 'price_1SC79ILLXrja5cxFn2BSZ7iU',
        stripeProductId: 'prod_T8NvYXqWwkL0wb',
        name: 'Giant',
        description: 'Insane subscription for giants.',
        priceInCents: 4000,
        currency: 'usd',
        interval: 'monthly',
        features: ['power', 'strength'],
        isActive: true,
        createdAt: new Date('2025-09-28 23:28:05.059936'),
        updatedAt: new Date('2025-09-28 23:28:05.059936')
      },
      {
        id: '2b06e308-a4e0-4533-a46c-a6f311c8c211',
        stripePriceId: 'price_1SC78BLLXrja5cxFxE7DtcJT',
        stripeProductId: 'prod_T8NtPOA7zftI3A',
        name: 'Hobbit',
        description: 'Subscription for hobbits.',
        priceInCents: 2000,
        currency: 'usd',
        interval: 'monthly',
        features: ['silent', 'agility'],
        isActive: true,
        createdAt: new Date('2025-09-28 23:29:31.925371'),
        updatedAt: new Date('2025-09-28 23:29:31.925371')
      }
    ];

    await db
      .insert(pricingPlanTable)
      .values(pricingPlansData)
      .onConflictDoNothing();

    logger.info('Pricing plans seed completed');

    process.exit(0);
  } catch (error) {
    logger.error(`Error adding pricing plans - ${error}`);
    process.exit(1);
  }
})();
