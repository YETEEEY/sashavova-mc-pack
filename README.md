# SashaVova_1201 — packwiz modpack

Minecraft 1.20.1, Forge 47.4.10. Client modpack for playing together on our server.

## Install (one-time)
1. Install [Prism Launcher](https://prismlauncher.org/download/) (free, open source).
2. In Prism: **Add Instance → Import → packwiz** and paste this repo's pack.toml raw URL
   (see below), or use **Add Instance → From URL**.
3. Launch — Prism downloads everything itself.

## Update (every time mods change)
In Prism, right-click the instance → **Update**. It re-syncs to whatever is in this repo —
adds new mods, removes deleted ones, updates changed versions. No manual downloading,
no zip files, no Google Drive.

## For the pack maintainer
After changing anything in `SashaVova_1201/.minecraft/mods` or `config`:
```
cd mcpack
python sync_pack.py
```
This re-detects mods, refreshes the index, commits, and pushes. Everyone's `Update` button
then picks up the change.
