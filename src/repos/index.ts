import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { getPostRepo } from './post.repo';
import { getCommentRepo } from './comment.repo';
import { getProfileRepo } from './profile.repo';
import { getTagRepo } from './tag.repo';
import { getTagToPostRepo } from './tag-to-post.repo';
import { getArchiveRepo } from './archive.repo';
import { getWebhookEventRepo } from './webhook-event.repo';
import { getSubscriptionRepo } from './subscription.repo';
import { getPricingPlanRepo } from './pricing-plan.repo';

export function getRepos(db: NodePgDatabase) {
  return {
    postRepo: getPostRepo(db),
    commentRepo: getCommentRepo(db),
    profileRepo: getProfileRepo(db),
    tagRepo: getTagRepo(db),
    tagToPostRepo: getTagToPostRepo(db),
    archiveRepo: getArchiveRepo(db),
    webhookEventRepo: getWebhookEventRepo(db),
    subscriptionRepo: getSubscriptionRepo(db),
    pricingPlanRepo: getPricingPlanRepo(db)
  };
}

export type IRepos = ReturnType<typeof getRepos>;