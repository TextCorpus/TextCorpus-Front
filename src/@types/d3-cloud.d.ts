declare module 'd3-cloud' {
  export interface Word {
    text: string;
    size: number;
    x?: number;
    y?: number;
    rotate?: number;
  }

  export interface Cloud<T = Word> {
    size: (size: [number, number]) => this;
    words: (words: T[]) => this;
    font: (font: string | ((word: T) => string)) => this;
    fontSize: (size: number | ((word: T) => number)) => this;
    fontWeight: (weight: string | number | ((word: T) => string | number)) => this;
    rotate: (rotate: ((word: T) => number) | number) => this;
    padding: (padding: number | ((word: T) => number)) => this;
    spiral: (spiral: 'archimedean' | 'rectangular' | ((size: [number, number]) => (t: number) => [number, number])) => this;
    random: (random: () => number) => this;
    on: (type: 'word' | 'end', listener: (data: T[]) => void) => this;
    start: () => this;
  }

  export default function cloud<T = Word>(): Cloud<T>;
}
