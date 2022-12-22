from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, FloatField, BooleanField
from wtforms.validators import DataRequired, ValidationError

def account_number_len_check(form, field):
    account_number = field.data
    if len(account_number) > 20:
        raise ValidationError("Account and routing numbers must be less than 20 characters")

def note_len_check(form, field):
    note = field.data
    if len(note) > 50:
        raise ValidationError("Note must be less than 50 characters")

class PaymentMethodForm(FlaskForm):
    type = StringField("Type", validators=[DataRequired()])
    account_number = StringField("Account Number", validators=[DataRequired(), account_number_len_check])
    routing_number = StringField("Routing Number", validators=[DataRequired(), account_number_len_check])
    note = StringField("Note", validators=[DataRequired(), note_len_check])


class UpdatePaymentMethodForm(FlaskForm):
    note = StringField("Note", validators=[DataRequired(), note_len_check])
