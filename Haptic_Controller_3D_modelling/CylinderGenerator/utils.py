# utils.py
import adsk.core
import adsk.fusion
import traceback

def get_app_objects():
    app = adsk.core.Application.get()
    ui = app.userInterface
    design = adsk.fusion.Design.cast(app.activeProduct)
    return app, ui, design

def handle_error(action_name):
    app = adsk.core.Application.get()
    ui = app.userInterface
    if ui:
        ui.messageBox(f'Failed during {action_name}:\n{traceback.format_exc()}')
