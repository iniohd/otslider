/*
* (c) 2018 - 2025 iniohd
* Author: Herminio Machava
* Author URL: https://github.com/iniohd
* URL: https://iniohd.github.io/otslider.html
* Version: 3.0.0beta
* License: MIT
*/

/**
 * Optionally slider initialization options type.
 * 
 * @since: initial
 */
export type basicOptions = {
    element: string|HTMLElement,
    direction?: string,
    transition?: string,
    transitionTiming?: string,
    prevButton?: string|HTMLElement,
    nextButton?: string|HTMLElement,
    duration?: number,
    transitionDuration?: number,
    itemsToShow?: number,
    itemsScrollBy?: number,
    padding?: number,
    teasing?: number,
    autoPlay?: boolean,
    pauseOnHover?: boolean,
    showPrevNext?: boolean,
    showNav?: boolean,
    swipe?: boolean,
    swipeFreely?: boolean,
    responsive?: boolean,
    roundButtons?: boolean,
    numericNav?: boolean,
    centered?: boolean,
}

export type 