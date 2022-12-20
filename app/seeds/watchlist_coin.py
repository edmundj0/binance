from app.models import db, WatchlistCoin, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_watchlistCoins():
    watchlistCoin0 = WatchlistCoin(
        watchlist_id = 1,
        coin_id=1
    )
    watchlistCoin1 = WatchlistCoin(
        watchlist_id=1,
        coin_id=2
        )
    watchlistCoin2 = WatchlistCoin(
        watchlist_id=2,
        coin_id=3
        )

    db.session.add(watchlistCoin0)
    db.session.add(watchlistCoin1)
    db.session.add(watchlistCoin2)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_watchlistCoins():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_coins RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM watchlist_coins")

    db.session.commit()
