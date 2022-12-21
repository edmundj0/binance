from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, WatchlistCoin
from sqlalchemy.orm import joinedload
from app.forms import PortfolioForm, UpdatePortfolioForm
from .auth_routes import validation_errors_to_error_messages

watchlist_routes = Blueprint('watchlists', __name__)

# @portfolio_routes.route('/')
# def test():
#     return {'test': 'test'}

@watchlist_routes.route('/current')
@login_required
def get_user_watchlists():
    """
    Get all watchlists of the current user
    """

    user_id = current_user.get_id()

    watchlists = Watchlist.query.filter(Watchlist.user_id == user_id).all()

    return {
        "Watchlists": [watchlist.to_dict() for watchlist in watchlists]
    }

@watchlist_routes.route('/<int:watchlist_id>')
@login_required
def get_one_watchlist(watchlist_id):
    """
    Get watchlist details and all coins of a watchlist given watchlist id
    """

    id_of_user = current_user.id

    desired_watchlist = Watchlist.query.filter(Watchlist.id == watchlist_id).first()

    if not desired_watchlist:
        return {"errors": "Watchlist not found"}, 404

    if not id_of_user == desired_watchlist.user_id:
        return {"errors": "Not authorized to view this watchlist"}

    watchlist_coins = WatchlistCoin.query.options(joinedload(WatchlistCoin.coin)).filter(WatchlistCoin.watchlist_id == watchlist_id).all()
    # print([watchlist_coin.coin for watchlist_coin in watchlist_coins])

    def coins_watchlist_to_dict(coin):
        """
        Returns informationa about the coins associated with watchlist
        """
        return {
            "id": coin.id,
            "name": coin.name,
            "symbol": coin.symbol,
            "description": coin.description
        }

    coins_list = [coins_watchlist_to_dict(watchlist_coin.coin) for watchlist_coin in watchlist_coins]
    # print(coins_list,)



    return {
        "id": desired_watchlist.id,
        "user_id": desired_watchlist.user_id,
        "name": desired_watchlist.name,
        "description": desired_watchlist.description,
        "created_at": desired_watchlist.created_at,
        "updated_at": desired_watchlist.updated_at,
        "Coins": coins_list
    }


