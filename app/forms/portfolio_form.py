from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, FloatField, BooleanField
from wtforms.validators import DataRequired, ValidationError

def account_type_len_check(form, field):
    account_type = field.data
    if len(account_type) > 50:
        raise ValidationError("Account type must be less than 50 characters")

def name_len_check(form, field):
    name = field.data
    if len(name) > 50:
        raise ValidationError("Account name must be less than 50 characters")

class PortfolioForm(FlaskForm):
    user_id = IntegerField("User Id")
    account_type = StringField("Account Type", validators=[DataRequired(), account_type_len_check])
    buying_power = FloatField("Buying Power")
    name = StringField("Name", validators=[DataRequired(), name_len_check])

class UpdatePortfolioForm(FlaskForm):
    account_type = StringField("Account Type", validators=[DataRequired(), account_type_len_check])
    buying_power = FloatField("Buying Power")
    name = StringField("Name", validators=[DataRequired(), name_len_check])
