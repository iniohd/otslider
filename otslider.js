/*
* OneTime Slider copyright 2018 - 2020 inioHD
* Author: Herminio Orlando Machava
* Author URL: https://github.com/iniohd
* URL: https://iniohd.github.io/otslider.html
* Version: 1.1.0
* Description: OneTime Slider(otSlider) is an powerful and intuitive slider
* built from plain/vanilla JS, which is suitable for any type of Web
* Application.
*/
function OTSlider(){
	"use strict";

	var sliderInstID = 0;

	var OTSlider = {
		slideClass : 'ot-slider',
		itemClass : 'ot-item',
		itemsClass : 'ot-items',
		prevNextClass : 'ot-prev-next',
		navClass : 'ot-nav',
		navListClass : 'ot-nav-list',
		slideFPS : 60,
		slideBy : 0,
		slideByReset : 0,
		itemWidth : 0,
		itemSlided : 0,
		itemsSlided : 0,
		totalItemsWidth : 0,
		realEffectDuration : 0,
		effectResetType : 0,
		currentItemIndex : 0,
		targetItemIndex : 0,
		left : 0,
		isSliding : false,
		isFading : false,
		isJumping : false,
		isStartUp: true,
		slideStarted : true,
		slideEffectStarted : true,
		canSlide : true,
		canTransform : false,
		itemStartPosition : [],
		itemEndPosition : [],
		
		configs : {
			element : 'ot-slider',
			direction: 'ltr',
			transition : 'slide',
			transitionTiming: "ease",
			prevButton : '&laquo;',
			nextButton : '&raquo;',
			duration: 2000,
			transitionDuration : 500,
			autoPlay : true,
			pauseOnHover : true,
			showPrevNext : true,
			showNav : true,
			swipe : true,
			responsive : true,
			roundButtons : false,
			numericNav : true
		},
		
		init : function(configs){

			if(sliderInstID > 0)
				throw new Error("The current slider's instance is already in use. Please create another one.");

			sliderInstID++;

			var s, configs = (configs && 'object' === typeof configs) ?
			configs : {};
			
			if(configs.transition && /^(slide|fade)$/i.test(configs.transition))
				this.configs.transition = configs.transition;
			
			if(configs.element && ('string' === typeof configs.element ||
			configs.element.nodeType == 1)){
				this.configs.element = ('string' === typeof configs.element) ?
				configs.element.toLowerCase() : configs.element;
			}
			
			if(configs.prevButton && 'string' === typeof configs.prevButton)
				this.configs.prevButton = configs.prevButton;
			
			if(configs.nextButton && 'string' === typeof configs.nextButton)
				this.configs.nextButton = configs.nextButton;
			
			if(configs.duration && 'number' === typeof configs.duration &&
			configs.duration > 9)
				this.configs.duration = configs.duration;
			
			if(configs.transitionDuration &&
			'number' === typeof configs.transitionDuration)
				this.configs.transitionDuration = configs.transitionDuration;
			
			if('boolean' === typeof configs.showNav)
				this.configs.showNav = configs.showNav;
			
			if('boolean' === typeof configs.showPrevNext)
				this.configs.showPrevNext = configs.showPrevNext;
			
			if('boolean' === typeof configs.responsive)
				this.configs.responsive = configs.responsive;
			
			if(configs.width && 'number' === typeof configs.width)
				this.configs.width = configs.width;
			
			if(configs.height && 'number' === typeof configs.height)
				this.configs.height = configs.height;
			
			if('boolean' === typeof configs.pauseOnHover)
				this.configs.pauseOnHover = configs.pauseOnHover;
			
			if('boolean' === typeof configs.autoPlay)
				this.configs.autoPlay = configs.autoPlay;
			
			if(configs.direction && 'string' === typeof configs.direction &&
			/^(ltr|rtl)$/gi.test(configs.direction))
				this.configs.direction = configs.direction.toLowerCase();
			
			if('boolean' === typeof configs.swipe)
				this.configs.swipe = configs.swipe;
			
			if('boolean' === typeof configs.roundButtons)
				this.configs.roundButtons = configs.roundButtons;
			
			if('boolean' === typeof configs.numericNav)
				this.configs.numericNav = configs.numericNav;

			if(configs.transitionTiming &&
			'string' === typeof configs.transitionTiming)
				this.configs.transitionTiming = configs.transitionTiming;

			this.common();
		},
		
		common : function(){
			var ots = OTSlider;
			
			var loaded = function(){
				//Fisrt we setup the slider
				ots.setupSlider();
				
				//Setup slider's items
				ots.setupItems();
				
				//Setup slider's dimensions and it's items
				ots.setupDimensions();
				
				//Setup the navs
				ots.setupNavs();
				
				//Configure some elements of slider
				ots.setupSlideDOM();
				
				//Slider initialization
				ots.slideInit();
			}

			if(window.addEventListener){
				document.addEventListener("DOMContentLoaded", loaded, false);
			}else{
				document.attachEvent("onreadystatechange", loaded);
			}
		},
		
		setupSlider : function(){
			var b = this.configs.element, e;
			
			//Get the slider container
			e = (b.nodeType == 1) ? b : document.getElementById(b) ||
			this.gecn(document.body, b)[0];

			if(!e){
				throw new Error("Element not found. Please specify an valid"+
				" HTML element or specify its class name or ID.");
			}
			
			//Create slide's reference in our object
			this.slider = e;
			
			//Add the required class attribute in order to style the slide
			this.acn(e, this.slideClass);
			
			//Only set the width or height if it was specified
			if(this.configs.width)
				e.style.width = this.configs.width + "px";
			
			if(this.configs.height)
				e.style.height = this.configs.height + "px";
			
			//Determine if the current Web browser has support for CSS3
			//transformation.
			this.canTransform = this.CSSSupportCheck("transform");

			this.transformPrefix = this.CSSSupportCheck("transform", true);

			this.transitionPrefix = this.CSSSupportCheck("transition", true);
			
			//Determine if the current Web browser has support for modern
			//opacity.
			this.mOpacity = this.CSSSupportCheck("opacity");
			
			//Determine if the current Web browser has support for CSS3
			//transition.
			this.canTransition = this.CSSSupportCheck("transition");
		},
		
		setupItems : function(){
			var s, v, w, x = [], z;
			
			//Get the slider element
			s = this.slider;
			
			//Get the list of direct children of the slider element
			v = s.children;
			
			var i = 0;
			
			while(v[0]){
				if(v[0].nodeType == 1){
					if(v[0].nodeName.toLowerCase() !== "div"){
						z = document.createElement("div");
						
						z.className = this.itemClass+' ot-item-' + i;
						
						z.innerHTML = '<img src="'+v[0].src+'" alt="'+
						v[0].alt+'" draggable="false">';
						
						x[i] = z;
					}else{
						w = v[0];
						
						w.className = this.itemClass+' ot-item-' + i;
						
						x[i] = w;
					}
					
					i++;
				}
				
				v[0].parentNode.removeChild(v[0]);
			}

			//Create the div element which will contain all slider items
			w = document.createElement("div");
			w.className = this.itemsClass;
			w.setAttribute("draggable", "false");

			//Create another div element which will be used as sub container
			z = document.createElement("div");
			z.className = "ot-wrap";
			z.setAttribute("draggable", "false");

			//Append the created sub container into the created cotnainer
			w.appendChild(z);
			
			//Now append all items into created sub container
			for(var i = 0; i < x.length; i++){
				z.appendChild(x[i]);
			}
			
			//Finaly let's append the container with it's children
			s.appendChild(w);
		},
		
		setupNavs : function(){
			var e = [], nlc, nn, s, v, w, x, y, pb, nb;
			
			//Create 2 div elements 
			for(var i = 0, j = 2; i < j ; i++)
				e[i] = document.createElement("div");
			
			//Previous and next Buttons
			v = e[0];
			v.className = this.prevNextClass;

			pb = document.createElement("span");
			pb.className = "ot-prev-button";
			pb.innerHTML = '<span class="ot-wrap-outer"><span class="ot-wrap-inner">'+
			this.configs.prevButton +'</span></span>';
			
			nb = document.createElement("span");
			nb.className = "ot-next-button";
			nb.innerHTML = '<span class="ot-wrap-outer"><span class="ot-wrap-inner">'+
			this.configs.nextButton + '</span></span>';

			v.appendChild(pb);
			v.appendChild(nb);
			
			//Navigation buttons
			w = e[1];
			w.className = this.navClass;
			
			//Get the slider container
			s = this.slider;
			
			x = this.gecn(s, this.itemClass)
			
			y = "<ul>";
			
			//Get the default class name for nav's items
			nlc = this.navListClass;
			
			nn = this.configs.numericNav;
			
			for(var i = 0; i < x.length; i++){
				if(nn)
					y += '<li class="'+ nlc +'">'+ (i + 1) +'</li>';
				else
					y += '<li class="'+ nlc +'"></li>';
			}
			
			y += '</ul>';
			
			w.innerHTML = y;
			
			//Append all created container into slider
			s.appendChild(v);
			s.appendChild(w);
			
			if(!this.configs.showPrevNext){
				v.style.display = "none";
				
				this.acn(s, "prev-next-hidden");
			}
			
			if(!this.configs.showNav){
				w.style.display = "none";
				
				this.acn(s, "nav-list-hidden");
			}
				
			this.addEvents();
		},
		
		setupSlideDOM : function(){
			var a, b, c, d, e;
			
			//Get the slider element
			a = this.slider;

			b = this.gecn(a, this.itemsClass)[0];

			c = this.gecn(b, this.itemClass);
			
			d = c[0].parentElement;

			e = this.gecn(a, this.navListClass);
			
			this.sliderItems = c;
			
			this.sliderItemsParent = d;
			
			this.sliderNavListItems = e;
			
			if(this.configs.roundButtons)
				this.acn(a, "ot-slider-round-buttons");
			
			if(this.configs.numericNav)
				this.acn(a, "ot-slider-numeric-nav");
		},
		
		setupDimensions : function(f){
			f = ('boolean' === typeof f) ? f : false;
			
			var a, b, c, d, p, s, pw, sw, sh;
			
			//Get the slider element
			s = this.slider;
			
			//Get slider's parent element
			p = s.parentElement;
			
			//Get the container of items
			a = this.gecn(s, this.itemsClass)[0];
			
			//Get the items of slider
			b = this.gecn(a, this.itemClass);

			if(!b.length)
				throw new Error("No item found within the slider");

			//Get the direct parent of items
			c = b[0].parentNode;

			//Get the width of the parent of the slider
			pw = p.offsetWidth;

			//Get the demension of the slider
			sw = (this.configs.width) ? this.configs.width : 768;

			sh = (this.configs.height) ? this.configs.height : 320;

			if(!this.isResizing)
				d = sh;

			//Verify if the slider must be responsive or not.
			if(this.configs.responsive){
				//If the specified width is higher than the window we set it to
				//be same as the window.
				sw = (sw >= pw) ? pw : sw;
			}

			if(this.configs.transition === "slide"){
				if(f || this.itemWidth < 1 || this.itemsWidth < 1){
					//Set the width for slider
					s.style.width = sw == pw ? "100%" : sw + "px";

					s.style.height = (sh < d) ? sh + "px" : d + "px";

					//The width of the direct parent of the items must be the
					//total sum of the width of all items.
					this.toggleInlineStyle(c, "width", (b.length * sw) + "px");

					this.totalItemsWidth = b.length * sw;

					this.itemWidth = sw;

					//Set the width each item and positionate each item
					//alongside another.
					for(var i = 0; i < b.length; i++){
						b[i].style.width = sw + "px";

						b[i].style.height = sh + "px";

						b[i].style.left = (sw * i) + "px";

						this.itemStartPosition[i] = sw * i;

						this.itemEndPosition[i] = sw * i + sw
					}
				}
			}else{
				this.itemWidth = sw;

				s.style.width = sw == pw ? "100%" : sw + "px";

				s.style.height = sh + "px";

				for(var i = 0; i < b.length; i++){
					b[i].style.width = sw + "px";

					b[i].style.height = sh + "px";
				}
			}
		},
		
		addEvents : function(){
			var a, b, c, d, e, s, ots;
			
			ots = OTSlider;
			
			//Get the container of slide
			s = this.slider;
			
			a = this.gecn(s, this.navClass)[0];
			
			//Get the list of all buttons from nav
			b = this.gecn(a, this.navListClass);
			
			//Get the container of previous and next button
			c = this.gecn(s, this.prevNextClass)[0];
			
			//Get the previous and next button
			d = c.children;

			e = this.gecn(s, "ot-items");
			
			if(window.addEventListener){
				s.addEventListener("mouseout", function(e){
					ots.resumeSlider(e);}, false);
				
				s.addEventListener("mouseover", function(e){
					ots.pauseSlider(e);}, false);
				
				for(var i = 0; i < b.length; i++){
					b[i].addEventListener("click", function(e){
						ots.navListButton(e);}, false);
				}
				
				for(var i = 0; i < d.length; i++){
					if(d[i].nodeType == 1){
						if(i < 1){
							d[i].addEventListener("click", function(e){
								ots.prevItem(e);}, false);
						}else{
							d[i].addEventListener("click", function(e){
								ots.nextItem(e);}, false);
						}
					}
				}
				
				//We must add swipe events?
				if(this.configs.swipe){
					for(var i = 0; i < e.length; i++){
						e[i].addEventListener("mousedown", ots.swipeStart, false);
						
						e[i].addEventListener("mouseup", ots.swipeEnd, false);
						
						e[i].addEventListener("mousemove", ots.swipeMove, false);
						
						e[i].addEventListener("dragstart", function(e){
							e.preventDefault(); e.stopPropagation();}, false);
							
						e[i].addEventListener("drag", function(e){
							e.preventDefault(); e.stopPropagation();}, false);
							
						e[i].addEventListener("touchstart", ots.swipeStart, false);
						
						e[i].addEventListener("touchend", ots.swipeEnd, false);
						
						e[i].addEventListener("touchcancel", ots.swipeCancel, false);
						
						e[i].addEventListener("touchmove", ots.swipeMove, false);
					}
				}
				
				window.addEventListener("resize", function(){
					ots.resizeHandler();}, false);
			}else{
				s.attachEvent("onmouseout", function(e){
					ots.resumeSlider(e);}, false);
				
				s.attachEvent("onmouseover", function(e){
					ots.pauseSlider(e);}, false);
				
				for(var i = 0; i < b.length; i++){
					b[i].attachEvent("onclick", function(e){
						ots.navListButton(e);}, false);
				}
				
				for(var i = 0; i < d.length; i++){
					if(d[i].nodeType == 1){
						if(i < 1){
							d[i].attachEvent("onclick", function(e){
								ots.prevItem(e);}, false);
						}else{
							d[i].attachEvent("onclick", function(e){
								ots.nextItem(e);}, false);
						}
					}
				}
				
				window.attachEvent("onresize", function(){
					ots.resizeHandler();});
			}
		},
		
		toggleInlineStyle : function(e, p, pv){
			if("undefined" === typeof e || e.nodeType != 1)
				return;
				
			if(!("string" === typeof p &&
			p.replace(/(\s)+|(\s\s)+/gi, "").length))
				return;

			var a, b, c = "", d;

			if(pv && "string" === typeof pv){
				if("undefined" !== typeof e.style[p])
					e.style[p] = pv;
			}else{
				//Get the value of the style attribute of the specified
				//element. And turn it as array where the key is property name.
				a = e.getAttribute("style").toLowerCase();
				a = a.replace(/(\;)$/gi, "");
				a = a.split(";");
				
				for(var i = 0; i < a.length; i++){
					b = a[i].split(":");
				
					if(b[0].replace(/(\s|\s\s)+/gi, "") !== p){
						c = c + b[0] +":"+ b[1] +";";
					}
				}
				
				//We've removed the specified property from the inline style
				e.setAttribute("style", c);
			}
		},

		/*
		* This method return true if the specified HTML element has the
		* specified inline style property. Else returb false.
		* @param: e [object] - HTML element.
		* @param: p [string] - inline style property that must be checked is set.
		*/
		hasInlineStyleProperty : function(e, p){
			if(!(e && e.nodeType == 1))
				throw new Error("The target HTML element wasn't specified");

			if(!(p && "string" === typeof p))
				throw new Error("CSS property that must be checked wasn't specified");

			var pp = ["", "-moz-", "-webkit-", "-o-", "-ms-"];
			pp.reverse();

			for(var i = 0; i < pp.length; i++){
				if(e.style[pp[i] + p] && e.style[pp[i] + p].length)
					return true;
			}

			return false;
		},

		CSSSupportCheck : function(p, rp){
			if(!(p && "string"  === typeof p))
				throw new Error("CSS property wasn't specified");

			rp = (rp && "boolean" === typeof rp) ? rp : false;

			var pp = ["-ms-", "-o-", "-webkit-", "-moz-", ""],
			e = document.createElement("div");

			for(var i = (pp.length - 1); i > 0; i--){
				if(e.style[pp[i] + p] !== "undefined")
					return rp ? pp[i] : true;
			}

			return false;
		},

		slideInit : function(){
			if(this.sliderItems.length <= 1){
				this.canSlide = false;
				return;
			}

			this.isSliding = this.isFading = this.isJumping =
			this.isResizing = false;
			
			var a, b, c, e, f, g, h, j, k, t, tp, items;
			
			a = this.itemWidth;
			
			b = this.totalItemsWidth;
			
			e = this.configs.transitionDuration;
			
			f = this.slideFPS;
			
			//Get all items within slider
			items = this.sliderItems;
			
			//The parent element of items
			g = this.sliderItemsParent;
			
			//The amount of time in miliseconds that each frame is displayed
			this.realEffectDuration = (e / f) / (e / 1000);
			
			this.slideBy = (a / f) / (e / 1000);
			
			this.slideByReset = (b / f) / (e / 1000);
			
			if(this.isStartUp){
				//This tell us if the current Web browser has support
				//for CSS3 transformation
				t = this.canTransform;

				tp = this.transformPrefix;

				if(this.configs.direction === 'rtl'){
					this.currentItemIndex = this.sliderItems.length - 1;
					
					//The current active item index
					c = this.currentItemIndex;
					
					//This array contain the beginning of left  absolute
					//position of each item.
					h = this.itemStartPosition;

					j = h[c];
					j = (j - j * 2);
					
					if(this.configs.transition === "slide"){
						if(t){
							this.toggleInlineStyle(g, tp + "transform", "translate(" + j +"px, 0)");
						}else{
							this.toggleInlineStyle(g, "left", j + "px");
						}
						
						this.left = j;
					}
					
					this.acn(items[c], "active");
				}else{
					if(this.configs.transition === "slide"){
						if(t){
							this.toggleInlineStyle(g, tp + "transform", "translate(0, 0)");
						}else{
							g.style.left = 0;
						}
						
						this.left = 0;
					}
				}
				
				//The list of button from nav
				k = this.sliderNavListItems;
				
				//Add the active class to the index of displayed item
				this.acn(k[this.currentItemIndex], "active");
				
				if(this.configs.transition === "slide")
					this.isStartUp = false;
			}
			
			if(this.configs.transition === 'slide'){
				//Carousel Slide
				this.carousel();
			}else{
				//Fade slide
				this.fade();
			}
		},
		
		carousel : function(){
			if(!this.configs.autoPlay)
				return;
			
			var a, b, d, ots = OTSlider;
			
			a = ots.canTransition;

			b = ots.configs.direction;

			d = ots.configs.duration;

			if(a){
				if(b === "ltr"){
					ots.slideStarted = setInterval(ots.dynamicTransition, d);
				}else{
					ots.slideStarted =
					setInterval(function(){ots.dynamicTransition(false);}, d);
				}
			}else{
				if(b === "ltr"){
					ots.slideStarted = setInterval(ots.carouselStart, d);
				}else{
					ots.slideStarted =
					setInterval(function(){ots.carouselStart(false);}, d);
				}
			}
		},
		
		fade : function(){
			var a, d, e, f, g, mo, dur, ots = OTSlider, fps;
			
			if(this.isStartUp){
				mo = this.mOpacity;
			
				//Get the list of all items
				a = this.sliderItems
			
				//Get the list of all items
				d = this.sliderItems;
			
				//Get the list of buttons of nav
				e = this.sliderNavListItems;
				
				f = this.configs.transitionDuration;
			
				//If the direction is ltr(lert to right), we start from the
				//first item(difault) else we start from the last item.
				g = (this.configs.direction === "ltr") ? 0 : a.length - 1;
			
				//Add the active class to the first or last item element
				for(var i = 0; i < d.length; i++){
					if(i == g){
						this.acn(d[i], "active");
					
						if(mo){
							d[i].style.opacity = 1;
						}else{
							d[i].style.filter = "alpha(opacity=100)";
						}
					
						this.acn(e[i], "active");
					
						this.currentItemIndex = i;
					}else{
						if(mo){
							d[i].style.opacity = 0;
						}else{
							d[i].style.filter = "alpha(opacity=0)";
						}
					}
				}
				
				//Get effect's FPS
				fps = this.slideFPS;
				
				//Determine the value that must incremented/descremented on
				//each frame of the fade effect.
				this.slideFadeBy = (1 / (fps * (f / 1000)));
				
				//Determine the amount of time in miliseconds that each frame
				//is displayed.
				this.realEffectDuration = (f / (fps * (f / 1000)));
			
				//This will determine if the ongoing effect is completed or
				//not yet.
				this.fadeEffectCompleted = 0;
			
				this.isStartUp = false;
			}
			
			dur = this.configs.duration;
			
			if(!this.configs.autoPlay)
				return;
			
			if(this.configs.direction === "ltr"){
				this.slideStarted = setInterval(ots.fadeStart, dur);
			}else{				
				this.slideStarted = setInterval(function(){
					ots.fadeStart(false);}, dur);
			}
		},
		
		fadeStart  : function(f, jumpTo){
			f = ('boolean' === typeof f) ? f : true;
			
			var a, b, d, e, ots = OTSlider;
			
			//Get the total number of items within the slider
			a = ots.sliderItems
			
			//Get the index of the current item
			b = ots.currentItemIndex;
			
			d = ots.realEffectDuration;
			
			//Get all nav items
			e = ots.sliderNavListItems;
			
			if(ots.isFading || ots.isJumping)
				return;
			
			if(ots.slideStarted){
				clearInterval(ots.slideStarted);
				
				if(ots.fadeEffectCompleted)
					ots.stopFadeEffect();
			}
			
			if(typeof jumpTo !== "undefined" && jumpTo.nodeType == 1){
				for(var i = 0; i < a.length; i ++){
					if(e[i] == jumpTo)
						ots.targetItemIndex = i; 
				}
			}else{
				//Determine the index of the target item
				if(ots.configs.direction === "ltr"){
					if(f){
						ots.targetItemIndex = a[b + 1] ? b + 1 : 0;
					}else{
						ots.targetItemIndex = a[b - 1] ? b - 1 : a.length - 1;
					}
				}else{
					if(f){
						ots.targetItemIndex = a[b + 1] ? b + 1 : 0;
					}else{
						ots.targetItemIndex = a[b - 1] ? b - 1 : a.length - 1;
					}
				}
			}

			if(ots.canTransition){
				ots.dynamicTransition(null, f)
			}else{
				ots.isFading = true;
				ots.slideEffectStarted = setInterval(ots.fadeEffect, d);
			}
		},
		
		fadeEffect : function(){
			var a, b, c, d, e, o, ots = OTSlider;
			
			//Get all the items of the slider
			a = ots.sliderItems
			
			//Get the index of the current item
			b = ots.currentItemIndex;
			
			//Get the index of the target item
			c = ots.targetItemIndex;
			
			//Get the value that will be used to increment/descrement the
			//opacity of the items.
			d = ots.slideFadeBy;
			
			e = ots.fadeEffectCompleted;
			
			o = ots.mOpacity;
			
			if((e + d) >= 1){
				//Completly hide the item that was displayed and completly
				//show the target item.
				if(o){
					a[b].style.opacity = 0;
					a[c].style.opacity = 1
				}else{
					a[b].style.filter = "alpha(opacity=0)";
					a[c].style.filter = "alpha(opacity=100)";
				}
				
				ots.stopFadeEffect();
			}else{
				if(o){
					a[b].style.opacity = 1 - (e + d);
					a[c].style.opacity = e + d;
				}else{
					a[b].style.filter = "alpha(opacity=" + (100 - ((e + d) * 100)) + ")";
					a[c].style.filter = "alpha(opacity=" + (e + d) * 100 + ")";
				}
				
				ots.fadeEffectCompleted += d;
			}
		},

		stopFadeEffect : function(){
			var a, b, d, e, f, o, ots = OTSlider;
			
			a = ots.sliderItems;
			
			b = ots.sliderNavListItems;
			
			d = ots.configs.duration;
			
			e = ots.targetItemIndex;
			
			f = ots.currentItemIndex;
			
			o = ots.mOpacity;
			
			if(ots.isFading){
				if(o){
					a[f].style.opacity = 0
				}else{
					a[f].style.filter = "alpha(opacity=0)";
				}
			}
			
			for(var i = 0; i < a.length; i++){
				if(e == i){
					ots.acn(a[i], "active");
					ots.acn(b[i], "active");
					
					if(o){
						a[i].style.opacity = 1;
					}else{
						a[i].style.filter = "alpha(opacity=100)";
					}
				}else{
					ots.rcn(a[i], "active");
					ots.rcn(b[i], "active");
				}
			}
			
			//Stop fade effect, because we're already done
			clearInterval(ots.slideEffectStarted);
			
			//Because we're done, the index of the target item will now be
			//the current item.
			ots.currentItemIndex = e;
			
			if(ots.slideStarted)
				clearInterval(ots.slideStarted);
			
			//Reset some values
			ots.isSliding = ots.isJumping = ots.isFading =
			ots.fadeEffectCompleted = ots.slideStarted =
			ots.slideEffectStarted = false;
			
			ots.targetItemIndex = null;
			
			if(ots.configs.autoPlay){
				if(ots.configs.direction === "ltr"){
					ots.slideStarted = setInterval(ots.fadeStart, d);
				}else{
					ots.slideStarted = setInterval(function(){
						ots.fadeStart(false);}, d);
				}
			}
		},

		carouselStart : function(f){
			if(this.isSliding || this.isJumping)
				return false;
			
			f = ('boolean' === typeof f) ? f : true;
			
			var a, b, d, l, fl, ots = OTSlider;
			
			//This is the interval of time that create the frames of effect
			d = this.realEffectDuration;
			
			//Get the current left absolute position of items parent
			l = this.left;
			
			//Get the module of left position
			fl = l - l * 2;
			
			//Get the width of slider
			a = this.itemWidth;
			
			//Get the sum of width of all items
			b = this.totalItemsWidth;
			
			this.itemSlided = a;
			
			this.itemsSlided = b - a;

			this.isSliding = true;

			if(f){
				if(fl >= b - a){
					//Perform the reset of forward moviment of slide
					this.slideEffectStarted = setInterval(
						ots.carouselResetForward, d);
				}else{
					//perform the forward moviment of slide
					this.slideEffectStarted = setInterval(
						ots.carouselForward, d);
				}
			}else{
				if(fl <= 0){
					//Perform the reset backward moviment of slide
					this.slideEffectStarted = setInterval(
						ots.carouselResetBackward, d);
				}else{
					//Perform the backward moviment of slide
					this.slideEffectStarted = setInterval(
						ots.carouselBackward, d);
				}
			}
		},

		carouselForward : function(){
			var a , b, f, g, j, l, fl, t, z, tp, ss;
			
			a = this.sliderItemsParent;
			
			b = this.slideBy;
			
			g = this.itemStartPosition;
			
			l = this.left;
			
			fl = (l > 0) ? (l - l * 2) : l;
			
			f = this.itemSlided;
			
			t = this.canTransform;

			tp = this.transformPrefix;
			
			ss = this.slideStarted;
			
			this.itemSlided = f - b;
			
			if(f - b <= 0){
				j = this.currentItemIndex;
				
				j = j + 1;
				
				this.currentItemIndex = j;
				
				z = g[j];
				
				z = z - z * 2;
				
				if(t){
					this.toggleInlineStyle(a, tp + "transform",
					"translate(" + z + "px, 0)");
				}else{
					a.style.left = z + "px";
				}
				
				this.left = z;
				
				this.stopSlideEffect();
				
			}else{
				if(t){
					this.toggleInlineStyle(a, tp + "transform",
					"translate(" + (fl - b) + "px, 0)");
				}else{
					a.style.left = (fl - b) + "px";
				}
				
				this.left = fl - b;
				
				if(ss){
					clearInterval(ss);
				}
			};
		},

		carouselResetForward : function(){
			var a, b, c, l, t, fl, tp;
			
			a = this.sliderItemsParent;
			
			b = this.slideByReset;
			
			l = this.left;
			
			fl = (l > 0) ? (l - l * 2) : l;
			
			c = this.itemsSlided;
			
			t = this.canTransform;

			tp = this.transformPrefix;
			
			this.itemsSlided = c - b;

			if(c - b <= 0){
				this.currentItemIndex = 0;
				
				if(t){
					this.toggleInlineStyle(a, tp + "transform", "translate(0, 0)");
				}else{
					a.style.left = 0;
				}

				this.left = 0;
				
				this.stopSlideEffect();
			}else{
				if(t){
					this.toggleInlineStyle(a, tp + "transform",
					"translate("+ (fl + b) + "px, 0)");
				}else{
					a.style.left = (fl + b) + "px";
				}
			
				this.left = fl + b;
			}
		},

		carouselBackward : function(){
			var a, b, c, e, f, j, l, t, tp;
			
			a = this.sliderItemsParent;
			
			b = this.slideBy;
			
			c = this.itemStartPosition;
			
			l = this.left;
			
			e = this.itemSlided;
			
			t = this.canTransform;

			tp = this.transformPrefix;
			
			this.itemSlided = e - b;
			
			if(e - b <= 0){
				f = this.currentItemIndex;
				
				f = f - 1;
				
				this.currentItemIndex = f;

				j = c[f];
				
				j = j - j * 2;
				
				if(t){
					this.toggleInlineStyle(a, tp + "transform",
					"translate("+ j + "px, 0)");
				}else{
					a.style.left = j + "px";
				}
				
				this.left = j;
				
				this.stopSlideEffect();
			}else{
				if(t){
					this.toggleInlineStyle(a, tp + "transform",
					"translate("+ (l + b) + "px, 0)");
				}else{
					a.style.left = (l + b) + "px";
				}
				
				this.left = l + b;
				
				if(this.slideStarted)
					clearInterval(this.slideStarted);
			}
		},

		carouselResetBackward : function(){
			var a, b, c, f, g, h, l, t, tp;
			
			a = this.sliderItemsParent;
			
			b = this.slideByReset;
			
			c = this.itemStartPosition;
			
			f = this.itemsSlided;
			
			t = this.canTransform;

			tp = this.transformPrefix;
			
			this.itemsSlided = f - b;
			
			l = this.left;
			
			if(f - b <= 0){
				g = c.length - 1;
				
				this.currentItemIndex = g;

				h = c[g];
				
				h = h - h * 2;
				
				if(t){
					this.toggleInlineStyle(a, tp + "transform",
					"translate("+ h + "px, 0)");
				}else{
					a.style.left = h + "px";
				}
				
				this.left = h;
				
				this.stopSlideEffect();
			}else{
				if(t){
					this.toggleInlineStyle(a, tp + "transform",
					"translate("+ (l - b) + "px, 0)");
				}else{
					a.style.left = (l - b) + "px";
				}
				
				this.left = l - b;
				
				if(this.slideStarted){
					clearInterval(this.slideStarted);
				}
			}
		},

		carouselJumpTo : function(){
			if(this.isSliding || this.isJumping)
				return;
			
			var d, f, ots = OTSlider;
			
			d = this.realEffectDuration;
			
			f = (this.slideJumpToDistance < 0) ? true : false;
			
			if(ots.canTransition){
				ots.dynamicTransition();
			}else{
				this.isJumping = true;

				if(f){
					//Perform forward jump
					this.slideEffectStarted = setInterval(
						ots.carouselJumpToForward, d);
				}else{
					//Perform backward jump
					this.slideEffectStarted = setInterval(
						ots.carouselJumpToBackward, d);
				}
			}
		},

		carouselJumpToForward : function(){
			var a, b, c, d, l, t, x, tp;
			
			a = this.sliderItemsParent;
			
			b = this.slideJumpToBy;
			
			b = (b < 0) ? (b - b * 2) : b;
			
			d = this.slideJumpToDistance;
			
			//If the value of distance is negative. Let's return it's module
			//which is positive.
			c = (d < 0) ? (d - d * 2) : d;
			
			this.slideJumpToDistance = c - b;
			
			t = this.slideJumpTo;
			
			l = this.left;
			
			x = this.canTransform;

			tp = this.transformPrefix;
			
			if((c - b) <= 0){
				t = t - t * 2;
				
				if(x){
					this.toggleInlineStyle(a, tp + "transform",
					"translate(" + t + "px, 0)");
				}else{
					a.style.left = t + "px";
				}
				
				this.left = t;
				
				this.currentItemIndex = this.slideJumpToItemIndex;
				
				this.stopSlideEffect();
			}else{
				if(x){
					this.toggleInlineStyle(a, tp + "transform",
					p + "translate(" + (l - b) + "px, 0)");
				}else{
					a.style.left = (l - b) + "px";
				}
				
				this.left = l - b;
				
				if(this.slideStarted)
					clearInterval(this.slideStarted);
			}
		},

		carouselJumpToBackward : function(){
			var a, b, d, e, l, t, x, tp;
			
			//Get the direct parect of items
			a = this.sliderItemsParent;
			
			//Each frame perform one step of this value
			b = this.slideJumpToBy;
			b = (b < 0) ? (b - b * 2) : b;
			
			//Get the distance that remain in order to reach the item target
			d = this.slideJumpToDistance;
			e = (d < 0) ? (d - d * 2) : d;
			
			//The position of our target
			t = this.slideJumpTo;
			t = (t > 0) ? (t - t * 2) : t;
			
			//Get the current left absolute position of items parent
			l = this.left;
			
			x = this.canTransform;

			tp = this.transformPrefix;
			
			this.slideJumpToDistance = e - b;
			
			if((e - b) <= 0){
				this.currentItemIndex = this.slideJumpToItemIndex;
				
				if(x){
					this.toggleInlineStyle(a, tp + "transform",
					"translate(" + t + "px, 0)");
				}else{
					a.style.left = t + "px";
				}
				
				this.left = t;
				
				this.stopSlideEffect();
			}else{
				
				if(x){
					this.toggleInlineStyle(a, tp + "transform",
					"translate(" + (l + b) + "px, 0)");
				}else{
					a.style.left = (l + b)+"px";
				}
				
				this.left = (l + b);
				
				if(this.slideStarted)
					clearInterval(this.slideStarted);
			}
		},

		dynamicTransition : function(x, fw){
			var a, b, c, d, e, f, g, tp, ots = OTSlider, ttp;

			if(ots.isSliding || ots.isFading || ots.isJumping || ots.isResizing)
				return;

			clearInterval(ots.slideEffectStarted);
			
			if(ots.slideStarted)
				clearInterval(ots.slideStarted);

			fw = ("boolean" === typeof fw) ? fw : true;

			ttp = ots.transitionPrefix;

			f = ots.configs.transitionDuration;

			if(ots.configs.transition === "slide"){
				ots.isSliding = true;

				a = ots.sliderNavListItems;

				//Get the left position of each item within slider
				b = ots.itemStartPosition;

				c = ots.currentItemIndex;
				
				d = ots.sliderItemsParent;


				if(x && x.nodeType == 1){
					for(var i = 0; i <= a.length; i++){
						if(a[i] == x)
							e = b[i];
					}
				}else{
					if("number" === typeof ots.slideJumpTo){
						e = Math.abs(ots.slideJumpTo);
					}else{
						x = ("boolean" === typeof x) ? x : true;

						if(x){
							e = (b[c + 1]) ? b[c + 1] : b[0];
						}else{
							e = ("number" === typeof b[c - 1]) ? b[c - 1] : b[b.length - 1];
						}
					}
				}

				ots.left = e = (e != 0) ? e - e * 2 : e;

				g = "transform " + ots.configs.transitionTiming + " " + f + "ms";

				tp = ots.transformPrefix;


				ots.toggleInlineStyle(d, ttp + "transition", g);
				ots.toggleInlineStyle(d, tp + "transform", "translate(" + e + "px, 0)");

				ots.isSliding = true;

				for(var i = 0; i < b.length; i++){
					if(b[i] == Math.abs(e))
						ots.currentItemIndex = i;
				}

				if(window.ontransitionend){
					d.ontransitionend = function(){
						ots.dynamicTransitionTrack();
					};
				}else{
					ots.slideEffectStarted = setInterval(ots.dynamicTransitionTrack,
					f + 200);
				}
			}else{
				ots.isFading = true;

				a = ots.currentItemIndex;

				b = ots.targetItemIndex;

				c = ots.sliderItems;

				g = ots.sliderNavListItems;

				if(a == b)
					return;

				d = ots.configs.transitionDuration;

				e = ots.configs.transitionTiming;

				ots.toggleInlineStyle(c[a], ttp + "transition", "opacity " + d + "ms " + e);
				ots.toggleInlineStyle(c[b], ttp + "transition", "opacity " + d + "ms " + e);

				ots.toggleInlineStyle(c[a], "opacity", "0");
				ots.toggleInlineStyle(c[b], "opacity", "1");

				if(window.ontransitionend){
					c[b].ontransitionend = function(){
						ots.dynamicTransitionTrack();
					};
				}else{
					ots.slideEffectStarted = setInterval(
						ots.dynamicTransitionTrack, f + 200);
				}
			}
		},

		dynamicTransitionTrack : function(){
			var ots = OTSlider, e, ttp;

			if(ots.configs.transition === "slide"){
				e = ots.sliderItemsParent;

				ttp = ots.transitionPrefix;

				ots.toggleInlineStyle(e, ttp + "transition");

				ots.stopSlideEffect();
			}else{
				e = ots.sliderItems;

				ots.toggleInlineStyle(e[ots.currentItemIndex], "transition");
				ots.toggleInlineStyle(e[ots.targetItemIndex], "transition");

				ots.stopFadeEffect();
			}

		},

		stopSlideEffect : function(x){
			x = ('boolean' === typeof x) ? x : true;
			
			var ots = OTSlider, d, t;

			t = ots.canTransition;
			
			//Stop slide effect
			clearInterval(ots.slideEffectStarted);
			
			ots.slideTrack();
			
			if(x){
				d = ots.configs.duration;
				
				if(ots.slideStarted)
					clearInterval(ots.slideStarted);
				
				if(this.configs.autoPlay){
					if(ots.configs.direction === "ltr"){
						ots.slideStarted = (t) ?
						setInterval(ots.dynamicTransition, d) :
						setInterval(ots.carouselStart, d);
					}else{
						ots.slideStarted = (t) ?
						setInterval(function(){ots.dynamicTransition(false);}, d) :
						setInterval(function(){ots.carouselStart(false);}, d);
					}
				}
			}
		},

		slideTrack : function(){
			var a, b, c, ots = OTSlider;
			
			c = ots.currentItemIndex;
			
			a = ots.sliderItems;
			
			b = ots.sliderNavListItems;
			
			for(var i = 0; i < a.length; i++){
				if(i == c){
					//Add the class that is used to identify the current
					//displayed item on slide.
					ots.acn(a[i], "active");
					ots.acn(b[i], "active");
				}else{
					//Remove the active class on non displayed items
					ots.rcn(a[i], "active");
					ots.rcn(b[i], "active");
				}
			}
			
			//Make sure that the left position is correctly set to 0. If we
			//are at the first item.
			if(c == 0)
				ots.left = 0;
			
			if(ots.configs.transition === "slide"){
				ots.slideJumpTo = ots.slideJumpToItemIndex = null;
			}

			ots.isSliding = ots.isJumping = ots.isResizing = false;

			ots.canSlide = true;

			if(ots.dragEvents && ots.dragEvents.dragStart)
				ots.dragEvents.dragStart = 0;
		},

		navListButton : function(e){
			if(window.preventDefault)
				e.preventDefault();
			
			if(window.stopPropagation)
				e.stopPropagation();
			
			if(!this.canSlide)
				return;
			
			if(this.isSliding || this.isFading || this.isJumping)
				return;
			
			//Get the element on which the event occurred
			e = e.target || e.srcElement;
			
			var a, b, c, g, h, l, t;
			
			if(this.configs.transition === "slide"){
				a = this.itemStartPosition;
			
				c = this.sliderNavListItems;
			
				for(var i = 0; i < c.length; i++){
					if(c[i] == e){
						e = i;
						t = a[i];
					}
				}
			
				//Return if click on the button that is the reference of
				//current displayed item.
				if(e == this.currentItemIndex)
					return;
				
				this.slideJumpTo = t;
				
				this.slideJumpToItemIndex = e;
				
				//Get the current left absolute position of our carousel
				l = Math.abs(this.left);
				
				//Get the distance between the current displayed item and that
				//we wish to go.
				g = t - l;
				
				//Fix the value of distance
				g = g - g * 2;
				
				h = this.slideFPS;
				
				b = this.configs.transitionDuration;
				
				this.slideJumpToBy = (g / h) / (b / 1000);
				
				this.slideJumpToDistance = g;
				
				this.carouselJumpTo();
			}else{
				if(this.hcn(e, "active"))
					return;
				
				this.fadeStart(true, e);
			}
		},
		
		prevItem : function(e){
			if(window.preventDefault)
				e.preventDefault();
			
			if(window.stopPropagation)
				e.stopPropagation();
			
			if(!this.canSlide)
				return;
			
			if(this.slideStarted)
				clearInterval(this.slideStarted);
			
			//Show the previous item
			if(this.configs.transition === "slide"){
				if(this.canTransition)
					this.dynamicTransition(false);
				else
					this.carouselStart(false);
			}else{
				this.fadeStart(false);
			}
		},
		
		nextItem : function(e){
			if(window.preventDefault)
				e.preventDefault();
			
			if(window.stopPropagation)
				e.stopPropagation();
			
			if(!this.canSlide)
				return;
			
			if(this.slideStarted)
				clearInterval(this.SlideStarted);
			
			//Show the next item
			if(this.configs.transition === "slide"){
				if(this.canTransition)
					this.dynamicTransition();
				else
					this.carouselStart();
			}else{
				this.fadeStart();
			}
		},
		
		pauseSlider : function(e){
			if(window.preventDefault)
				e.preventDefault();
			
			if(!this.configs.pauseOnHover)
				return;
			
			if(this.slideStarted)
				clearInterval(this.slideStarted);
		},
		
		resumeSlider : function(e){
			if(window.preventDefault)
				e.preventDefault();
			
			if(!this.canSlide)
				return;
			
			if(!this.configs.pauseOnHover)
				return;
			
			var d, t, ots = OTSlider;

			t = ots.canTransition;

			d = ots.configs.duration;
			
			if(this.slideStarted)
				clearInterval(this.slideStarted);
			
			if(this.configs.autoPlay){
				if(this.configs.transition === "slide"){
					if(this.configs.direction === "ltr"){
						this.slideStarted = (t) ?
						setInterval(ots.dynamicTransition, d) :
						setInterval(ots.carouselStart, d);
					}else{
						this.slideStarted = (t) ?
						setInterval(function(){ots.dynamicTransition(false);}, d) :
						setInterval(function(){ots.carouselStart(false);}, d);
					}
				}else{
					if(this.isFading)
						return
					
					if(this.configs.direction === "ltr"){
						this.slideStarted = setInterval(ots.fadeStart, d);
					}else{
						this.slideStarted = setInterval(function(){
							ots.fadeStart(false);}, d);
					}
				}
			}
		},
		
		swipeStart : function(x){
			x.preventDefault();
			
			x.stopPropagation();
			
			var ct, ots = OTSlider;
			
			if(ots.isSliding || ots.isFading || ots.isJumping)
				return;
			
			if(ots.slideStarted)
				clearInterval(ots.slideStarted);

			//Get the current touch elements
			ct = (x.changedTouches) ? x.changedTouches[0] : x;
			
			//Create new object with current finger position on x or y eixes.
			ots.swipeEvents = {
				pageX : ct.pageX,
				pageY : ct.pageY,
				startX : ct.pageX,
				startY : ct.pageY,
				startLeft : ots.left,
				startTimestamp : new Date().getTime(),
				endTimestamp : 0,
				totalSwiped : 0,
				totalSwipedPerc : 0,
				isTouch : (x.type.toLowerCase() === "touchstart") ?
				true : false
			};
			
			ots.isSliding = true;
		},
		
		swipeEnd : function(x){
			x.preventDefault();
			
			var a, b , c, d, e, f, se, sp, ots = OTSlider;
			
			if(!(ots.swipeEvents && ots.swipeEvents.pageX))
				return;
			
			se = ots.swipeEvents;
			
			//Set the end timestamp of the swipe event
			se.endTimestamp = new Date().getTime();
			
			//Total swiped distance in percents
			sp = se.totalSwipedPerc;
			
			a = ots.itemStartPosition;
			
			b = ots.currentItemIndex;
			
			c = ots.itemWidth;
			
			if(ots.configs.transition === "slide"){
				if(sp != 0 && se.totalSwiped != 0){
					if(sp < 0){
						//Swiped to Left
						if(sp <= -45){
							ots.slideJumpTo = a[b + 1];
							ots.slideJumpToItemIndex = b + 1
						}else{
							ots.slideJumpTo = a[b];
							ots.slideJumpToItemIndex = b;
						}
					}else{
						//Swiped to Right
						if(sp >= 45){
							ots.slideJumpTo = a[b - 1];
							ots.slideJumpToItemIndex = b - 1;
						}else{
							ots.slideJumpTo = a[b];
							ots.slideJumpToItemIndex = b;
						}
					}
					
					ots.swipeReset();
				}else{
					if(Math.abs(ots.left) < a[a.length - 1] &&
					((sp != 0 && se.totalSwiped == 0) ||
					(sp == 0 && se.totalSwiped != 0))){
						ots.left = a[a.length - 1] - a[a.length - 1] * 2;
					}
						
					ots.stopSlideEffect();
				}
			}else{
				ots.swipeReset();
			}
			
			ots.swipeEvents = {};
		},
		
		swipeCancel : function(x){
			x.preventDefault();

			ots.swipeEnd();
		},
		
		swipeMove : function(x){
			x.preventDefault();
			
			var ots = OTSlider;
			
			if(!(ots.swipeEvents && ots.swipeEvents.pageX))
				return;
			
			var a, b, c, l, t, z, ip, sb, se, sd, sp, ct, ts, tp, psx,
			psy, csx, csy, ci, li, rl;
			
			//Get the previous swipe details
			se = ots.swipeEvents;
			
			if("boolean" !== typeof se.isTouch)
				return;
			
			//Get the current swipe datails
			ct = (x.changedTouches) ? x.changedTouches[0] : x;
			
			//Get the previous finger position at x or y eixes
			psx = se.pageX;
			psy = se.pageY;
			
			//Get the current finger position at x or y eixes
			csx = ct.pageX;
			csy = ct.pageY
			
			//Let's get swiped direction
			sd = ots.swipeDirection(psx, psy, csx, csy);
			
			if("number" === typeof sd){
				//Get the index of the current displayed item
				ci = ots.currentItemIndex;
				
				//Get the start position of all items
				c = ots.itemStartPosition;
				
				//Get the start left position of the last slider item
				li = c[c.length - 1];
				
				if(ots.configs.transition === "slide"){
					//Get the parent element of items
					ip = ots.sliderItemsParent;
					
					//Get the total swiped distance
					ts = se.totalSwiped;
					
					//Get the current left position
					l = ots.left;
					
					b = ots.itemWidth;
					
					//Let's determine the distance that the user have swiped
					sb = Math.abs(se.pageX - ct.pageX);
					
					l = (sd == 0) ? l - sb : l + sb;
					
					ts = (sd == 0) ? ts - sb : ts + sb;
					
					//Determine the total swiped distance in percents
					ots.swipeEvents.totalSwipedPerc = sp =
					Math.floor((l - se.startLeft) / b * 100);
					
					t = ots.canTransform;

					tp = ots.transformPrefix;
					
					if(sd == 0){
						if(Math.abs(l) > li){
							if(t)
								ots.toggleInlineStyle(ip, tp + "transform",
								"translate(-" + li + "px, 0)");
							else
								ip.style.left = "-" + li + "px"
							
							ts = 0;
						}else{
							
							z = c[ci] + b;
							z = z - z * 2;
							
							if(sp > -100){
								if(t)
									ots.toggleInlineStyle(ip, tp + "transform",
									"translate(" + l + "px, 0)");
								else
									ip.style.left = l + "px";
								
								ots.left = l;
							}else{
								if(t)
									ots.toggleInlineStyle(ip, tp + "transform",
									"translate(" + z + "px, 0)");
								else
									ip.style.left = z + "px";
								
								ots.left = z;
								
								ts = b - b * 2;
							}
						}
					}else{
						if(l > 0){
							if(t)
								ots.toggleInlineStyle(ip, tp + "transform",
								"translate(0, 0)");
							else
								ip.style.left = "0";
							
							ots.left = ts = 0;
						}else{
							z = c[ci] - b;
							z = z - z * 2;
							
							if(sp < 100){
								if(t)
									ots.toggleInlineStyle(ip, tp + "transform",
									"translate(" + l + "px, 0)");
								else
									ip.style.left = l+"px";
								
								ots.left = l;
							}else{
								if(t)
									ots.toggleInlineStyle(ip, tp + "transform",
									"translate(" + z + "px, 0)");
								else
									ip.style.left = z+"px";
								
								ots.left = z;
								
								ts = b;
							}
						}
					}
					
					rl = ots.left;
					
					ots.left = (rl > 0) ? rl - rl * 2 : rl;
				}else{
					//Get the total swiped distance
					ts = se.totalSwiped;
					
					//Determine the last swiped distance
					sb = Math.abs(se.pageX - ct.pageX);
					
					ts = (sd == 0) ? ts - sb : ts + sb;
					
					//Determine the total swiped distance in percents
					ots.swipeEvents.totalSwipedPerc = sp =
					Math.floor((ct.pageX - se.startX) / ots.itemWidth * 100);
				}
				
				ots.swipeEvents.totalSwiped = ts;
			}
			
			//We're done at this time, so let's save the current finger's
			//position. In order to use it the next time as previous finger's
			//position.
			ots.swipeEvents.pageX = csx;
			ots.swipeEvents.pageY = csy;
		},
		
		swipeReset : function(){
			var a, b, c, d, e, f, l, z, tp, ots = OTSlider;
			
			if(ots.configs.transition === "slide"){
				a = ots.slideJumpTo;
				
				a = Math.abs(a) - Math.abs(a) * 2;
			
				b = ots.slideJumpToItemIndex;
				
				l = ots.left;
			
				if(l == a){
					ots.currentItemIndex = b;
					
					ots.stopSlideEffect();
				
					return;
				}

				c = ots.itemWidth / ots.slideFPS;
				
				e = ots.swipeEvents;
				
				//Determine the amount of time that the swipe event took in
				//milisecods.
				d = Math.abs(e.endTimestamp - e.startTimestamp);
				
				z = (d < ots.configs.transitionDuration) ?
				d / ots.slideFPS : ots.realEffectDuration;

				if(ots.canTransition){
					f = ots.sliderItemsParent;

					d = Math.max(180, Math.min(d, ots.configs.transitionDuration));
					
					ots.toggleInlineStyle(f, ots.transitionPrefix + "transition",
					"transform " + d + "ms ease-out");

					ots.toggleInlineStyle(f, ots.transformPrefix + "transform",
					"translate(" + a + "px, 0)");

					ots.left = a;

					ots.currentItemIndex = b;

					if(window.ontransitionend){
						f.ontransitionend = function(){
							ots.dynamicTransitionTrack();
						};
					}else{
						ots.slideEffectStarted = setInterval(
							ots.dynamicTransitionTrack, d + 200);
					}
				}else{
					ots.slideEffectStarted = setInterval(function(){
						var t, x, s = ots.sliderItemsParent;
					
						l = ots.left;
						
						t = ots.canTransform;

						tp = ots.transformPrefix;
					
						if(l > a){
							//Go to the left
							x = l - c;
						
							if(x <= a){
								if(t)
									ots.toggleInlineStyle(s, tp + "transform",
									"translate(" + a + "px, 0)");
								else
									s.style.left = a + "px";
							
								ots.currentItemIndex = b;
							
								ots.left = a;
							
								ots.stopSlideEffect();
							}else{
								if(t)
									ots.toggleInlineStyle(s, tp + "transform",
									"translate(" + x + "px, 0)");
								else
									s.style.left = x + "px";
							}
						}else{
							//Go to the right
							x = l + c;
						
							if(x >= a){
								if(t)
									ots.toggleInlineStyle(s, tp + "transform",
									"translate(" + a + "px, 0)");
								else
									s.style.left = a + "px";
							
								ots.currentItemIndex = b;
							
								ots.left = a;
							
								ots.stopSlideEffect();
							}else{
								if(t)
									ots.toggleInlineStyle(s, tp + "transform",
									"translate(" + x + "px, 0)");
								else
									s.style.left = x + "px";
							}
						}
						
						ots.left = x;
					}, z);
				}
			}else{
				a = ots.swipeEvents;
				
				b = a.totalSwipedPerc;
				
				//Determine the amount of time that the swipe evrnt to took.
				//The result is in milisecods.
				c = Math.abs(a.endTimestamp - a.startTimestamp);

				ots.isSliding = false;
				
				if(b >= 25 || (b >= 5 && c <= 500)){
					ots.fadeStart(false);
				}else if(b <= -25 || (b <= 5 && c <= 500)){
					ots.fadeStart();
				}else{
					ots.swipeEvents = {};
				}

			}
		},
		
		/*
		* Desc: This method is used to determine the swipe direction, by
		* compare the previous and the current finger position. If the
		* current finger position is higher than the previous finger
		* position. It means that the user have swiped to the right direction
		* else to the left.
		* @param: psx [integer] - The previous finger's position on x eixes.
		* @param: psy [integer] - The previous finger's position on y eixes.
		* @param: csx [integer] - The current finger's position on x eixes.
		* @param: csy [integer] - The current finger's position on y eixes.
		* Return: integer | null
		*/
		swipeDirection : function(psx, psy, csx, csy){
			if(!("number" === typeof psx && "number" === typeof psy &&
			"number" === typeof csx && "number" === typeof csy)){
				return
			}
			
			return (csx > psx) ? 1 : (csy < psx) ? 0 : null;
		},
		
		resizeHandler : function(){
			var a, b, c, d, t, tp;
			
			this.isResizing = true;
			
			if(this.slideStarted)
				clearInterval(this.slideStarted);
			
			//We must recalculate the dimensions of the slider and it's items
			//each time the window get resized.
			this.setupDimensions(true);
			
			//The array which contain the start position of each item
			a = this.itemStartPosition;
			
			//Get the current displayed item
			b = this.currentItemIndex;
			
			c = this.sliderItemsParent;
			
			t = this.canTransform;
			
			if(this.configs.transition === "slide"){
				d = a[b];

				//If the current position of the parent of items is negative,
				//we must keep it negative else positive.
				d = (/(\-)/.test(this.left)) ? (d - d * 2) : d;

				tp = this.transformPrefix;
				
				if(t){
					this.toggleInlineStyle(c, tp +"transform",
					"translate("+ d +"px, 0)");
				}else{
					this.toggleInlineStyle(c, "left", d +"px");
				}
			
				this.left = d;
			}
			
			this.slideInit();
		},
		
		//This method is used to check if the specified HTML element has the
		//specific class.
		hcn : function(e, c){
			if(!(e && e.nodeType == 1))
				throw new Error("No element specified on hcn method");

			if(!(c && "string" === typeof c))
				throw new Error("The className was not specified on hcn method");
	
			//Create any array that contain all the classes of the specified
			//HTML element.
			var x = e.className.split(" ");
			
			for(var i = 0; i <= x.length; i++){
				if(/[A-Za-z0-9]/i.test(x[i]) && x[i] === c)
					return true;
			}
				
			return false;
		},
		
		//This method id used to remove the specified className from the
		//specified HTML element.
		rcn : function(e, c){
			if(!(e && e.nodeType == 1))
				throw new Error("No element specified on rcn method");
			
			if(!(c && "string" === typeof c))
				throw new Error("The className was not specified on rcn method");
			
			//Create any array of all classes of the specified HTML element
			var x = e.className.split(" ");
			
			for(var i = 0; i <= x.length; i++){
				if(/[A-Za-z0-9]/i.test(x[i]) && x[i] === c)
					x[i] = "";
			}
			
			e.className = x.join(" ").replace(/(\s\s+|\s)/gi, " ").
			replace(/^(\s)|(\s)$/gi, "");
		},
		
		//This method is used to add a specified class to specified HTML
		//element.
		acn : function(e, c){
			if(!(e && e.nodeType == 1))
				throw new Error("The element was not specified or is invalid.");
			
			if(!(c && "string" === typeof c))
				throw new Error("The class must be valid string.");
			
			var x = e.className.split(" ");
			
			for(var i = 0; i < x.length; i++){
				if(/[A-Za-z0-9]/gi.test(x[i]) && x[i] === c)
					x[i] = "";
			}
			
			//Add the specified class to the array
			x[x.length + 1] = c;
			
			e.className = x.join(" ").replace(/(\s\s+|\s)/gi, " ").
			replace(/^(\s)|(\s)$/gi, "");
		},
		
		//This method has the same function as getElementsByClassName
		gecn : function(e, c){
			if(!(e && e.nodeType == 1))
				throw new Error("The first argument must be an HTML element");
			
			if(!(c && "string" === typeof c))
				throw new Error("The className is undefined");
			
			c = c.split(" ").join(".");
			
			if(c !== "*")
				c = "."+c;
			
			return e.querySelectorAll(c);
		}
	};
	
	return OTSlider;
};