# 第三方与参考范围

核查日期：2026-11-05。参考仓库仅用于需求与交互方向研究，本项目业务代码与琴键组件独立实现，没有复制代码、图片或音频。许可证结论针对核查时仓库，不能代替未来具体文件的逐项检查。

| 项目 | 核查结果 | 本次复用 |
|---|---|---|
| [earpath](https://github.com/abeage1/earpath-app/blob/main/LICENSE) | 仓库标注 MIT | 仅参考训练分类与本地优先思路 |
| [kissishka/ear-training](https://github.com/kissishka/ear-training) | 仓库标注 MIT | 仅参考音乐技术栈方向 |
| [ear-training-buddy](https://github.com/pianosnake/ear-training-buddy) | 仓库未发现明确代码 LICENSE；README 的采样公共领域说明不代表代码许可 | 不复制代码或采样 |
| [react-piano](https://github.com/kevinsqi/react-piano/blob/master/LICENSE) | MIT | 仅参考黑白键交互；未安装，独立实现 Pointer Events 键盘 |

直接运行依赖：React/React DOM、Tone.js、Tonal、VexFlow、idb（MIT）；lucide-react 图标（ISC）。Vite、TypeScript、Vitest、vite-plugin-pwa 等作为开发/打包工具使用。精确版本以 package-lock.json 为准；完整许可证以各 npm 包内 LICENSE 为准。

0.2 版本新增 Salamander Grand Piano 真实钢琴采样（13 个 MP3），作者 Alexander Holm，CC BY 3.0。分发来自 Tonejs/audio，文件未修改；采样器运行时移调、调整包络和音量，不表示作者背书。署名见 public/samples/salamander/ATTRIBUTION.md，完整许可见 public/licenses/Salamander-CC-BY-3.0.txt。品牌与 PWA 图标为本次制作。VexFlow Bravura 入口内嵌 Bravura 与 Academico 字体（SIL OFL 1.1），随应用离线缓存，不从 CDN 加载。原始字体许可随 public/licenses 分发。运行依赖许可汇总位于 public/THIRD_PARTY_LICENSES.txt。
