# parameters.py
import adsk.core
import adsk.fusion
from .utils import handle_error

class ParameterManager:
    def __init__(self, design: adsk.fusion.Design):
        self.design = design

    def create_or_update(self, name: str, expression: str, unit: str, comment: str):
        try:
            user_params = self.design.userParameters
            param = user_params.itemByName(name)
            if param:
                param.expression = expression
            else:
                user_params.add(name, adsk.core.ValueInput.createByString(expression), unit, comment)
        except Exception:
            handle_error(f'create_or_update parameter {name}')

    def initialize_parameters(self, params_dict: dict):
        for key, value in params_dict.items():
            unit = 'mm' if 'mm' in value else ''
            self.create_or_update(key, value, unit, f"Parameter for {key}")
