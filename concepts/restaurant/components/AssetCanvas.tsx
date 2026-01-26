/**
 * Asset Canvas (Restaurant Concept)
 * 
 * Displays the content of a selected asset in a canvas view.
 * Positioned between the secondary panel and main chat area.
 * Renders different content block types (tables, alerts, notes, etc.)
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Icons } from '../../../components/Icons/Icons';
import Button from '../../../components/Button/Button';
import { ResizeHandle } from '../../../components/ResizeHandle/ResizeHandle';
import { useFeatureFlags } from '../../../context/FeatureFlagContext';
import { useRestaurant } from '../context/RestaurantContext';
import { getAssetById, ASSET_CATEGORIES, type ContentBlock, type Asset, type ChartConfig, type WaterfallDataPoint, type GroupedBarDataPoint, type ComboChartDataPoint } from '../data/assets';
import './AssetCanvas.css';

const DEFAULT_WIDTH = 500;
const MIN_WIDTH = 300;
const MAX_WIDTH = 800;
const STORAGE_KEY = 'toqan-asset-canvas-width';

// Render a table content block
const TableBlock: React.FC<{ columns: ContentBlock extends { type: 'table' } ? ContentBlock['columns'] : never; rows: ContentBlock extends { type: 'table' } ? ContentBlock['rows'] : never }> = ({ columns, rows }) => (
  <div className="asset-canvas__table-wrapper">
    <table className="asset-canvas__table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={{ textAlign: col.align || 'left' }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Render an alert content block
const AlertBlock: React.FC<{ level: 'warning' | 'info' | 'success' | 'error'; items: string[] }> = ({ level, items }) => (
  <div className={`asset-canvas__alert asset-canvas__alert--${level}`}>
    <Icons name={level === 'warning' ? 'AlertTriangle' : level === 'error' ? 'AlertCircle' : level === 'success' ? 'Check' : 'Info'} />
    <ul className="asset-canvas__alert-list">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </div>
);

// Render a note content block
const NoteBlock: React.FC<{ text: string }> = ({ text }) => (
  <div className="asset-canvas__note">
    <Icons name="Info" />
    <p>{text}</p>
  </div>
);

// Classification colors for menu engineering matrix
const CLASSIFICATION_COLORS: Record<string, string> = {
  Star: 'var(--color-success-default, #22c55e)',
  Plowhorse: 'var(--color-warning-default, #f59e0b)',
  Puzzle: 'var(--color-info-default, #3b82f6)',
  Dog: 'var(--color-error-default, #ef4444)',
};

// Extract classification from quadrant title and normalize to singular form
const getClassificationFromTitle = (title: string): string | null => {
  const match = title.match(/^(Stars?|Plowhorses?|Puzzles?|Dogs?)/i);
  if (!match) return null;
  // Normalize to singular form (remove trailing 's')
  const classification = match[1].replace(/s$/i, '');
  // Capitalize first letter
  return classification.charAt(0).toUpperCase() + classification.slice(1).toLowerCase();
};

// Render a quadrant content block (menu analysis style)
const QuadrantBlock: React.FC<{ title: string; items: { name: string; emoji: string; stats: string; action: string }[] }> = ({ title, items }) => {
  const classification = getClassificationFromTitle(title);
  const dotColor = classification ? CLASSIFICATION_COLORS[classification] : null;
  
  return (
    <div className="asset-canvas__quadrant">
      <h4 className="asset-canvas__quadrant-title">
        {dotColor && (
          <span 
            className="asset-canvas__quadrant-dot" 
            style={{ backgroundColor: dotColor }} 
          />
        )}
        {title}
      </h4>
      <div className="asset-canvas__quadrant-items">
        {items.map((item, idx) => (
          <div key={idx} className="asset-canvas__quadrant-item">
            <span className="asset-canvas__quadrant-emoji">{item.emoji}</span>
            <div className="asset-canvas__quadrant-content">
              <span className="asset-canvas__quadrant-name">{item.name}</span>
              <span className="asset-canvas__quadrant-stats">{item.stats}</span>
              <span className="asset-canvas__quadrant-action">Action: {item.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Unovis data point type
type MenuDataPoint = {
  name: string;
  category: string;
  x: number;
  y: number;
  qtySold: number;
  margin: number;
  classification: string;
};

// Waterfall chart colors (using hex for SVG compatibility)
const WATERFALL_COLORS: Record<string, string> = {
  total: '#6366f1',     // Primary/purple
  addition: '#22c55e',  // Success/green
  deduction: '#ef4444', // Error/red
  end: '#3b82f6',       // Info/blue
};

// Processed waterfall data point
interface ProcessedWaterfallPoint {
  name: string;
  value: number;
  type: 'total' | 'addition' | 'deduction' | 'end';
  y0: number;  // Bottom of bar
  y1: number;  // Top of bar
}

// Custom SVG Waterfall Chart
const WaterfallChartBlock: React.FC<{ title?: string; data: WaterfallDataPoint[]; yLabel?: string }> = ({ title, data, yLabel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Fixed height, responsive width
  const height = 260;
  const margin = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartWidth = containerWidth - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Observe container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Process data for waterfall visualization
  const processedData = useMemo(() => {
    let runningTotal = 0;
    return data.map((d): ProcessedWaterfallPoint => {
      let y0 = 0;
      let y1 = 0;
      
      if (d.type === 'total') {
        y0 = 0;
        y1 = d.value;
        runningTotal = d.value;
      } else if (d.type === 'deduction') {
        y1 = runningTotal;
        y0 = runningTotal + d.value;
        runningTotal += d.value;
      } else if (d.type === 'addition') {
        y0 = runningTotal;
        y1 = runningTotal + d.value;
        runningTotal += d.value;
      } else if (d.type === 'end') {
        y0 = 0;
        y1 = d.value;
      }
      
      return { name: d.name, value: d.value, type: d.type, y0, y1 };
    });
  }, [data]);

  // Calculate scales
  const maxValue = useMemo(() => {
    return Math.max(...processedData.map(d => Math.max(d.y0, d.y1)));
  }, [processedData]);

  const barWidth = Math.min(40, chartWidth / processedData.length * 0.6);
  const barGap = (chartWidth - barWidth * processedData.length) / (processedData.length + 1);

  // Scale functions
  const xScale = (index: number) => margin.left + barGap + index * (barWidth + barGap);
  const yScale = (value: number) => margin.top + chartHeight - (value / maxValue) * chartHeight;

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const step = maxValue / tickCount;
    return Array.from({ length: tickCount + 1 }, (_, i) => Math.round(i * step));
  }, [maxValue]);

  return (
    <div className="asset-canvas__chart">
      {title && <h4 className="asset-canvas__chart-title">{title}</h4>}
      <div className="asset-canvas__chart-container" ref={containerRef}>
        <svg width={containerWidth} height={height}>
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <line
              key={tick}
              x1={margin.left}
              x2={containerWidth - margin.right}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="var(--color-ui-border)"
              strokeDasharray="2,2"
            />
          ))}

          {/* Y-axis */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="var(--color-ui-border)"
          />

          {/* Y-axis ticks and labels */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <text
                x={margin.left - 8}
                y={yScale(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="11"
                fill="var(--color-text-secondary)"
              >
                ${(tick / 1000).toFixed(0)}k
              </text>
            </g>
          ))}

          {/* Y-axis label */}
          {yLabel && (
            <text
              x={14}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill="var(--color-text-secondary)"
              transform={`rotate(-90, 14, ${height / 2})`}
            >
              {yLabel}
            </text>
          )}

          {/* X-axis */}
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={containerWidth - margin.right}
            y2={height - margin.bottom}
            stroke="var(--color-ui-border)"
          />

          {/* Bars */}
          {processedData.map((d, i) => {
            const x = xScale(i);
            const y = yScale(Math.max(d.y0, d.y1));
            const barHeight = Math.abs(yScale(d.y0) - yScale(d.y1));
            const isHovered = hoveredIndex === i;

            return (
              <g key={d.name}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={WATERFALL_COLORS[d.type]}
                  rx={4}
                  opacity={isHovered ? 1 : 0.85}
                  style={{ transition: 'opacity 0.15s' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Connector line (except for first and last) */}
                {i > 0 && i < processedData.length - 1 && (
                  <line
                    x1={xScale(i - 1) + barWidth}
                    x2={x}
                    y1={yScale(processedData[i].y1 > processedData[i].y0 ? processedData[i].y0 : processedData[i].y1)}
                    y2={yScale(processedData[i].y1 > processedData[i].y0 ? processedData[i].y0 : processedData[i].y1)}
                    stroke="var(--color-text-tertiary)"
                    strokeDasharray="3,3"
                    strokeWidth={1}
                  />
                )}

                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={height - margin.bottom + 12}
                  textAnchor="end"
                  fontSize="10"
                  fill="var(--color-text-secondary)"
                  transform={`rotate(-45, ${x + barWidth / 2}, ${height - margin.bottom + 12})`}
                >
                  {d.name}
                </text>

                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={x + barWidth / 2 - 50}
                      y={y - 45}
                      width={100}
                      height={36}
                      fill="var(--color-ui-background-elevated)"
                      stroke="var(--color-ui-border)"
                      rx={4}
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 30}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="var(--color-text-default)"
                    >
                      {d.name}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={y - 15}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="600"
                      fill={WATERFALL_COLORS[d.type]}
                    >
                      {d.value < 0 ? '-' : ''}${Math.abs(d.value).toLocaleString()}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="asset-canvas__chart-legend">
        <div className="asset-canvas__chart-legend-item">
          <span className="asset-canvas__chart-legend-dot" style={{ backgroundColor: WATERFALL_COLORS.total }} />
          <span className="asset-canvas__chart-legend-label">Total</span>
        </div>
        <div className="asset-canvas__chart-legend-item">
          <span className="asset-canvas__chart-legend-dot" style={{ backgroundColor: WATERFALL_COLORS.deduction }} />
          <span className="asset-canvas__chart-legend-label">Expense</span>
        </div>
        <div className="asset-canvas__chart-legend-item">
          <span className="asset-canvas__chart-legend-dot" style={{ backgroundColor: WATERFALL_COLORS.end }} />
          <span className="asset-canvas__chart-legend-label">Net</span>
        </div>
      </div>
    </div>
  );
};

// Custom SVG Scatter Chart
const ScatterChartBlock: React.FC<{ title?: string; config: ChartConfig }> = ({ title, config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const { data, xLabel, yLabel, colorKey } = config;
  const scatterData = data as MenuDataPoint[];

  // Fixed dimensions
  const height = 280;
  const margin = { top: 20, right: 20, bottom: 50, left: 55 };
  const chartWidth = containerWidth - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Observe container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate scales
  const { minX, maxX, minY, maxY } = useMemo(() => {
    const xValues = scatterData.map(d => d.x);
    const yValues = scatterData.map(d => d.y);
    return {
      minX: Math.min(...xValues) * 0.9,
      maxX: Math.max(...xValues) * 1.1,
      minY: Math.min(...yValues) * 0.9,
      maxY: Math.max(...yValues) * 1.1,
    };
  }, [scatterData]);

  const xScale = (value: number) => margin.left + ((value - minX) / (maxX - minX)) * chartWidth;
  const yScale = (value: number) => margin.top + chartHeight - ((value - minY) / (maxY - minY)) * chartHeight;

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const step = (maxY - minY) / tickCount;
    return Array.from({ length: tickCount + 1 }, (_, i) => minY + i * step);
  }, [minY, maxY]);

  // X-axis ticks
  const xTicks = useMemo(() => {
    const tickCount = 5;
    const step = (maxX - minX) / tickCount;
    return Array.from({ length: tickCount + 1 }, (_, i) => Math.round(minX + i * step));
  }, [minX, maxX]);

  const getColor = (d: MenuDataPoint) => {
    if (colorKey && d[colorKey as keyof MenuDataPoint]) {
      return CLASSIFICATION_COLORS[String(d[colorKey as keyof MenuDataPoint])] || '#6366f1';
    }
    return '#6366f1';
  };

  return (
    <div className="asset-canvas__chart">
      {title && <h4 className="asset-canvas__chart-title">{title}</h4>}
      <div className="asset-canvas__chart-container" ref={containerRef}>
        <svg width={containerWidth} height={height}>
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <line
              key={tick}
              x1={margin.left}
              x2={containerWidth - margin.right}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="var(--color-ui-border)"
              strokeDasharray="2,2"
            />
          ))}

          {/* Y-axis */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="var(--color-ui-border)"
          />
          {yTicks.map((tick) => (
            <g key={tick}>
              <text
                x={margin.left - 8}
                y={yScale(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="11"
                fill="var(--color-text-secondary)"
              >
                ${tick.toFixed(0)}
              </text>
            </g>
          ))}
          {yLabel && (
            <text
              x={14}
              y={height / 2}
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-text-secondary)"
              transform={`rotate(-90, 14, ${height / 2})`}
            >
              {yLabel}
            </text>
          )}

          {/* X-axis */}
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={containerWidth - margin.right}
            y2={height - margin.bottom}
            stroke="var(--color-ui-border)"
          />
          {xTicks.map((tick) => (
            <text
              key={tick}
              x={xScale(tick)}
              y={height - margin.bottom + 18}
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-text-secondary)"
            >
              {tick}
            </text>
          ))}
          {xLabel && (
            <text
              x={margin.left + chartWidth / 2}
              y={height - 8}
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-text-secondary)"
            >
              {xLabel}
            </text>
          )}

          {/* Data points */}
          {scatterData.map((d, i) => {
            const cx = xScale(d.x);
            const cy = yScale(d.y);
            const isHovered = hoveredIndex === i;
            const pointColor = getColor(d);

            return (
              <g key={d.name}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 8 : 6}
                  fill={pointColor}
                  opacity={isHovered ? 1 : 0.85}
                  style={{ transition: 'r 0.15s, opacity 0.15s', cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={cx - 70}
                      y={cy - 75}
                      width={140}
                      height={65}
                      fill="var(--color-ui-background-elevated)"
                      stroke="var(--color-ui-border)"
                      rx={4}
                    />
                    <text x={cx} y={cy - 58} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-text-default)">
                      {d.name}
                    </text>
                    <text x={cx} y={cy - 44} textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">
                      Category: {d.category}
                    </text>
                    <text x={cx} y={cy - 30} textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">
                      Qty: {d.qtySold} | Margin: ${d.margin.toFixed(2)}
                    </text>
                    <text x={cx} y={cy - 16} textAnchor="middle" fontSize="10" fontWeight="600" fill={pointColor}>
                      {d.classification}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="asset-canvas__chart-legend">
        {Object.entries(CLASSIFICATION_COLORS).map(([labelText, colorVal]) => (
          <div key={labelText} className="asset-canvas__chart-legend-item">
            <span className="asset-canvas__chart-legend-dot" style={{ backgroundColor: colorVal }} />
            <span className="asset-canvas__chart-legend-label">{labelText}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Grouped bar colors
const GROUPED_BAR_COLORS = ['#6366f1', '#94a3b8']; // Actual (primary), Budget (gray)

// Custom SVG Grouped Bar Chart
const GroupedBarChartBlock: React.FC<{ title?: string; data: GroupedBarDataPoint[]; yLabel?: string }> = ({ title, data, yLabel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);
  const [hoveredBar, setHoveredBar] = useState<{ catIndex: number; barIndex: number } | null>(null);
  
  // Get labels from first data point
  const groupLabels = data[0]?.values.map(v => v.label) || [];
  const numBarsPerGroup = groupLabels.length;

  // Fixed height, responsive width
  const height = 260;
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const chartWidth = containerWidth - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Observe container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate max value for y-axis
  const maxValue = useMemo(() => {
    let max = 0;
    data.forEach(d => {
      d.values.forEach(v => {
        if (v.value > max) max = v.value;
      });
    });
    return max * 1.1; // Add 10% padding
  }, [data]);

  // Scale functions
  const groupWidth = chartWidth / data.length;
  const barWidth = Math.min(30, (groupWidth * 0.7) / numBarsPerGroup);
  const groupPadding = (groupWidth - barWidth * numBarsPerGroup) / 2;
  
  const xScale = (catIndex: number, barIndex: number) => 
    margin.left + (catIndex * groupWidth) + groupPadding + (barIndex * barWidth);
  const yScale = (value: number) => margin.top + chartHeight - (value / maxValue) * chartHeight;

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const step = maxValue / tickCount;
    return Array.from({ length: tickCount + 1 }, (_, i) => Math.round(i * step));
  }, [maxValue]);

  return (
    <div className="asset-canvas__chart">
      {title && <h4 className="asset-canvas__chart-title">{title}</h4>}
      <div className="asset-canvas__chart-container" ref={containerRef}>
        <svg width={containerWidth} height={height}>
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <line
              key={tick}
              x1={margin.left}
              x2={containerWidth - margin.right}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="var(--color-ui-border)"
              strokeDasharray="2,2"
            />
          ))}

          {/* Y-axis */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="var(--color-ui-border)"
          />

          {/* Y-axis ticks and labels */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <text
                x={margin.left - 8}
                y={yScale(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="11"
                fill="var(--color-text-secondary)"
              >
                ${(tick / 1000).toFixed(0)}k
              </text>
            </g>
          ))}

          {/* Y-axis label */}
          {yLabel && (
            <text
              x={14}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill="var(--color-text-secondary)"
              transform={`rotate(-90, 14, ${height / 2})`}
            >
              {yLabel}
            </text>
          )}

          {/* X-axis */}
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={containerWidth - margin.right}
            y2={height - margin.bottom}
            stroke="var(--color-ui-border)"
          />

          {/* Bars */}
          {data.map((category, catIndex) => (
            <g key={category.category}>
              {/* Category label */}
              <text
                x={margin.left + (catIndex * groupWidth) + groupWidth / 2}
                y={height - margin.bottom + 20}
                textAnchor="middle"
                fontSize="11"
                fill="var(--color-text-secondary)"
              >
                {category.category}
              </text>

              {/* Bars in group */}
              {category.values.map((bar, barIndex) => {
                const x = xScale(catIndex, barIndex);
                const barHeight = (bar.value / maxValue) * chartHeight;
                const y = yScale(bar.value);
                const isHovered = hoveredBar?.catIndex === catIndex && hoveredBar?.barIndex === barIndex;

                return (
                  <g key={bar.label}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth - 2}
                      height={barHeight}
                      fill={GROUPED_BAR_COLORS[barIndex]}
                      rx={4}
                      opacity={isHovered ? 1 : 0.85}
                      style={{ transition: 'opacity 0.15s' }}
                      onMouseEnter={() => setHoveredBar({ catIndex, barIndex })}
                      onMouseLeave={() => setHoveredBar(null)}
                    />

                    {/* Tooltip */}
                    {isHovered && (
                      <g>
                        <rect
                          x={x + barWidth / 2 - 45}
                          y={y - 40}
                          width={90}
                          height={32}
                          fill="var(--color-ui-background-elevated)"
                          stroke="var(--color-ui-border)"
                          rx={4}
                        />
                        <text
                          x={x + barWidth / 2}
                          y={y - 26}
                          textAnchor="middle"
                          fontSize="10"
                          fill="var(--color-text-secondary)"
                        >
                          {bar.label}
                        </text>
                        <text
                          x={x + barWidth / 2}
                          y={y - 12}
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="600"
                          fill={GROUPED_BAR_COLORS[barIndex]}
                        >
                          ${bar.value.toLocaleString()}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>
      <div className="asset-canvas__chart-legend">
        {groupLabels.map((label, i) => (
          <div key={label} className="asset-canvas__chart-legend-item">
            <span className="asset-canvas__chart-legend-dot" style={{ backgroundColor: GROUPED_BAR_COLORS[i] }} />
            <span className="asset-canvas__chart-legend-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Combo chart colors
const COMBO_BAR_COLOR = '#6366f1';  // Primary purple for bars
const COMBO_LINE_COLOR = '#22c55e'; // Green for line

// Custom SVG Combo Chart (bars + line with dual Y-axes)
const ComboChartBlock: React.FC<{ 
  title?: string; 
  data: ComboChartDataPoint[]; 
  yLabel?: string;
  yLabelSecondary?: string;
  barLabel?: string;
  lineLabel?: string;
}> = ({ title, data, yLabel, yLabelSecondary, barLabel = 'Bar', lineLabel = 'Line' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Fixed height, responsive width
  const height = 260;
  const margin = { top: 20, right: 55, bottom: 40, left: 50 };
  const chartWidth = containerWidth - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Observe container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate max values for both axes
  const maxBarValue = useMemo(() => Math.max(...data.map(d => d.barValue)) * 1.1, [data]);
  const maxLineValue = useMemo(() => Math.max(...data.map(d => d.lineValue)) * 1.1, [data]);

  // Scale functions
  const barWidth = Math.min(35, (chartWidth / data.length) * 0.6);
  const xScale = useCallback((index: number) => 
    margin.left + (index * (chartWidth / data.length)) + (chartWidth / data.length - barWidth) / 2
  , [chartWidth, data.length, barWidth, margin.left]);
  const yScaleBar = (value: number) => margin.top + chartHeight - (value / maxBarValue) * chartHeight;
  const yScaleLine = (value: number) => margin.top + chartHeight - (value / maxLineValue) * chartHeight;

  // Y-axis ticks
  const yTicksBar = useMemo(() => {
    const tickCount = 5;
    const step = maxBarValue / tickCount;
    return Array.from({ length: tickCount + 1 }, (_, i) => Math.round(i * step));
  }, [maxBarValue]);

  const yTicksLine = useMemo(() => {
    const tickCount = 5;
    const step = maxLineValue / tickCount;
    return Array.from({ length: tickCount + 1 }, (_, i) => Math.round(i * step));
  }, [maxLineValue]);

  // Generate line path
  const linePath = useMemo(() => {
    return data.map((d, i) => {
      const x = xScale(i) + barWidth / 2;
      const y = yScaleLine(d.lineValue);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [data, barWidth, xScale, yScaleLine]);

  return (
    <div className="asset-canvas__chart">
      {title && <h4 className="asset-canvas__chart-title">{title}</h4>}
      <div className="asset-canvas__chart-container" ref={containerRef}>
        <svg width={containerWidth} height={height}>
          {/* Grid lines */}
          {yTicksBar.map((tick) => (
            <line
              key={tick}
              x1={margin.left}
              x2={containerWidth - margin.right}
              y1={yScaleBar(tick)}
              y2={yScaleBar(tick)}
              stroke="var(--color-ui-border)"
              strokeDasharray="2,2"
            />
          ))}

          {/* Left Y-axis (Bar values) */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="var(--color-ui-border)"
          />
          {yTicksBar.map((tick) => (
            <g key={tick}>
              <line
                x1={margin.left - 5}
                x2={margin.left}
                y1={yScaleBar(tick)}
                y2={yScaleBar(tick)}
                stroke="var(--color-ui-border)"
              />
              <text
                x={margin.left - 8}
                y={yScaleBar(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="10"
                fill={COMBO_BAR_COLOR}
              >
                {tick}
              </text>
            </g>
          ))}
          {yLabel && (
            <text
              x={12}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill={COMBO_BAR_COLOR}
              transform={`rotate(-90, 12, ${height / 2})`}
            >
              {yLabel}
            </text>
          )}

          {/* Right Y-axis (Line values) */}
          <line
            x1={containerWidth - margin.right}
            y1={margin.top}
            x2={containerWidth - margin.right}
            y2={height - margin.bottom}
            stroke="var(--color-ui-border)"
          />
          {yTicksLine.map((tick) => (
            <g key={tick}>
              <text
                x={containerWidth - margin.right + 8}
                y={yScaleLine(tick)}
                textAnchor="start"
                dominantBaseline="middle"
                fontSize="10"
                fill={COMBO_LINE_COLOR}
              >
                ${(tick / 1000).toFixed(1)}k
              </text>
            </g>
          ))}
          {yLabelSecondary && (
            <text
              x={containerWidth - 8}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill={COMBO_LINE_COLOR}
              transform={`rotate(90, ${containerWidth - 8}, ${height / 2})`}
            >
              {yLabelSecondary}
            </text>
          )}

          {/* X-axis */}
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={containerWidth - margin.right}
            y2={height - margin.bottom}
            stroke="var(--color-ui-border)"
          />

          {/* Bars */}
          {data.map((d, i) => {
            const x = xScale(i);
            const barHeight = (d.barValue / maxBarValue) * chartHeight;
            const y = yScaleBar(d.barValue);
            const isHovered = hoveredIndex === i;

            return (
              <g key={d.label}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={COMBO_BAR_COLOR}
                  rx={4}
                  opacity={isHovered ? 1 : 0.8}
                  style={{ transition: 'opacity 0.15s' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={height - margin.bottom + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--color-text-secondary)"
                >
                  {d.label}
                </text>

                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={x + barWidth / 2 - 55}
                      y={Math.min(y, yScaleLine(d.lineValue)) - 50}
                      width={110}
                      height={44}
                      fill="var(--color-ui-background-elevated)"
                      stroke="var(--color-ui-border)"
                      rx={4}
                    />
                    <text
                      x={x + barWidth / 2}
                      y={Math.min(y, yScaleLine(d.lineValue)) - 36}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="var(--color-text-default)"
                    >
                      {d.label}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={Math.min(y, yScaleLine(d.lineValue)) - 22}
                      textAnchor="middle"
                      fontSize="10"
                      fill={COMBO_BAR_COLOR}
                    >
                      Hours: {d.barValue}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={Math.min(y, yScaleLine(d.lineValue)) - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill={COMBO_LINE_COLOR}
                    >
                      Sales: ${d.lineValue.toLocaleString()}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={COMBO_LINE_COLOR}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Line dots */}
          {data.map((d, i) => {
            const cx = xScale(i) + barWidth / 2;
            const cy = yScaleLine(d.lineValue);
            const isHovered = hoveredIndex === i;

            return (
              <circle
                key={`dot-${d.label}`}
                cx={cx}
                cy={cy}
                r={isHovered ? 6 : 4}
                fill={COMBO_LINE_COLOR}
                stroke="var(--color-ui-background)"
                strokeWidth={2}
                style={{ transition: 'r 0.15s' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>
      </div>
      <div className="asset-canvas__chart-legend">
        <div className="asset-canvas__chart-legend-item">
          <span className="asset-canvas__chart-legend-dot" style={{ backgroundColor: COMBO_BAR_COLOR }} />
          <span className="asset-canvas__chart-legend-label">{barLabel}</span>
        </div>
        <div className="asset-canvas__chart-legend-item">
          <span className="asset-canvas__chart-legend-dot" style={{ backgroundColor: COMBO_LINE_COLOR }} />
          <span className="asset-canvas__chart-legend-label">{lineLabel}</span>
        </div>
      </div>
    </div>
  );
};

// Render a chart content block - delegates to specific chart type
const ChartBlock: React.FC<{ title?: string; config: ChartConfig }> = ({ title, config }) => {
  if (config.chartType === 'waterfall') {
    return <WaterfallChartBlock title={title} data={config.data as WaterfallDataPoint[]} yLabel={config.yLabel} />;
  }
  
  if (config.chartType === 'groupedBar') {
    return <GroupedBarChartBlock title={title} data={config.data as GroupedBarDataPoint[]} yLabel={config.yLabel} />;
  }
  
  if (config.chartType === 'combo') {
    return (
      <ComboChartBlock 
        title={title} 
        data={config.data as ComboChartDataPoint[]} 
        yLabel={config.yLabel}
        yLabelSecondary={config.yLabelSecondary}
        barLabel={config.barLabel}
        lineLabel={config.lineLabel}
      />
    );
  }
  
  // Default to scatter chart
  return <ScatterChartBlock title={title} config={config} />;
};

// Render content block based on type
const ContentBlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case 'table':
      return <TableBlock columns={block.columns} rows={block.rows} />;
    case 'alert':
      return <AlertBlock level={block.level} items={block.items} />;
    case 'note':
      return <NoteBlock text={block.text} />;
    case 'quadrant':
      return <QuadrantBlock title={block.title} items={block.items} />;
    case 'chart':
      return <ChartBlock title={block.title} config={block.config} />;
    default:
      return null;
  }
};

export const AssetCanvas: React.FC = () => {
  const { selectedAssetId, selectAsset, isCanvasOpen } = useRestaurant();
  const { isFeatureActive } = useFeatureFlags();
  
  // Load width from localStorage
  const [width, setWidth] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : DEFAULT_WIDTH;
    } catch {
      return DEFAULT_WIDTH;
    }
  });

  // Save width to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(width));
    } catch (error) {
      console.error('Failed to save asset canvas width:', error);
    }
  }, [width]);

  const handleResize = (newWidth: number) => {
    setWidth(newWidth);
  };
  
  if (!isCanvasOpen || !selectedAssetId) return null;
  
  const asset = getAssetById(selectedAssetId);
  if (!asset) return null;
  
  const categoryMeta = ASSET_CATEGORIES[asset.category];
  const isResizable = isFeatureActive('newResizeablePanels');
  const panelStyle: React.CSSProperties = isResizable ? {
    width: `${width}px`,
    minWidth: `${width}px`,
    maxWidth: `${width}px`,
  } : {};
  
  return (
    <div className="asset-canvas panel-with-shadow" style={panelStyle}>
      {/* Resize handle */}
      {isResizable && (
        <ResizeHandle
          onResize={handleResize}
          currentWidth={width}
          minWidth={MIN_WIDTH}
          maxWidth={MAX_WIDTH}
          defaultWidth={DEFAULT_WIDTH}
          position="right"
          bufferSize={20}
        />
      )}
      <div className="asset-canvas__header">
        <div className="asset-canvas__header-left">
          <span className="asset-canvas__category">
            <Icons name={categoryMeta.icon} />
            {categoryMeta.label}
          </span>
          <h2 className="asset-canvas__title">{asset.title}</h2>
          <div className="asset-canvas__meta">
            <span className="asset-canvas__status">{asset.status}</span>
            {asset.statusDetail && (
              <>
                <span className="asset-canvas__separator">•</span>
                <span className="asset-canvas__status-detail">{asset.statusDetail}</span>
              </>
            )}
          </div>
        </div>
        <div className="asset-canvas__header-right">
          <Button
            variant="text"
            shape="circle"
            icon="X"
            aria-label="Close canvas"
            onClick={() => selectAsset(null)}
          />
        </div>
      </div>
      
      <div className="asset-canvas__content" key={selectedAssetId}>
        {asset.content.map((block, idx) => (
          <ContentBlockRenderer key={idx} block={block} />
        ))}
      </div>
      
      <div className="asset-canvas__footer d-none">
        <div className="asset-canvas__chat-prompt">
          <Icons name="MessageSquare" />
          <input
            type="text"
            placeholder="Ask Toqan about this asset..."
            className="asset-canvas__chat-input"
          />
        </div>
      </div>
    </div>
  );
};

export default AssetCanvas;
