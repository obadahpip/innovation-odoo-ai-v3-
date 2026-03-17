# Phase 6 — Mobile Responsiveness

Pure frontend — no backend changes, no new packages, no migration needed.

---

## Files included

| File in this zip                                       | Action  | Replace in project                                      |
|--------------------------------------------------------|---------|---------------------------------------------------------|
| `frontend/src/pages/course/CoursePage.jsx`             | Replace | `frontend/src/pages/course/CoursePage.jsx`              |
| `frontend/src/pages/profile/ProfilePage.jsx`           | Replace | `frontend/src/pages/profile/ProfilePage.jsx`            |

---

## What changed

### CoursePage — biggest fixes

**h-screen collapse on mobile (fixed)**
- Changed `h-screen` → `height: 100dvh` (dynamic viewport height)
- `100dvh` accounts for the mobile browser address bar shrinking/growing
- Prevents the page from being cut off or overflowing on iOS/Android

**AI Tutor — bottom sheet on mobile**
- On mobile (< lg breakpoint): AI panel is completely hidden from the side
- A **💡 AI** button appears in the breadcrumb bar on mobile
- Tapping it opens a bottom sheet that slides up to 75% of the screen height
- The sheet has a drag handle, close button, full Simplify/Ask functionality
- Body scroll is locked while the sheet is open
- On desktop (lg+): original side panel is unchanged

**Touch targets — all interactive elements**
- Every button now has `min-h-[44px]` (Apple/Google recommended minimum)
- Breadcrumb bar height enforced at 44px minimum
- Nav/exit buttons have proper tap areas

**Other mobile polish**
- Slide content padding: `px-4 sm:px-8` (tighter on small screens)
- Slide title: `text-lg sm:text-xl`
- "Complete lesson ✓" shortened to "Complete ✓" on mobile to fit the button
- Slide count (1/8) hidden on mobile to save space
- Shortcut hint hidden on mobile (keyboard not available)
- ToC sidebar: already desktop-only (`hidden md:flex`) — unchanged

### ProfilePage — minor responsive fixes
- Nav height enforced at 44px minimum
- Grid: `grid-cols-1 sm:grid-cols-2` (stacked on mobile, side by side on tablet+)
- All buttons: `min-h-[44px]`
- Avatar section: `flex-shrink-0` on avatar circle to prevent squishing on small screens
- Padding: `p-5 sm:p-6` on cards

### DashboardPage — already done in Phase 3
- Sidebar hamburger menu already works on mobile ✅
- No changes needed

---

## No commands needed

Just copy the 2 files and reload.

---

## Quick checklist

- [ ] `CoursePage.jsx` replaced
- [ ] `ProfilePage.jsx` replaced
- [ ] On mobile (375px): lesson page fills full height without overflow
- [ ] On mobile: "💡 AI" button appears in the top bar
- [ ] Tapping "💡 AI" opens bottom sheet with Simplify/Ask
- [ ] Bottom sheet closes by tapping the backdrop or × button
- [ ] All buttons are comfortably tappable (≥44px height)
- [ ] Profile page stacks to single column on mobile
