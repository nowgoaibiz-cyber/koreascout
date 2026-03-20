# WATERMARK_AUDIT

Scan-only audit. No code modified.

---

## 1. cat -n "app/weekly/[weekId]/[id]/page.tsx" | head -60

```
     1	import { createClient } from "@/lib/supabase/server";
     2	import { getAuthTier, maskReportByTier } from "@/lib/auth-server";
     3	import Link from "next/link";
     4	import { notFound } from "next/navigation";
     5	import { PRICING } from "@/src/config/pricing";
     6	import { ClientLeftNav } from "@/components/layout/ClientLeftNav";
     7	import ProductIdentity from "@/components/ProductIdentity";
     8	import {
     9	  TrendSignalDashboard,
    10	  MarketIntelligence,
    11	  SocialProofTrendIntelligence,
    12	  SourcingIntel,
    13	  SupplierContact,
    14	  EXPORT_STATUS_DISPLAY,
    15	} from "@/components/report";
    16	import type { ScoutFinalReportsRow } from "@/types/database";
    17	
    18	export default async function ProductDetailPage({
    19	  params,
    20	}: {
    21	  params: Promise<{ weekId: string; id: string }>;
    22	}) {
    23	  const { weekId, id } = await params;
    24	  const supabase = await createClient();
    25	  const { userId, userEmail, tier, subscriptionStartAt } = await getAuthTier();
    26	
    27	  const [
    28	    { data: report, error },
    29	    { data: weekReports },
    30	    { data: week },
    31	    { data: favoriteRow },
    32	  ] = await Promise.all([
    33	    supabase
    34	      .from("scout_final_reports")
    35	      .select("*")
    36	      .eq("id", id)
    37	      .eq("week_id", weekId)
    38	      .eq("status", "published")
    39	      .single(),
    40	    supabase
    41	      .from("scout_final_reports")
    42	      .select("id")
    43	      .eq("week_id", weekId)
    43	      .eq("status", "published")
    44	      .order("created_at", { ascending: true }),
    45	    supabase.from("weeks").select("week_label, published_at").eq("week_id", weekId).single(),
    46	    userId
    47	      ? supabase
    48	          .from("user_favorites")
    49	          .select("report_id")
    50	          .eq("user_id", userId)
    51	          .eq("report_id", id)
    52	          .maybeSingle()
    53	      : Promise.resolve({ data: null }),
    54	  ]);
    55	  const { data: freeWeek } = await supabase
    56	    .from("weeks")
    57	    .select("week_id, published_at")
    58	    .eq("status", "published")
    59	    .lt("published_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
    60	
```

---

## 2. grep -n "userEmail" "app/weekly/[weekId]/[id]/page.tsx"

```
25:  const { userId, userEmail, tier, subscriptionStartAt } = await getAuthTier();
143:      <ClientLeftNav sections={sections} userEmail={userEmail} tier={tier as "free" | "standard" | "alpha"} />
```

---

## 3. ls components/report/

```
TrendSignalDashboard.tsx
utils.ts
SourcingIntel.tsx
MarketIntelligence.tsx
SupplierContact.tsx
SocialProofTrendIntelligence.tsx
index.ts
constants.ts
```
