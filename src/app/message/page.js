import { Suspense } from "react";

import Loader from "components/loader";
import Message from "components/message";

export default function MessagePage() {
  return (
    <Suspense fallback={<div className="text-(--primary) font-bold h-126"><Loader /></div>}>
      <Message />
    </Suspense>
  );
};