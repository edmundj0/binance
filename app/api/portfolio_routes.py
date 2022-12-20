from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Portfolio
from sqlalchemy.orm import joinedload
from .auth_routes import validation_errors_to_error_messages

portfolio_routes = Blueprint('portfolios', __name__)

# @portfolio_routes.route('/')
# def test():
#     return {'test': 'test'}

@portfolio_routes.route('/current')
@login_required
def all_portfolios_of_user():
    """
    Query for all portfolios(accounts) of the current user
    """
    user_id = current_user.get_id()

    portfolios = Portfolio.query.filter(Portfolio.user_id == user_id).all()

    def portfolios_to_dict(portfolio):
        return {
            "id": portfolio.id,
            "user_id": portfolio.user_id,
            "account_type": portfolio.account_type,
            "buying_power": portfolio.buying_power
        }

    return {
        'Portfolios': [portfolios_to_dict(portfolio) for portfolio in portfolios]
    }
