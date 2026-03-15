# Images Folder

This folder contains all local images used in the KiddieBoo application.

## Image Files

### Hero Banner
- **hero-banner.jpg** — Main hero section banner image (4:3 aspect ratio, min 800px wide)

### Testimonial Avatars
- **avatar-1.jpg** — Testimonial avatar 1 (160x160px, square)
- **avatar-2.jpg** — Testimonial avatar 2 (160x160px, square)
- **avatar-3.jpg** — Testimonial avatar 3 (160x160px, square)
- **avatar-4.jpg** — Testimonial avatar 4 (160x160px, square)
- **avatar-5.jpg** — Testimonial avatar 5 (160x160px, square)
- **avatar-6.jpg** — Testimonial avatar 6 (160x160px, square)

## Usage

All images are referenced using absolute paths in the components:
- `/images/hero-banner.jpg`
- `/images/avatar-*.jpg`

These paths resolve to this public folder at runtime.

## Guidelines

- Keep images optimized (compressed for web)
- Use appropriate formats (JPG for photos, PNG for graphics with transparency)
- Maintain consistent dimensions as specified above
- Images should load from local storage for faster performance and offline support
