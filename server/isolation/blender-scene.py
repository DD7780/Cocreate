"""Trusted scene builder. Never executes provider/user source or opens a .blend."""
import bpy
import json
import os
import sys
from mathutils import Vector

root = os.path.dirname(os.path.abspath(sys.argv[sys.argv.index('--') + 1]))
with open(os.path.join(root, 'input.json'), encoding='utf-8') as source:
    request = json.load(source)
assert bpy.app.version == (4, 5, 14), 'Unsupported Blender version'
assert not bpy.context.preferences.filepaths.use_scripts_auto_execute

if request.get('probe'):
    import socket
    import subprocess
    evidence = {}
    try:
        with open(request['outside'], 'rb') as outside:
            outside.read(1)
        evidence['outsideDenied'] = False
    except OSError:
        evidence['outsideDenied'] = True
    try:
        socket.create_connection(('127.0.0.1', request['port']), timeout=1).close()
        evidence['networkDenied'] = False
    except OSError:
        evidence['networkDenied'] = True
    try:
        subprocess.run([bpy.app.binary_path, '--version'], timeout=2, check=True, stdout=subprocess.DEVNULL)
        evidence['processDenied'] = False
    except (OSError, subprocess.SubprocessError):
        evidence['processDenied'] = True
    evidence['credentialsAbsent'] = not any(name in os.environ for name in ('OPENAI_API_KEY', 'COCREATE_TEST_SECRET', 'SUPABASE_SERVICE_ROLE_KEY', 'AWS_SECRET_ACCESS_KEY'))
    evidence['version'] = '.'.join(str(part) for part in bpy.app.version)
    with open(os.path.join(root, 'probe.json'), 'x', encoding='utf-8') as output:
        json.dump(evidence, output)
    sys.exit(0)

scene = request['scene']
bpy.context.preferences.filepaths.temporary_directory = root
assert set(scene) == {'objects', 'camera', 'lights'}
assert 1 <= len(scene['objects']) <= 12 and 1 <= len(scene['lights']) <= 3
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for item in scene['objects']:
    assert set(item) == {'kind', 'name', 'location', 'scale', 'color'}
    if item['kind'] == 'cube':
        bpy.ops.mesh.primitive_cube_add(location=item['location'])
    elif item['kind'] == 'sphere':
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, location=item['location'])
    elif item['kind'] == 'plane':
        bpy.ops.mesh.primitive_plane_add(location=item['location'])
    else:
        raise ValueError('Unsupported object')
    obj = bpy.context.object
    obj.name = item['name']
    obj.scale = item['scale']
    material = bpy.data.materials.new(item['name'] + ' color')
    material.diffuse_color = tuple(item['color']) + (1.0,)
    material.use_nodes = True
    material.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value = material.diffuse_color
    obj.data.materials.append(material)

camera_data = bpy.data.cameras.new('Task camera')
camera = bpy.data.objects.new('Task camera', camera_data)
bpy.context.collection.objects.link(camera)
camera.location = scene['camera']['location']
camera.rotation_euler = (Vector(scene['camera']['target']) - camera.location).to_track_quat('-Z', 'Y').to_euler()
bpy.context.scene.camera = camera
for index, item in enumerate(scene['lights']):
    light_data = bpy.data.lights.new('Task light ' + str(index), 'AREA')
    light_data.energy = item['energy']
    light_data.size = 5
    light = bpy.data.objects.new(light_data.name, light_data)
    bpy.context.collection.objects.link(light)
    light.location = item['location']
    light.rotation_euler = (Vector(scene['camera']['target']) - light.location).to_track_quat('-Z', 'Y').to_euler()

render = bpy.context.scene.render
render.engine = 'CYCLES'
bpy.context.scene.cycles.device = 'CPU'
bpy.context.scene.cycles.samples = 8
render.resolution_x = 512
render.resolution_y = 512
render.resolution_percentage = 100
render.image_settings.file_format = 'PNG'
render.filepath = os.path.join(root, 'render.png')
bpy.context.preferences.filepaths.save_version = 0
assert not os.path.exists(os.path.join(root, 'scene.blend')) and not os.path.exists(render.filepath)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(root, 'scene.blend'), check_existing=False)
bpy.ops.render.render(write_still=True)
print('COCREATE_BLENDER_COMPLETED', flush=True)
