import { PricingPlan } from './PricingPlan';

export interface IPricingPlanRepo {
  getPricingPlans(): Promise<PricingPlan[]>;
  getPricingPlanByStripePriceId(stripePriceId: string): Promise<PricingPlan | null>;
  }