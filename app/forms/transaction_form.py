from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, FloatField, BooleanField
from wtforms.validators import DataRequired, ValidationError

# def account_type_len_check(form, field):
#     account_type = field.data
#     if len(account_type) > 50:
#         raise ValidationError("Account type must be less than 50 characters")

# def name_len_check(form, field):
#     name = field.data
#     if len(name) > 50:
#         raise ValidationError("Account name must be less than 50 characters")

class TransactionForm(FlaskForm):
    portfolio_id = IntegerField("Portfolio Id", validators=[DataRequired()])
    coin_id = IntegerField("Coin Id", validators=[DataRequired()])
    quantity = FloatField("Quantity", validators=[DataRequired()])
    avg_price = FloatField("Average Price", validators=[DataRequired()])
    action = StringField("Action", validators=[DataRequired()])
