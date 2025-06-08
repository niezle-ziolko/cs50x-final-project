import { Suspense } from "react";

import Loader from "components/loader";
import Message from "components/message";

export default function MessagePage() {
  return (
    <Suspense fallback={<div className="u16 u15"><Loader /></div>}>
      <Message />
    </Suspense>
  );
};