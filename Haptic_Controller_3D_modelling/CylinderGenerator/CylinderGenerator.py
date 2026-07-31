# CylinderGenerator.py
import adsk.core
import adsk.fusion
import traceback
from . import ui as custom_ui
from .utils import get_app_objects

handlers = []

def run(context):
    try:
        app, ui, design = get_app_objects()

        cmd_def = ui.commandDefinitions.itemById(custom_ui.COMMAND_ID)
        if not cmd_def:
            cmd_def = ui.commandDefinitions.addButtonDefinition(
                custom_ui.COMMAND_ID, 
                'Cylinder Generator', 
                'Generates a parametric cylindrical enclosure.', 
                '' 
            )
        
        on_cmd_created = custom_ui.CylinderGeneratorCommandCreatedHandler()
        cmd_def.commandCreated.add(on_cmd_created)
        handlers.append(on_cmd_created)
        
        create_panel = ui.allToolbarPanels.itemById('SolidCreatePanel')
        button_control = create_panel.controls.itemById(custom_ui.COMMAND_ID)
        if not button_control:
            button_control = create_panel.controls.addCommand(cmd_def)
            button_control.isPromoted = True
            button_control.isPromotedByDefault = True

    except Exception as e:
        if ui:
            ui.messageBox('Failed:\n{}'.format(traceback.format_exc()))

def stop(context):
    try:
        app, ui, design = get_app_objects()
        
        create_panel = ui.allToolbarPanels.itemById('SolidCreatePanel')
        button_control = create_panel.controls.itemById(custom_ui.COMMAND_ID)
        if button_control:
            button_control.deleteMe()
            
        cmd_def = ui.commandDefinitions.itemById(custom_ui.COMMAND_ID)
        if cmd_def:
            cmd_def.deleteMe()

    except Exception as e:
        if ui:
            ui.messageBox('Failed:\n{}'.format(traceback.format_exc()))
