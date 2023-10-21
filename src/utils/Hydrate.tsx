"use client";

import { Hydrate as RHydrate, HydrateProps } from "@tanstack/react-query";

function Hydrate(props: HydrateProps) {
  return <RHydrate {...props} />;
}

export default Hydrate;
