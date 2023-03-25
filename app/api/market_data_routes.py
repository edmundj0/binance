from flask import Blueprint


market_data_routes = Blueprint('market_data', __name__)

@market_data_routes.route('/options')
def options_market_data():
    """
    Return options data
    """
    return {
        "test": "test"
    }
