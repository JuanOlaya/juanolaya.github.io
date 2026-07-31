# ui.py
import adsk.core
import adsk.fusion
from . import config
from .utils import get_app_objects, handle_error
from .parameters import ParameterManager
from .geometry import GeometryBuilder
from .split import SplitManager
from .inserts import InsertGenerator
from .screws import ScrewGenerator

COMMAND_ID = f"{config.ADDIN_NAME}_Command"

handlers = []

class CylinderGeneratorCommandExecuteHandler(adsk.core.CommandEventHandler):
    def __init__(self):
        super().__init__()
    def notify(self, args):
        try:
            event_args = adsk.core.CommandEventArgs.cast(args)
            inputs = event_args.command.commandInputs

            insert_type = inputs.itemById('insert_type').selectedItem.name
            
            # Map insert type to parameters
            if insert_type == 'M2':
                boss_dia = "6 mm"
                boss_h = "4 mm"
                ins_od = "3.2 mm"
                ins_hd = "3.1 mm"
                scr_hd = "2.2 mm"
                cb_dia = "4.0 mm"
                cb_dep = "2 mm"
            elif insert_type == 'M4':
                boss_dia = "10 mm"
                boss_h = "8 mm"
                ins_od = "6.0 mm"
                ins_hd = "5.8 mm"
                scr_hd = "4.3 mm"
                cb_dia = "7.5 mm"
                cb_dep = "4 mm"
            else: # M3 default
                boss_dia = config.DEFAULT_BOSS_DIAMETER
                boss_h = config.DEFAULT_BOSS_HEIGHT
                ins_od = config.DEFAULT_INSERT_OUTER_DIAMETER
                ins_hd = config.DEFAULT_INSERT_HOLE_DIAMETER
                scr_hd = config.DEFAULT_SCREW_HOLE_DIAMETER
                cb_dia = config.DEFAULT_COUNTERBORE_DIAMETER
                cb_dep = config.DEFAULT_COUNTERBORE_DEPTH
                
            app, ui, design = get_app_objects()
            
            od_expr = inputs.itemById('outer_diameter').expression
            len_expr = inputs.itemById('length').expression
            wall_expr = inputs.itemById('wall_thickness').expression
            num_expr = inputs.itemById('num_bosses').expression

            param_dict = {
                "OuterDiameter": od_expr,
                "Length": len_expr,
                "WallThickness": wall_expr,
                "BossDiameter": boss_dia,
                "BossHeight": boss_h,
                "InsertOuterDiameter": ins_od,
                "InsertHoleDiameter": ins_hd,
                "ScrewHoleDiameter": scr_hd,
                "CounterboreDiameter": cb_dia,
                "CounterboreDepth": cb_dep,
                "CornerOffset": config.DEFAULT_CORNER_OFFSET,
                "NumberOfBosses": num_expr,
                "FilletRadius": config.DEFAULT_FILLET_RADIUS
            }
            
            param_mgr = ParameterManager(design)
            param_mgr.initialize_parameters(param_dict)
            
            root_comp = design.rootComponent
            geo_builder = GeometryBuilder(root_comp)
            split_mgr = SplitManager(root_comp)
            insert_gen = InsertGenerator(root_comp)
            screw_gen = ScrewGenerator(root_comp)
            
            body = geo_builder.build_outer_cylinder()
            if not body: return
            
            shell_feat = geo_builder.apply_shell(body)
            if not shell_feat: return
            
            upper, lower = split_mgr.split_body(body)
            if not upper or not lower: return
            
            insert_gen.create_bosses(upper)
            screw_gen.create_bosses(lower)

        except Exception:
            handle_error('ExecuteCommand')

class CylinderGeneratorCommandCreatedHandler(adsk.core.CommandCreatedEventHandler):
    def __init__(self):
        super().__init__()
    def notify(self, args):
        try:
            event_args = adsk.core.CommandCreatedEventArgs.cast(args)
            cmd = event_args.command
            inputs = cmd.commandInputs

            inputs.addValueInput('outer_diameter', 'Outer Diameter', 'mm', adsk.core.ValueInput.createByString(config.DEFAULT_OUTER_DIAMETER))
            inputs.addValueInput('length', 'Length', 'mm', adsk.core.ValueInput.createByString(config.DEFAULT_LENGTH))
            inputs.addValueInput('wall_thickness', 'Wall Thickness', 'mm', adsk.core.ValueInput.createByString(config.DEFAULT_WALL_THICKNESS))
            
            drop = inputs.addDropDownCommandInput('insert_type', 'Insert Type', adsk.core.DropDownStyles.TextListDropDownStyle)
            drop.listItems.add('M2', False)
            drop.listItems.add('M3', True)
            drop.listItems.add('M4', False)
            
            inputs.addValueInput('num_bosses', 'Number of Bosses', '', adsk.core.ValueInput.createByString(config.DEFAULT_NUMBER_OF_BOSSES))

            on_execute = CylinderGeneratorCommandExecuteHandler()
            cmd.execute.add(on_execute)
            handlers.append(on_execute)
        except Exception:
            handle_error('CommandCreated')
