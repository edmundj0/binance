from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default = db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    portfolios_user = db.relationship('Portfolio', primaryjoin='User.id == Portfolio.user_id', back_populates='user', cascade='all, delete')
    watchlists_user = db.relationship('Watchlist', primaryjoin='User.id == Watchlist.user_id', back_populates='user', cascade='all, delete')
    # transactions_user = db.relationship('Transaction', primaryjoin='User.id == Transaction.user_id', back_populates='user', cascade='all, delete')
    newsArticles_user = db.relationship('NewsArticle', primaryjoin='User.id == NewsArticle.user_id', back_populates='user', cascade='all, delete')
    paymentMethods_user = db.relationship('PaymentMethod', primaryjoin='User.id == PaymentMethod.user_id', back_populates='user', cascade='all, delete')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name
        }
