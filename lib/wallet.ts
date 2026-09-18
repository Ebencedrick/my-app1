type Tx = {
  id: number;
  type: string;
  method: string;
  amount: number;
  status: string;
  date: string;
};

export function getWalletBalance(): number {
  try {
    if (typeof window === "undefined") return 0;
    const raw = localStorage.getItem("mock_wallet_balance");
    if (!raw) return 0;
    return Number(raw) || 0;
  } catch (e) {
    return 0;
  }
}

export function setWalletBalance(amount: number) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem("mock_wallet_balance", String(Number(amount.toFixed(2))));
  } catch (e) {}
}

export function getTransactions(): Tx[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("mock_wallet_transactions");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addToWallet(amount: number, method = "Mobile Money") {
  try {
    if (typeof window === "undefined") return 0;
    const current = getWalletBalance();
    const next = Number((current + amount).toFixed(2));
    setWalletBalance(next);

    const txs = getTransactions();
    const tx: Tx = { id: Date.now(), type: "deposit", method, amount, status: "completed", date: new Date().toISOString() };
    txs.unshift(tx);
    localStorage.setItem("mock_wallet_transactions", JSON.stringify(txs));

    // Add a notification
    try {
      const raw = localStorage.getItem("mock_notifications");
      const notes = raw ? JSON.parse(raw) : [];
      notes.unshift({ id: `n${Date.now()}`, title: "Wallet topped up", body: `+$${amount.toFixed(2)} via ${method}`, read: false, time: "Just now" });
      localStorage.setItem("mock_notifications", JSON.stringify(notes));
      try {
        // notify other components in same tab
        window.dispatchEvent(new Event("mock_notifications:update"));
      } catch (e) {}
    } catch (e) {}

    return next;
  } catch (e) {
    return getWalletBalance();
  }
}

export default {};
