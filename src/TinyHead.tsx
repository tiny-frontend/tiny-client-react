import { TinyFrontendSsrConfig } from "@tiny-frontend/client";
import React from "react";

export interface Props {
  config: TinyFrontendSsrConfig;
}

const TinyHead: React.FC<Props> = ({ config }) => {
  const { cssBundle, jsBundle, moduleConfigScript } = config;
  return (
    <>
      {cssBundle ? <link rel="stylesheet" href={cssBundle} /> : null}
      <link rel="preload" href={jsBundle} as="script" />
      <script dangerouslySetInnerHTML={{ __html: moduleConfigScript }} />
    </>
  );
};
export { TinyHead };
