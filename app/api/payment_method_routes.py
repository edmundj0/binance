from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Portfolio, PaymentMethod
from sqlalchemy.orm import joinedload
from app.forms import PaymentMethodForm, UpdatePaymentMethodForm
from .auth_routes import validation_errors_to_error_messages

payment_method_routes = Blueprint('payment_methods', __name__)

@payment_method_routes.route('/current')
@login_required
def all_payment_methods_of_user():
    """
    Query for all payment methods of the current user
    """

    user_id = current_user.get_id()

    payment_methods = PaymentMethod.query.filter(PaymentMethod.user_id == user_id).all()

    return {
        "Payment Methods": [method.to_dict() for method in payment_methods]
    }

@payment_method_routes.route('/<int:payment_method_id>')
@login_required
def get_one_payment_method(payment_method_id):
    """
    Get payment method details of a given payment method id
    """

    id_of_user = current_user.id

    payment_method = PaymentMethod.query.filter(PaymentMethod.id == payment_method_id).first()

    if not payment_method:
        return {"errors": "Payment method not found"}, 404

    if not id_of_user == payment_method.user_id:
        return {"errors": "Not authorized to view this payment method"}, 401

    return payment_method.to_dict()

@payment_method_routes.route("", methods=["POST"])
@login_required
def create_payment_method():
    """
    Create a new payment method
    """
    form = PaymentMethodForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    id_of_user = current_user.id

    if form.validate_on_submit():
        user_id = id_of_user
        type = form.data["type"]
        account_number = form.data["account_number"]
        routing_number = form.data["routing_number"]
        note = form.data["note"]

        new_payment_method = PaymentMethod(user_id=user_id, type=type,account_number=account_number,routing_number=routing_number,note=note)

        db.session.add(new_payment_method)
        db.session.commit()

        return new_payment_method.to_dict()

    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@payment_method_routes.route("/<int:payment_method_id>", methods=["PUT"])
@login_required
def update_payment_method(payment_method_id):
    """
    Update payment method
    """
    form = UpdatePaymentMethodForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    id_of_user = current_user.id
    payment_method = PaymentMethod.query.get(payment_method_id)

    if not payment_method:
        return {"errors": "Payment method not found"}, 404

    if not id_of_user == payment_method.user_id:
        return {"errors": "Not authorized to edit this payment method"}, 401

    if form.validate_on_submit():
        payment_method.note = form.data["note"]

        db.session.commit()

        return payment_method.to_dict()

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@payment_method_routes.route("/<int:payment_method_id>", methods=["DELETE"])
@login_required
def delete_payment_method(payment_method_id):
    """
    Delete a payment method
    """

    id_of_user = current_user.id

    payment_method = PaymentMethod.query.filter(PaymentMethod.id == payment_method_id).first()

    if not payment_method:
        return {"errors": "Payment method not found"}, 404

    if not id_of_user == payment_method.user_id:
        return {"errors": "Not authorized to edit this payment method"}, 401

    db.session.delete(payment_method)
    db.session.commit()

    return {"message": "Payment method successfully deleted"}
