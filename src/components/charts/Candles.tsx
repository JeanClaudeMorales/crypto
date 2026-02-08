import React, { useEffect, useMemo, useRef } from 'react';
import { createChart, IChartApi, CandlestickData, CrosshairMode } from 'lightweight-charts';
import type { Candle } from '../../types/domain';

export function CandlesChart({ candles }: { candles: Candle[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const data: CandlestickData[] = useMemo(() => {
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

    const chart = createChart(containerRef.current, {
      autoSize: true,
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

    series.setData(data);
    chart.timeScale().fitContent();

    chartRef.current = chart;

    const ro = new ResizeObserver(() => chart.timeScale().fitContent());
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data]);

  return <div ref={containerRef} className="w-full h-[320px]" />;
}
