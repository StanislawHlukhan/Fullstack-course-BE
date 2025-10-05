"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepos = getRepos;
const post_repo_1 = require("./post.repo");
const comment_repo_1 = require("./comment.repo");
const profile_repo_1 = require("./profile.repo");
const tag_repo_1 = require("./tag.repo");
const tag_to_post_repo_1 = require("./tag-to-post.repo");
const archive_repo_1 = require("./archive.repo");
const webhook_event_repo_1 = require("./webhook-event.repo");
const subscription_repo_1 = require("./subscription.repo");
const pricing_plan_repo_1 = require("./pricing-plan.repo");
function getRepos(db) {
    return {
        postRepo: (0, post_repo_1.getPostRepo)(db),
        commentRepo: (0, comment_repo_1.getCommentRepo)(db),
        profileRepo: (0, profile_repo_1.getProfileRepo)(db),
        tagRepo: (0, tag_repo_1.getTagRepo)(db),
        tagToPostRepo: (0, tag_to_post_repo_1.getTagToPostRepo)(db),
        archiveRepo: (0, archive_repo_1.getArchiveRepo)(db),
        webhookEventRepo: (0, webhook_event_repo_1.getWebhookEventRepo)(db),
        subscriptionRepo: (0, subscription_repo_1.getSubscriptionRepo)(db),
        pricingPlanRepo: (0, pricing_plan_repo_1.getPricingPlanRepo)(db)
    };
}
