import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { transactionStore } from "../../store/transactionStore";
import "./TransactionsPage.css";

const DEFAULT_FILTERS = {
  page: 1,
  limit: 8,
  type: "",
  status: "",
  provider: "",
  currency: "",
  from: "",
  to: "",
};

const TransactionsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const transactions = transactionStore((s) => s.transactions);
  const pagination = transactionStore((s) => s.pagination);
  const fetchTransactions = transactionStore((s) => s.fetchTransactions);

  const [filters, setFilters] = useState(() => ({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 8,
    type: searchParams.get("type") || "",
    status: searchParams.get("status") || "",
    provider: searchParams.get("provider") || "",
    currency: searchParams.get("currency") || "",
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
  }));

  useEffect(() => {
    fetchTransactions(filters);
  }, [filters, fetchTransactions]);

  useEffect(() => {
    const cleaned = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== ""),
    );

    setSearchParams(cleaned, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const changePage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="transactions-page">
      <div className="transactions-container">
        <div className="back-btn-wrapper">
          <button className="back-btn" onClick={handleBack}>
            ⬅ Back to profile
          </button>
        </div>

        <div className="transactions-card">
          <div className="transactions-header">
            <div>
              <h1 className="transactions-title">Transactions</h1>
              <div className="transactions-subtitle">
                Total: {pagination?.totalItems || 0}
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="transactions-filters-row">
            <div className="transactions-filters">
              <div className="filter-block">
                <label>Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => updateFilter("type", e.target.value)}
                >
                  <option value="">All</option>
                  <option value="DEPOSIT">Deposit</option>
                  <option value="WITHDRAWAL">Withdraw</option>
                  <option value="BET">Bet</option>
                  <option value="WIN">Win</option>
                </select>
              </div>

              <div className="filter-block">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                >
                  <option value="">All</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div className="filter-block">
                <label>Currency</label>
                <select
                  value={filters.currency}
                  onChange={(e) => updateFilter("currency", e.target.value)}
                >
                  <option value="">All</option>
                  <option value="UAH">UAH</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div className="filter-block">
                <label>Provider</label>
                <select
                  value={filters.provider}
                  onChange={(e) => updateFilter("provider", e.target.value)}
                >
                  <option value="">All</option>
                  <option value="STRIPE">Stripe</option>
                </select>
              </div>

              <div className="filter-block">
                <label>From</label>
                <input
                  type="date"
                  value={filters.from}
                  onChange={(e) => updateFilter("from", e.target.value)}
                />
              </div>

              <div className="filter-block">
                <label>To</label>
                <input
                  type="date"
                  value={filters.to}
                  onChange={(e) => updateFilter("to", e.target.value)}
                />
              </div>
            </div>

            <button className="clear-btn" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          {/* TABLE */}
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Provider</th>
                  <th>Before</th>
                  <th>After</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx, i) => (
                    <tr key={tx.id}>
                      <td>{(filters.page - 1) * filters.limit + i + 1}</td>
                      <td>{tx.type}</td>
                      <td>{tx.status}</td>
                      <td>
                        {tx.amount} {tx.currency}
                      </td>
                      <td>{tx.provider}</td>
                      <td>
                        {tx.balanceBefore} {tx.currency}
                      </td>
                      <td>
                        {tx.balanceAfter} {tx.currency}
                      </td>
                      <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="empty-state">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && transactions.length > 0 && (
            <div className="transactions-pagination">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => changePage(pagination.page - 1)}
              >
                Prev
              </button>

              <span>
                {pagination.page} / {pagination.totalPages}
              </span>

              <button
                disabled={!pagination.hasNextPage}
                onClick={() => changePage(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
