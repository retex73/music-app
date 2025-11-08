# Audio Player Implementation Checklist

## Phase 1: Setup & Preparation

- [ ] **Review Documentation** (Estimated: 15 minutes)
  - [ ] Read AUDIO_PLAYER_QUICK_REFERENCE.md
  - [ ] Review AUDIO_PLAYER_MIGRATION.md overview
  - [ ] Check AUDIO_PLAYER_VISUAL_GUIDE.md for design

- [ ] **Backup Current Implementation** (Estimated: 5 minutes)
  - [ ] Backup old TuneAudioPlayer.jsx
  - [ ] Backup old TuneAudioPlayer.css
  - [ ] Create git branch: `git checkout -b feat/custom-audio-player`

- [ ] **Verify Dependencies** (Estimated: 5 minutes)
  - [ ] Confirm abcjs 6.4.3+ installed
  - [ ] Confirm @mui/material 6.1.6+ installed
  - [ ] Confirm @mui/icons-material 6.1.5+ installed
  - [ ] Run `npm list` to verify versions

- [ ] **Identify All Pages Using Old Component** (Estimated: 10 minutes)
  - [ ] Search codebase for `TuneAudioPlayer` imports
  - [ ] List all pages/components that need updates
  - [ ] Document settingId patterns used
  - [ ] Note any custom props/modifications

- [ ] **Prepare Test Environment** (Estimated: 5 minutes)
  - [ ] Ensure test suite runs cleanly
  - [ ] Set up browser DevTools inspection
  - [ ] Prepare mobile testing device (if available)
  - [ ] Document baseline performance metrics

---

## Phase 2: File Installation

- [ ] **Copy Component Files** (Estimated: 2 minutes)
  - [ ] Copy `TuneAudioPlayerCustom.jsx` to `src/components/`
  - [ ] Copy `TuneAudioPlayerCustom.css` to `src/components/`
  - [ ] Verify files exist in correct locations
  - [ ] Verify file permissions are readable

- [ ] **Verify Imports** (Estimated: 5 minutes)
  - [ ] Open TuneAudioPlayerCustom.jsx
  - [ ] Verify all imports resolve correctly
  - [ ] Check for any red squiggles in IDE
  - [ ] Ensure abcjs import works
  - [ ] Ensure @mui imports work

- [ ] **Initial Build Test** (Estimated: 5 minutes)
  - [ ] Run `npm run build` (or equivalent)
  - [ ] Check for compilation errors
  - [ ] Verify no console errors during build
  - [ ] Test production build if applicable

---

## Phase 3: Update Imports

- [ ] **Page 1: TheSessionTuneDetailsPage** (Estimated: 5 minutes per page)
  - [ ] Find old import statement
  - [ ] Replace with new import
  - [ ] Verify component renders without errors
  - [ ] No additional prop changes needed

- [ ] **Page 2: [Other Pages Using Audio Player]** (Repeat for each)
  - [ ] Find old import statement
  - [ ] Replace with new import
  - [ ] Verify component renders without errors

- [ ] **Page N: [Continue for all pages]**
  - [ ] [Repeat above pattern]

- [ ] **Verify No Duplicate Imports**
  - [ ] Search for old `TuneAudioPlayer` imports
  - [ ] Confirm all replaced or removed
  - [ ] No components importing both old and new

---

## Phase 4: Verify Sheet Music Containers

For each page using the player:

- [ ] **Container ID Verification** (Estimated: 2 minutes per page)
  - [ ] Verify container uses correct ID pattern: `paper-{settingId}`
  - [ ] Check SVG element exists in container
  - [ ] Verify abcjs renders sheet music there
  - [ ] Confirm ID is unique if multiple tunes on page

- [ ] **Visual Object Availability**
  - [ ] Verify visualObj is passed as prop
  - [ ] Check visualObj comes from abcjs.renderAbc()
  - [ ] Ensure visualObj is available before player renders
  - [ ] Add loading spinner if needed

