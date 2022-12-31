from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Coin
from sqlalchemy.orm import joinedload
from app.forms import PaymentMethodForm, UpdatePaymentMethodForm
from .auth_routes import validation_errors_to_error_messages

coin_routes = Blueprint('coins', __name__)

@coin_routes.route('/all')
def all_coins():
    """
    Get all coins in exchange
    """

    coins = Coin.query.all()

    return {
        'Coins': [coin.to_dict() for coin in coins]
        }

@coin_routes.route('/<int:coin_id>')
def one_coin(coin_id):
    """
    Get details of one coin on exchange
    """

    coin = Coin.query.filter(Coin.id == coin_id).first()

    if not coin:
        return {'errors': "Coin not found or is not available on this platform"}, 404

    return coin.to_dict()
