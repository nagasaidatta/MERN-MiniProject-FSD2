import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationBanner from '../components/NotificationBanner';
import '../styles/reports.css';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await reportService.getReportSummary();
      if (res.success && res.summary) {
        setReport(res.summary);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to compute analytics and aggregated reports.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container page-wrapper">
        <LoadingSpinner text="Aggregating database reports and demographic metrics..." />
      </div>
    );
  }

  const totalApps = report?.totalApplications || 0;
  const approved = report?.statusCounts?.Approved || 0;
  const pending = report?.statusCounts?.Pending || 0;
  const rejected = report?.statusCounts?.Rejected || 0;

  // Compute percentages for CSS distribution bar
  const approvedPct = totalApps > 0 ? ((approved / totalApps) * 100).toFixed(1) : 0;
  const pendingPct = totalApps > 0 ? ((pending / totalApps) * 100).toFixed(1) : 0;
  const rejectedPct = totalApps > 0 ? ((rejected / totalApps) * 100).toFixed(1) : 0;

  // Max category count for relative bar width
  const maxCategoryCount = Math.max(
    ...(report?.applicationsByCategory?.map((c) => c.count) || [1]),
    1
  );

  // Max scheme count for relative bar width
  const maxSchemeCount = Math.max(
    ...(report?.applicationsByScheme?.map((s) => s.totalApplications) || [1]),
    1
  );

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welfare Analytics & Governance Reports</h1>
          <p className="page-subtitle">
            MongoDB aggregation-driven analytics evaluating scheme disbursement, approval velocity, and demographic distribution.
          </p>
        </div>
        <button onClick={fetchReportData} className="btn btn-outline btn-sm">
          🔄 Refresh Aggregations
        </button>
      </div>

      {error && <NotificationBanner type="danger" message={error} />}

      {/* Top Level Telemetry */}
      <div className="metrics-grid">
        <DashboardCard
          title="Total Claims Received"
          value={totalApps}
          caption="Aggregated across all programs"
          icon="📊"
          color="blue"
        />
        <DashboardCard
          title="Approval Rate"
          value={`${approvedPct}%`}
          caption={`${approved} granted sanctions`}
          icon="📈"
          color="green"
        />
        <DashboardCard
          title="Pending Adjudication"
          value={pending}
          caption={`${pendingPct}% of total volume`}
          icon="⏳"
          color="amber"
        />
        <DashboardCard
          title="Rejection / Ineligible"
          value={rejected}
          caption={`${rejectedPct}% of total volume`}
          icon="🛡️"
          color="red"
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="reports-grid">
        {/* Panel 1: Application Adjudication Breakdown */}
        <div className="report-panel">
          <div className="report-panel-title">
            <span>Adjudication Status Distribution</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              N = {totalApps} Applications
            </span>
          </div>

          {/* Pure CSS Multi-Segment Distribution Bar */}
          <div className="distribution-bar" title={`Approved: ${approvedPct}%, Pending: ${pendingPct}%, Rejected: ${rejectedPct}%`}>
            <div className="segment-approved" style={{ width: `${approvedPct}%` }}></div>
            <div className="segment-pending" style={{ width: `${pendingPct}%` }}></div>
            <div className="segment-rejected" style={{ width: `${rejectedPct}%` }}></div>
          </div>

          <div className="distribution-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: 'var(--color-success)' }}></span>
              <span>Approved ({approved} &bull; {approvedPct}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: 'var(--color-warning)' }}></span>
              <span>Pending ({pending} &bull; {pendingPct}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: 'var(--color-danger)' }}></span>
              <span>Rejected ({rejected} &bull; {rejectedPct}%)</span>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Performance Metrics
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span className="scheme-meta-label">Total Citizen Base</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                  {report?.totalCitizens || 0}
                </strong>
              </div>
              <div>
                <span className="scheme-meta-label">Active Schemes Deployed</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                  {report?.totalSchemes || 0}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Applications By Target Category */}
        <div className="report-panel">
          <div className="report-panel-title">
            <span>Applications by Welfare Category</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Demographic Reach
            </span>
          </div>

          {report?.applicationsByCategory && report.applicationsByCategory.length > 0 ? (
            <div className="css-chart-list">
              {report.applicationsByCategory.map((catItem) => {
                const widthPct = Math.round((catItem.count / maxCategoryCount) * 100);
                return (
                  <div key={catItem.category} className="css-chart-row">
                    <div className="chart-label-row">
                      <span>{catItem.category}</span>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
                        {catItem.count} apps
                      </span>
                    </div>
                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill"
                        style={{ width: `${Math.max(widthPct, 6)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              No category data available yet.
            </p>
          )}
        </div>
      </div>

      {/* Panel 3: Scheme-wise Performance Table */}
      <div className="report-panel">
        <div className="report-panel-title">
          <span>Scheme-Level Utilization & Adjudication Breakdown</span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            Aggregated via MongoDB $group Pipeline
          </span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Scheme ID</th>
                <th>Government Scheme</th>
                <th>Category</th>
                <th>Total Applications</th>
                <th>Approved</th>
                <th>Pending</th>
                <th>Rejected</th>
                <th>Approval Ratio</th>
              </tr>
            </thead>
            <tbody>
              {report?.applicationsByScheme && report.applicationsByScheme.length > 0 ? (
                report.applicationsByScheme.map((item) => {
                  const ratio = item.totalApplications > 0
                    ? Math.round((item.approved / item.totalApplications) * 100)
                    : 0;
                  return (
                    <tr key={item.schemeId}>
                      <td><code>{item.schemeId}</code></td>
                      <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        {item.schemeName}
                      </td>
                      <td>
                        <span className="badge badge-category">{item.category}</span>
                      </td>
                      <td><strong>{item.totalApplications}</strong></td>
                      <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>{item.approved}</td>
                      <td style={{ color: 'var(--color-warning)', fontWeight: 600 }}>{item.pending}</td>
                      <td style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{item.rejected}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${ratio}%`, height: '100%', background: 'var(--color-success)' }}></div>
                          </div>
                          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>{ratio}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No scheme applications recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
