import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'

export const createSubscription = async (req, res, next) => {
  try {
    console.log("👉 Received createSubscription for user:", req.user._id);

    // Save subscription to DB
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    console.log("✅ Subscription saved with ID:", subscription.id);

    let workflowRunId = null;

    // Debug print of query and env
    console.log("🔍 forceQstash query param:", req.query.forceQstash);
    console.log("🌱 NODE_ENV:", process.env.NODE_ENV);

    // FOR TESTING, FORCE trigger
    const shouldTriggerQstash = true;

    console.log("⚡ Should trigger Qstash?", shouldTriggerQstash);

    if (shouldTriggerQstash) {
      console.log("🚀 Triggering workflow via Qstash for subscription reminder...");

      try {
        const triggerResult = await workflowClient.trigger({
          url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
          body: { subscriptionId: subscription.id },
          headers: { 'content-type': 'application/json' },
          retries: 0,
        });

        console.log("📦 Full Qstash trigger result:", JSON.stringify(triggerResult, null, 2));
        // Sometimes upstash returns { messageId: '...' } or workflowRunId
        workflowRunId = triggerResult.workflowRunId || triggerResult.messageId || null;

      } catch (err) {
        console.error("❌ Failed triggering Qstash:", err);
      }

    } else {
      console.log("⚙️ Skipping Qstash workflow trigger.");
    }

    // Send final response
    res.status(201).json({
      success: true,
      data: {
        subscription,
        workflowRunId,
      },
    });

  } catch (err) {
    console.error("🔥 Error in createSubscription:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Something went wrong while creating the subscription"
    });
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    console.log(`🔍 Getting subscriptions for user ${req.params.id}`);

    if (req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    console.log(`✅ Found ${subscriptions.length} subscriptions`);
    res.status(200).json({ success: true, data: subscriptions });
  } catch (err) {
    console.error("🔥 Error in getUserSubscriptions:", err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || "Something went wrong while fetching subscriptions"
    });
  }
};


