# ⏱️ Time Tuner

**Time Tuner** is a lightweight, plug-and-play module designed to optimize timestep allocation in diffusion models. It helps accelerate sampling while maintaining high generation quality. This implementation is based on the CVPR 2024 paper:  
**“Towards More Accurate Diffusion Model Acceleration with A Timestep Tuner”**

🔗 [Live Demo](https://time-tuner-psi.vercel.app)
---

## 🚀 Features

- ⚡ Boosts diffusion sampling speed with minimal loss in quality
- 🧩 Compatible with DDIM and other deterministic samplers
- 🔄 Works with unconditional, classifier, and classifier-free guidance
- 🧠 Converts discrete-time diffusion models into continuous-time
- 💻 Simple integration into any diffusion codebase

---

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/THU-LYJ-Lab/time-tuner.git
cd time-tuner
pip install -r requirements.txt
