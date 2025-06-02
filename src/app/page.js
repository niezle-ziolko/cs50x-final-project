import { Suspense } from "react";

import Form from "components/form";
import Loader from "components/loader";

export default function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <Form />
    </Suspense>
  );
};