---

## Phase 5: Testing - Component Rendering

- [ ] **Component Renders** (Estimated: 5 minutes per page)
  - [ ] Load page in browser
  - [ ] Confirm player component appears
  - [ ] Confirm "Activate Audio" button visible
  - [ ] Button is enabled (not grayed out)
  - [ ] No console errors

- [ ] **No Console Errors**
  - [ ] Open DevTools Console
  - [ ] Confirm no red error messages
  - [ ] Note any warnings for investigation
  - [ ] Check Network tab for soundfont requests

---

## Phase 6: Testing - Audio Playback

- [ ] **Activate Audio** (Estimated: 10 minutes per page)
  - [ ] Click "Activate Audio" button
  - [ ] Loading spinner appears
  - [ ] Soundfonts load (check Network tab)
  - [ ] Loading completes within 2-3 seconds
  - [ ] Controls become visible and enabled

- [ ] **Play/Pause Functionality**
  - [ ] Play button visible (48x48px, orange gradient)
  - [ ] Click play → playback starts
  - [ ] Icon changes to pause icon
  - [ ] Audio plays through speakers (if available)
  - [ ] Click pause → playback stops
  - [ ] Progress bar updates during playback
  - [ ] Click play again → resumes from last position

- [ ] **Restart Button**
  - [ ] Restart button visible (32x32px)
  - [ ] Click restart → playback stops
  - [ ] Time resets to 0:00.00
  - [ ] Can click play immediately after

- [ ] **Loop Toggle**
  - [ ] Loop button visible and clickable
  - [ ] Click loop → button highlights orange
  - [ ] Playback repeats at end (if enabled)
  - [ ] Click loop again → button returns to normal state
  - [ ] Playback stops at end (loop disabled)

---

## Phase 7: Testing - Progress & Time

- [ ] **Progress Bar** (Estimated: 5 minutes per page)
  - [ ] Progress bar visible during playback
  - [ ] Progress fill (orange) updates smoothly
  - [ ] Progress bar fills available width
  - [ ] No jittery movement
  - [ ] Progress is accurate

- [ ] **Time Display**
  - [ ] Current time shown (MM:SS.ms format)
  - [ ] Total duration shown
  - [ ] Both separated by forward slash
  - [ ] Updates during playback
  - [ ] Format matches: 0:00.00 / 2:15.50

- [ ] **Progress Bar Seeking**
  - [ ] Hover over progress bar
  - [ ] Handle appears (white circle, orange border)
  - [ ] Handle is draggable when paused
  - [ ] Seeking works (only when paused)
  - [ ] Time display updates after seek

---

## Phase 8: Testing - Tempo Control

- [ ] **Tempo Section** (Estimated: 5 minutes per page)
  - [ ] "TEMPO" label visible (uppercase)
  - [ ] Tempo section has dark background
  - [ ] Separated from transport controls

