import { Suspense } from "react";
import { db } from "./firebase/firebaseConfig";
import Router from "./Router";

export default function App() {
  const name = "Shareef";

  return (
    <Suspense
      fallback={
        <div>
          <h1>Loading...</h1>
        </div>
      }
    >
      <Router />
    </Suspense>
  );
}
