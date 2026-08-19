# SashaVova_1201 — packwiz modpack

Minecraft 1.20.1, Forge 47.4.10. Client modpack for playing together on our server.

Live-tested end to end on 2026-08-16: a clean install downloaded all 1200 tracked
files (296 mods + configs + resourcepacks + shaderpacks) with zero errors.

## Install (one-time, ~10 minutes, then never again)

1. Install [Prism Launcher](https://prismlauncher.org/download/) (free, open source,
   no account/license needed).
2. **Add Instance → Custom** tab → version `1.20.1` → Mod Loader **Forge** →
   version `47.4.10` → name it whatever → OK. This creates an empty instance and
   downloads base Forge/Minecraft files.
3. Download [`packwiz-installer-bootstrap.jar`](https://github.com/packwiz/packwiz-installer-bootstrap/releases)
   and drop it into the instance's `.minecraft` folder (right-click instance →
   **Folder**, then into the `minecraft` subfolder).
4. Right-click the instance → **Edit** → **Settings** tab → **Custom Commands** →
   check **Override Global Settings** → paste into **Pre-launch Command**:
   ```
   "$INST_JAVA" -jar packwiz-installer-bootstrap.jar -g https://raw.githubusercontent.com/YETEEEY/sashavova-mc-pack/master/pack.toml
   ```
5. Click **Launch**. First run downloads everything (~1.5GB, several minutes).

Important: Prism's own **Add Instance → Import** dialog does NOT support packwiz
`pack.toml` URLs directly — its "Import" only recognizes CurseForge/Modrinth/Technic
zip exports, and the OK button stays disabled if you paste a raw pack.toml link
there. Confirmed by testing; don't waste time on that path. The pre-launch command
above is the actual supported packwiz integration.

## Update (automatic, every single launch)

Nothing to click. The pre-launch command re-runs every time you hit Play — it
downloads new mods, removes deleted ones, updates changed versions, before the
game even starts. If nothing changed, it's instant.

## For the pack maintainer

After changing anything in `SashaVova_1201/.minecraft/mods`, `config`,
`resourcepacks`, or `shaderpacks`:
```
cd mcpack
python sync_pack.py
```
This re-detects mods (CurseForge fingerprint match, then Modrinth hash match for
anything CF misses), refreshes the index, commits, and pushes. Everyone picks up
the change automatically on their next launch — nothing to notify anyone about.

**After pushing, wait a few minutes before testing** — raw.githubusercontent.com
is a CDN and can serve a stale cached copy for a short while after a push,
especially on a low-traffic repo. If a test run shows errors that don't match
what's actually in the repo, that's usually why — re-check with a fresh `curl`
before assuming something's broken.

**Known gotcha:** a mod matched by content hash on CurseForge can occasionally
match the *wrong* CurseForge listing (a rehost/clone project with byte-identical
files) or Modrinth can auto-add a dependency at a different version than what's
already pinned elsewhere in the pack. After any `packwiz ... add`, check for:
- duplicate `filename = "..."` values across `mods/*.pw.toml` (two metadata files
  pointing at the same output file = duplicate-mod-id crash)
- a `side = "server"` on something that should ship to clients too (packwiz's
  auto-detection isn't always right — everything in this pack came from the
  client's own mods folder, so nothing here should legitimately be server-only)

`sync_pack.py` doesn't currently guard against either automatically — worth
adding if this keeps happening.

## Known CurseForge-blocked mods (already handled)

13 mods have "third-party API access" disabled by their author on CurseForge,
which breaks automatic installers. All 13 are sourced from Modrinth instead in
this pack. If a *future* newly-added mod hits this (installer error: "This mod
is excluded from the CurseForge API and must be downloaded manually"), check
Modrinth for the same mod by content hash — `sync_pack.py` already does this
automatically as a fallback.
