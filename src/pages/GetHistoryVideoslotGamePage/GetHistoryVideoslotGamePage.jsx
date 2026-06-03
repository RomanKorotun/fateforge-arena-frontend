import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { videoslotStore } from "../../store/videoslotStore";
import "./GetHistoryVideoslotGamePage.css";

const DEFAULT_FILTERS = {
  page: 1,
  limit: 8,
  currency: "",
  from: "",
  to: "",
};

const GetHistoryVideoslotGamePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const history = videoslotStore((s) => s.videoSlotHistory);
  const pagination = videoslotStore((s) => s.videoSlotPagination);
  const fetchHistory = videoslotStore((s) => s.fetchVideoSlotHistory);

  const filters = useMemo(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 8,
      currency: searchParams.get("currency") || "",
      from: searchParams.get("from") || "",
      to: searchParams.get("to") || "",
    };
  }, [searchParams]);

  useEffect(() => {
    fetchHistory(filters);
  }, [filters, fetchHistory]);

  const updateFilter = (key, value) => {
    const next = {
      ...filters,
      [key]: value,
      page: 1,
    };

    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v !== ""),
    );

    setSearchParams(cleaned, { replace: true });
  };

  const changePage = (page) => {
    const next = {
      ...filters,
      page,
    };

    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v !== ""),
    );

    setSearchParams(cleaned, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams(DEFAULT_FILTERS, { replace: true });
  };

  return (
    <div className="vsh-page">
      <div className="vsh-container">
        <div className="back-btn-wrapper">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ⬅ Back to profile
          </button>
        </div>

        <div className="vsh-card">
          <div className="vsh-header">
            <div>
              <h1 className="vsh-title">VideoSlot History</h1>
              <div className="vsh-subtitle">
                Total: {pagination?.totalItems || 0}
              </div>
            </div>
          </div>

          <div className="vsh-filters-row">
            <div className="vsh-filters">
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

            <button className="vsh-clear" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          <div className="vsh-table-wrapper">
            <table className="vsh-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Spins</th>
                  <th>Bets</th>
                  <th>Wins</th>
                  <th>RTP</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {history?.length ? (
                  history.map((item, i) => (
                    <tr key={item.id}>
                      <td>{(filters.page - 1) * filters.limit + i + 1}</td>
                      <td>{item.totalSpins}</td>
                      <td>
                        {item.totalBets} {item.currency}
                      </td>
                      <td>
                        {item.totalWins} {item.currency}
                      </td>
                      <td>{item.rtp}%</td>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="vsh-empty">
                      No history
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="vsh-pagination">
            <button
              disabled={!pagination?.hasPrevPage}
              onClick={() => changePage(pagination.page - 1)}
            >
              Prev
            </button>

            <span>
              {pagination?.page} / {pagination?.totalPages}
            </span>

            <button
              disabled={!pagination?.hasNextPage}
              onClick={() => changePage(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetHistoryVideoslotGamePage;
