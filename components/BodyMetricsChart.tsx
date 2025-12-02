import React, { useMemo } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface BodyMetricsChartProps {
  history: Array<{
    date: string;
    weight: number | string;
    waist: number | string;
  }>;
  currentWeight: number | string;
  currentWaist: number | string;
}

export const BodyMetricsChart: React.FC<BodyMetricsChartProps> = ({
  history,
  currentWeight,
  currentWaist
}) => {
  const chartData = useMemo(() => {
    if (history.length === 0) return null;

    // Convert all values to numbers and sort by date
    const sortedHistory = [...history].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const weights = sortedHistory.map(h => Number(h.weight));
    const waists = sortedHistory.map(h => Number(h.waist));

    // Filter out invalid values (0 or NaN)
    const validWeights = weights.filter(w => w > 0);
    const validWaists = waists.filter(w => w > 0);

    if (validWeights.length === 0 && validWaists.length === 0) return null;

    return {
      history: sortedHistory,
      weights: validWeights,
      waists: validWaists
    };
  }, [history]);

  if (!chartData || chartData.history.length === 0) {
    return (
      <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-8 text-center">
        <p className="text-slate-400">No body metrics recorded yet. Check in to start tracking!</p>
      </div>
    );
  }

  // Calculate changes
  const weightChange = chartData.weights.length >= 2 
    ? (Number(currentWeight) - chartData.weights[0]).toFixed(1)
    : 0;
  
  const waistChange = chartData.waists.length >= 2 
    ? (Number(currentWaist) - chartData.waists[0]).toFixed(1)
    : 0;

  const isWeightDecreasing = Number(weightChange) < 0;
  const isWaistDecreasing = Number(waistChange) < 0;

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Weight</p>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-2xl font-bold text-white">{currentWeight}</p>
            <span className="text-xs text-slate-400">lbs</span>
          </div>
          <div className="flex items-center gap-1">
            {isWeightDecreasing ? (
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingUp className="w-4 h-4 text-red-400" />
            )}
            <p className={`text-sm font-semibold ${isWeightDecreasing ? 'text-emerald-400' : 'text-red-400'}`}>
              {isWeightDecreasing ? '−' : '+'}{Math.abs(Number(weightChange)).toFixed(1)} lbs
            </p>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Waist Size</p>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-2xl font-bold text-white">{currentWaist}</p>
            <span className="text-xs text-slate-400">inches</span>
          </div>
          <div className="flex items-center gap-1">
            {isWaistDecreasing ? (
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingUp className="w-4 h-4 text-red-400" />
            )}
            <p className={`text-sm font-semibold ${isWaistDecreasing ? 'text-emerald-400' : 'text-red-400'}`}>
              {isWaistDecreasing ? '−' : '+'}{Math.abs(Number(waistChange)).toFixed(1)}"
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-6">
        <div className="space-y-4">
          {/* Weight Chart */}
          {chartData.weights.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Weight Trend</h4>
              <LineChart 
                data={chartData.weights}
                labels={chartData.history.map(h => new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))}
                color="rgb(59, 130, 246)"
                height={150}
              />
            </div>
          )}

          {/* Waist Chart */}
          {chartData.waists.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Waist Size Trend</h4>
              <LineChart 
                data={chartData.waists}
                labels={chartData.history.map(h => new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))}
                color="rgb(245, 158, 11)"
                height={150}
              />
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-800/30 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/5">
          <h4 className="text-sm font-semibold text-slate-300">Check-in History</h4>
        </div>
        <div className="max-h-48 overflow-y-auto">
          {[...chartData.history].reverse().map((entry, idx) => (
            <div key={idx} className="flex justify-between items-center px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
              <span className="text-sm text-slate-400">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</span>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-slate-500">Weight: </span>
                  <span className="text-white font-medium">{entry.weight} lbs</span>
                </div>
                <div>
                  <span className="text-slate-500">Waist: </span>
                  <span className="text-white font-medium">{entry.waist}"</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple line chart component
interface LineChartProps {
  data: number[];
  labels: string[];
  color: string;
  height: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, labels, color, height }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const clientWidth = canvas.clientWidth;
    
    canvas.width = clientWidth * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const padding = 50;
    const plotWidth = clientWidth - padding * 2;
    const plotHeight = height - padding * 2;

    // Find min and max values
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue || 1;

    // Draw background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
    ctx.fillRect(padding, padding, plotWidth, plotHeight);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (plotHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(clientWidth - padding, y);
      ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();

    data.forEach((value, idx) => {
      const x = padding + (plotWidth / (data.length - 1 || 1)) * idx;
      const y = padding + plotHeight - ((value - minValue) / range) * plotHeight;
      
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = color;
    data.forEach((value, idx) => {
      const x = padding + (plotWidth / (data.length - 1 || 1)) * idx;
      const y = padding + plotHeight - ((value - minValue) / range) * plotHeight;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw axes
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(clientWidth - padding, height - padding);
    ctx.stroke();

    // Draw Y-axis labels (values)
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'right';
    for (let i = 0; i <= gridLines; i++) {
      const value = minValue + (range / gridLines) * (gridLines - i);
      const y = padding + (plotHeight / gridLines) * i;
      ctx.fillText(value.toFixed(1), padding - 8, y + 4);
    }

    // Draw X-axis labels (dates)
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    labels.forEach((label, idx) => {
      if (idx % Math.max(1, Math.floor(labels.length / 5)) === 0 || idx === labels.length - 1) {
        const x = padding + (plotWidth / (data.length - 1 || 1)) * idx;
        ctx.fillText(label, x, height - 8);
      }
    });
  }, [data, labels, color, height]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: `${height}px` }}
    />
  );
};
