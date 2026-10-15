# Pumpkin Hollow Companion

**The illustrated layer for the [Pumpkin Hollow Home Assistant theme](https://github.com/slinzner/pumpkin-hollow-home-assistant).** Adds haunted-lake artwork, Creepster display headings, seasonal navigation icons, opaque card surfaces, and a cast of creatures on supported sliders and card headings.

![Illustrative Pumpkin Hollow dashboard with invented rooms and states](docs/screenshots/overview-desktop.jpg)

> These screenshots are **illustrative mockups** with invented data. The companion styles your existing dashboard; it does not install the sample rooms, scenes, hero, or card layouts.

## Install with HACS

This package is available as a **HACS custom repository**. Default-catalog inclusion is a separate review and has not been requested. For installation without HACS, follow the [manual installation instructions](https://github.com/slinzner/pumpkin-hollow-home-assistant#install).

1. Install the [Pumpkin Hollow theme](https://github.com/slinzner/pumpkin-hollow-home-assistant) in HACS as a **Theme**.
2. Open **HACS → ⋮ → Custom repositories**. Add `https://github.com/slinzner/pumpkin-hollow-companion` with type **Dashboard**, then download **Pumpkin Hollow Companion**.
3. Merge the following into `configuration.yaml`. Keep existing `frontend:` keys and module entries; do not add a second `frontend:` block.

```yaml
frontend:
  themes: !include_dir_merge_named themes
  extra_module_url:
    - /local/community/pumpkin-hollow-companion/pumpkin-hollow-companion.js?v=20261015-2
```

4. Check configuration in **Developer Tools → YAML**, then restart Home Assistant.
5. In **Settings → Dashboards → Resources**, keep the JavaScript module resource HACS adds under `/hacsfiles/pumpkin-hollow-companion/`. Do not add a duplicate `/local/` resource. For YAML-managed resources, follow the [full resource configuration instructions](https://github.com/slinzner/pumpkin-hollow-home-assistant#check-restart-and-select-the-theme).
6. Select **Pumpkin Hollow** and **Dark** appearance in your user profile on each device. Fully close and reopen the Companion app after the first install.

The frontend entry and HACS dashboard resource cover both startup paths. The module installs its styles once when both load it. Advanced mode in your user profile reveals Resources if it is hidden.

## What is included

![Illustrative seasonal controls and color widgets](docs/screenshots/controls-desktop.jpg)

- Separate desktop and phone backdrops, bundled locally.
- Creepster headings, with ordinary control labels kept readable.
- Pumpkin, bat, ghost, spider, cat, owl, moth, and leaf accents.
- Native hue controls retain their color range and decorations leave control hit targets available.
- No runtime npm dependencies, remote fonts, entity writes, or dashboard writes.

Developed against **Home Assistant 2026.10**, native controls, and supported Mushroom components. The theme is required for activation; Mushroom is optional and card-mod is not required. Frontend or custom-card updates can change styling hooks, so some third-party widgets may not show creature accents.

## Update, disable, or remove

Update through HACS, which updates its dashboard resource automatically. Check the main theme README for the current `frontend.extra_module_url` version, update that entry if needed, check configuration, and restart Home Assistant. Fully close and reopen each mobile app once. Current companion build: **2026.10.15.2**.

Select another theme to disable the seasonal styling. To uninstall, remove the frontend module entry, remove this package through HACS, and restart Home Assistant. HACS removes its UI-managed resource; remove any YAML-managed resource yourself.

If fonts or creatures are missing, confirm Pumpkin Hollow is selected, check both loading paths, and open `/local/community/pumpkin-hollow-companion/assets/spider.svg` on your own Home Assistant origin. A 404 indicates an incomplete download or a different folder name. See the [full troubleshooting guide](https://github.com/slinzner/pumpkin-hollow-home-assistant#mobile-and-troubleshooting).

## Source and license

Source, lifecycle tests, and the export script are maintained in the [main repository](https://github.com/slinzner/pumpkin-hollow-home-assistant). This repository is a distribution package; submit code fixes to the main repository.

Original code, artwork, creature icons, documentation, and preview images use the [MIT License](LICENSE). The Creepster font by Font Diner, Inc. remains under the [SIL Open Font License 1.1](dist/OFL-Creepster.txt). Keep that notice with the font. All visual assets and both license notices are shipped together in `dist/`; do not redistribute the JavaScript file alone.
