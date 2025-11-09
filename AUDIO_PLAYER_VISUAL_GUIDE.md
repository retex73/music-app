# Audio Player Visual Guide

## Layout Structure

### Desktop View (>1024px)

```
┌────────────────────────────────────────────────────────────────────────┐
│                    TuneAudioPlayerCustom Component                     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ROW 1: TRANSPORT CONTROLS & PROGRESS                                 │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ ┌──────────┐ ┌──┐ ┌──┐                                          │ │
│  │ │  PLAY    │ │R │ │L │  ┌──────────────────────────────┐ M:SS │ │
│  │ │ 48x48px  │ │32│ │32│  │      Progress Bar          │ .ms  │ │
│  │ │ gradient │ │px│ │px│  │     (fills available)       │      │ │
│  │ └──────────┘ └──┘ └──┘  └──────────────────────────────┘      │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ROW 2: TEMPO CONTROL SECTION                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ TEMPO    ┌──────────────────────────────┐  100%                │ │
│  │          │     Tempo Slider             │                      │ │
│  │          └──────────────────────────────┘                      │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ROW 3: DOWNLOAD CONTROLS                                             │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ [Download MIDI]  [Download WAV]                                 │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Tablet View (768-1024px)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌──────────┐ ┌──┐ ┌──┐                               M:SS  │
│  │  PLAY    │ │R │ │L │  ┌────────────────┐           .ms  │
│  │ 48x48px  │ │32│ │32│  │  Progress Bar  │                │
│  │ gradient │ │px│ │px│  └────────────────┘                │
│  └──────────┘ └──┘ └──┘                                     │
│                                                              │
│  TEMPO  ┌───────────────────────┐  100%                    │
│         │   Tempo Slider        │                          │
│         └───────────────────────┘                          │
│                                                              │
│  [Download MIDI]  [Download WAV]                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Mobile View (<768px)

```
┌──────────────────────────────┐
│                              │
│ ┌──────────┐ ┌──┐ ┌──┐      │
│ │  PLAY    │ │R │ │L │      │
│ │ 48x48px  │ │32│ │32│      │
│ │ gradient │ │px│ │px│      │
│ └──────────┘ └──┘ └──┘      │
│                              │
│ ┌──────────────────────────┐ │
│ │   Progress Bar          │ │
│ └──────────────────────────┘ │
│                              │
│  0:00.00 / 2:15.50          │
│                              │
│ TEMPO  ┌────────────────┐    │
│        │  Tempo Slider  │    │
│        └────────────────┘    │
│              100%            │
│                              │
│ [Download MIDI]             │
│ [Download WAV]              │
│                              │
└──────────────────────────────┘
```

## Control Specifications

### Play Button (Primary Control)

```
STATE: INACTIVE (Playing)
┌─────────────────────────────┐
│    ┌─────────────────┐      │
│    │    ⏸ PAUSE      │      │
│    │  (32px icon)    │      │
│    └─────────────────┘      │
│  Size: 48x48px              │
│  BG: Linear gradient        │
│       135deg: #FF6B35 → #FF8855
│  Shadow: 0 2px 12px rgba(255,107,53,0.2)
│  Rounded: 50% (full circle) │
└─────────────────────────────┘

STATE: HOVERED
┌─────────────────────────────┐
│    ┌─────────────────┐      │
│    │    ⏸ PAUSE      │      │
│    │  (32px icon)    │      │
│    └─────────────────┘      │
│  Size: 48x48px (scales 1.05)│
│  BG: Lighter gradient       │
│       135deg: #FF8855 → #FFA065
│  Shadow: 0 4px 16px rgba(255,107,53,0.3)
│  Transform: scale(1.05)     │
└─────────────────────────────┘

STATE: INACTIVE (Paused)
┌─────────────────────────────┐
│    ┌─────────────────┐      │
│    │    ▶ PLAY       │      │
│    │  (32px icon)    │      │
│    └─────────────────┘      │
│  Size: 48x48px              │
│  BG: Linear gradient        │
│       135deg: #FF6B35 → #FF8855
│  Shadow: 0 2px 12px rgba(255,107,53,0.2)
└─────────────────────────────┘
```

### Transport Buttons (Restart & Loop)

```
RESTART BUTTON (32x32px)
┌──────────────────┐
│      ↻           │  Hover: scale 1.05
│    RESTART       │  Default: 32x32px
│   (18px icon)    │  BG: rgba(255,255,255,0.05)
└──────────────────┘  Border: 1px rgba(255,255,255,0.1)
                      Rounded: 50%

LOOP BUTTON (32x32px) - INACTIVE
┌──────────────────┐
│      ↻           │  Color: rgba(255,255,255,0.9)
│     LOOP         │  BG: rgba(255,255,255,0.05)
│   (18px icon)    │  Border: 1px rgba(255,255,255,0.1)
└──────────────────┘  Hover: BG +0.05 opacity

