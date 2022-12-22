from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, FloatField, BooleanField
from wtforms.validators import DataRequired, ValidationError

def name_len_check(form, field):
    name = field.data
    if len(name) > 50:
        raise ValidationError("Name must be less than 50 characters")

def description_len_check(form, field):
    description = field.data
    if len(description) > 100:
        raise ValidationError("Description must be less than 100 characters")

class WatchlistForm(FlaskForm):
    user_id = IntegerField("User Id")
    name = StringField('Name', validators=[DataRequired(), name_len_check])
    description = StringField('Description', validators=[DataRequired(), description_len_check])

class UpdateWatchlistForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), name_len_check])
    description = StringField('Description', validators=[DataRequired(), description_len_check])


class AddCoinToWatchListForm(FlaskForm):
    symbol = StringField('Symbol', validators=[DataRequired()])
