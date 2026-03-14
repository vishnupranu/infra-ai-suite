

## PHASE 1 — GLOBAL STATE MANAGEMENT

### 1.1 Create Zustand Stores
**File: `src/stores/authStore.ts`**
- Store: AuthSession (user, session, role, isAdmin, loading)
- Persist to localStorage with auto-rehydration
- Include token refresh logic

**File: `src/stores/cartStore.ts`**
- Store: CartStore (items, pricing, checkout state, discount codes)
- Persist to sessionStorage
- Include checkout flow management

**File: `src/stores/appStore.ts`**
- Store: AppStore (language, theme, notifications, sidebar state)
- Global app configuration

### 1.2 Create Providers
**File: `src/providers/AuthProvider.tsx`**
- Wrap entire app with auth context
- Handle Supabase auth state changes
- Auto-rehydrate session on page refresh

---

## PHASE 2 — ENHANCED RBAC

### 2.1 Role System Enhancement
- Roles: `admin`, `developer`, `editor`, `viewer` (extend existing `app_role` enum)
- **Database migration**: Add developer and editor roles
- **File: `src/hooks/usePermissions.ts`** - Permission checking hook

### 2.2 Route Guards
**File: `src/components/RoleGuard.tsx`**
- Component-level visibility control
- Redirect unauthorized users
- Show loading skeletons during auth check

### 2.3 Enhanced ProtectedRoute
- Update existing `ProtectedRoute.tsx` to support multiple roles
- Add `requiredRoles` prop for flexible access control

---

## PHASE 3 — AI ARCHITECTURE LAB (GEMINI)

### 3.1 Create AI Lab Page
**File: `src/pages/AILab.tsx`**
- Industry selector (E-commerce, Healthcare, Finance, SaaS, etc.)
- Security level slider (Basic → Enterprise)
- Cost & scale sliders
- Prompt editor with templates

### 3.2 Create Architecture Generator Edge Function
**File: `supabase/functions/generate-architecture/index.ts`**
- Call Lovable AI Gateway (gemini-2.5-flash)
- Structured output for:
  - Services (microservices, APIs)
  - Databases (SQL, NoSQL, Vector)
  - Security layers (Auth, WAF, Encryption)
  - Cost estimation (monthly/yearly)
  - Deployment topology (Kubernetes, Serverless)

### 3.3 Architecture Visualization
**File: `src/components/ArchitectureDiagram.tsx`**
- Visual representation using React Flow or custom SVG
- Interactive nodes for services
- Export to JSON and Markdown

---

## PHASE 4 — REAL-TIME SYSTEM SIMULATION

### 4.1 System Logs Provider
**File: `src/stores/systemLogsStore.ts`**
- Real-time log streaming simulation
- Categories: threats_blocked, auth_attempts, infra_warnings, payment_events

### 4.2 Live Dashboard Updates
**File: `src/components/LiveMetrics.tsx`**
- Recharts integration for traffic data
- CPU/Memory/Requests gauges
- Error rate monitoring
- Auto-refresh every 5 seconds (using React Query)

### 4.3 Threat Scanner Simulation
**File: `src/components/ThreatScanner.tsx`**
- Replace setTimeout with interval-based polling
- Streaming security events
- Real-time threat count updates

---

## PHASE 5 — COMPLETE SCREENS & ROUTING

### 5.1 New Pages to Create:
1. **`src/pages/IndustryDetail.tsx`** - Dynamic /industries/:id page
2. **`src/pages/AdminUsers.tsx`** - Full CRUD user management
3. **`src/pages/AdminAudit.tsx`** - Filterable, scrollable audit trail
4. **`src/pages/Settings.tsx`** - Profile, Security (2FA toggle), Billing History
5. **`src/pages/AIChat.tsx`** - Already exists, add to routes
6. **`src/pages/Industries.tsx`** - Industry solutions listing
7. **`src/pages/Analytics.tsx`** - User analytics dashboard

### 5.2 Route Updates
**File: `src/App.tsx`**
```tsx
<Route path="/ai-lab" element={<ProtectedRoute><AILab /></ProtectedRoute>} />
<Route path="/ai-chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
<Route path="/industries" element={<Industries />} />
<Route path="/industries/:id" element={<IndustryDetail />} />
<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
<Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
<Route path="/admin/audit" element={<ProtectedRoute requireAdmin><AdminAudit /></ProtectedRoute>} />
<Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><Analytics /></ProtectedRoute>} />
```

---

## PHASE 6 — ADMIN & DATA MOCK APIs

### 6.1 Analytics Edge Function
**File: `supabase/functions/analytics/index.ts`**
- Traffic data generation for Recharts
- CPU/Memory/Request metrics
- Error rates by time period

### 6.2 Admin Dashboard Enhancement
**File: `src/pages/AdminDashboard.tsx`**
- Live-updating metrics (5-second refresh)
- User statistics cards
- Revenue charts
- Recent activity feed

### 6.3 Database Tables for Analytics
**Migration**: Add `audit_logs` and `analytics_events` tables
- Track admin actions
- Store user engagement metrics

---

## PHASE 7 — PAYMENTS & WEBHOOK FLOW

