# Installable packages

The Home Assistant theme lives at [`../themes/pumpkin-hollow.yaml`](../themes/pumpkin-hollow.yaml), where HACS expects it. `companion/dist/` is the optional frontend module and every asset it loads. Copy the full `dist/` contents together so relative asset URLs resolve.

This repository is packaged for HACS as a **Theme**. The companion uses a separate **Dashboard** repository because HACS tracks a GitHub repository as a single package. Its `hacs.json`, README, validation workflow, and complete `dist/` are maintained here. Run `npm run package:companion` from the project root to export the companion repository to `build/hacs-companion/`, together with the MIT license and synthetic preview images.

See the [installation instructions](../README.md#install) and [publishing guide](../docs/hacs-publishing.md). Both packages must be public before HACS can install them.
