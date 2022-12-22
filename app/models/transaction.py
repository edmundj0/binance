from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date

class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("portfolios.id")), nullable=False)
    coin_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("coins.id")), nullable=False)
    # user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    # paymentMethod_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("payment_methods.id")))
    quantity = db.Column(db.Float, nullable=False)
    avg_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.Boolean, default=False)
    action = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default = db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    # user = db.relationship('User', back_populates='transactions_user', foreign_keys=[user_id])
    portfolio = db.relationship('Portfolio', back_populates='transactions_portfolio', foreign_keys=[portfolio_id])
    coin = db.relationship('Coin', back_populates='transactions_coin', foreign_keys=[coin_id])
    # paymentMethod = db.relationship('PaymentMethod', back_populates='transactions_paymentMethod', foreign_keys=[paymentMethod_id])


    def to_dict(self):
        return {
            "id": self.id,
            "portfolio_id": self.portfolio_id,
            "coin_id": self.coin_id,
            "quantity": self.quantity,
            "avg_price": self.avg_price,
            "status": self.status,
            "created_at": self.created_at
        }
