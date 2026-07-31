# inserts.py
import adsk.core
import adsk.fusion
from .utils import handle_error

class InsertGenerator:
    def __init__(self, root_comp: adsk.fusion.Component):
        self.root_comp = root_comp

    def create_bosses(self, upper_body: adsk.fusion.BRepBody):
        try:
            sketches = self.root_comp.sketches
            yz_plane = self.root_comp.yZConstructionPlane
            sketch = sketches.add(yz_plane)
            sketch.name = "UpperBossSketch"
            
            origin = sketch.originPoint
            
            # 1. Boss Circle
            center1 = adsk.core.Point3D.create(1, 1, 0)
            circle1 = sketch.sketchCurves.sketchCircles.addByCenterRadius(center1, 0.4)
            dim_dia1 = sketch.sketchDimensions.addDiameterDimension(circle1, adsk.core.Point3D.create(1.5, 1.5, 0))
            dim_dia1.parameter.expression = "BossDiameter"
            
            # Dimensions for position
            # We want it at Y = OuterDiameter/4, Z = CornerOffset
            # On YZ plane, Sketch X is model Y, Sketch Y is model Z.
            dim_x = sketch.sketchDimensions.addDistanceDimension(origin, sketch.sketchPoints.item(1), adsk.fusion.DimensionOrientations.HorizontalDimensionOrientation, adsk.core.Point3D.create(0.5, 0, 0))
            dim_x.parameter.expression = "OuterDiameter / 4"
            
            dim_y = sketch.sketchDimensions.addDistanceDimension(origin, sketch.sketchPoints.item(1), adsk.fusion.DimensionOrientations.VerticalDimensionOrientation, adsk.core.Point3D.create(0, 0.5, 0))
            dim_y.parameter.expression = "CornerOffset"
            
            # 2. Insert Hole Circle (concentric)
            circle2 = sketch.sketchCurves.sketchCircles.addByCenterRadius(center1, 0.2)
            dim_dia2 = sketch.sketchDimensions.addDiameterDimension(circle2, adsk.core.Point3D.create(1.5, 0.5, 0))
            dim_dia2.parameter.expression = "InsertHoleDiameter"
            
            # Concentric constraint
            sketch.geometricConstraints.addConcentric(circle1, circle2)

            # We can mirror these in the sketch for the other 3 positions, or use feature mirror/pattern.
            # Feature pattern is better. Let's just extrude this one first.
            extrudes = self.root_comp.features.extrudeFeatures
            
            # The profile between outer and inner circle
            prof_boss = None
            for p in sketch.profiles:
                if p.profileLoops.count == 2:
                    prof_boss = p
                    break
            if not prof_boss:
                prof_boss = sketch.profiles.item(0) # Fallback
                
            ext_input = extrudes.createInput(prof_boss, adsk.fusion.FeatureOperations.JoinFeatureOperation)
            ext_input.setDistanceExtent(False, adsk.core.ValueInput.createByString("BossHeight"))
            # Upper body is +X, so if YZ plane normal is +X, distance should be positive.
            ext_input.participantBodies = [upper_body]
            ext_feat = extrudes.add(ext_input)
            ext_feat.name = "InsertBossExtrude"

            # Create Pattern for the 4 bosses
            # We want them mirrored across XZ plane (Y=0) and XY plane at Z = Length/2? 
            # Pattern along Z is easier.
            patterns = self.root_comp.features.rectangularPatternFeatures
            pat_input = patterns.createInput(adsk.core.ObjectCollection.createWithArray([ext_feat]), self.root_comp.zConstructionAxis)
            pat_input.quantityOne = adsk.core.ValueInput.createByString("2")
            pat_input.distanceOne = adsk.core.ValueInput.createByString("Length - 2 * CornerOffset")
            
            pat_input.directionTwo = self.root_comp.yConstructionAxis
            pat_input.quantityTwo = adsk.core.ValueInput.createByString("2")
            pat_input.distanceTwo = adsk.core.ValueInput.createByString("-OuterDiameter / 2") # 2 * OuterDiameter/4
            
            pat_feat = patterns.add(pat_input)
            pat_feat.name = "InsertBossPattern"

            return ext_feat

        except Exception:
            handle_error('create_bosses')
            return None
