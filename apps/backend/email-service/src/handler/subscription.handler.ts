import Subscription from "../models/Subscription";
import { Context } from "hono";

export const createSubscriptionHandler = async (c: Context) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }
    
    const existingSubscription = await Subscription.findOne({email});
    if(existingSubscription){
      return c.json({ error: "Email is already subscribed !" }, 400);
    }

    const newSubscription = new Subscription({ email });
    await newSubscription.save();
    console.log("Contact saved sucessfully");

    return c.json({ message: "Subscription successful" }, 201);
  } catch (error) {
    console.error("Error saving subscription:", error);
    return c.json({ error: "Failed to save subscription" }, 500);
  }
};

export const helloHandler = async (c: Context) => {
  return c.json({ message: "Hello, World!" });
};
