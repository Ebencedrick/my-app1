type Campaign = {
  id: number;
  owner?: string;
  name: string;
  objective: string;
  platforms: string[];
  targeting: any;
  budget: number;
  status: string;
  createdAt: string;
};

type User = {
  email: string;
  name?: string;
  walletBalance: number;
};

// Simple in-memory store for development/testing. Not persisted across restarts.
const store = {
  campaigns: [] as Campaign[],
  users: new Map<string, User>(),
  nextCampaignId: 1,
};

export function ensureUser(email: string) {
  if (!email) return null;
  if (!store.users.has(email)) {
    store.users.set(email, { email, name: email.split("@")[0], walletBalance: 0 });
  }
  return store.users.get(email) as User;
}

export function getCampaigns(owner?: string) {
  if (owner) return store.campaigns.filter((c) => c.owner === owner);
  return store.campaigns;
}

export function createCampaign(data: Partial<Campaign>, owner?: string) {
  const id = store.nextCampaignId++;
  const campaign: Campaign = {
    id,
    owner,
    name: data.name || `Campaign ${id}`,
    objective: data.objective || "unspecified",
    platforms: data.platforms || [],
    targeting: data.targeting || {},
    budget: data.budget || 0,
    status: data.status || "pending",
    createdAt: new Date().toISOString(),
  };
  store.campaigns.unshift(campaign);
  return campaign;
}

export function getCampaign(id: number) {
  return store.campaigns.find((c) => c.id === id) || null;
}

export function updateCampaign(id: number, patch: Partial<Campaign>) {
  const idx = store.campaigns.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  store.campaigns[idx] = { ...store.campaigns[idx], ...patch };
  return store.campaigns[idx];
}

export function creditWallet(email: string, amount: number) {
  const user = ensureUser(email);
  if (!user) return null;
  user.walletBalance = Number(((user.walletBalance || 0) + amount).toFixed(2));
  return user.walletBalance;
}

export function debitWallet(email: string, amount: number) {
  const user = ensureUser(email);
  if (!user) return null;
  if ((user.walletBalance || 0) < amount) return null;
  user.walletBalance = Number(((user.walletBalance || 0) - amount).toFixed(2));
  return user.walletBalance;
}

export function getWallet(email: string) {
  const user = ensureUser(email);
  return user ? user.walletBalance : 0;
}

export function getUsers() {
  return Array.from(store.users.values());
}

export default store;
