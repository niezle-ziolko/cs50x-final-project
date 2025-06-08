import { Suspense } from "react";

import Form from "components/form";
import Loader from "components/loader";

export default function Home() {
  return (
    <Suspense fallback={<div className="u16 u15"><Loader /></div>}>
      <Form />
    </Suspense>
  );
};