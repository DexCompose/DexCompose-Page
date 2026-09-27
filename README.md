# DexCompose Project Page

This repository contains the static project page for:

**DexCompose: Reusing Dexterous Policies for Multi-Task Manipulation with a Single Hand**

The page is served from `index.html` and uses local static assets under `static/`.

## Preview

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Citation

```bibtex
@misc{dexcompose2026,
  title={DexCompose: Reusing Dexterous Policies for Multi-Task Manipulation with a Single Hand},
  author={Anonymous Authors},
  year={2026},
  note={Manuscript under review}
}
```

## September 2026 experiment update

The website follows the September 15 ICRA manuscript revision (`main.tex`),
including its raw-data audit and updated stage-failure figure. It retains the
anonymous author information and under-review status.

- Table I: six methods, all 16 task pairs, and overall mean ± sample SD.
- Table II: seven variants, including Stabilizer-only, with all task pairs.
- Table III: heuristic versus LLM mask selection on four selected pairs.
- Table IV: four physical tasks, 20 trials each; 59/80 successes (73.75%).
- Three-skill simulation: 62.11% success, with four demonstration clips.
- Updated preservation/failure figure and Franka–LEAP figures from the paper.
- Three-minute narrated overview from the September 22 `v8_paper` video export,
  with English WebVTT captions. All added videos use on-demand loading.

Simulation tables use 13 seeds and 32 rollouts per seed per task. Overall SD is
computed across seed-level averages over all 16 tasks, not across task means.
The three-skill rate is reported separately; the page does not infer an
unreported trial count or standard deviation for it.

### Data and asset provenance

`static/data/icra_results.json` records the manuscript SHA-256, protocol,
complete simulation results, mask-selection comparison, and physical trial
counts. The JSON and the two CSV downloads preserve the manuscript's reported
precision. The full tables are also embedded in HTML, so they do not require a
network data fetch or JavaScript to read.

| Website asset | Source |
| --- | --- |
| `icra_preservation_failures.png` | `figures/policy_preservation_and_failures.pdf`, ICRA Figure 3 |
| `icra_real_world_rollouts.png` | `figures/real_world_rollouts.pdf`, ICRA rollout figure |
| `icra_real_world_setup.png` | `figures/real_world_setup.pdf`, ICRA setup figure |
| `three_skill_button.mp4` | `demo_3skills/demo1_graspA_graspB_pushbutton.mp4` |
| `three_skill_button_variant.mp4` | `demo_3skills/demo2_variant_present_end.mp4` |
| `three_skill_button_side.mp4` | `demo_3skills/demo3_side45.mp4` |
| `three_skill_switch.mp4` | `demo_3skills/demo4_pick_pick_switch.mp4` |
| `icra_overview.mp4` | `dexcompose_demo_v8_paper/DexCompose_ICRA_3min_under20MB.mp4` |
| `icra_overview.vtt` | `dexcompose_demo_v8_paper/English_Subtitles.srt` |

The overview and demonstration videos are copied without re-encoding. Posters
are extracted from their corresponding videos. Manuscript figures are rendered
to PNG; the original paper files are unchanged.

Four individual Franka–LEAP clips accompany the physical trial table, copied
from the ICRA project’s `Code/realworld/` directory (the same sources used by
the overview video):

- `real_ball_button.mp4`: `GraspBall_PressButton_seed_16962.mp4` (GraspBall + PushButton).
- `real_ball_drawer.mp4`: `GraspBall_PushDrawer_seed_8898.mp4` (GraspBall + OpenDrawer).
- `real_cube_button.mp4`: `GraspCube_PressButton_seed_5662.mp4` (GraspCube + PushButton).
- `real_cube_drawer.mp4`: `GraspCube_PushDrawer_seed_4113.mp4` (GraspCube + OpenDrawer).
