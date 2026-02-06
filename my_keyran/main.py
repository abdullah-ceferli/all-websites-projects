# Full code for your custom Keyran-like macro tool in Python
# Folder structure:
# my_keyran/
# ├── main.py
# ├── gui.py
# ├── macro_recorder.py
# ├── macro_player.py
# └── macros/  (create this folder)

# Install libraries: pip install pynput pyautogui customtkinter keyboard jsonpickle

# This version adds a visual keyboard layout with letters/keys (like in the image)
# Mouse icon is a simple label (you can add an image if you have one)
# Dark red-black theme
# Load .json macros (your format)
# Placeholder for .amc load - you need to implement parser yourself (no public one exists)

# To load .amc: Add your own parser in load_macro (search for "bloody amc format" on forums to RE it)

### main.py
from gui import main

if __name__ == "__main__":
    main()