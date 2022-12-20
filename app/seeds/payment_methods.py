from app.models import db, PaymentMethod, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_paymentMethods():
    method0 = PaymentMethod(
        user_id=1,
        type='checking',
        account_number="0000000001",
        routing_number="00000002"
    )
    method1 = PaymentMethod(
        user_id=1,
        type='savings',
        account_number="500000000",
        routing_number="500000001"
        )
    method2 = PaymentMethod(
        user_id=2,
        type='savings',
        account_number="500000000",
        routing_number="500000001"
        )

    db.session.add(method0)
    db.session.add(method1)
    db.session.add(method2)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_paymentMethods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.payment_methods RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM payment_methods")

    db.session.commit()
