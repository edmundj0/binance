from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Transaction
from sqlalchemy.orm import joinedload
from app.forms import TransactionForm
from .auth_routes import validation_errors_to_error_messages

transaction_routes = Blueprint('transactions', __name__)

# @transaction_routes.route('/current')
# @login_required
# def all_transactions_of_user():
#     """
#     Query for all transactions of current portfolio
#     """
#     user_id = current_user.get_id()

#     transactions = Transaction.query.filter(Transaction.user_id == user_id).all()

@transaction_routes.route('/new', methods=["POST"])
@login_required
def new_transaction():
    """
    Create new transaction in given portfolio
    """
    form = TransactionForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    id_of_user = current_user.id

    if form.validate_on_submit():
        portfolio_id = form.data["portfolio_id"]
        coin_id = form.data["coin_id"]
        quantity = form.data["quantity"]
        avg_price = form.data["avg_price"]
        action = form.data["action"]

        new_transaction = Transaction(portfolio_id=portfolio_id, coin_id=coin_id, quantity=quantity,avg_price=avg_price,action=action)

        db.session.add(new_transaction)
        db.session.commit()

        return new_transaction.to_dict()

    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401
