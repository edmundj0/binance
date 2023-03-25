import requests
from flask import Blueprint


market_data_routes = Blueprint('market_data', __name__)

@market_data_routes.route('/options/btc')
def options_market_data_btc():
    """
    Return options data from Ledger X API for btc options data
    """

    headers = {'Accept': 'application/json'}
    response = requests.get('https://api.ledgerx.com/trading/contracts?asset=BTC', headers=headers)
    print(response.json())
    if response.ok:
        data = response.json()
        return data
    else:
        return {"error": "Unable to retrieve options data"}


@market_data_routes.route('/options/eth')
def options_market_data_eth():
    """
    Return options data from Ledger X API for eth options data
    """

    headers = {'Accept': 'application/json'}
    response = requests.get('https://api.ledgerx.com/trading/contracts?asset=ETH', headers=headers)
    print(response.json())
    if response.ok:
        data = response.json()
        return data
    else:
        return {"error": "Unable to retrieve options data"}
