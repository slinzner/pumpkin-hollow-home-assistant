# Publishing Pumpkin Hollow through HACS

HACS supports two stages: users can add a public repository themselves, and accepted packages can appear in the default catalog. Preparing a manifest does not submit a package or grant catalog approval.

## Packages

| Repository | HACS type | Layout |
| :--- | :--- | :--- |
| `slinzner/pumpkin-hollow-home-assistant` | Theme (`theme` in the validator) | Root `hacs.json` and `themes/pumpkin-hollow.yaml` |
| `slinzner/pumpkin-hollow-companion` | Dashboard (`plugin` in the validator) | Root `hacs.json` and complete `dist/`, including nested assets and notices |

HACS identifies a package by its GitHub repository. These two components therefore use separate repositories. The companion's manifest specifies `pumpkin-hollow-companion.js`; keep its repository name as shown so the documented installed URLs remain correct.

HACS downloads manifests and documentation from public URLs. The workflow runs the complete official validator on public repositories with no `ignore` input and skips private copies. A skipped job is **not** evidence of successful HACS validation.

## Maintain the companion distribution

The main repository is the source of truth. Edit `packages/companion/` there and run:

```sh
npm ci --ignore-scripts
npm run verify
npm run package:companion
```

`build/hacs-companion/` contains the separate repository's files: manifest, README, HACS workflow, complete `dist/`, root MIT license, and two illustrative preview images. This directory is ignored by the main repository. Copy those files into the companion checkout, inspect the exact diff, run the privacy check, then commit and push. The exporter does not publish or push anything. Remove files from the distribution checkout when they have also been removed from the generated package.

Keep the runtime version, frontend module URL, and install instructions in both READMEs consistent when changing companion behavior. HACS manages its own dashboard resource cache tag. Changes to this project's documentation or packaging alone do not require a new runtime version.

## Before offering custom-repository installation

- Review the exact files, synthetic images, metadata, and reachable history for personal data and secrets. Keep real dashboard captures and Home Assistant configuration out of both packages.
- Make **both** repositories public when ready to publish.
- Keep a useful description, searchable topics, enabled issues, installation documentation, and the MIT license on each repository. Retain the font's OFL notice.
- Run each **HACS validation** workflow and require success. Re-run Code quality on the main source repository too.
- On a test Home Assistant instance, add the repositories using the types above. Verify the downloaded YAML, module, nested SVGs, backdrops, font, and license notices.
- Follow the README setup. Confirm theme activation, browser refresh, mobile app cold start, a theme switch, and removal. Review supported native and Mushroom controls. Test with invented demo entities; use only synthetic images in public documentation.

Users can then follow the [custom repository instructions](https://www.hacs.dev/docs/faq/custom_repositories/). Default-catalog approval is not required for that installation route.

## Releases and default-catalog submission

The current [`hacs/default` PR checklist](https://github.com/hacs/default/blob/master/.github/PULL_REQUEST_TEMPLATE.md) requires successful validation **before** creating the release used for submission, plus links to both results.

1. Obtain passing, complete HACS validation runs on the exact package revisions.
2. Create a GitHub release for each package from its validated commit. A Git tag alone is not a GitHub release. Use release notes describing installation and compatibility.
3. Keep the companion's complete `dist/` in the tagged source. **Do not attach a standalone `pumpkin-hollow-companion.js` release asset.** HACS can select a matching release attachment as a single-file install, omitting the adjacent asset directory. The source archive already includes everything needed.
4. As the owner or a major contributor, fork [`hacs/default`](https://github.com/hacs/default) into a personal account and branch from its current `master`. Add the exact repository name to the corresponding JSON list (`theme` or `plugin`) in sorted order. Use a separate submission for each package.
5. Complete the upstream checklist, link the new release and successful validator run, and allow maintainer edits. All applicable checks must pass. Review and merge are controlled by HACS maintainers; availability follows a later catalog scan.

Themes and Dashboard plugins do not need **hassfest**, an integration `manifest.json`, or a Home Assistant Brands entry; those requirements apply to integrations. Catalog checks also inspect the documentation images, repository metadata, archive status, and license. The included screenshots are labeled synthetic previews.

## Official references

- [General publishing requirements and `hacs.json`](https://www.hacs.dev/docs/publish/start/)
- [Theme layout](https://www.hacs.dev/docs/publish/theme/)
- [Dashboard layout and extra assets](https://www.hacs.dev/docs/publish/plugin/)
- [Official validation action](https://www.hacs.dev/docs/publish/action/)
- [Default-catalog inclusion](https://www.hacs.dev/docs/publish/include/)
- [Current submission checklist](https://github.com/hacs/default/blob/master/.github/PULL_REQUEST_TEMPLATE.md)
- [HACS plugin resource and release selection](https://github.com/hacs/integration/blob/2.0.5/custom_components/hacs/repositories/plugin.py)
- [HACS license validation](https://github.com/hacs/integration/blob/main/custom_components/hacs/validate/license.py)
