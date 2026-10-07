# Frontend conventions

## Structure and state

- Put features in `src/feature/<feature>/`, shared controls in `src/components/ui/`, and shared types in `src/types/`. Prefer `@/` imports and nearby feature styles/tests. Reuse the existing studio layout and branding components.
- All application logic and API orchestration go through Zustand store actions. Components mainly render state and trigger actions; form drafts, dialogs, responsive layout state, and presentation effects may stay local.
- Add typed slices under `src/store/slices/`, export through `slices/index.ts`, extend `StoreState`, and compose in `src/store/index.ts`. Expose focused `useShallow` selector hooks.
- `userSlice` owns session restoration/sign-out; `accountSlice` owns profile/theme updates and deletion. Keep request flags, errors, conflict guards, and request notifications in slices; clear flags in `finally`.
- Check `sessionVersion` before applying async results so late responses cannot restore a cleared session. Unauthorized errors call `resetSession`; extend its reset for new session-scoped state. Mutations may rethrow for UI handling without duplicating error logic/toasts.

## API flow

```text
component -> store action -> service -> shared Axios client + ENDPOINTS -> backend
response -> store validation/error handling -> state -> UI
```

- Keep paths in `src/api/endpoints.ts` and thin typed services in `src/api/services/`, returning `AxiosResponse<ApiResponse<T>>`. Components must not call services directly.
- Reuse `src/api/index.ts`: JSON headers, 10-second timeout, `withCredentials: true`, same-origin `/api` paths. Vite runs on 5173 and proxies to backend 3001. Disable the client's testing-only `ENABLE_API_DELAY` before production.
- Validate responses with `requireApiSuccess` / `requireUserData` in `src/api/responses.ts`; extend payload checks when fields change. Normalize errors through `src/api/errors.ts`.
- Restore the user from `/api/auth/me`; Google login uses browser navigation. Do not persist credentials or authenticated state in localStorage.

## Styling

- Follow the fitness-companion pattern: `src/styles/colors.css` owns the palette; `global.css` maps semantic Tailwind/shadcn tokens. Use semantic classes or existing CSS variables, with feature layout styles kept local. Avoid hardcoded palettes and global control overrides.
- Reuse customized shadcn/Radix controls, `cn`, and `cva`. Add missing controls with `npx shadcn@latest add <component>` and adapt to existing styles; do not overwrite customizations with CLI defaults.
- Use button variants `primary`, `secondary`, `secondary-filled`, `app-special`, `destructive`, `ghost`, and `subtle`, existing sizes, and `loading` rather than page-level control overrides.
- Theme is the persisted user field `light | dark | system` (default dark). Update through the account store; `feature/theme/theme.ts` applies `data-theme`, and the palette handles system preference. Do not add separate theme persistence.
- Use `src/utils/notifications.tsx` and shared Sonner styles. Preserve accessible labels, keyboard/focus behavior, loading/disabled states, and reduced-motion support.

## Tests

- Prioritize behavior tests per slice in `src/store/slices/tests/`, with shared fixtures in `helpers.ts`. Keep transport/contract tests in `src/api/tests/`; add component tests only for meaningful UI behavior.
- Run relevant `npm test -- <test-file>` checks plus root tooling guidance.
