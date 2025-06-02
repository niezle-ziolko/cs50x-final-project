import { Suspense } from "react";

import Form from "components/form";
import Loader from "components/loader";

export default function Home() {
  return (
    <Suspense fallback={<div className="text-(--primary) font-bold h-126"><Loader /></div>}>
      <Form />
    </Suspense>
  );
};