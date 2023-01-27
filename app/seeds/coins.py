from app.models import db, Coin, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_coins():
    btc = Coin(
        name='Bitcoin', symbol='BTC', description='Bitcoin is a digital form of cash, but there is no central bank controlling it. The financial system in Bitcoin is run by computers around the world. Bitcoin transactions are verified and recorded in the public blockchain ledger by Bitcoin users.')
    eth = Coin(
        name='Ethereum', symbol='ETH', description='Ethereum is a next-generation smart contract and decentralized application platform. Ethereum is a decentralized network (often referred to as “the world computer”), created by Vitalik Buterin in 2013.')
    ada = Coin(
        name='Cardano', symbol='ADA', description='Cardano (ADA) is an open-source public blockchain to support smart contracts.')
    sol = Coin(
        name='Solana', symbol='SOL', description='Solana is a next-generation blockchain focused on speed and specifically designed to host scalable decentralized applications (dApps). SOL is the native cryptocurrency of the Solana blockchain and network.')
    doge = Coin(
        name='Dogecoin', symbol='DOGE', description='Dogecoin (DOGE) is an open-source peer-to-peer cryptocurrency reported to be favored by all Shiba inus worldwide.')
    ltc = Coin(
        name='Litecoin', symbol='LTC', description='Litecoin is both an open-source blockchain and the native cryptocurrency (LTC) that operates on it as a peer-to-peer payment system. The Litecoin blockchain forked from the Bitcoin protocol in 2011 — two years after Bitcoin was introduced.')
    avax = Coin(
        name='Avalanche', symbol='AVAX', description='Avalanche is a next-generation blockchain network combining speed and scalability with smart contract compatibility. The native token of the Avalanche network is AVAX, which can be used to pay fees, transfer value, and help secure the network via staking.')

    db.session.add(btc)
    db.session.add(eth)
    db.session.add(ada)
    db.session.add(sol)
    db.session.add(doge)
    db.session.add(ltc)
    db.session.add(avax)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_coins():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.coins RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM coins")

    db.session.commit()
