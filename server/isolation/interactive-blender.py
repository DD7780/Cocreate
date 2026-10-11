"""Trusted GUI bridge on the private X server. No supplied code or host display."""
import bpy
import gpu
import ctypes as c
import os
import sys
import json
import socket
import base64
import struct
import zlib
import time

root = '/session'
with open(root + '/input.json', encoding='utf-8') as source:
    initial = json.load(source)
assert bpy.app.version == (4, 5, 14) and not bpy.app.background
assert not bpy.context.preferences.filepaths.use_scripts_auto_execute
assert os.environ.get('DISPLAY') == ':99'
os.set_blocking(0, False)
x = c.CDLL('libX11.so.6')
xt = c.CDLL('libXtst.so.6')
x.XOpenDisplay.argtypes = [c.c_char_p]
x.XOpenDisplay.restype = c.c_void_p
x.XDefaultRootWindow.argtypes = [c.c_void_p]
x.XDefaultRootWindow.restype = c.c_ulong
x.XSync.argtypes = [c.c_void_p, c.c_int]
x.XStringToKeysym.argtypes = [c.c_char_p]
x.XStringToKeysym.restype = c.c_ulong
x.XKeysymToKeycode.argtypes = [c.c_void_p, c.c_ulong]
x.XKeysymToKeycode.restype = c.c_uint
x.XKeycodeToKeysym.argtypes = [c.c_void_p, c.c_uint, c.c_int]
x.XKeycodeToKeysym.restype = c.c_ulong
xt.XTestFakeKeyEvent.argtypes = [c.c_void_p, c.c_uint, c.c_int, c.c_ulong]
xt.XTestFakeButtonEvent.argtypes = [c.c_void_p, c.c_uint, c.c_int, c.c_ulong]
xt.XTestFakeMotionEvent.argtypes = [c.c_void_p, c.c_int, c.c_int, c.c_int, c.c_ulong]
display = x.XOpenDisplay(b':99')
assert display

class XImage(c.Structure):
    _fields_ = [('width', c.c_int), ('height', c.c_int), ('xoffset', c.c_int), ('format', c.c_int), ('data', c.c_void_p), ('byte_order', c.c_int), ('bitmap_unit', c.c_int), ('bitmap_bit_order', c.c_int), ('bitmap_pad', c.c_int), ('depth', c.c_int), ('bytes_per_line', c.c_int), ('bits_per_pixel', c.c_int), ('red_mask', c.c_ulong), ('green_mask', c.c_ulong), ('blue_mask', c.c_ulong)]
x.XGetImage.argtypes = [c.c_void_p, c.c_ulong, c.c_int, c.c_int, c.c_uint, c.c_uint, c.c_ulong, c.c_int]
x.XGetImage.restype = c.POINTER(XImage)
x.XDestroyImage.argtypes = [c.POINTER(XImage)]

def send(identifier, value=None, error=None):
    print('COCREATE_GUI ' + json.dumps({'id': identifier, 'value': value, 'error': error}, separators=(',', ':')), flush=True)

def png():
    x.XSync(display, 0)
    image = x.XGetImage(display, x.XDefaultRootWindow(display), 0, 0, 960, 640, 0xffffffff, 2)
    assert image
    try:
        info = image.contents
        assert info.width == 960 and info.height == 640 and info.bits_per_pixel == 32 and info.byte_order == 0
        assert (info.red_mask, info.green_mask, info.blue_mask) == (0xff0000, 0xff00, 0xff)
        pixels = c.string_at(info.data, info.bytes_per_line * info.height)
        rows = bytearray()
        for row in range(640):
            rows.append(0)
            line = pixels[row * info.bytes_per_line:row * info.bytes_per_line + 960 * 4]
            for col in range(960):
                off = col * 4
                rows.extend((line[off+2], line[off+1], line[off]))
        def chunk(kind, data):
            return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data) & 0xffffffff)
        output = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('!2I5B', 960, 640, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(rows, 3)) + chunk(b'IEND', b'')
        assert len(output) <= 1024 * 1024
        return base64.b64encode(output).decode('ascii')
    finally:
        x.XDestroyImage(image)

def key(name):
    symbol = ord(name) if len(name) == 1 else x.XStringToKeysym(name.encode('ascii'))
    code = x.XKeysymToKeycode(display, symbol)
    assert code
    shifted = x.XKeycodeToKeysym(display, code, 0) != symbol
    shift = x.XKeysymToKeycode(display, x.XStringToKeysym(b'Shift_L'))
    if shifted:
        xt.XTestFakeKeyEvent(display, shift, 1, 0)
    xt.XTestFakeKeyEvent(display, code, 1, 0)
    xt.XTestFakeKeyEvent(display, code, 0, 0)
    if shifted:
        xt.XTestFakeKeyEvent(display, shift, 0, 0)
    x.XSync(display, 0)

