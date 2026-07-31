# CylinderGenerator

A professional Autodesk Fusion 360 Add-in that generates a fully parametric cylindrical enclosure, split into two halves (Upper and Lower). The Upper half contains bosses for threaded inserts, and the Lower half contains corresponding screw bosses with counterbores and clearance holes.

## Installation

1. Download or clone this repository.
2. In Fusion 360, go to **Utilities > Add-Ins > Scripts and Add-Ins**.
3. Select the **Add-Ins** tab.
4. Click the **+** (Create) button and select the `CylinderGenerator` folder.
5. Select `CylinderGenerator` from the list and click **Run**.

## Usage

1. Switch to the **Solid** workspace.
2. In the **Create** panel, click **Cylinder Generator**.
3. A dialog will appear asking for dimensions (Outer Diameter, Length, Wall Thickness, Insert Type, etc.).
4. Click **OK** to generate the enclosure.
5. All features are natively added to the timeline and use User Parameters for easy future modifications.

## Folder Structure

- `CylinderGenerator.py` - Main entry point.
- `ui.py` - UI dialogs and command event handlers.
- `parameters.py` - Logic to inject user parameters into the design.
- `geometry.py`, `split.py`, `inserts.py`, `screws.py` - Modular operations that add timeline features.
- `config.py` - Constants and defaults.
- `utils.py` - Helper utilities.
