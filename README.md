# SapinSapin speech experiments

Results and limitations from JC Diamante’s Filipino ASR work, with downloadable
aggregate metrics and checkpoint curves. The site follows SapinSapin’s visual
identity and is designed for GitHub Pages.

Site: https://sapinsapin.github.io/speech-experiments/

Repository: https://github.com/sapinsapin/speech-experiments

- **F1:** A17 completed October 2, 2026. Fresh final normalized WER was 31.0227%
  versus 52.5758% zero-shot on the same 347-recording FSC diagnostic. The below-25%
  gate failed. This diagnostic selected the rate and checkpoint.
- **F2:** A25 compared four existing models on 200 FLEURS Filipino development
  recordings under three conditions. All 2,400 transcriptions succeeded. Large
  v3 PLD normalized was the quality reference under this benchmark.
- **F3:** The next Mac candidate, reviewed dataset, and Hub releases are pending.
  `Suman Ube 1` is a provisional name, not an already downloadable model.

## Preview

```sh
python3 scripts/build.py
python3 -m http.server 8000 --directory site
```

Open `http://localhost:8000`. The static pages also work when opened directly.
No dependencies or API credentials are required for the site.

`site/data/results.json` is the public results snapshot. `scripts/build.py`
generates the four pages and a SHA-256 release manifest. It does not train,
download models, read private repositories, or upload anything to the Hub.
The workflow deploys `site/` through GitHub Pages on a push to `main`.

## Evidence limits

The original prediction and checkpoint audits were performed locally against
retained private training artifacts. This first public snapshot includes aggregate
metrics, configuration, checkpoint curves, and source-file fingerprints. It does
not include audio or per-example transcripts and is not a public reproduction of
the original scoring audit. The final evaluation reservation remains unscored.
Future eligible model/data releases will be linked after upload and verification.

Study 01 and Study 02 use different cohorts and decoding budgets. Their scores
must not be combined into one model ranking. Historical defective runs are not
used as clean baselines.

## Attribution

Whisper is the base model by OpenAI. FSC is the Filipino Speech Corpus by Ramil
Sagum, distributed through SapinSapin. The development comparison uses Google
FLEURS Filipino and existing SapinSapin checkpoints. Refer to upstream cards for
their applicable terms. This repository does not relicense those models or data.

SapinSapin’s layered mark, cream/ube/pandan palette, and Fraunces/Inter typography
follow its existing website identity. Font licenses are in
`site/assets/FONT-LICENSES.txt`. The research presentation was informed by
[Experimental Machines](https://experimentalmachines.org/) and
[Experimental Intelligence](https://experimentalintelligence.org/), without
copying their research claims or page implementation.
