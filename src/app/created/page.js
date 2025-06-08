import { Suspense } from "react";

import Copy from "components/copy";
import Loader from "components/loader";

export default function LinkPage() {
  return (
    <Suspense fallback={<div className="u16 u15"><Loader /></div>}>
      <Copy />
    </Suspense>
  );
};