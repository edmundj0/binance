export default function CoinChartTimeIntervals({ setTimeInSecs, chartContainerRef, setTimeInterval, timeInSecs }) {

    const timeOptions = [["60", "1m"], ["300", "5m"], ["900", "15m"], ["1800", "30m"], ["3600", "1h"], ["86400", "1d"], ["259200", "3d"]]

    return (
        <div className="chart-time-intervals-container">
            {timeOptions.map(time => {
                return (
                    <div className={timeInSecs === time[0] ? "chart-time-each-interval-current" : "chart-time-each-interval"} key={`time ${time[0]}`} onClick={() => {
                        setTimeInSecs(time[0])
                        setTimeInterval(time[1])
                    }}>{time[1]}</div>
                )
            })}
        </div>
    )
}