def inspect():
    return {'objects': [{'name': item.name, 'location': list(item.location)} for item in bpy.context.scene.objects][:32], 'mode': bpy.context.mode, 'active': bpy.context.object.name if bpy.context.object else None}

def probe():
    evidence = {'version': '4.5.14', 'background': False, 'windows': len(bpy.context.window_manager.windows), 'renderer': gpu.platform.renderer_get(), 'credentialsAbsent': not any(name in os.environ for name in ('COCREATE_TEST_SECRET', 'OPENAI_API_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'AWS_SECRET_ACCESS_KEY'))}
    other = x.XOpenDisplay(b':0')
    evidence['hostDisplayDenied'] = not bool(other)
    try:
        with open(initial['outside'], 'rb') as sentinel:
            sentinel.read(1)
        evidence['outsideDenied'] = False
    except OSError:
        evidence['outsideDenied'] = True
    try:
        socket.create_connection(('127.0.0.1', initial['port']), timeout=.5).close()
        evidence['networkDenied'] = False
    except OSError:
        evidence['networkDenied'] = True
    evidence['privateDisplay'] = os.environ['DISPLAY'] == ':99'
    return evidence

def save():
    render = bpy.context.scene.render
    render.engine = 'CYCLES'
    bpy.context.scene.cycles.device = 'CPU'
    bpy.context.scene.cycles.samples = 8
    render.resolution_x = render.resolution_y = 512
    render.resolution_percentage = 100
    render.image_settings.file_format = 'PNG'
    render.filepath = root + '/render.png'
    bpy.context.preferences.filepaths.save_version = 0
    assert not os.path.exists(root + '/scene.blend') and not os.path.exists(render.filepath)
    bpy.ops.wm.save_as_mainfile(filepath=root + '/scene.blend', check_existing=False)
    bpy.ops.render.render(write_still=True)

buffer = bytearray()
initialized = False
def tick():
    global initialized, buffer
    if not initialized:
        initialized = True
        bpy.context.preferences.filepaths.temporary_directory = root
        if initial.get('scene'):
            # The existing trusted builder accepts validated scene data; no supplied script.
            exec(compile(open('/control/blender-scene.py', encoding='utf-8').read(), '/control/blender-scene.py', 'exec'), {'__name__': '__main__'})
            send('ready', {'probe': probe(), 'saved': True})
            bpy.ops.wm.quit_blender()
            return None
        send('ready', {'probe': probe()})
    try:
        data = os.read(0, 65536)
        if not data:
            bpy.ops.wm.quit_blender()
            return None
        buffer.extend(data)
        assert len(buffer) <= 65536
    except BlockingIOError:
        pass
    while b'\n' in buffer:
        line, _, buffer = buffer.partition(b'\n')
        request = json.loads(line)
        identifier, kind = request['id'], request['kind']
        try:
            if kind == 'frame':
                result = {'png': png()}
            elif kind == 'inspect':
                result = inspect()
            elif kind == 'click':
                assert 0 <= request['x'] < 960 and 0 <= request['y'] < 640
                xt.XTestFakeMotionEvent(display, -1, request['x'], request['y'], 0)
                xt.XTestFakeButtonEvent(display, 1, 1, 0)
                xt.XTestFakeButtonEvent(display, 1, 0, 0)
                x.XSync(display, 0)
                result = {'acknowledged': True}
            elif kind == 'key':
                assert request['key'] in ('Escape', 'Return', 'Tab', 'Delete', 'g', 'r', 's', 'x', 'y', 'z', 'a')
                key(request['key'])
                result = {'acknowledged': True}
            elif kind == 'text':
                assert 1 <= len(request['text']) <= 64 and all(item in '-+0123456789. ' for item in request['text'])
                for char in request['text']:
                    key('space' if char == ' ' else char)
                result = {'acknowledged': True}
            elif kind == 'save':
                save()
                send(identifier, {'saved': True})
                bpy.ops.wm.quit_blender()
                return None
            else:
                raise ValueError('Unsupported dedicated app input')
            send(identifier, result)
        except Exception:
            send(identifier, error='Dedicated app command failed; inspect instead of replaying.')
    return .05

bpy.app.timers.register(tick, first_interval=3)
