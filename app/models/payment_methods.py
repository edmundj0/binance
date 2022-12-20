from .db import db, environment, SCHEMA, add_prefix_for_prod

class PaymentMethod(db.Model):
    __tablename__ = 'payment_methods'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    type = db.Column(db.String(255))
    account_number = db.Column(db.String(255), nullable=False)
    routing_number = db.Column(db.String(255), nullable=False)

    user = db.relationship('User', back_populates='paymentMethods_user', foreign_keys=[user_id])
