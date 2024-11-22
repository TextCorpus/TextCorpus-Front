declare module 'react-cytoscapejs' {
    import { FC } from 'react';
    import { Core, Stylesheet, ElementDefinition, LayoutOptions } from 'cytoscape';
  
    interface CytoscapeComponentProps {
      elements: ElementDefinition[];
      style?: React.CSSProperties;
      layout?: LayoutOptions;
      stylesheet?: Stylesheet | Stylesheet[];
      cy?: (cy: Core) => void;
    }
  
    const CytoscapeComponent: FC<CytoscapeComponentProps>;
    export default CytoscapeComponent;
  }
  