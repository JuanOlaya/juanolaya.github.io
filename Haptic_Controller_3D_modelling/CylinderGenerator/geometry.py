# geometry.py
import adsk.core
import adsk.fusion
from .utils import handle_error

class GeometryBuilder:
    def __init__(self, root_comp: adsk.fusion.Component):
        self.root_comp = root_comp

    def build_outer_cylinder(self):
        try:
            sketches = self.root_comp.sketches
            xy_plane = self.root_comp.xYConstructionPlane
            sketch = sketches.add(xy_plane)
            sketch.name = "OuterCylinderSketch"

            center = adsk.core.Point3D.create(0, 0, 0)
            circle = sketch.sketchCurves.sketchCircles.addByCenterRadius(center, 1.0)
            
            dim = sketch.sketchDimensions.addDiameterDimension(circle, adsk.core.Point3D.create(2, 2, 0))
            dim.parameter.expression = "OuterDiameter"

            extrudes = self.root_comp.features.extrudeFeatures
            prof = sketch.profiles.item(0)
            ext_input = extrudes.createInput(prof, adsk.fusion.FeatureOperations.NewBodyFeatureOperation)
            
            distance = adsk.core.ValueInput.createByString("Length")
            ext_input.setDistanceExtent(False, distance)
            extrude_feat = extrudes.add(ext_input)
            extrude_feat.name = "CylinderExtrude"
            
            return extrude_feat.bodies.item(0)
        except Exception:
            handle_error('build_outer_cylinder')
            return None

    def apply_shell(self, body: adsk.fusion.BRepBody):
        try:
            shells = self.root_comp.features.shellFeatures
            entities = adsk.core.ObjectCollection.create()
            entities.add(body)
            
            shell_input = shells.createInput(entities, False)
            shell_input.insideThickness = adsk.core.ValueInput.createByString("WallThickness")
            shell_feat = shells.add(shell_input)
            shell_feat.name = "CylinderShell"
            return shell_feat
        except Exception:
            handle_error('apply_shell')
            return None
