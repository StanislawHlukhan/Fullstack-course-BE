import { z } from 'zod';

export const PricingPlanSchema = z.object({
  id: z.string().uuid(),
  stripePriceId: z.string(),
  stripeProductId: z.string(),
  name: z.string(),
  description: z.string(),
  priceInCents: z.number(),
  currency: z.string(),
  interval: z.string(),
  features: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type PricingPlan = z.infer<typeof PricingPlanSchema>;