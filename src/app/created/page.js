import { Suspense } from "react";

import Copy from "components/copy";
import Loader from "components/loader";

export default function LinkPage() {
  return (
    <Suspense fallback={<div className="text-(--primary) font-bold h-126"><Loader /></div>}>
      <Copy />
    </Suspense>
  );
};