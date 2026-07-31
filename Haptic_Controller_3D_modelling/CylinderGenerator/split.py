# split.py
import adsk.core
import adsk.fusion
from .utils import handle_error

class SplitManager:
    def __init__(self, root_comp: adsk.fusion.Component):
        self.root_comp = root_comp

    def split_body(self, body_to_split: adsk.fusion.BRepBody):
        try:
            split_features = self.root_comp.features.splitBodyFeatures
            yz_plane = self.root_comp.yZConstructionPlane
            
            split_input = split_features.createInput(body_to_split, yz_plane, True)
            split_feat = split_features.add(split_input)
            split_feat.name = "SplitEnclosure"
            
            # Rename bodies
            bodies = self.root_comp.bRepBodies
            upper = None
            lower = None
            for b in bodies:
                bbox = b.boundingBox
                cx = (bbox.maxPoint.x + bbox.minPoint.x) / 2
                if cx > 0:
                    upper = b
                else:
                    lower = b
                    
            if upper:
                upper.name = "Upper"
            if lower:
                lower.name = "Lower"
                
            return upper, lower
        except Exception:
            handle_error('split_body')
            return None, None
