import { IPricingPlanRepo } from 'src/types/IPricingPlanRepo';

export async function getPricingPlans(params: {
  pricingPlanRepo: IPricingPlanRepo;
}) {
  const pricingPlans = await params.pricingPlanRepo.getPricingPlans();
  return pricingPlans;
}