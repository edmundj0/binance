export default function CoinChartTimeIntervals({ setTimeInSecs, chartContainerRef, setTimeInterval }) {

    const timeOptions = [["60", "1m"], ["300", "5m"], ["900", "15m"], ["1800", "30m"], ["3600", "1h"], ["86400", "1d"], ["259200", "3d"]]

    return (
        <div>
            {timeOptions.map(time => {
                return (
                    <div key={`time ${time[0]}`} onClick={() => {
                        setTimeInSecs(time[0])
                        setTimeInterval(time[1])
                    }}>{time[1]}</div>
                )
            })}
        </div>
    )
}