### 7.1 Payment Webhook Edge Function
**File: `supabase/functions/payment-webhook/index.ts`**
- Handle payment status updates
- Update user `payment_verified` status
- Create subscription records
- Log payment events

### 7.2 Payment Flow Enhancement
- Checkout → Pending (current)
- Webhook → Success/Failed
- Redirect → Success page with confirmation
- Persist transaction history

### 7.3 Payment History Page
**File: `src/pages/PaymentHistory.tsx`**
- List all transactions
- Status badges (pending, success, failed)
- Invoice download

---

## PHASE 8 — UX & INTERACTION POLISH

### 8.1 Form Validation
- Zod schemas for all forms (Login, Signup, Payment, Profile)
- Clear error messages with toast notifications

### 8.2 Loading States
**File: `src/components/ui/skeleton-card.tsx`**
- Skeleton components for:
  - Tool cards
  - Dashboard stats
  - Profile sections
  - Chat messages

### 8.3 Toast Notifications
- Success (green check)
- Error (red X)
- Warning (yellow triangle)
- Info (blue info)

### 8.4 Animations
**File: `src/index.css`** - Enhanced animations:
- Page transitions (fade-in-up)
- Card hover effects (scale, glow)
- Button interactions (pulse, ripple)
- Modal enter/exit animations
- 60fps smooth scrolling

### 8.5 Mobile Navigation
**File: `src/components/MobileNav.tsx`**
- Bottom navigation bar for mobile
- Swipe gestures
- Native app-like transitions

---

## PHASE 9 — PRODUCTION READY CHECKLIST

### 9.1 Error Boundaries
**File: `src/components/ErrorBoundary.tsx`**
- Catch React errors gracefully
- Fallback UI with retry option

### 9.2 SEO & Meta Tags
**File: `src/components/SEO.tsx`**
- Dynamic page titles
- Open Graph tags
- Twitter cards

### 9.3 Performance Optimization
- React.lazy for code splitting
- useMemo/useCallback for expensive operations
- Image optimization with lazy loading

### 9.4 Security Hardening
- CSP headers via config.toml
- Rate limiting on edge functions
- Input sanitization everywhere

---

## DATABASE MIGRATIONS NEEDED

```sql
-- Add new roles
ALTER TYPE app_role ADD VALUE 'developer';
ALTER TYPE app_role ADD VALUE 'editor';
ALTER TYPE app_role ADD VALUE 'viewer';

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics events table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Industry solutions table
CREATE TABLE industry_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_name TEXT,
  features JSONB,
  tools UUID[] REFERENCES ai_tools(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_solutions ENABLE ROW LEVEL SECURITY;
```

---

## FILES TO CREATE/UPDATE

### New Files (30+):
1. `src/stores/authStore.ts`
2. `src/stores/cartStore.ts`
3. `src/stores/appStore.ts`
4. `src/stores/systemLogsStore.ts`
5. `src/providers/AuthProvider.tsx`
6. `src/hooks/usePermissions.ts`
7. `src/components/RoleGuard.tsx`
8. `src/components/ArchitectureDiagram.tsx`
9. `src/components/LiveMetrics.tsx`
10. `src/components/ThreatScanner.tsx`
11. `src/components/MobileNav.tsx`
12. `src/components/ErrorBoundary.tsx`
13. `src/components/SEO.tsx`
14. `src/components/ui/skeleton-card.tsx`
15. `src/pages/AILab.tsx`
16. `src/pages/Industries.tsx`
17. `src/pages/IndustryDetail.tsx`
18. `src/pages/AdminUsers.tsx`
19. `src/pages/AdminAudit.tsx`
20. `src/pages/AdminDashboard.tsx`
21. `src/pages/Settings.tsx`
22. `src/pages/Analytics.tsx`
23. `src/pages/PaymentHistory.tsx`
24. `src/pages/PaymentSuccess.tsx`
25. `supabase/functions/generate-architecture/index.ts`
26. `supabase/functions/analytics/index.ts`
27. `supabase/functions/payment-webhook/index.ts`

### Files to Update:
1. `src/App.tsx` - Add all new routes
2. `src/components/Navbar.tsx` - Add new navigation links
3. `src/components/ProtectedRoute.tsx` - Support multiple roles
4. `src/pages/Index.tsx` - Add industries section, enhanced CTA
5. `src/pages/Dashboard.tsx` - Live metrics integration
6. `src/pages/Payment.tsx` - Webhook integration
7. `src/index.css` - Enhanced animations
8. `supabase/config.toml` - Add new edge functions
9. `tailwind.config.ts` - New animation keyframes

---

## SUMMARY

This plan transforms your existing AI Tools platform into a **production-grade SaaS** with:

✅ **State Management**: Zustand stores with persistence
✅ **RBAC**: 4-tier role system (admin/developer/editor/viewer)
✅ **AI Lab**: Generate cloud architectures with Gemini
✅ **Real-time**: Live metrics, threat scanning, system logs
✅ **Complete Pages**: 15+ fully functional screens
✅ **Admin Panel**: User management, audit logs, analytics
✅ **Payments**: Webhook-based confirmation, transaction history
✅ **UX**: Skeletons, animations, mobile-first navigation
✅ **Production**: Error boundaries, SEO, performance optimization

**Estimated Implementation**: All 9 phases in a single execution run.

