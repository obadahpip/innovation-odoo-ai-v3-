/**
 * appStore.js — Global Zustand store
 *
 * Manages ERP-wide state that is shared across all modules:
 *   - Active user & company
 *   - Active app / module
 *   - Sidebar collapsed state
 *   - Debug mode
 *   - Active lesson (task engine integration)
 *   - Notifications / toasts
 *
 * Phase 0: Full store defined.
 * Each module will create its own store in /modules/{name}/store.js
 * for module-specific state.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set, get) => ({

      // ── Active context ───────────────────────────────────────────
      activeApp:     null,   // e.g. 'crm'
      activeModule:  null,   // e.g. 'crm' (same as activeApp for top-level)
      activeCompany: 'company-1',
      activeUser:    'user-admin',

      setActiveApp:    (app)     => set({ activeApp: app }),
      setActiveModule: (module)  => set({ activeModule: module }),
      setActiveCompany:(id)      => set({ activeCompany: id }),
      setActiveUser:   (id)      => set({ activeUser: id }),

      // ── Layout state ─────────────────────────────────────────────
      sidebarCollapsed: false,
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // ── Developer mode ───────────────────────────────────────────
      developerMode: false,
      toggleDeveloperMode: () => set(s => ({ developerMode: !s.developerMode })),

      // ── Lesson / task engine ─────────────────────────────────────
      activeLessonId:  null,
      lessonTaskStep:  0,
      lessonCompleted: false,
      hintCount:       0,
      maxHints:        3,

      setActiveLesson: (lessonId) => set({ activeLessonId: lessonId, lessonTaskStep: 0, lessonCompleted: false, hintCount: 0 }),
      advanceLessonStep: () => set(s => ({ lessonTaskStep: s.lessonTaskStep + 1 })),
      completeLessonTask: () => set({ lessonCompleted: true }),
      requestHint: () => set(s => ({ hintCount: Math.min(s.hintCount + 1, s.maxHints) })),
      canRequestHint: () => get().hintCount < get().maxHints,

      // ── Notifications ─────────────────────────────────────────────
      notifications: [],
      addNotification: (n) => set(s => ({
        notifications: [...s.notifications, { id: Date.now(), ...n }].slice(-10),
      })),
      removeNotification: (id) => set(s => ({
        notifications: s.notifications.filter(n => n.id !== id),
      })),

      // ── Global loading state ─────────────────────────────────────
      globalLoading: false,
      setGlobalLoading: (v) => set({ globalLoading: v }),

    }),
    {
      name: 'innovation-erp-app',
      partialize: (s) => ({
        // Only persist these fields across page refreshes
        sidebarCollapsed: s.sidebarCollapsed,
        developerMode:    s.developerMode,
        activeCompany:    s.activeCompany,
        activeUser:       s.activeUser,
      }),
    },
  ),
)

export default useAppStore
