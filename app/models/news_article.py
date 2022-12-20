from .db import db, environment, SCHEMA, add_prefix_for_prod

class NewsArticle(db.Model):
    __tablename__ = 'news_articles'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    coin = db.Column(db.String(255))
    title = db.Column(db.String(255), nullable=False)
    article_link = db.Column(db.String(1000), nullable=False)
    description = db.Column(db.String(1000), nullable=False)

    user = db.relationship('User', back_populates='newsArticles_user', foreign_keys=[user_id])