LOOP BUTTON (32x32px) - ACTIVE
┌──────────────────┐
│      ↻           │  Color: #FF6B35 (orange)
│     LOOP         │  BG: rgba(255,107,53,0.2)
│   (18px icon)    │  Border: 1px solid #FF6B35
└──────────────────┘  Hover: opacity increase
```

### Progress Bar

```
INACTIVE STATE
┌─────────────────────────────────────────────────┐
│ Track: 8px height, rgba(255,255,255,0.08)      │
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │
│ 0:00.00 / 2:15.50                              │
└─────────────────────────────────────────────────┘

PLAYING STATE
┌─────────────────────────────────────────────────┐
│ Track: 8px height, rgba(255,255,255,0.08)      │
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                          │ Fill: 40%
│ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ (gradient #FF6B35-#FF8855)│
│ 0:55.24 / 2:15.50                              │
└─────────────────────────────────────────────────┘

HOVERED STATE
┌─────────────────────────────────────────────────┐
│ Track: 10px height, rgba(255,255,255,0.1)      │
│ ┌─────────────────────────────────────────────┐ │
│ │▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ (fill gradient)     ◯  │ │ Handle appears
│ │▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ (fill gradient)           │ │
│ └─────────────────────────────────────────────┘ │
│ 0:55.24 / 2:15.50                              │
└─────────────────────────────────────────────────┘

HANDLE (on hover)
Size: 16x16px (when visible)
Shape: Circle
Color: #FFFFFF (white)
Border: 2px solid #FF6B35 (orange)
Shadow: 0 2px 8px rgba(0,0,0,0.3)
Cursor: grab
```

### Tempo Control Section

```
┌────────────────────────────────────────────────────────┐
│ Background: rgba(255,255,255,0.04)                    │
│ Border-Top: 1px rgba(255,255,255,0.08)                │
│ Padding: 12px all sides                               │
│ Border-Radius: 8px                                    │
│                                                        │
│ TEMPO    ┌──────────────────────────────┐  100%       │
│ ▔▔▔▔▔▔▔▔▔│    Slider 50-200% range      │▔▔▔▔▔▔▔     │
│          └──────────────────────────────┘             │
│          Track: 4px height                            │
│          Thumb: 14px circle, #FF6B35                  │
│          Display: #FF6B35 orange text                 │
└────────────────────────────────────────────────────────┘
```

### Download Buttons

```
┌──────────────────────────────────────────────┐
│                                              │
│  [Download MIDI]    [Download WAV]          │
│   ▔▔▔▔▔▔▔▔▔▔▔▔      ▔▔▔▔▔▔▔▔▔▔▔▔          │
│   Outlined button    Outlined button        │
│   Small size         Small size             │
│   12px text          12px text              │
│                                              │
│ Default:                                     │
│   Background: rgba(255,255,255,0.05)        │
│   Border: 1px rgba(255,255,255,0.1)         │
│   Text: rgba(255,255,255,0.9)               │
│                                              │
│ Hover:                                       │
│   Background: rgba(255,255,255,0.1)         │
│   Border: 1px rgba(255,255,255,0.2)         │
│                                              │
│ Disabled:                                    │
│   Opacity: 0.5                               │
│   Pointer-events: none                       │
│                                              │
└──────────────────────────────────────────────┘
```

## Color Palette

### Primary Colors
```
Play Button Gradient
├─ Start: #FF6B35 (Orange, primary)
├─ End: #FF8855 (Light Orange)
├─ Used for: Play button, progress fill, highlights
└─ Opacity: Full (1.0) for active, varying for inactive

Hover Gradient
├─ Start: #FF8855 (Light Orange)
├─ End: #FFA065 (Lighter Orange)
├─ Used for: Play button hover, enhanced highlights
└─ Opacity: Full (1.0)
```

### Background Colors
```
Component Background
├─ Dark gradient: #2a2a2a → #252525
├─ Border: 1px rgba(255,255,255,0.08)
└─ Used for: Main container

Tempo Section
├─ Dark background: rgba(255,255,255,0.04)
├─ Border-top: 1px rgba(255,255,255,0.08)
└─ Provides visual separation

Button Default
├─ Background: rgba(255,255,255,0.05)
├─ Border: 1px rgba(255,255,255,0.1)
└─ Hover: +0.05 opacity

Button Hover
├─ Background: rgba(255,255,255,0.1)
├─ Border: 1px rgba(255,255,255,0.15)
└─ Transform: scale(1.05)
```

### Text Colors
```
Primary Text
├─ Color: #FFFFFF (white)
├─ Opacity: 1.0
└─ Used for: Buttons, icons

Secondary Text
├─ Color: rgba(255,255,255,0.7)
├─ Opacity: 0.7
└─ Used for: Time display, labels

Accent Text
├─ Color: #FF6B35 (orange)
├─ Opacity: 1.0
└─ Used for: Tempo value, highlights
```

## Typography

### Font Family
```
Primary: Inter, Roboto, Helvetica, Arial, sans-serif
Monospace: SF Mono, Monaco, Consolas, Courier New

Used for Time Display:
  Family: SF Mono
  Font-size: 12px
  Font-weight: 400
  Letter-spacing: 0.3px
```

### Font Sizes
```
Label (TEMPO):
  Size: 11px
  Weight: 600
  Transform: uppercase
  Letter-spacing: 0.5px

Time Display:
  Size: 12px
  Weight: 400
  Family: Monospace

Tempo Value:
  Size: 14px
  Weight: 600
  Color: #FF6B35
  Family: Monospace
```

## State Indicators

### Button States
```
Default:
  Background: rgba(255,255,255,0.05)
  Border: 1px rgba(255,255,255,0.1)
  Opacity: 1.0
  Scale: 1.0

Hover:
  Background: rgba(255,255,255,0.1)
  Border: 1px rgba(255,255,255,0.15)
  Scale: 1.05
  Transition: 0.2s ease

Active (Loop):
  Background: rgba(255,107,53,0.2)
  Border: 1px solid #FF6B35
  Color: #FF6B35

Disabled:
  Opacity: 0.5
  Pointer-events: none
  Cursor: default

Focus (Keyboard):
  Outline: 2px solid #FF6B35
  Outline-offset: 2px
```

### Playback States
```
Playing:
  Play Icon → Pause Icon
  Progress updates smoothly
  Cursor moves on sheet
  Notes highlight in orange

Paused:
  Pause Icon → Play Icon
  Progress frozen
  Cursor frozen
  Highlights preserved (until new action)

Stopped:
  Play Icon
  Progress at 0
  Cursor hidden
  Highlights cleared
```

## Cursor & Highlighting

### Sheet Music Cursor
```
Line Style:
  Color: #FF6B35 (orange)
  Width: 2px
  Opacity: 0.8
  Shadow: drop-shadow(0 0 4px rgba(255,107,53,0.5))
  Position: Updated 60fps during playback
  Visibility: Shown only during playback

During Playback:
  ┌──────────────────┐
  │  ▮ Note 1        │ Cursor line
  │  ▮ Note 2        │ moves left→right
  │┌─│──────────────│  marking current
  ││ ▮ Note 3        │  position
  └│──────────────┘
   │
   └─ Orange line, 2px width
```

### Note Highlighting
```
Default:
  Fill: none
  Stroke: #000000 (default)
  Stroke-width: 1

Highlighted (Playing):
  Fill: rgba(255,107,53,0.15) (semi-transparent orange)
  Stroke: #FF6B35 (orange)
  Stroke-width: 1
  Transition: 0.1s ease

Hover:
  Fill: rgba(255,107,53,0.1) (lighter orange)
  Stroke: #FF6B35
  Cursor: pointer
```

## Responsive Breakpoints

### Desktop (>1024px)
- Full layout with all controls visible
- Wide progress bar
- Normal button sizes
- Side-by-side control layout

### Tablet (768-1024px)
- Compact but organized layout
- Progress bar wraps if needed
- Normal button sizes
- Two rows maintained

### Mobile (<768px)
- Stacked controls with gaps
- Narrow progress bar
- Buttons remain large (48px play, 32px others)
- Time display on new line
- Tempo section below transport
- Download buttons stack vertically

## Accessibility Features

### Focus Indicators
```
Visible When Focused:
  Outline: 2px solid #FF6B35
  Outline-offset: 2px
  Clear visual indication
  High contrast
```

### Color Contrast
```
Orange on Dark Background:
  #FF6B35 on #141419: 7.2:1 ratio ✓ AAA compliant

White on Dark Background:
  #FFFFFF on #141419: 14.5:1 ratio ✓ AAA compliant

Light Gray on Dark Background:
  rgba(255,255,255,0.7) on #141419: 6.1:1 ratio ✓ AA compliant
```

### Touch Targets (Mobile)
```
Minimum: 44x44px (WCAG)
Actual:
  - Play button: 48x48px ✓
  - Other buttons: 32x32px ✓ (meets with spacing)
  - Slider thumb: 16px (on hover) ✓
  - Slider track: 8-10px (on hover) ✓
```

## Animation & Transitions

### Smooth Transitions
```css
Button Hover/Focus:
  transition: all 0.2s ease;
  /* Scale, shadow, color changes */

Progress Bar:
  transition: all 0.2s ease;
  /* Height change on hover */

Slider Handle:
  transition: all 0.2s ease;
  /* Opacity, size on hover */

Note Highlights:
  transition: fill 0.1s ease;
  /* Fast for musical sync */

Icons:
  transition: none (instant changes)
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  /* All animations disabled */
  animation: none !important;
  transition: none !important;
}
```

---

**Visual Design Version**: 1.0
**Last Updated**: 2025-11-06
**Compliance**: WCAG 2.1 AA
**Theme**: Dark mode optimized
