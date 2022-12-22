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
    note = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default = db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    user = db.relationship('User', back_populates='paymentMethods_user', foreign_keys=[user_id])
    # transactions_paymentMethod = db.relationship('Transaction', primaryjoin='PaymentMethod.id == Transaction.paymentMethod_id', back_populates='paymentMethod')


    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "type": self.type,
            "account_number": self.account_number,
            "routing_number": self.routing_number,
            "note": self.note,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
