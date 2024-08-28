import type { DOMAttributes } from 'react';
import type { SerializedStyles } from '@emotion/serialize';

declare module 'react' {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: SerializedStyles;
  }
  interface SVGAttributes<T> extends DOMAttributes<T> {
    css?: SerializedStyles;
  }
}
