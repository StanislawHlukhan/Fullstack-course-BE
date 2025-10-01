import 'src/services/env/env.service';

import { getDb } from 'src/services/drizzle/drizzle.service';
import pino from 'pino';
import { pricingPlanTable } from 'src/services/drizzle/schema';
import { eq } from 'drizzle-orm';

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
        name: 'Big dick users (10cm +)',
        description: 'Insane subscription for liers. More than 10cm only in films',
        price: '40.00',
        currency: 'usd',
        interval: 'monthly',
        features: ['nothing', 'liar'],
        isActive: true,
        createdAt: new Date('2025-09-28 23:28:05.059936'),
        updatedAt: new Date('2025-09-28 23:28:05.059936')
      },
      {
        id: '2b06e308-a4e0-4533-a46c-a6f311c8c211',
        stripePriceId: 'price_1SC78BLLXrja5cxFxE7DtcJT',
        stripeProductId: 'prod_T8NtPOA7zftI3A',
        name: 'Small Dick',
        description: 'Subscription for small dick users\nSubscription for small dick users',
        price: '20.00',
        currency: 'usd',
        interval: 'monthly',
        features: ['nothing', 'true man'],
        isActive: true,
        createdAt: new Date('2025-09-28 23:29:31.925371'),
        updatedAt: new Date('2025-09-28 23:29:31.925371')
      }
    ];

    for (const plan of pricingPlansData) {
      const existingPlan = await db
        .select()
        .from(pricingPlanTable)
        .where(eq(pricingPlanTable.stripePriceId, plan.stripePriceId))
        .limit(1);

      if (existingPlan[0]) {
        logger.info(`Pricing plan already exists: ${plan.name}`);
        continue;
      }

      await db.insert(pricingPlanTable).values(plan);
      logger.info(`Pricing plan added: ${plan.name} (${plan.stripePriceId})`);
    }

    logger.info('Pricing plans seed completed');

    process.exit(0);
  } catch (error) {
    logger.error(`Error adding pricing plans - ${error}`);
    process.exit(1);
  }
})();