- [ ] **Tempo Slider**
  - [ ] Slider visible with range 50-200%
  - [ ] Slider thumb visible and draggable
  - [ ] Current value displayed (e.g., "100%")
  - [ ] Value in orange color (#FF6B35)
  - [ ] Slider responds to drag

- [ ] **Tempo Adjustment**
  - [ ] Drag slider to 50% → playback slows to half speed
  - [ ] Drag slider to 200% → playback speeds to double
  - [ ] Drag slider to 75% → playback at 3/4 speed
  - [ ] Adjustment applies immediately
  - [ ] No lag or stuttering

---

## Phase 9: Testing - Sheet Music Integration

- [ ] **Cursor Tracking** (Estimated: 5 minutes per page)
  - [ ] Play audio → orange cursor line appears on sheet music
  - [ ] Cursor is 2px wide, orange (#FF6B35)
  - [ ] Cursor moves smoothly with playback
  - [ ] Cursor follows current playback position
  - [ ] Cursor disappears when playback ends

- [ ] **Note Highlighting**
  - [ ] During playback: notes highlight in semi-transparent orange
  - [ ] Highlights update smoothly (no delays)
  - [ ] Only current notes highlighted
  - [ ] Highlights clear after note passes
  - [ ] Highlights clear at end of playback

- [ ] **Note Clicking**
  - [ ] Can click individual notes on sheet music
  - [ ] Note plays when clicked (sound)
  - [ ] Multiple notes can be clicked in sequence
  - [ ] Works even without main playback active
  - [ ] No errors in console

---

## Phase 10: Testing - Download Functionality

- [ ] **Download MIDI** (Estimated: 3 minutes per page)
  - [ ] "Download MIDI" button visible
  - [ ] Button is enabled after audio activation
  - [ ] Click downloads a .midi file
  - [ ] File is named: `tune-{settingId}.midi`
  - [ ] File is valid (can open in DAW or player)

- [ ] **Download WAV** (Estimated: 3 minutes per page)
  - [ ] "Download WAV" button visible
  - [ ] Button is enabled after audio activation
  - [ ] Click downloads a .wav file
  - [ ] File is named: `tune-{settingId}.wav`
  - [ ] File is valid (can play with audio player)

---

## Phase 11: Testing - Responsive Design

- [ ] **Desktop View (>1024px)** (Estimated: 5 minutes)
  - [ ] Resize browser to 1280px width
  - [ ] All controls visible and properly spaced
  - [ ] Progress bar fills available space
  - [ ] No button overlap
  - [ ] Layout looks clean and professional

- [ ] **Tablet View (768-1024px)** (Estimated: 5 minutes)
  - [ ] Resize browser to 800px width
  - [ ] Controls reorganize appropriately
  - [ ] No horizontal scrolling
  - [ ] All controls remain usable
  - [ ] Play button prominent (48x48px)

- [ ] **Mobile View (<768px)** (Estimated: 5 minutes)
  - [ ] Resize browser to 375px width
  - [ ] Vertical stacking of controls
  - [ ] Play button large and tappable (48x48px)
  - [ ] Progress bar usable with touch
  - [ ] Tempo slider usable with touch
  - [ ] No horizontal scrolling

---

## Phase 12: Testing - Accessibility

- [ ] **Keyboard Navigation** (Estimated: 5 minutes)
  - [ ] Tab through controls
  - [ ] All controls focused in logical order
  - [ ] Focus visible on each control (orange outline)
  - [ ] Enter/Space can activate buttons
  - [ ] Slider arrow keys work for tempo/progress

- [ ] **Screen Reader Testing** (if available)
  - [ ] Component announces properly
  - [ ] Button labels clear and descriptive
  - [ ] Slider values announced correctly
  - [ ] Status updates announced (play/pause)

- [ ] **Color Contrast** (Estimated: 3 minutes)
  - [ ] Orange on dark background: readable
  - [ ] Text contrast adequate
  - [ ] No color-only information (support icons)
  - [ ] Meets WCAG AA standards

- [ ] **Reduced Motion** (Estimated: 3 minutes)
  - [ ] Enable `prefers-reduced-motion` in OS
  - [ ] Animations disabled/minimized
  - [ ] Functionality unchanged
  - [ ] No flashing or rapid motion

---

## Phase 13: Testing - Edge Cases

- [ ] **Very Long Tunes** (>10 minutes) (Estimated: 3 minutes)
  - [ ] Load long tune
  - [ ] Audio initializes correctly
  - [ ] Playback smooth throughout
  - [ ] Seeking works
  - [ ] No memory issues

- [ ] **Very Short Tunes** (<5 seconds) (Estimated: 3 minutes)
  - [ ] Load short tune
  - [ ] Audio initializes correctly
  - [ ] Progress bar displays correctly
  - [ ] Playback completes properly

- [ ] **Network Latency** (Estimated: 5 minutes)
  - [ ] Throttle network to "Slow 3G" (DevTools)
  - [ ] Audio activation still works
  - [ ] Loading spinner shown during wait
  - [ ] No timeout errors
  - [ ] Playback quality acceptable

- [ ] **Rapid Button Clicks** (Estimated: 3 minutes)
  - [ ] Rapidly click play/pause
  - [ ] No double playback
  - [ ] State stays consistent
  - [ ] No errors in console

---

## Phase 14: Testing - Cross-Browser

- [ ] **Chrome/Chromium** (Estimated: 10 minutes)
  - [ ] Load page in Chrome
  - [ ] Audio activates and plays
  - [ ] All controls work
  - [ ] No console errors

- [ ] **Firefox** (Estimated: 10 minutes)
  - [ ] Load page in Firefox
  - [ ] Audio activates and plays
  - [ ] All controls work
  - [ ] No console errors

- [ ] **Safari** (Estimated: 10 minutes, if available)
  - [ ] Load page in Safari
  - [ ] Audio activates and plays
  - [ ] All controls work
  - [ ] No console errors

- [ ] **Edge** (Estimated: 10 minutes, if available)
  - [ ] Load page in Edge
  - [ ] Audio activates and plays
  - [ ] All controls work
  - [ ] No console errors

---

## Phase 15: Testing - Mobile Devices (Optional)

- [ ] **iOS Safari** (if available)
  - [ ] Audio requires user gesture (activate button)
  - [ ] Playback works after activation
  - [ ] Touch controls responsive
  - [ ] No audio context errors

- [ ] **Android Chrome** (if available)
  - [ ] Audio requires user gesture (activate button)
  - [ ] Playback works after activation
  - [ ] Touch controls responsive
  - [ ] No audio context errors

---

## Phase 16: Performance Testing

- [ ] **Load Time** (Estimated: 5 minutes)
  - [ ] Measure time from click "Activate Audio" to ready
  - [ ] Should be 500ms - 2 seconds
  - [ ] Document baseline for comparison

- [ ] **Playback Smoothness** (Estimated: 5 minutes)
  - [ ] Play audio and observe progress bar
  - [ ] No stuttering or jittering
  - [ ] Smooth 60fps updates
  - [ ] No CPU spikes

- [ ] **Memory Usage** (Estimated: 5 minutes)
  - [ ] Open DevTools Performance tab
  - [ ] Play audio for 30 seconds
  - [ ] Stop and take heap snapshot
  - [ ] Check for memory leaks
  - [ ] Memory should remain stable

---

## Phase 17: Documentation & Cleanup

- [ ] **Update Project Documentation** (Estimated: 10 minutes)
  - [ ] Update project README if references old player
  - [ ] Document any customizations made
  - [ ] Add usage examples for new developers
  - [ ] Link to AUDIO_PLAYER_QUICK_REFERENCE.md

- [ ] **Code Review** (Estimated: 15 minutes)
  - [ ] Self-review changes
  - [ ] Check for console.logs or debug code
  - [ ] Verify no commented-out code
  - [ ] Ensure consistent code style
  - [ ] Confirm no security issues

- [ ] **Decide on Old Component** (Estimated: 5 minutes)
  - [ ] [ ] Remove old TuneAudioPlayer.jsx
  - [ ] [ ] Remove old TuneAudioPlayer.css
  - [ ] [ ] Or keep as backup (1 commit only)
  - [ ] [ ] Document decision in commit message

---

## Phase 18: Version Control & Deployment

- [ ] **Git Operations** (Estimated: 10 minutes)
  - [ ] Review all changes: `git status`
  - [ ] Stage files: `git add .`
  - [ ] Create descriptive commit message
  - [ ] Push to feature branch
  - [ ] Create Pull Request for review

- [ ] **Code Review** (Estimated: varies)
  - [ ] Request review from team members
  - [ ] Address review comments
  - [ ] Run CI/CD tests
  - [ ] Confirm all tests pass

- [ ] **Merge to Main** (Estimated: 5 minutes)
  - [ ] Rebase on latest main if needed
  - [ ] Merge to main branch
  - [ ] Delete feature branch
  - [ ] Update main locally

- [ ] **Deploy to Staging** (Estimated: 10 minutes)
  - [ ] Deploy to staging environment
  - [ ] Run full test suite
  - [ ] Smoke test all pages
  - [ ] Verify performance metrics

- [ ] **Deploy to Production** (Estimated: 10 minutes)
  - [ ] Schedule deployment during low-traffic time
  - [ ] Create release notes
  - [ ] Deploy to production
  - [ ] Monitor error tracking (Sentry, etc.)
  - [ ] Verify no critical issues

---

## Phase 19: Post-Deployment Monitoring

- [ ] **Monitor Error Logs** (Estimated: 5 minutes, ongoing)
  - [ ] Check error tracking for new errors
  - [ ] Watch for audio context issues
  - [ ] Monitor for network errors
  - [ ] Note any user-reported issues

- [ ] **Performance Monitoring** (Estimated: 5 minutes, ongoing)
  - [ ] Monitor load times
  - [ ] Watch CPU/memory usage
  - [ ] Track user interaction metrics
  - [ ] Compare to baseline metrics

- [ ] **User Feedback** (Estimated: ongoing)
  - [ ] Monitor user feedback channels
  - [ ] Respond to issues quickly
  - [ ] Document any improvements needed
  - [ ] Plan follow-up releases if needed

---

## Success Criteria

All items completed when:

- [x] All files installed correctly
- [x] All pages updated with new component
- [x] Audio playback works on all pages
- [x] All controls functional (play, pause, restart, loop, tempo)
- [x] Sheet music cursor tracking works
- [x] Note clicking works
- [x] Download MIDI and WAV work
- [x] Responsive design works (desktop, tablet, mobile)
- [x] Keyboard navigation works
- [x] Accessibility features working
- [x] All edge cases tested
- [x] Cross-browser testing passed
- [x] Performance acceptable
- [x] Code reviewed and merged
- [x] Deployed to production
- [x] No critical issues post-deployment
- [x] Team trained on new component

---

## Estimated Timeline

| Phase | Estimated Time |
|-------|-----------------|
| Setup & Preparation | 45 minutes |
| File Installation | 20 minutes |
| Import Updates | 30 minutes (varies by pages) |
| Sheet Container Verification | 20 minutes (varies) |
| Rendering Tests | 30 minutes |
| Audio Playback Tests | 60 minutes |
| Progress/Time Tests | 20 minutes |
| Tempo Tests | 20 minutes |
| Sheet Music Integration | 20 minutes |
| Download Tests | 10 minutes |
| Responsive Tests | 20 minutes |
| Accessibility Tests | 20 minutes |
| Edge Cases | 20 minutes |
| Cross-Browser | 45 minutes |
| Mobile Testing | 30 minutes (optional) |
| Performance Tests | 20 minutes |
| Documentation | 20 minutes |
| Version Control | 30 minutes |
| **Total** | **≈ 6-8 hours** |

**Timeline may vary based on:**
- Number of pages to update
- Complexity of existing integrations
- Availability for testing
- Review/approval process time
- Deployment timing

---

## Notes & Observations

Use this section to document findings:

```
Date: ___________

Page/Feature: ___________

Issue/Finding: ___________

Resolution: ___________

Status: ___________
```

---

## Sign-Off

- [ ] All testing completed
- [ ] All issues resolved
- [ ] Documentation updated
- [ ] Code approved
- [ ] Deployed successfully
- [ ] No critical issues in production

**Tested By**: _________________ **Date**: _________

**Reviewed By**: _________________ **Date**: _________

**Deployed By**: _________________ **Date**: _________

---

**Last Updated**: 2025-11-06
**Checklist Version**: 1.0
**Status**: Ready for implementation
