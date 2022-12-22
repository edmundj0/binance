from app.models import db, Transaction, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_transactions():
    transaction0 = Transaction(
        portfolio_id=1,
        coin_id=1,
        quantity=2,
        avg_price=16500.32,
        action="buy"
    )
    transaction1 = Transaction(
        portfolio_id=1,
        coin_id=2,
        quantity=12,
        avg_price=1230.01,
        action="buy"
        )
    transaction2 = Transaction(
        portfolio_id=3,
        coin_id=2,
        quantity=2.5,
        avg_price=1215.30,
        action="buy"
        )
    transaction3 = Transaction(
        portfolio_id=1,
        coin_id=2,
        quantity=2,
        avg_price=1230.01,
        action="sell"
    )

    db.session.add(transaction0)
    db.session.add(transaction1)
    db.session.add(transaction2)
    db.session.add(transaction3)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM transactions")

    db.session.commit()
