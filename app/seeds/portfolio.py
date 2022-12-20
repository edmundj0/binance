from app.models import db, Portfolio, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_portfolios():
    portfolio0 = Portfolio(
        user_id=1,
        account_type='investing',
        buying_power=100000,
    )
    portfolio1 = Portfolio(
        user_id=1,
        account_type='ira',
        buying_power=0,
        )
    portfolio2 = Portfolio(
        user_id=2,
        account_type='investing',
        buying_power=500000
        )

    db.session.add(portfolio0)
    db.session.add(portfolio1)
    db.session.add(portfolio2)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_portfolios():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolios RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM portfolios")

    db.session.commit()
