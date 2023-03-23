import { createChart, CrosshairMode } from "lightweight-charts"
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CoinChartTimeIntervals from "./CoinChartTimeIntervals";

export default function CoinChart({ price, thisCoin, showModal }) { //pass in showModal to set chart z index to -1 when true
    const chartContainerRef = useRef()
    const [timeInSecs, setTimeInSecs] = useState("1800")
    const [timeInterval, setTimeInterval] = useState("30m")
    const isMounted = useRef(false)


    useEffect(() => {

        //chart only created after the first render(thisCoin is undefined, creating 2 charts with one error chart)
        if (isMounted.current) {

            //remove old chart and create new chart on timeInterval state change
            if (chartContainerRef.current.children[0]){
                chartContainerRef.current.removeChild(chartContainerRef.current.children[0])
            }


             const chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.offsetWidth,
                height: 600,
                layout: {
                    backgroundColor: '#000000',
                    textColor: 'rgba(255, 255, 255, 0.9)',
                },
                grid: {
                    vertLines: {
                        color: 'rgba(197, 203, 206, 0.5)',
                    },
                    horzLines: {
                        color: 'rgba(197, 203, 206, 0.5)',
                    },
                },
                crosshair: {
                    mode: CrosshairMode.Normal
                },
                rightPriceScale: {
                    borderColor: 'rgba(197, 203, 206, 0.8)',
                },
                timeScale: {
                    borderColor: 'rgba(197, 203, 206, 0.8)',
                    timeVisible: true,
                    fixRightEdge: true,
                    fixLeftEdge: true
                },
                // handleScroll: false,
                // handleScale: false,
            });

            let candleSeries = chart.addCandlestickSeries({
                upColor: '#02C076', //rgba(255, 144, 0, 1) defaults
                downColor: '#F84960', //#000
                borderDownColor: '#F84960', //rgba(255, 144, 0, 1)
                borderUpColor: '#02C076', //rgba(255, 144, 0, 1)
                wickDownColor: '#F84960', //rgba(255, 144, 0, 1)
                wickUpColor: '#02C076', //rgba(255, 144, 0, 1)
            });

            //load historical candlestick data from bitstamp api
            const getCandles = () => {
                return fetch(`https://www.bitstamp.net/api/v2/ohlc/${thisCoin?.symbol?.toLowerCase()}usd?step=${timeInSecs}&limit=1000`)
                    .then((response) => response.json())
                    .then((data) => {
                        const processedData = data.data.ohlc
                        const processedCandles = []
                        for (let candle of processedData) {
                            processedCandles.push({
                                time: parseFloat(candle.timestamp),
                                open: candle.open,
                                high: candle.high,
                                low: candle.low,
                                close: candle.close
                            })
                        }

                        candleSeries.setData(
                            processedCandles
                        )

                        return data
                    })

            }

            getCandles()

            // candleSeries.setData(
            //     [{ time: '2018-10-19', open: 180.34, high: 180.99, low: 178.57, close: 179.85 }]
            // );

            //WebSocket fetches current coin prices
            const binanceSocket = new WebSocket(`wss://stream.binance.us:9443/ws/${thisCoin?.symbol?.toLowerCase()}usd@kline_${timeInterval}`)
            binanceSocket.onmessage = function (event) {

                const msgObj = JSON.parse(event.data)
                const candleStick = msgObj.k
                //update chart with updated data
                candleSeries.update({
                    time: candleStick.t / 1000,
                    open: candleStick.o,
                    high: candleStick.h,
                    low: candleStick.l,
                    close: candleStick.c
                })
            }

            return () => binanceSocket.close();
        } else {
            isMounted.current = true;
        }



    }, [thisCoin, timeInSecs])


    return (
        <>
        <div className="coin-details-chart-container">
            <div ref={chartContainerRef} className={showModal ? 'coin-details-chart-chart-modal-true' : 'coin-details-chart-chart'}></div>
        </div>
        <CoinChartTimeIntervals setTimeInSecs={setTimeInSecs} chartContainerRef={chartContainerRef} setTimeInterval={setTimeInterval} />
        <div>{timeInSecs}</div>
        </>
    )
}
