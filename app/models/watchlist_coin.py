from .db import db, environment, SCHEMA, add_prefix_for_prod

class WatchlistCoin(db.Model):
    __tablename__ = 'watchlist_coins'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('watchlists.id')))
    coin_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('coins.id')))

    watchlist = db.relationship('Watchlist', back_populates='watchlist_coin', foreign_keys=[watchlist_id])
    coin = db.relationship('Coin', back_populates='watchlist_coin', foreign_keys=[coin_id])
