import requests
from flask import Blueprint
from app.models import Coin


market_data_routes = Blueprint('market_data', __name__)

@market_data_routes.route('/options/<int:coin_id>')
def options_market_data(coin_id):
    """
    Return options data from Ledger X API for options data
    """
    coin = Coin.query.filter(Coin.id == coin_id).first()
    print(coin, 'coin')

    if not coin:
        return {'errors': "Coin not found or is not available at this time"}

    headers = {'Accept': 'application/json'}
    response = requests.get(f'https://api.ledgerx.com/trading/contracts?active=true&derivative_type=options_contract&asset={coin.symbol}')
    if response.ok:
        data = response.json()
        return data
    else:
        return {'errors': f"Unable to retrieve options data"}

# @market_data_routes.route('/options/btc')
# def options_market_data_btc():
#     """
#     Return options data from Ledger X API for btc options data
#     """

#     headers = {'Accept': 'application/json'}
#     response = requests.get('https://api.ledgerx.com/trading/contracts?asset=BTC', headers=headers)
#     if response.ok:
#         data = response.json()
#         return data
#     else:
#         return {"error": "Unable to retrieve options data"}


# @market_data_routes.route('/options/eth')
# def options_market_data_eth():
#     """
#     Return options data from Ledger X API for eth options data
#     """

#     headers = {'Accept': 'application/json'}
#     response = requests.get('https://api.ledgerx.com/trading/contracts?asset=ETH', headers=headers)
#     if response.ok:
#         data = response.json()
#         return data
#     else:
#         return {"error": "Unable to retrieve options data"}
