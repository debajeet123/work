import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
plt.switch_backend('tkagg')  # Add this at the top of your script

# Grid setup
nx, nz = 200, 200      # Grid size
dx = dz = 10.0         # Grid spacing (m)
nt = 500               # Time steps
dt = 0.001             # Time step (s)

# Physical parameters
v = 4000.0             # Constant velocity (m/s)
Q = 40                 # Quality factor
f0 = 15.0              # Source frequency (Hz)
alpha = np.pi * f0 / Q  # Attenuation coefficient

# CFL condition
cfl = v * dt / dx
assert cfl < 1/np.sqrt(2), f"CFL too high: {cfl:.2f}"

# Wavefields
u = np.zeros((nx, nz))
u_past = np.zeros_like(u)
u_future = np.zeros_like(u)

# Source setup
src_x, src_z = nx // 2, nz // 2
t = np.linspace(-1, 1, int(2/dt))
src_wavelet = (1 - 2*(np.pi*f0*t)**2) * np.exp(-(np.pi*f0*t)**2)

# Normalize source wavelet
src_wavelet /= np.max(np.abs(src_wavelet))
# Ensure source wavelet is not empty
if len(src_wavelet) == 0:
    raise ValueError("Source wavelet is empty. Check the parameters.")
# Initialize source wavelet
if len(src_wavelet) < nt:
    src_wavelet = np.pad(src_wavelet, (0, nt - len(src_wavelet)), 'constant')
# Ensure source wavelet is not empty after padding
if len(src_wavelet) == 0:
    raise ValueError("Source wavelet is still empty after padding. Check the parameters.")

# Storage for animation
frames = []

# Time loop
for it in range(nt):
    if it < len(src_wavelet):
        u_future[src_x, src_z] += src_wavelet[it]

    lap = (
        -4 * u +
        np.roll(u, 1, axis=0) + np.roll(u, -1, axis=0) +
        np.roll(u, 1, axis=1) + np.roll(u, -1, axis=1)
    ) / dx**2

    u_future += (v*dt)**2 * lap
    u_future *= np.exp(-alpha * dt)

    u_past, u = u, u_future.copy()

    if it % 5 == 0:
        frames.append(u.copy())

    if it == 5:
        plt.imshow(u_future, cmap="seismic"); plt.colorbar(); plt.show()

# Animate
fig, ax = plt.subplots(figsize=(6, 6))
im = ax.imshow(frames[0], cmap="seismic", vmin=-0.01, vmax=0.01, animated=True)
ax.set_title(f"2D Anelastic Wave Propagation (Q = {Q})")

def update(frame):
    im.set_array(frame)
    return [im]

ani = FuncAnimation(fig, update, frames=frames, interval=50, blit=True)
print(len(frames))  # Should be > 0
# Save the animation
ani.save('anelastic_wave_propagation.mp4', writer='ffmpeg', fps=30, dpi=300)
plt.show()