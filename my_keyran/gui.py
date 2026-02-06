import tkinter as tk
from tkinter import ttk, messagebox, Canvas
from pathlib import Path
import json

from macro_runner import Macro, record_macro

class KeyranApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Keyran Runner")
        self.root.geometry("1024x600")
        self.root.configure(bg="#000000")

        self.macros_folder = Path("macros")
        self.macros_folder.mkdir(exist_ok=True)

        self.macros: list[Macro] = []
        self.selected_macro: Macro = None
        self.selected_key = None

        self._style()
        self._build_ui()
        self._load_macros()
        self._draw_keyboard()
        self._draw_mouse()

    def _style(self):
        style = ttk.Style()
        style.theme_use('clam')
        style.configure("TButton", background="#ff0000", foreground="#ffffff", font=("Arial", 10, "bold"), padding=6, relief="flat")
        style.configure("TLabel", background="#000000", foreground="#ff0000", font=("Arial", 12))
        style.configure("TEntry", fieldbackground="#333333", foreground="#ffffff")
        style.map("TButton", background=[("active", "#cc0000")])

    def _build_ui(self):
        # Top bar
        top = tk.Frame(self.root, bg="#111111", height=40)
        top.pack(fill="x")

        tabs = ["Profile", "Editor", "Macros"]
        for tab in tabs:
            btn = ttk.Button(top, text=tab, command=lambda t=tab: self._tab_click(t))
            btn.pack(side="left", padx=10)

        # Profile selector (dummy)
        self.profile_var = tk.StringVar(value="Profile 1")
        ttk.OptionMenu(top, self.profile_var, "Profile 1", "Profile 1", "Profile 2").pack(side="left", padx=10)

        # Main canvas for keyboard + mouse
        self.canvas = Canvas(self.root, bg="#000000", height=400, width=1024, highlightthickness=0)
        self.canvas.pack(pady=10)

        # Bottom bar
        bottom = tk.Frame(self.root, bg="#111111", height=100)
        bottom.pack(fill="x")

        self.play_btn = ttk.Button(bottom, text="Play", command=self.toggle_macro)
        self.play_btn.pack(side="left", padx=20, pady=10)

        self.random_delay_toggle = tk.BooleanVar()
        tk.Checkbutton(bottom, text="Random Delay", variable=self.random_delay_toggle, bg="#111111", fg="#ff0000").pack(side="left", padx=10)

        ttk.Button(bottom, text="Record Macro", command=self.record_new_macro).pack(side="left", padx=10)

        # Number buttons 1-5
        num_frame = tk.Frame(bottom, bg="#111111")
        num_frame.pack(side="right", padx=20)
        for i in range(1, 6):
            ttk.Button(num_frame, text=str(i), width=3).pack(side="left", padx=2)

        # Status
        self.status_var = tk.StringVar(value="Ready")
        tk.Label(bottom, textvariable=self.status_var, bg="#111111", fg="#ffffff").pack(side="left", padx=20)

    def _tab_click(self, tab):
        if tab == "Editor":
            self._open_editor()
        elif tab == "Macros":
            self._show_macro_list()

    def _draw_keyboard(self):
        # Simple keyboard layout (rows)
        keys = [
            ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
            ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
            ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
            ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
            ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
        ]

        x_start, y_start = 50, 50
        key_size = 40
        for row_idx, row in enumerate(keys):
            x = x_start
            y = y_start + row_idx * (key_size + 5)
            for key in row:
                w = key_size * 2 if key == 'Space' else key_size
                rect = self.canvas.create_rectangle(x, y, x + w, y + key_size, fill="#333333", outline="#ff0000")
                text = self.canvas.create_text(x + w/2, y + key_size/2, text=key.upper(), fill="#ffffff")
                self.canvas.tag_bind(rect, "<Button-1>", lambda e, k=key: self.assign_hotkey(k))
                self.canvas.tag_bind(text, "<Button-1>", lambda e, k=key: self.assign_hotkey(k))
                x += w + 5

    def _draw_mouse(self):
        # Simple mouse graphic
        x, y = 800, 150
        self.canvas.create_rectangle(x, y, x+100, y+150, fill="#555555", outline="#ff0000")  # body
        self.canvas.create_rectangle(x+10, y+10, x+40, y+50, fill="#333333", outline="#ff0000")  # L button
        self.canvas.create_rectangle(x+60, y+10, x+90, y+50, fill="#333333", outline="#ff0000")  # R button
        self.canvas.create_oval(x+45, y+60, x+55, y+80, fill="#666666", outline="#ff0000")  # wheel

    def _load_macros(self):
        self.macros.clear()
        for file in self.macros_folder.glob("*.json"):
            with open(file, encoding="utf-8") as f:
                data = json.load(f)
            name = data.get("name", file.stem)
            m = Macro(name, str(file))
            self.macros.append(m)

    def assign_hotkey(self, key):
        if not self.selected_macro:
            messagebox.showwarning("Select Macro", "Select a macro first")
            return
        self.selected_macro.hotkey = key.upper()
        self.status_var.set(f"Hotkey {key.upper()} assigned to {self.selected_macro.name}")

    def toggle_macro(self):
        if not self.selected_macro:
            return
        m = self.selected_macro
        m.random_delay = self.random_delay_toggle.get()

        if m.running:
            m.stop()
            self.play_btn.config(text="Play")
            self.status_var.set("Stopped")
        else:
            m.start()
            self.play_btn.config(text="Stop")
            self.status_var.set("Running")

    def record_new_macro(self):
        # Simple recording
        actions = record_macro(duration=5)  # 5 sec example
        name = "recorded_" + str(len(self.macros) + 1)
        path = str(self.macros_folder / f"{name}.json")
        with open(path, 'w', encoding='utf-8') as f:
            json.dump({"name": name, "actions": actions, "loop": False}, f)
        m = Macro(name, path)
        self.macros.append(m)
        self.status_var.set("Recorded new macro")

    def _show_macro_list(self):
        list_win = tk.Toplevel(self.root)
        list_win.title("Macros")
        tree = ttk.Treeview(list_win, columns=("name"), show="headings")
        tree.heading("name", text="Macro Name")
        for m in self.macros:
            tree.insert("", "end", values=(m.name,))
        tree.pack()
        tree.bind("<<TreeviewSelect>>", lambda e: self._select_macro_from_list(tree))

    def _select_macro_from_list(self, tree):
        sel = tree.selection()
        if sel:
            name = tree.item(sel)["values"][0]
            self.selected_macro = next(m for m in self.macros if m.name == name)
            self.status_var.set(f"Selected: {name}")

    def _open_editor(self):
        # Dummy editor window (expand later)
        editor_win = tk.Toplevel(self.root)
        editor_win.title("Macro Editor")
        tk.Label(editor_win, text="Edit actions here (TODO)").pack()

def main():
    root = tk.Tk()
    app = KeyranApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()