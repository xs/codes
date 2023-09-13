import React from "react";

interface Props {
  contexts: Array<{
    ContextProvider: React.JSXElementConstructor<React.PropsWithChildren<any>>;
    value: any;
  }>;
  children: React.ReactNode;
}

export default function ComposeContext(props: Props): JSX.Element {
  const { contexts = [], children } = props;

  return (
    <>
      {contexts.reduceRight((acc, element) => {
        const { ContextProvider, value } = element;
        return <ContextProvider value={value}>{acc}</ContextProvider>;
      }, children)}
    </>
  );
}
