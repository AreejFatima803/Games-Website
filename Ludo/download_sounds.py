import urllib.request
import os

sounds = {
    'dice.ogg': 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Dice-roll.ogg',
    'move.ogg': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Boton.ogg',
    'win.ogg': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Success_sound_effect.ogg'
}

for filename, url in sounds.items():
    try:
        print(f"Downloading {filename}...")
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(filename, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
            print(f"Successfully downloaded {filename} ({len(data)} bytes)")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
