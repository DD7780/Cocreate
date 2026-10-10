"""Trusted gate probe only. No session transport or user-supplied code is enabled."""
import bpy
import ctypes
import json
import os
import socket
import subprocess
import sys
from ctypes import wintypes

root = os.path.dirname(os.path.abspath(sys.argv[sys.argv.index('--') + 1]))
with open(os.path.join(root, 'input.json'), encoding='utf-8') as source:
    request = json.load(source)
assert bpy.app.version == (4, 5, 14)
assert not bpy.app.background
assert not bpy.context.preferences.filepaths.use_scripts_auto_execute
user32 = ctypes.WinDLL('user32', use_last_error=True)
gdi32 = ctypes.WinDLL('gdi32', use_last_error=True)
user32.OpenClipboard.argtypes = [wintypes.HWND]
user32.OpenDesktopW.argtypes = [wintypes.LPCWSTR, wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
user32.OpenDesktopW.restype = wintypes.HANDLE
user32.GetWindowThreadProcessId.argtypes = [wintypes.HWND, ctypes.POINTER(wintypes.DWORD)]
user32.IsWindowVisible.argtypes = [wintypes.HWND]
user32.PostMessageW.argtypes = [wintypes.HWND, wintypes.UINT, wintypes.WPARAM, wintypes.LPARAM]
callback_type = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)

def finish():
    results = {'background': bpy.app.background, 'windows': len(bpy.context.window_manager.windows)}
    handles = []
    def collect(handle, _data):
        pid = wintypes.DWORD()
        user32.GetWindowThreadProcessId(handle, ctypes.byref(pid))
        if user32.IsWindowVisible(handle):
            handles.append((int(handle), pid.value))
        return True
    user32.EnumWindows(callback_type(collect), 0)
    results['onlyOwnWindows'] = bool(handles) and all(pid == os.getpid() for _h, pid in handles)
    results['clipboardDenied'] = not bool(user32.OpenClipboard(None))
    if not results['clipboardDenied']:
        user32.CloseClipboard()
    other_desktop = user32.OpenDesktopW('Default', 0, False, 0x0041)
    results['defaultDesktopDenied'] = not bool(other_desktop)
    if other_desktop:
        user32.CloseDesktop(other_desktop)
    try:
        with open(request['outside'], 'rb') as sentinel:
            sentinel.read(1)
        results['outsideDenied'] = False
    except OSError:
        results['outsideDenied'] = True
    connection = socket.socket()
    connection.settimeout(1)
    try:
        connection.connect(('127.0.0.1', request['port']))
        results['networkDenied'] = False
    except OSError:
        results['networkDenied'] = True
    finally:
        connection.close()
    try:
        subprocess.run([sys.executable, '--version'], timeout=2, check=True, capture_output=True)
        results['processDenied'] = False
    except Exception:
        results['processDenied'] = True
    results['credentialsAbsent'] = 'COCREATE_INTERACTIVE_TEST_SECRET' not in os.environ
    results['inputPosted'] = bool(handles) and bool(user32.PostMessageW(handles[0][0], 0x0100, 9, 1))
    if handles:
        user32.PostMessageW(handles[0][0], 0x0101, 9, 1)
    with open(os.path.join(root, 'interactive-probe.json'), 'w', encoding='utf-8') as target:
        json.dump(results, target)
    print('COCREATE_INTERACTIVE_PROBE', json.dumps(results), flush=True)
    bpy.ops.wm.quit_blender()
    return None

bpy.app.timers.register(finish, first_interval=4)
