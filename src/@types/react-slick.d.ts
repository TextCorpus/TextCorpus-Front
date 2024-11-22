declare module 'react-slick' {
    import { Component } from 'react';
    interface SliderProps {
      dots?: boolean;
      infinite?: boolean;
      speed?: number;
      slidesToShow?: number;
      slidesToScroll?: number;
      autoplay?: boolean;
      autoplaySpeed?: number;
      responsive?: any[];
    }
  
    export default class Slider extends Component<SliderProps> {}
  }
  