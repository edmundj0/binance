import { useEffect, useState, useRef } from "react"
import { createChart, CrosshairMode } from 'lightweight-charts'



export default function BtcChart() {
    const [price, setPrice] = useState('Connecting...')
    const chartContainerRef = useRef()

    useEffect(() => {
        const binanceSocket = new WebSocket("wss://stream.binance.us:9443/ws/btcusd@trade")
        binanceSocket.onmessage = function (event) {
            console.log(event.data)

            const msgObj = JSON.parse(event.data)

            setPrice(msgObj.p)
        }

        return () => binanceSocket.close();
    }, [])



    useEffect(() => {

        const chart = createChart(chartContainerRef.current, {
            width: 800,
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
            },
        });

        let candleSeries = chart.addCandlestickSeries({
            upColor: 'rgba(255, 144, 0, 1)',
            downColor: '#000',
            borderDownColor: 'rgba(255, 144, 0, 1)',
            borderUpColor: 'rgba(255, 144, 0, 1)',
            wickDownColor: 'rgba(255, 144, 0, 1)',
            wickUpColor: 'rgba(255, 144, 0, 1)',
        });

        const getCandles = () => {
            return fetch("https://www.bitstamp.net/api/v2/ohlc/btcusd?step=180&limit=1000")
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

        const binanceSocket = new WebSocket("wss://stream.binance.us:9443/ws/btcusd@kline_3m")
        binanceSocket.onmessage = function (event) {

            const msgObj = JSON.parse(event.data)
            const candleStick = msgObj.k

            candleSeries.update({
                time: candleStick.t / 1000,
                open: candleStick.o,
                high: candleStick.h,
                low: candleStick.l,
                close: candleStick.c
            })
        }

        return () => binanceSocket.close();
    }, [])



    return (
        <>Test
            <div>{price}</div>
            <div ref={chartContainerRef}>testtttt</div>
            <h3>Settings</h3>
            <div>
                <input type="checkbox" />RSI
                <input type="text" name="rsi_length" placeholder="14" />
                Overbought
                <input type="text" name="rsi_overbought" placeholder="70" />
                Oversold
                <input type="text" name="rsi_overshold" placeholder="30" />



            </div>
        </>
    )
}
