import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import binanceBackgroundImg from '../../assets/binanceBackgroundImg.png'
import githubIcon from '../../assets/githubLogo.png'
import linkedInLogo from '../../assets/linkedinLogo.png'
import { getAllCoins } from '../../store/coin'
import CoinDataTable from '../CoinDetails/CoinDataTable'
import './HomePage.css'

export default function HomePage() {
    const dispatch = useDispatch()
    let allCoins = useSelector(state => state.coins.allCoins)

    useEffect(() => {
        dispatch(getAllCoins())
    }, [dispatch])


    return (
        <div className="homepage-entire-container" style={{ backgroundImage: `url(${binanceBackgroundImg})` }}>
            <div className='main-center-homepage-text-container'>
                <div id='homepage-logo-text'>₿INANCE.ME</div>
                <div className='homepage-title-text'>Buy, Sell, and Trade</div>
                <div className='homepage-title-text'>Cryptocurrencies</div>
                <div id="homepage-trade-text">Trade cryptocurrencies with no trading fees.</div>
                <NavLink to="/sign-up" exact={true} activeClassName='active'>
                    <button id="homepage-signup-button">Get Started</button>
                </NavLink>
            </div>
            <div className='second-center-homepage-container'>
                <div>Your new favorite application for Cryptocurrency Trading</div>
                <div>
                    Developed By: Edmund Ju
                    <a href="https://github.com/edmundj0"><img src={githubIcon} className="developer-logo-img" alt='githubLogo'></img></a>
                    <a href="https://www.linkedin.com/in/edmund-ju/"><img src={linkedInLogo} className="developer-logo-img" alt='linkedin-logo'></img></a>
                </div>
                <div className="warning-text-homepage">This site was developed for educational purposes and is not binance.us or binance.com. Please do not provide any real personal information to this cloned site.</div>
            </div>
            <div className='all-coins-market-container'>
                <table className='home-page-table'>
                    <thead>
                        <tr className='table-homepage-tr'>
                            <th className='table-homepage-th'>Cryptocurrency</th>
                            <th className='table-homepage-th'>Price</th>
                            <th className='table-homepage-th'>24h % Change</th>
                        </tr>
                    </thead>
                    <tbody>
                    {allCoins && Object.values(allCoins).map((coin) => {
                        return (
                            <tr key={`coins ${coin.id}`} className='table-homepage-tr'>
                                <CoinDataTable coin={coin} />
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
