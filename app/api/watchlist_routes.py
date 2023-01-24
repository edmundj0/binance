from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, WatchlistCoin, Coin
from sqlalchemy.orm import joinedload
from app.forms import WatchlistForm, UpdateWatchlistForm, AddCoinToWatchListForm
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
        Returns information about the coins associated with watchlist
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


@watchlist_routes.route("", methods=["POST"])
@login_required
def create_watchlist():
    """
    Create a new watchlist
    """

    form = WatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    id_of_user = current_user.id #user is an integer

    if form.validate_on_submit():
        user_id = id_of_user
        name = form.data["name"]
        description = form.data["description"]

        new_watchlist = Watchlist(user_id=user_id, name=name, description=description)

        db.session.add(new_watchlist)
        db.session.commit()

        return new_watchlist.to_dict()

    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@watchlist_routes.route("/<int:watchlist_id>", methods=["PUT"])
@login_required
def update_watchlist(watchlist_id):
    """
    Update watchlist name or description
    """

    form = UpdateWatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    id_of_user = current_user.id
    watchlist = Watchlist.query.get(watchlist_id)

    if not watchlist:
        return {"errors": "Watchlist not found"}, 404

    if not id_of_user == watchlist.user_id:
        return {"errors": "Not authorized to edit this watchlist"}, 401

    if watchlist and form.validate_on_submit():
        watchlist.name = form.data["name"]
        watchlist.description = form.data["description"]

        db.session.commit()
        return watchlist.to_dict()

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@watchlist_routes.route("/<int:watchlist_id>", methods=["DELETE"])
@login_required
def delete_watchlist(watchlist_id):
    """
    Delete a watchlist
    """
    watchlist = Watchlist.query.filter(Watchlist.id == watchlist_id).first()

    id_of_user = current_user.id

    if not watchlist:
        return {"errors": "Watchlist not found"}, 404

    if not id_of_user == watchlist.user_id:
        return {"errors": "Not authorized to delete this watchlist"}, 401

    db.session.delete(watchlist)
    db.session.commit()

    return {"message": "Watchlist successfully deleted"}

#need to send in coin symbol as well
@watchlist_routes.route("/<int:watchlist_id>/coins", methods=["POST"])
@login_required
def add_coin_to_watchlist(watchlist_id):
    """
    Add coin to watchlist
    """

    id_of_user = current_user.id
    watchlist = Watchlist.query.filter(Watchlist.id == watchlist_id).first()

    if not watchlist:
        return {"errors": "Watchlist not found"}, 404

    if not id_of_user == watchlist.user_id:
        return {"errors": "Not authorized to edit this watchlist"}, 401


    form = AddCoinToWatchListForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        symbol = form.data["symbol"]

        coin = Coin.query.filter(Coin.symbol == symbol).first()

        if not coin:
            return {"errors": ["Sorry, that coin is not supported on our exchange at this time."]}, 404

        # print(watchlist.watchlist_coin, 'watchlist.watchlist_coin---------------')
        # print([wlc.coin_id for wlc in watchlist.watchlist_coin])

        if coin.id in [wlc.coin_id for wlc in watchlist.watchlist_coin]: #watchlist.watchlist_coin is a list of WatchlistCoin class instances
            return {"errors": ["Coin already favorited in this watchlist!"]}, 401

        coin_id = coin.id

        new_watchlist_coin = WatchlistCoin(coin_id=coin_id, watchlist_id=watchlist_id)

        db.session.add(new_watchlist_coin)
        db.session.commit()

        return {
            "message": "Successfully added coin to watchlist",
            "coin_id": coin_id,
            "watchlist_id": watchlist_id
        }

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@watchlist_routes.route("/<int:watchlist_id>/coins", methods=["DELETE"])
@login_required
def remove_coin_from_watchlist(watchlist_id):
    """
    Remove coin from watchlist
    """

    id_of_user = current_user.id
    watchlist = Watchlist.query.filter(Watchlist.id == watchlist_id).first()

    if not watchlist:
        return {"errors": "Watchlist not found"}, 404

    if not id_of_user == watchlist.user_id:
        return {"errors": "Not authorized to delete this watchlist"}, 401

    form = AddCoinToWatchListForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        symbol = form.data["symbol"]

        coin = Coin.query.filter(Coin.symbol == symbol).first()

        if not coin:
            return {"errors": ["Sorry, that coin is not supported on our exchange at this time."]}, 404


        row_to_delete = WatchlistCoin.query.filter((WatchlistCoin.watchlist_id == watchlist.id), (WatchlistCoin.coin_id == coin.id)).first()

        if not row_to_delete:
            return {"errors": ["Sorry that coin is not found in this watchlist. If you believe this is an error, please try again later."]}, 404

        db.session.delete(row_to_delete)
        db.session.commit()

        return {
            "message": "Coin successfully removed from watchlist."
        }

    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401
