"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);

    // Mock plan selection - replace with actual API call
    setTimeout(() => {
      localStorage.setItem("mock_onboarding", "true");
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose your plan</h1>
          <p className="text-gray-600 dark:text-gray-400">Step 3 of 3</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>

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
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  selectedPlan === plan.id
                    ? "bg-indigo-600 text-white"
                    : plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading && selectedPlan === plan.id
                  ? "Setting up..."
                  : selectedPlan === plan.id
                  ? "Selected"
                  : plan.id === "agency"
                  ? "Contact Sales"
                  : "Get Started"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
