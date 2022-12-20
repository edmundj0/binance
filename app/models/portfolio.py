from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date

class Portfolio(db.Model):
    __tablename__ = 'portfolios'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    account_type = db.Column(db.String(255), nullable=False)
    buying_power = db.Column(db.Float)
