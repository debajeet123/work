from OCC.Core.gp import gp_Pnt, gp_Dir, gp_Ax2
from OCC.Core.BRepPrimAPI import BRepPrimAPI_MakeCylinder
from OCC.Core.BRepBuilderAPI import BRepBuilderAPI_Transform
from OCC.Core.gp import gp_Trsf
from OCC.Core.BRepOffsetAPI import BRepOffsetAPI_MakeThickSolid
from OCC.Core.BRepBuilderAPI import BRepBuilderAPI_MakeEdge, BRepBuilderAPI_MakeWire
from OCC.Core.BRepOffsetAPI import BRepOffsetAPI_MakePipe
from OCC.Display.SimpleGui import init_display
import math

display, start_display, add_menu, add_function_to_menu = init_display()

# Helper function to move shapes vertically
def move_shape(shape, dz):
    trsf = gp_Trsf()
    trsf.SetTranslation(gp_Vec(0, 0, dz))
    return BRepBuilderAPI_Transform(shape, trsf, True).Shape()

### 1. Outer Casing (hollow cylinder)
outer_radius = 60
inner_radius = outer_radius - 3
height = 150

outer_cylinder = BRepPrimAPI_MakeCylinder(outer_radius, height).Shape()
inner_cylinder = BRepPrimAPI_MakeCylinder(inner_radius, height).Shape()
# Use thick solid instead of subtracting to create walls (simplified)
casing = BRepOffsetAPI_MakeThickSolid(outer_cylinder, inner_cylinder, -3, 1e-3).Shape()

### 2. Base Plate
base = BRepPrimAPI_MakeCylinder(outer_radius, 5).Shape()

### 3. Internal Frame (3 rods)
frame_rods = []
rod_radius = 2.5
rod_height = 130
for angle_deg in [0, 120, 240]:
    angle_rad = math.radians(angle_deg)
    x = (inner_radius - 5) * math.cos(angle_rad)
    y = (inner_radius - 5) * math.sin(angle_rad)
    rod = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(x, y, 5), gp_Dir(0, 0, 1)), rod_radius, rod_height).Shape()
    frame_rods.append(rod)

### 4. Pendulum Mass
mass_radius = 15
mass_height = 25
mass_z = 60
mass = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(0, 0, mass_z), gp_Dir(0, 0, 1)), mass_radius, mass_height).Shape()

### 5. Spring (helix approximation using a pipe on a wire)
def make_helix_spring(radius, height, wire_radius, turns=15):
    pts = []
    for i in range(turns * 10):
        t = i / 10
        angle = 2 * math.pi * t
        x = radius * math.cos(angle)
        y = radius * math.sin(angle)
        z = (t / turns) * height
        pts.append(gp_Pnt(x, y, z + 90))  # offset Z position

    # Create edges from points
    edges = []
    for i in range(len(pts) - 1):
        edge = BRepBuilderAPI_MakeEdge(pts[i], pts[i + 1]).Edge()
        edges.append(edge)

    wire = BRepBuilderAPI_MakeWire()
    for e in edges:
        wire.Add(e)

    # Sweep a small circle along the wire
    circle = BRepPrimAPI_MakeCylinder(wire_radius, 1).Shape()
    spring = BRepOffsetAPI_MakePipe(wire.Wire(), circle).Shape()
    return spring

spring = make_helix_spring(6, 80, 1.5)

### Add everything to the viewer
display.DisplayShape(casing, update=True)
display.DisplayShape(base)
for rod in frame_rods:
    display.DisplayShape(rod)
display.DisplayShape(mass)
display.DisplayShape(spring)

start_display()
