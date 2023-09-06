from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Portfolio, Transaction
from sqlalchemy.orm import joinedload
from app.forms import PortfolioForm, UpdatePortfolioForm
from .auth_routes import validation_errors_to_error_messages

portfolio_routes = Blueprint('portfolios', __name__)


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
            "buying_power": portfolio.buying_power,
            "name": portfolio.name
        }

    return {
        'Portfolios': [portfolios_to_dict(portfolio) for portfolio in portfolios]
    }


@portfolio_routes.route('/<int:portfolio_id>')
@login_required
def get_one_portfolio(portfolio_id):
    """
    Get portfolio details and transactions of a given portfolio id
    """

    id_of_user = current_user.id

    portfolio = Portfolio.query.options(joinedload(Portfolio.transactions_portfolio).options(joinedload(Transaction.coin))).filter(Portfolio.id == portfolio_id).first()

    if(not portfolio):
        return {"errors": "Portfolio (account) not found"}, 404

    if not id_of_user == portfolio.user_id:
        return {"errors": "Not authorized to view this portfolio (account)"}, 401

    def transactions_portfolio_to_dict(transaction):
        """
        Return information about the portfolio and all associated transactions
        """
        return {
            "id": transaction.id,
            "portfolio_id": transaction.portfolio_id,
            "coin_id": transaction.coin_id,
            "quantity": transaction.quantity,
            "avg_price": transaction.avg_price,
            "status": transaction.status,
            "created_at": transaction.created_at,
            "action": transaction.action,
            "Coin": {
                "id": transaction.coin.id,
                "name": transaction.coin.name,
                "symbol": transaction.coin.symbol,
                "description": transaction.coin.description
            }
        }


    return {
        "id": portfolio.id,
        "user_id": portfolio.user_id,
        "account_type": portfolio.account_type,
        "buying_power": portfolio.buying_power,
        "name": portfolio.name,
        "Transactions": [transactions_portfolio_to_dict(transaction) for transaction in portfolio.transactions_portfolio]
    }


@portfolio_routes.route("", methods=["POST"])
@login_required
def create_portfolio():
    """
    Create a new portfolio
    """

    form = PortfolioForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    id_of_user = current_user.id #user is an integer

    if form.validate_on_submit():
        user_id = id_of_user
        account_type = form.data["account_type"]
        buying_power = form.data["buying_power"]
        name = form.data["name"]

        new_portfolio = Portfolio(user_id=user_id, account_type=account_type, buying_power=buying_power, name=name)

        db.session.add(new_portfolio)
        db.session.commit()

        return new_portfolio.to_dict()

    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@portfolio_routes.route("/<int:portfolio_id>", methods=["PUT"])
@login_required
def update_portfolio(portfolio_id):
    """
    Update portfolio
    """

    form = UpdatePortfolioForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    id_of_user = current_user.id
    portfolio = Portfolio.query.get(portfolio_id) #if not found, portfolio will be None

    if not portfolio:
        return {"errors": "Portfolio (account) not found"}, 404

    if not id_of_user == portfolio.user_id:
        return {"errors": "Not authorized to edit this portfolio (account)"}, 401

    if portfolio and form.validate_on_submit():
        portfolio.account_type = form.data["account_type"] or portfolio.account_type
        portfolio.name = form.data["name"]

        if form.data["buying_power"] == 0:
            portfolio.buying_power = 0
        else:
            portfolio.buying_power = form.data["buying_power"] or portfolio.buying_power

        db.session.commit()

        return portfolio.to_dict()

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@portfolio_routes.route("/<int:portfolio_id>", methods=["DELETE"])
@login_required
def delete_portfolio(portfolio_id):
    """
    Delete a portfolio
    """
    portfolio = Portfolio.query.options(joinedload(Portfolio.transactions_portfolio)).filter(Portfolio.id == portfolio_id).first()

    id_of_user = current_user.id

    if not portfolio:
        return {"errors": ["Portfolio (account) not found"]}, 404

    if not id_of_user == portfolio.user_id:
        return {"errors": ["Not authorized to delete this portfolio (account)"]}, 401

    if portfolio.transactions_portfolio:
        return {"errors": ["Can not delete portfolio (account) after making purchases or having transactions"]}, 403


    db.session.delete(portfolio)
    db.session.commit()

    return {"message": "Portfolio (account) successfully deleted"}


@portfolio_routes.route("/<int:portfolio_id>/assets")
@login_required
def all_assets_of_portfolio(portfolio_id):
    """
    Get aggregate assets in a portfolio
    """

    id_of_user = current_user.id
    portfolio = Portfolio.query.options(joinedload(Portfolio.transactions_portfolio).options(joinedload(Transaction.coin))).filter(Portfolio.id == portfolio_id).first()

    if(not portfolio):
        return {"errors": "Portfolio (account) not found"}, 404

    if not id_of_user == portfolio.user_id:
        return {"errors": "Not authorized to view this portfolio (account)"}, 401

    assetsDict = {}
    for transaction in portfolio.transactions_portfolio:

        # handle divide by 0 error and remove coin from assets list, in the case where user sells all
        # TODO: fix avg price after removing the total_money_paid and total_money_received calculation
        if(transaction.action == "buy" and transaction.coin_id in assetsDict and (assetsDict[transaction.coin_id]["quantity"] + transaction.quantity) == 0):
            del assetsDict[transaction.coin_id]
            continue
        if(transaction.action == "sell" and transaction.coin_id in assetsDict and (assetsDict[transaction.coin_id]["quantity"] - transaction.quantity) == 0):
            del assetsDict[transaction.coin_id]
            continue

        if transaction.action == "buy" and not transaction.coin_id in assetsDict:
            assetsDict[transaction.coin_id] = {"quantity": transaction.quantity, "avg_price": transaction.avg_price, "symbol": transaction.coin.symbol, "name": transaction.coin.name, "total_money_paid": transaction.avg_price * transaction.quantity, "total_money_received": 0, "coin_id": transaction.coin_id}
        elif transaction.action == "buy" and transaction.coin_id in assetsDict:
            existingAsset = assetsDict[transaction.coin_id]
            existingAsset["total_money_paid"] += (transaction.avg_price * transaction.quantity)
            existingAsset["avg_price"] = (existingAsset["total_money_paid"] - existingAsset["total_money_received"]) / (existingAsset["quantity"] + transaction.quantity)
            existingAsset["quantity"] += transaction.quantity
        elif transaction.action == "sell" and not transaction.coin_id in assetsDict:
            assetsDict[transaction.coin_id] = {"quantity": transaction.quantity * -1, "avg_price": transaction.avg_price, "symbol": transaction.coin.symbol, "name": transaction.coin.name, "total_money_paid": 0, "total_money_received": transaction.avg_price * transaction.quantity, "coin_id": transaction.coin_id}
        elif transaction.action == "sell" and transaction.coin_id in assetsDict:
            existingAsset = assetsDict[transaction.coin_id]
            existingAsset["total_money_received"] += (transaction.avg_price * transaction.quantity)
            existingAsset["avg_price"] = (existingAsset["total_money_paid"] - existingAsset["total_money_received"]) / (existingAsset["quantity"] - transaction.quantity)
            existingAsset["quantity"] -= transaction.quantity

    return {"Assets": [item for item in assetsDict.values()]}
