import React from 'react';
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';
import { InlineMath, BlockMath } from 'react-katex';

interface HtmlRendererProps {
  html: string;
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ html }) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (domNode.type === 'tag' && domNode.name === 'formula') {
        return <InlineMath math={domNode.children[0].data} />;
      }
      if (domNode.type === 'tag' && domNode.name === 'formula-block') {
        return <BlockMath math={domNode.children[0].data} />;
      }
    },
  };

  return <>{parse(html, options)}</>;
};

export default HtmlRenderer;