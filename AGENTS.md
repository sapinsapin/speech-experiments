# Speech experiment results

This is a static SapinSapin results site. Keep study results distinct from planned
work. Every metric must derive from the committed `site/data/results.json`, which
must be updated from actual retained run evidence. Do not invent model/dataset
download links or infer successful training from code or a calendar date.

Run `python3 scripts/build.py` after changing data or templates. Generated HTML
and `site/data/release-manifest.json` must match the build. Preview desktop and
mobile in both themes, exercise native chart controls, and check local links.
Inherit the SapinSapin tokens and brand mark in `site/assets/`.

Do not place credentials, absolute local paths, private host details, raw audio,
per-example transcripts, or sealed evaluation labels in this repository. Publish
eligible artifacts separately through the agreed Hub release process. Do not
turn missing evidence into a success claim. The original training workspace and
its learning-loop instructions govern new runs.
