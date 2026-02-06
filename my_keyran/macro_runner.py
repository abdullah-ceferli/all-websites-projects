import json
import time
import threading
from typing import Optional, Dict, Any, List

import keyboard
import mouse
import pyautogui  # for color check
from pynput.keyboard import Key, Controller as KeyboardController
from pynput.mouse import Button, Controller as MouseController

kb = KeyboardController()
ms = MouseController()

KEY_MAP = {
    'lbutton': Button.left, 'rbutton': Button.right, 'mbutton': Button.middle,
    'space': Key.space, 'enter': Key.enter, 'tab': Key.tab,
    'shift': Key.shift, 'ctrl': Key.ctrl_l, 'alt': Key.alt_l,
    'esc': Key.esc,
}
for i in range(1, 13):
    KEY_MAP[f'f{i}'] = getattr(Key, f'f{i}')

def normalize_key(k: str):
    k = k.lower().strip()
    if k in KEY_MAP:
        return KEY_MAP[k]
    if len(k) == 1:
        return k
    return None


class Macro:
    def __init__(self, name: str, path: str, hotkey: str = None):
        self.name = name
        self.path = path
        self.hotkey = hotkey
        self.hotkey_obj = normalize_key(hotkey) if hotkey else None
        self.running = False
        self.thread: Optional[threading.Thread] = None
        self.stop_event = threading.Event()
        self.actions: List[Dict] = []
        self.loop = False
        self.random_delay = False  # Keyran-like random delay
        self.color_check = None  # {'x': int, 'y': int, 'color': (r,g,b)}

    def load(self):
        with open(self.path, encoding='utf-8') as f:
            data = json.load(f)
        self.actions = data.get('actions', [])
        self.loop = data.get('loop', False)

    def start(self):
        if self.running:
            return
        self.load()
        self.stop_event.clear()

        def run():
            self.running = True
            while not self.stop_event.is_set():
                for act in self.actions:
                    if self.stop_event.is_set():
                        break
                    self._execute_action(act)
                if not self.loop:
                    break
            self.running = False

        self.thread = threading.Thread(target=run, daemon=True)
        self.thread.start()

    def stop(self):
        self.stop_event.set()
        if self.thread and self.thread.is_alive():
            self.thread.join(timeout=1.2)
        self.running = False

    def _execute_action(self, action: dict):
        typ = action.get('type')
        delay = action.get('ms', 8) / 1000.0
        if self.random_delay:
            delay += time.uniform(-0.01, 0.01)  # small random

        if self.color_check and typ != 'delay':  # skip if color not match
            px = pyautogui.pixel(self.color_check['x'], self.color_check['y'])
            if px != self.color_check['color']:
                return

        if typ == 'delay':
            time.sleep(delay)

        elif typ == 'mouse_move_rel':
            dx = action.get('dx', 0)
            dy = action.get('dy', 0)
            mouse.move(dx, dy)

        elif typ == 'mouse_move_abs':
            x, y = action.get('x'), action.get('y')
            if x is not None and y is not None:
                cx, cy = ms.position
                mouse.move(x - cx, y - cy)

        elif typ in ('key_down', 'press'):
            key = normalize_key(action.get('key'))
            if key: kb.press(key)

        elif typ in ('key_up', 'release'):
            key = normalize_key(action.get('key'))
            if key: kb.release(key)

        elif typ == 'click':
            btn = normalize_key(action.get('button', 'lbutton'))
            if btn:
                mouse.click(btn)

        time.sleep(0.001)

# Recording function (Keyran-like)
def record_macro(duration=10) -> List[Dict]:
    actions = []
    start_time = time.time()
    last_pos = mouse.get_position()

    keyboard.hook(lambda e: actions.append({'type': 'key_down' if e.event_type == 'down' else 'key_up', 'key': e.name, 'ms': int((time.time() - start_time) * 1000)}))
    mouse.hook(lambda e: actions.append({'type': 'mouse_move_rel', 'dx': e.x - last_pos[0], 'dy': e.y - last_pos[1], 'ms': int((time.time() - start_time) * 1000)}) if e.event_type == 'move' else actions.append({'type': 'click', 'button': e.button.name, 'ms': int((time.time() - start_time) * 1000)}))

    time.sleep(duration)
    keyboard.unhook_all()
    mouse.unhook_all()
    return actions