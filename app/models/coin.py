from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date

class Coin(db.Model):
    __tablename__ = 'coins'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    symbol = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(1000), nullable=False)

    transactions_coin = db.relationship('Transaction', primaryjoin='Coin.id == Transaction.coin_id', back_populates='coin', cascade='all, delete')
    watchlist_coin = db.relationship('WatchlistCoin', back_populates='coin', cascade='all, delete')


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "symbol": self.symbol,
            "description": self.description
        }
