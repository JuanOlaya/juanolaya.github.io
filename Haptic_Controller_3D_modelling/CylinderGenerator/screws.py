# screws.py
import adsk.core
import adsk.fusion
from .utils import handle_error

class ScrewGenerator:
    def __init__(self, root_comp: adsk.fusion.Component):
        self.root_comp = root_comp

    def create_bosses(self, lower_body: adsk.fusion.BRepBody):
        try:
            sketches = self.root_comp.sketches
            yz_plane = self.root_comp.yZConstructionPlane
            sketch = sketches.add(yz_plane)
            sketch.name = "LowerBossSketch"
            
            origin = sketch.originPoint
            
            # Boss Circle
            center1 = adsk.core.Point3D.create(1, 1, 0)
            circle1 = sketch.sketchCurves.sketchCircles.addByCenterRadius(center1, 0.4)
            dim_dia1 = sketch.sketchDimensions.addDiameterDimension(circle1, adsk.core.Point3D.create(1.5, 1.5, 0))
            dim_dia1.parameter.expression = "BossDiameter"
            
            # Position (same as upper)
            dim_x = sketch.sketchDimensions.addDistanceDimension(origin, sketch.sketchPoints.item(1), adsk.fusion.DimensionOrientations.HorizontalDimensionOrientation, adsk.core.Point3D.create(0.5, 0, 0))
            dim_x.parameter.expression = "OuterDiameter / 4"
            
            dim_y = sketch.sketchDimensions.addDistanceDimension(origin, sketch.sketchPoints.item(1), adsk.fusion.DimensionOrientations.VerticalDimensionOrientation, adsk.core.Point3D.create(0, 0.5, 0))
            dim_y.parameter.expression = "CornerOffset"
            
            # Hole Circle
            circle2 = sketch.sketchCurves.sketchCircles.addByCenterRadius(center1, 0.2)
            dim_dia2 = sketch.sketchDimensions.addDiameterDimension(circle2, adsk.core.Point3D.create(1.5, 0.5, 0))
            dim_dia2.parameter.expression = "ScrewHoleDiameter"
            
            sketch.geometricConstraints.addConcentric(circle1, circle2)

            extrudes = self.root_comp.features.extrudeFeatures
            prof_boss = None
            for p in sketch.profiles:
                if p.profileLoops.count == 2:
                    prof_boss = p
                    break
            if not prof_boss:
                prof_boss = sketch.profiles.item(0)
                
            ext_input = extrudes.createInput(prof_boss, adsk.fusion.FeatureOperations.JoinFeatureOperation)
            # Extrude in opposite direction for lower body (-X)
            ext_input.setDistanceExtent(True, adsk.core.ValueInput.createByString("BossHeight")) 
            ext_input.participantBodies = [lower_body]
            ext_feat = extrudes.add(ext_input)
            ext_feat.name = "ScrewBossExtrude"

            # Now create counterbore hole
            # Easiest way is to extrude cut from the outside of the shell.
            # But the shell is curved. A simpler way is to sketch on YZ plane and do a symmetric cut, or just a cut in the -X direction by "OuterDiameter/2 - WallThickness".
            # Or use hole feature. 
            # We'll just extrude a cut from YZ plane in -X direction.
            prof_hole = None
            for p in sketch.profiles:
                if p.profileLoops.count == 1:
                    prof_hole = p
                    break
                    
            if prof_hole:
                hole_ext_input = extrudes.createInput(prof_hole, adsk.fusion.FeatureOperations.CutFeatureOperation)
                # Cut completely through the lower body
                hole_ext_input.setDistanceExtent(True, adsk.core.ValueInput.createByString("OuterDiameter"))
                hole_ext_input.participantBodies = [lower_body]
                hole_feat = extrudes.add(hole_ext_input)
                hole_feat.name = "ScrewHoleCut"

                # Counterbore cut
                # Sketch on YZ plane, draw counterbore circle
                cb_sketch = sketches.add(yz_plane)
                cb_sketch.name = "CounterboreSketch"
                cb_center = adsk.core.Point3D.create(1, 1, 0)
                cb_circle = cb_sketch.sketchCurves.sketchCircles.addByCenterRadius(cb_center, 0.3)
                cb_dim = cb_sketch.sketchDimensions.addDiameterDimension(cb_circle, adsk.core.Point3D.create(1.5, 1.5, 0))
                cb_dim.parameter.expression = "CounterboreDiameter"
                
                # Position (same)
                cb_dim_x = cb_sketch.sketchDimensions.addDistanceDimension(cb_sketch.originPoint, cb_sketch.sketchPoints.item(1), adsk.fusion.DimensionOrientations.HorizontalDimensionOrientation, adsk.core.Point3D.create(0.5, 0, 0))
                cb_dim_x.parameter.expression = "OuterDiameter / 4"
                cb_dim_y = cb_sketch.sketchDimensions.addDistanceDimension(cb_sketch.originPoint, cb_sketch.sketchPoints.item(1), adsk.fusion.DimensionOrientations.VerticalDimensionOrientation, adsk.core.Point3D.create(0, 0.5, 0))
                cb_dim_y.parameter.expression = "CornerOffset"
                
                cb_ext_input = extrudes.createInput(cb_sketch.profiles.item(0), adsk.fusion.FeatureOperations.CutFeatureOperation)
                
                # Starts from the outside of the shell. Offset start plane.
                offset_val = adsk.core.ValueInput.createByString("-(OuterDiameter / 2)")
                start_offset = adsk.fusion.OffsetStartDefinition.create(offset_val)
                cb_ext_input.startExtent = start_offset
                
                # Extent is CounterboreDepth in the +X direction (towards the center)
                cb_ext_input.setDistanceExtent(False, adsk.core.ValueInput.createByString("CounterboreDepth"))
                cb_ext_input.participantBodies = [lower_body]
                cb_feat = extrudes.add(cb_ext_input)
                cb_feat.name = "CounterboreCut"
                
            # Pattern
            patterns = self.root_comp.features.rectangularPatternFeatures
            objs = adsk.core.ObjectCollection.create()
            objs.add(ext_feat)
            if prof_hole:
                objs.add(hole_feat)
                objs.add(cb_feat)
                
            pat_input = patterns.createInput(objs, self.root_comp.zConstructionAxis)
            pat_input.quantityOne = adsk.core.ValueInput.createByString("2")
            pat_input.distanceOne = adsk.core.ValueInput.createByString("Length - 2 * CornerOffset")
            
            pat_input.directionTwo = self.root_comp.yConstructionAxis
            pat_input.quantityTwo = adsk.core.ValueInput.createByString("2")
            pat_input.distanceTwo = adsk.core.ValueInput.createByString("-OuterDiameter / 2")
            
            pat_feat = patterns.add(pat_input)
            pat_feat.name = "ScrewBossPattern"

            return ext_feat
        except Exception:
            handle_error('create_screw_bosses')
            return None
