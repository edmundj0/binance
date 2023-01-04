import { createChart } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";


export default function OnePortfolioChart({thisPortfolio}) {
    // const dispatch = useDispatch()
    // const [assets, setAssets] = useState([])
    const portfolioChartContainerRef = useRef(null)
    // const isMounted = useRef(false)

    // const thisPortfolio = useSelector(state => state.portfolios.onePortfolio)


    useEffect(() => {
        //fetch assets for chart
        if (thisPortfolio.id) {
            fetch(`/api/portfolios/${thisPortfolio.id}/assets`)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw response
                })
                .then((data) => {
                    // setAssets(data.Assets)
                    let assets = data.Assets
                    console.log(Math.floor(new Date().getTime() / 1000), 'date', new Date().getTime())

                    // if (isMounted.current) {

                        //useEffect can run 3 times on load - remove multiple charts if it exists
                        if(portfolioChartContainerRef.current.children[0]){
                            portfolioChartContainerRef.current.removeChild(portfolioChartContainerRef.current.children[0])
                        }

                        const chart = createChart(portfolioChartContainerRef.current, {
                            width: 800,
                            height: 600,
                            rightPriceScale: {
                                scaleMargins: {
                                    top: 0.2,
                                    bottom: 0.2,
                                },
                                borderVisible: true,
                                borderColor: 'rgba(197, 203, 206, 0.8)'
                            },
                            timeScale: {
                                borderVisible: true,
                                fixRightEdge: true,
                                fixLeftEdge: true,
                                borderColor: 'rgba(197, 203, 206, 0.8)'
                            },
                            layout: {
                                backgroundColor: '#000000',
                                textColor: 'rgba(255,255,255,0.9)'
                            },
                            grid: {
                                horzLines: {
                                    color: '#eee',
                                    visible: false
                                },
                                vertLines: {
                                    color: '#ffffff',
                                    visible: false
                                },
                            },
                            crosshair: {
                                vertLine: {
                                    labelVisible: true,
                                },
                            },
                            gridLineOptions: false
                        })

                        let series = chart.addAreaSeries({
                            topColor: 'rgba(0, 150, 136, 0.56)',
                            bottomColor: 'rgba(0, 150, 136, 0.04)',
                            lineColor: 'rgba(0, 150, 136, 1)',
                            lineWidth: 2,
                        })

                        const getCandles = () => {

                            if(!assets.length){
                                series.setData([
                                {
                                    value: thisPortfolio?.buying_power,
                                    time: Math.floor(new Date().getTime() / 1000)
                                },
                                {
                                    value: thisPortfolio?.buying_power,
                                    time: Math.floor(new Date().getTime() / 1000)
                                }

                            ])
                            }
                            for (let asset of assets) {
                                let sumData = []
                                return fetch(`https://www.bitstamp.net/api/v2/ohlc/${asset.symbol.toLowerCase()}usd?step=14400&limit=300`)
                                    .then((response) => { if (response.ok) return response.json() })
                                    .then((data) => {
                                        const relevantData = data.data.ohlc
                                        for (let candle of relevantData) {

                                            if (sumData.some(ele => ele.time === parseFloat(candle.timestamp))) { //check if that time exists as a value already in sumData.time
                                                sumData[parseFloat(candle.timestamp)]["value"] = sumData["value"] + (asset.quantity * candle.open) //set value to new value
                                            }
                                            else { //if timestamp doesn't already exist
                                                sumData.push({
                                                    time: parseFloat(candle.timestamp),
                                                    value: candle.open * asset.quantity + thisPortfolio?.buying_power //js type coercion //add usd value of portfolio
                                                })
                                            }

                                            // processedCandles.push({
                                            //     time: parseFloat(candle.timestamp),
                                            //     value: candle.open
                                            // })
                                        }

                                        series.setData(sumData)


                                        return data
                                    })
                            }
                        }


                        getCandles()

                    // } else {
                    //     isMounted.current = true;
                    // }


                })
        }

    }, [thisPortfolio])

    //put this in the other use effect so the entire page won't error out on improper timestamp
    // useEffect(() => {
    //     console.log(portfolioChartContainerRef.current.children[0], 'reffffffffffffffffffffff')
    //     if (isMounted.current) {

    //         if(portfolioChartContainerRef.current.children[0]){
    //             portfolioChartContainerRef.current.removeChild(portfolioChartContainerRef.current.children[0])
    //         }

    //         const chart = createChart(portfolioChartContainerRef.current, {
    //             width: 800,
    //             height: 600,
    //             rightPriceScale: {
    //                 scaleMargins: {
    //                     top: 0.2,
    //                     bottom: 0.2,
    //                 },
    //                 borderVisible: false,
    //             },
    //             timeScale: {
    //                 borderVisible: false,
    //                 fixRightEdge: true,
    //                 fixLeftEdge: true
    //             },
    //             layout: {
    //                 backgroundColor: '#000000',
    //                 textColor: '#333',
    //             },
    //             grid: {
    //                 horzLines: {
    //                     color: '#eee',
    //                     visible: false
    //                 },
    //                 vertLines: {
    //                     color: '#ffffff',
    //                     visible: false
    //                 },
    //             },
    //             crosshair: {
    //                 vertLine: {
    //                     labelVisible: true,
    //                 },
    //             },
    //             gridLineOptions: false
    //         })

    //         let series = chart.addAreaSeries({
    //             topColor: 'rgba(0, 150, 136, 0.56)',
    //             bottomColor: 'rgba(0, 150, 136, 0.04)',
    //             lineColor: 'rgba(0, 150, 136, 1)',
    //             lineWidth: 2,
    //         })

    //         const getCandles = () => {

    //             if(!assets.length){
    //                 series.setData([
    //                 {
    //                     value: thisPortfolio?.buying_power,
    //                     time: null
    //                 }

    //             ])
    //             }
    //             for (let asset of assets) {
    //                 let sumData = []
    //                 return fetch(`https://www.bitstamp.net/api/v2/ohlc/${asset.symbol.toLowerCase()}usd?step=300&limit=300`)
    //                     .then((response) => { if (response.ok) return response.json() })
    //                     .then((data) => {
    //                         const relevantData = data.data.ohlc
    //                         for (let candle of relevantData) {

    //                             if (sumData.some(ele => ele.time === parseFloat(candle.timestamp))) { //check if that time exists as a value already in sumData.time
    //                                 sumData[parseFloat(candle.timestamp)]["value"] = sumData["value"] + (asset.quantity * candle.open) //set value to new value
    //                             }
    //                             else { //if timestamp doesn't already exist
    //                                 sumData.push({
    //                                     time: parseFloat(candle.timestamp),
    //                                     value: candle.open * asset.quantity + thisPortfolio?.buying_power //js type coercion //add usd value of portfolio
    //                                 })
    //                             }

    //                             // processedCandles.push({
    //                             //     time: parseFloat(candle.timestamp),
    //                             //     value: candle.open
    //                             // })
    //                         }

    //                         series.setData(sumData)


    //                         return data
    //                     })
    //             }
    //         }


    //         getCandles()
    //         setChartCreated(true)

    //     } else {
    //         isMounted.current = true;
    //     }

    // }, [assets])


    // if (!thisPortfolio) {
    //     return null
    // }


    return (
        <div>
            <div ref={portfolioChartContainerRef}>

            </div>

        </div>
    )

}
