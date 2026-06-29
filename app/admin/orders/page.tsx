"use client";

import { useCallback, useEffect, useState } from "react";

type Platform = "Fiverr" | "Upwork" | "Contra" | "Freelancer" | "Direct";
type PackageTier = "starter" | "pro" | "elite";

type SearchResult = {
  id: string;
  translated_name: string | null;
  product_name: string | null;
  market_viability: number | null;
};

type SelectedProduct = {
  id: string;
  label: string;
};

type OrderRow = {
  id: string;
  buyer_name: string;
  platform: string;
  package_tier: string;
  product_count: number;
  expires_at: string | null;
  token: string;
  url: string;
  status: "active" | "expired" | "deactivated";
};

const PACKAGE_LIMITS: Record<PackageTier, number> = {
  starter: 1,
  pro: 3,
  elite: 5,
};

const PACKAGE_LABELS: Record<PackageTier, string> = {
  starter: "Starter",
  pro: "Pro",
  elite: "Elite",
};

function displayName(row: SearchResult): string {
  return row.translated_name || row.product_name || row.id.slice(0, 8);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusBadgeClass(status: OrderRow["status"]): string {
  switch (status) {
    case "active":
      return "bg-[#DCFCE7] text-[#16A34A]";
    case "expired":
      return "bg-[#F2F1EE] text-[#6B6860]";
    case "deactivated":
      return "bg-[#FEE2E2] text-[#DC2626]";
  }
}

function statusLabel(status: OrderRow["status"]): string {
  switch (status) {
    case "active":
      return "Active";
    case "expired":
      return "Expired";
    case "deactivated":
      return "Deactivated";
  }
}

export default function AdminOrdersPage() {
  const [buyerName, setBuyerName] = useState("");
  const [platform, setPlatform] = useState<Platform>("Fiverr");
  const [packageTier, setPackageTier] = useState<PackageTier>("starter");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const maxProducts = PACKAGE_LIMITS[packageTier];

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/admin/orders/list", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/admin/orders/search?q=${encodeURIComponent(q)}`,
          { credentials: "include" }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setSearchResults(Array.isArray(data) ? data : []);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    setSelectedProducts((prev) => prev.slice(0, maxProducts));
  }, [maxProducts]);

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
      redirect: "manual",
    });
    window.location.href = "/admin/login";
  }

  function handleAddProduct(row: SearchResult) {
    if (selectedProducts.some((p) => p.id === row.id)) return;
    if (selectedProducts.length >= maxProducts) return;
    setSelectedProducts((prev) => [
      ...prev,
      { id: row.id, label: displayName(row) },
    ]);
    setSearchQuery("");
    setSearchResults([]);
  }

  function handleRemoveProduct(id: string) {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleGenerateLink() {
    if (!buyerName.trim() || selectedProducts.length !== maxProducts) return;
    setGenerating(true);
    setGeneratedUrl(null);
    try {
      const res = await fetch("/api/admin/orders/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_name: buyerName.trim(),
          platform,
          package_tier: packageTier,
          report_ids: selectedProducts.map((p) => p.id),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to create order");
        return;
      }
      setGeneratedUrl(data.url);
      setBuyerName("");
      setSelectedProducts([]);
      setSearchQuery("");
      await fetchOrders();
    } catch {
      alert("Failed to create order");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert("Copy failed");
    }
  }

  async function handleDeactivate(orderId: string) {
    if (!confirm("Deactivate this share link?")) return;
    setDeactivatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders/deactivate", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Failed to deactivate");
        return;
      }
      await fetchOrders();
    } finally {
      setDeactivatingId(null);
    }
  }

  const canGenerate =
    buyerName.trim().length > 0 &&
    selectedProducts.length === maxProducts &&
    !generating;

  return (
    <div className="bg-[#F8F7F4] min-h-screen pt-16">
      <header className="bg-white border-b border-[#E8E6E1] px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#1A1916]">KoreaScout Admin</span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-[#9E9C98] hover:text-[#1A1916] transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="bg-white border-b border-[#E8E6E1]">
        <nav className="flex gap-0 px-6">
          <a
            href="/admin"
            className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-[#9E9C98] hover:text-[#1A1916] transition-colors"
          >
            Reports
          </a>
          <a
            href="/admin/script-generator"
            className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-[#9E9C98] hover:text-[#1A1916] transition-colors"
          >
            Script Generator
          </a>
          <a
            href="/admin/orders"
            className="px-4 py-3 text-sm font-medium border-b-2 border-[#16A34A] text-[#16A34A] transition-colors"
          >
            Orders
          </a>
        </nav>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <section className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] p-6">
          <h1 className="text-lg font-bold text-[#1A1916]">New Order</h1>
          <p className="mt-1 text-sm text-[#6B6860]">
            Create a share link for a client order
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="buyer-name"
                className="text-sm font-medium text-[#1A1916] block mb-2"
              >
                Buyer Name
              </label>
              <input
                id="buyer-name"
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full border border-[#E8E6E1] rounded-xl px-3 py-2.5 text-sm text-[#1A1916] placeholder:text-[#9E9C98] focus:border-[#16A34A] outline-none"
                placeholder="Client or buyer name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="platform"
                  className="text-sm font-medium text-[#1A1916] block mb-2"
                >
                  Platform
                </label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="w-full bg-white border border-[#E8E6E1] rounded-xl px-3 py-2.5 text-sm text-[#1A1916] focus:border-[#16A34A] outline-none"
                >
                  <option value="Fiverr">Fiverr</option>
                  <option value="Upwork">Upwork</option>
                  <option value="Contra">Contra</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Direct">Direct</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="package"
                  className="text-sm font-medium text-[#1A1916] block mb-2"
                >
                  Package
                </label>
                <select
                  id="package"
                  value={packageTier}
                  onChange={(e) => setPackageTier(e.target.value as PackageTier)}
                  className="w-full bg-white border border-[#E8E6E1] rounded-xl px-3 py-2.5 text-sm text-[#1A1916] focus:border-[#16A34A] outline-none"
                >
                  <option value="starter">Starter (1 product)</option>
                  <option value="pro">Pro (3 products)</option>
                  <option value="elite">Elite (5 products)</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="product-search"
                className="text-sm font-medium text-[#1A1916] block mb-2"
              >
                Product Search
              </label>
              <input
                id="product-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={selectedProducts.length >= maxProducts}
                className="w-full border border-[#E8E6E1] rounded-xl px-3 py-2.5 text-sm text-[#1A1916] placeholder:text-[#9E9C98] focus:border-[#16A34A] outline-none disabled:opacity-50"
                placeholder="Search by product name…"
              />
              {searching && (
                <p className="mt-2 text-xs text-[#9E9C98]">Searching…</p>
              )}
              {searchResults.length > 0 && (
                <ul className="mt-2 border border-[#E8E6E1] rounded-xl overflow-hidden">
                  {searchResults.map((row) => {
                    const alreadySelected = selectedProducts.some((p) => p.id === row.id);
                    return (
                      <li key={row.id}>
                        <button
                          type="button"
                          disabled={alreadySelected || selectedProducts.length >= maxProducts}
                          onClick={() => handleAddProduct(row)}
                          className="w-full text-left px-3 py-2.5 text-sm hover:bg-[#F8F7F4] transition-colors disabled:opacity-50 border-b border-[#E8E6E1] last:border-b-0"
                        >
                          <span className="font-medium text-[#1A1916]">
                            {displayName(row)}
                          </span>
                          {row.market_viability != null && (
                            <span className="ml-2 text-xs text-[#9E9C98] font-mono">
                              Score {row.market_viability}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-[#1A1916] mb-2">
                Selected Products ({selectedProducts.length}/{maxProducts})
              </p>
              {selectedProducts.length === 0 ? (
                <p className="text-sm text-[#9E9C98]">No products selected</p>
              ) : (
                <ul className="space-y-2">
                  {selectedProducts.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl px-3 py-2"
                    >
                      <span className="text-sm text-[#1A1916]">{product.label}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-medium"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              disabled={!canGenerate}
              onClick={handleGenerateLink}
              className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:bg-[#16A34A] text-white rounded-xl py-3 text-sm font-semibold transition-colors"
            >
              {generating ? "Generating…" : "Generate Link"}
            </button>

            {generatedUrl && (
              <div className="bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">
                  Generated Link
                </p>
                <p className="text-sm text-[#1A1916] break-all font-mono">{generatedUrl}</p>
                <button
                  type="button"
                  onClick={() => handleCopy(generatedUrl)}
                  className="mt-3 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                >
                  Copy Link
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8E6E1]">
            <h2 className="text-lg font-bold text-[#1A1916]">Orders</h2>
          </div>

          {ordersLoading ? (
            <div className="p-8 text-center text-[#6B6860] text-sm">Loading…</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-[#6B6860] text-sm">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8F7F4] border-b border-[#E8E6E1]">
                    <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">
                      Buyer
                    </th>
                    <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">
                      Platform
                    </th>
                    <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">
                      Package
                    </th>
                    <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">
                      Products
                    </th>
                    <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">
                      Expires
                    </th>
                    <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#E8E6E1] hover:bg-[#F8F7F4] transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-[#1A1916]">
                        {order.buyer_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#3D3B36]">{order.platform}</td>
                      <td className="px-4 py-3 text-sm text-[#3D3B36] capitalize">
                        {PACKAGE_LABELS[order.package_tier as PackageTier] ??
                          order.package_tier}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#3D3B36] font-mono">
                        {order.product_count}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#3D3B36]">
                        {formatDate(order.expires_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadgeClass(order.status)}`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {order.url && (
                            <button
                              type="button"
                              onClick={() => handleCopy(order.url)}
                              className="text-xs text-[#16A34A] hover:text-[#15803D] font-medium transition-colors"
                            >
                              Copy Link
                            </button>
                          )}
                          {order.status === "active" && (
                            <button
                              type="button"
                              disabled={deactivatingId === order.id}
                              onClick={() => handleDeactivate(order.id)}
                              className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-medium transition-colors disabled:opacity-50"
                            >
                              {deactivatingId === order.id ? "…" : "Deactivate"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
