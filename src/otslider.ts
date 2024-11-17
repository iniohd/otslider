/*
* (c) 2018 - 2025 iniohd
* Author: Herminio Machava
* Author URL: https://github.com/iniohd
* URL: https://iniohd.github.io/otslider.html
* Version: 3.0.0beta
* License: MIT
*/

import { basicOptions } from './types';
import '../otslider.css';

export default class OTSlider {
    // Default options configs
    private options: basicOptions = {
        element: "ot-slider",
        direction: 'ltr',
        transition: 'slide',
        transitionTiming: "ease",
        prevButton: '&#9001;',
        nextButton: '&#9002;',
        duration: 2000,
        transitionDuration: 500,
        itemsToShow: 1,
        itemsScrollBy : 1,
        padding: 0,
        teasing: 0,
        autoPlay: true,
        pauseOnHover: true,
        showPrevNext: true,
        showNav: true,
        swipe: true,
        swipeFreely: false,
        responsive: true,
        roundButtons: false,
        numericNav: true,
        centered: false,
    };

    private otState = {}

    constructor(options: basicOptions) {
        if ((options && "object" === typeof options)) {
            for (let option in options) {
                this.options[option] = options[option];
            }
        }
    }
}