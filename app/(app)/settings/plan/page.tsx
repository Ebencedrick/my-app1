"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("growth");

  // Mock data - replace with actual API calls
  const currentPlan = {
    id: "growth",
    name: "Growth",
    monthlyFee: 29.00,
    feePercent: 10,
    nextBillingDate: "2024-02-10",
    features: [
      "Everything in Pay-as-you-go",
      "Priority support",
      "Advanced analytics",
      "A/B testing features",
      "Custom reporting",
    ],
  };

  const plans = [
    {
      id: "pay-as-you-go",
      name: "Pay-as-you-go",
      description: "Perfect for testing the waters",
      price: "15%",
      priceLabel: "management fee",
      features: [
        "No monthly subscription",
        "All ad platforms included",
        "Basic support",
        "Mobile Money & crypto payments",
      ],
    },
    {
      id: "growth",
      name: "Growth",
      description: "For growing businesses",
      price: "$29",
      priceLabel: "/month + 10% fee",
      features: [
        "Everything in Pay-as-you-go",
        "Priority support",
        "Advanced analytics",
        "A/B testing features",
        "Custom reporting",
      ],
      popular: true,
    },
    {
      id: "agency",
      name: "Agency",
      description: "For marketing agencies",
      price: "$99",
      priceLabel: "/month + 8% fee",
      features: [
        "Everything in Growth",
        "Dedicated account manager",
        "White-label reporting",
        "API access",
        "Custom integrations",
      ],
    },
  ];

  const handlePlanChange = async (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);

    // Mock plan change - replace with actual API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Plan updated successfully!");
    }, 500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
        >
          ← Back to Settings
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Plan Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your subscription plan</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 mb-2">Current Plan</p>
            <p className="text-3xl font-bold mb-1">{currentPlan.name}</p>
            <p className="text-indigo-200">${currentPlan.monthlyFee.toFixed(2)}/month + {currentPlan.feePercent}% fee</p>
            <p className="text-indigo-200 text-sm mt-2">Next billing: {formatDate(currentPlan.nextBillingDate)}</p>
          </div>
        </div>
      </div>

      {/* Plan Options */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-2 relative ${
                selectedPlan === plan.id
                  ? "border-indigo-600"
                  : plan.popular
                  ? "border-indigo-300 dark:border-indigo-700"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm"> {plan.priceLabel}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanChange(plan.id)}
                disabled={isLoading || plan.id === currentPlan.id}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.id === currentPlan.id
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : selectedPlan === plan.id
                    ? "bg-indigo-600 text-white"
                    : plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading && selectedPlan === plan.id
                  ? "Updating..."
                  : plan.id === currentPlan.id
                  ? "Current Plan"
                  : plan.id === "agency"
                  ? "Contact Sales"
                  : "Switch to Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Plan History */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Plan History</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-gray-900 dark:text-white font-medium">Growth Plan</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Started January 10, 2024</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs font-semibold rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-gray-900 dark:text-white font-medium">Pay-as-you-go</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">December 1, 2023 - January 9, 2024</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
              Previous
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
