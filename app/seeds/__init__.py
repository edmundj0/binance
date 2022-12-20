from flask.cli import AppGroup
from .users import seed_users, undo_users
from .coins import seed_coins, undo_coins
from .payment_methods import seed_paymentMethods, undo_paymentMethods
from .portfolio import seed_portfolios, undo_portfolios
from .transaction import seed_transactions, undo_transactions
from .watchlist_coin import seed_watchlistCoins, undo_watchlistCoins
from .watchlist import seed_watchlists, undo_watchlists


from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_watchlistCoins()
        undo_watchlists()
        undo_transactions()
        undo_paymentMethods()
        undo_portfolios()
        undo_coins()
        undo_users()



    seed_users()
    seed_coins()
    seed_portfolios()
    seed_paymentMethods()
    seed_transactions()
    seed_watchlists()
    seed_watchlistCoins()

    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_watchlistCoins()
    undo_watchlists()
    undo_transactions()
    undo_paymentMethods()
    undo_portfolios()
    undo_coins()
    undo_users()
    # Add other undo functions here
