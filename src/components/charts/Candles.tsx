import React, { useEffect, useMemo, useRef } from 'react';
import { createChart, IChartApi, CandlestickData, CrosshairMode } from 'lightweight-charts';
import type { Candle } from '../../types/domain';

export function CandlesChart({ candles }: { candles: Candle[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

  // Memoize data transformation to avoid recalculating on every render
  const data = useMemo(() => {
    return candles.map(c => ({
      time: Math.floor(c.t / 1000) as any,
      open: c.o,
      high: c.h,
      low: c.l,
      close: c.c,
    }));
  }, [candles]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create Chart only once
    const chart = createChart(containerRef.current, {
      autoSize: true, // Let library handle resize efficiently
      layout: { background: { color: 'transparent' }, textColor: 'rgba(255,255,255,0.75)' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.04)' }, horzLines: { color: 'rgba(255,255,255,0.04)' } },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.08)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.08)' },
      crosshair: { mode: CrosshairMode.Magnet },
    });

    const series = chart.addCandlestickSeries({
      upColor: '#049F6C',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#049F6C',
      wickDownColor: '#ef4444',
      wickUpColor: '#049F6C',
    });

    seriesRef.current = series;
    chartRef.current = chart;

    // Use a ResizeObserver that doesn't trigger state updates, just chart resize
    const ro = new ResizeObserver((entries) => {
      if (entries.length === 0 || !entries[0].contentRect) return;
      chart.timeScale().fitContent();
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Update data separately when it changes
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
      // Only fit content on initial load or significant data changes?
      // chartRef.current?.timeScale().fitContent(); 
    }
  }, [data]);

  return <div ref={containerRef} className="w-full h-[320px]" />;
}
