/*
* (c) 2018 - 2021 inioHD
* Author: Herminio Machava
* Author URL: https://github.com/iniohd
* URL: https://iniohd.github.io/otslider.html
* Version: 2.1.0
* License: MIT
*/

function OTSlider() {
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
		itemWidth : 0,
		totalItemsWidth : 0,
		realEffectDuration : 0,
		currentItemIndex : 0,
		targetItemIndex : 0,
		slideStarted : 0,
		slideEffectStarted : 0,
		left : 0,
		isSliding : false,
		isFading : false,
		isStartUp: true,
		canSlide : true,
		canTransform : false,
		itemStartPosition : [],
		itemEndPosition : [],
		
		configs: {
			element : 'ot-slider',
			direction: 'ltr',
			transition : 'slide',
			transitionTiming: "ease",
			prevButton : '&#9001;',
			nextButton : '&#9002;',
			duration: 2000,
			transitionDuration : 500,
			itemsToShow : 1,
			itemsScrollBy : 1,
			padding : 0,
			teasing : 0,
			autoPlay : true,
			pauseOnHover : true,
			showPrevNext : true,
			showNav : true,
			swipe : true,
			swipeFreely : false,
			responsive : true,
			roundButtons : false,
			numericNav : true,
			centered : false,
		},
		
		init : function(configs){

			if(sliderInstID > 0)
				throw new Error("The current slider's instance is already in use. Please create another one.");

			sliderInstID++;

			var configs = (configs && 'object' === typeof configs) ?
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

			if(configs.itemsToShow && 'number' === typeof configs.itemsToShow)
				this.configs.itemsToShow = configs.itemsToShow;

			if(configs.itemsScrollBy && 'number' === typeof configs.itemsScrollBy)
				this.configs.itemsScrollBy = configs.itemsScrollBy;

			if('boolean' === typeof configs.centered)
				this.configs.centered = configs.centered;

			if(configs.padding && 'number' === typeof configs.padding)
				this.configs.padding = configs.padding;

			if(configs.teasing && 'number' === typeof configs.teasing)
				this.configs.teasing = configs.teasing;

			if('boolean' === typeof configs.swipeFreely)
				this.configs.swipeFreely = configs.swipeFreely;

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
				document.addEventListener("readystatechange", function(){
					if(document.readyState.toLowerCase() !== "loading" && !ots.slider){
						loaded();
					}
				});
			}else{
				document.attachEvent("onreadystatechange", function(){
					if(document.readyState.toLowerCase() !== "loading" && !ots.slider){
						loaded();
					}
				});
			}
		},
		
		setupSlider : function(){
			var b = this.configs.element, e;
			
			//Get the slider container
			e = (b.nodeType == 1) ? b : document.getElementById(b) ||
			this.gecn(document.body, b)[0];

			if(!e){
				throw new Error("Element not found. Please specify an valid" +
				" HTML element or specify its class name or ID.");
			}
			
			//Create slide's reference in our object
			this.slider = e;
			
			//Add the required class attribute in order to style the slide
			this.acn(e, this.slideClass);
			
			e.setAttribute("data-running", "true");
			
			//Only set the width or height if it was specified
			if(this.configs.width)
				e.style.width = this.configs.width + "px";
			
			if(this.configs.height)
				e.style.height = this.configs.height + "px";

			this.configs.itemsScrollBy = Math.min(this.configs.itemsToShow,
			this.configs.itemsScrollBy);
			
			//Determine if the current Web browser has support for CSS3 transformation.
			this.canTransform = this.CSSSupportCheck("transform");

			this.transformPrefix = this.CSSSupportCheck("transform", true);

			this.transitionPrefix = this.CSSSupportCheck("transition", true);
			
			//Determine if the current Web browser has support for modern opacity.
			this.mOpacity = this.CSSSupportCheck("opacity");
			
			//Determine if the current Web browser has support for CSS3 transition.
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
					if(v[0].nodeName.toLowerCase() == "img"){
						z = document.createElement("div");
						
						z.className = this.itemClass+' ot-item-' + i;
						
						z.innerHTML = '<img src="'+ v[0].src +'" alt="'+ v[0].alt +'" draggable="false">';
						
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

			//Create a div element which will contain all slider items
			w = document.createElement("div");
			w.className = this.itemsClass;
			w.setAttribute("draggable", "false");

			//Create another div element which will be used as sub container
			z = document.createElement("div");
			z.className = "ot-wrap";
			z.setAttribute("draggable", "false");

			//Append the created sub container into the created container
			w.appendChild(z);
			
			//Now append all items into the created sub container
			for(var i = 0; i < x.length; i++){
				z.appendChild(x[i]);
			}
			
			//Finaly let's append the container with its children
			s.appendChild(w);

			this.acn(s, "ot-" + this.configs.transition + "-transition");
		},
		
		setupNavs : function(){
			var e = [], nlc, nn, s, v, w, x, y, pb, nb, its, isb, tni;
			
			//Create 2 div elements 
			for(var i = 0, j = 2; i < j ; i++)
				e[i] = document.createElement("div");
			
			//Previous and next Buttons
			v = e[0];
			v.className = this.prevNextClass;
			v.style.display = "none";

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
			w.style.display = "none";
			
			//Get slider's container
			s = this.slider;
			
			x = this.gecn(s, this.itemClass)

			its = this.configs.itemsToShow;

			isb = this.configs.itemsScrollBy;

			//Determing the number of nav buttons to be displayed according
			//to the items.
			tni = (x.length - its) / isb + 1;

			tni = /(\.)/.test(tni) ? Math.floor(tni + 1) : tni;

			tni = (this.configs.transition === "slide") ? tni : x.length;

			//Get the default class name for nav's items
			nlc = this.navListClass;
			
			nn = this.configs.numericNav;
			
			y = "<ul>";

			for(var i = 0; i < tni; i++){
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
			
			var a, b, c, p, s, t, pw, sw, sh, iw, its, ip, dw, dh, wd;
			
			//Get the slider element
			s = this.slider;
			
			//Get slider's parent element
			p = s.parentElement;
			
			//Get the container of items
			a = this.gecn(s, this.itemsClass)[0];
			
			//Get the items of the slider
			b = this.gecn(a, this.itemClass);

			if(!b.length)
				throw new Error("No item found within the slider");

			//Get the direct parent of items
			c = b[0].parentNode;

			//Get the width of the parent of the slider
			pw = p.offsetWidth;

			its = this.configs.itemsToShow;

			ip = this.configs.padding;

			t = this.configs.teasing / its;

			//if((this.isStartUp && !this.configs.width) || pw < this.configs.width){
				//this.configs.width = pw;
			//}

			//Get the demension of the slider
			dw = sw = (this.configs.width) ? this.configs.width : pw;

			dh = sh = (this.configs.height) ? this.configs.height : null;

			//Get a lower width between the dafault width and the current one.
			wd = Math.min(pw, dw);

			//Verify if the slider must be responsive or not.
			if(this.configs.responsive){
				//If the specified width is higher than the window or slider's parent element. We
				//set it to be the same as window's or parent's width.
				sw = Math.min(sw, pw);

				//Determine the apropriate height of the slider according to
				//the current slider's width.
				if("number" === typeof sh)
					sh = (dh / dw) * wd;

				if(pw <= wd){
					s.style.width = "100%";
					sw = s.offsetWidth;
				}
			}

			if(this.configs.transition === "slide"){
				if(f || this.itemWidth < 1 || this.itemsWidth < 1){
					//Set the width for slider
					s.style.width = (sw == pw) ? "100%" : sw + "px";

					if(sh)
						s.style.height = sh + "px";

					iw = sw / its - t;

					//The width of the direct parent of the items must be the
					//total sum of the width of all items.
					this.toggleInlineStyle(c, "width", (b.length * iw) + "px");

					this.totalItemsWidth = b.length * iw;

					this.itemWidth = iw;

					//Set the width of each item and positionate each item
					//alongside another.
					for(var i = 0; i < b.length; i++){
						b[i].style.width = iw + "px";
						
						if(sh)
							b[i].style.height = sh + "px";

						if(ip > 0)
							b[i].style.padding = "0 " + ip + "px";

						this.itemStartPosition[i] = iw * i;

						this.itemEndPosition[i] = iw * i + iw;
					}
				}
			}else{
				this.itemWidth = sw;

				s.style.width = sw == pw ? "100%" : sw + "px";

				if(!sh && f || !sh)
					sh = this.getItemsHeight(false, true);

				s.style.height = sh + "px";

				for(var i = 0; i < b.length; i++){
					b[i].style.width = sw + "px";
				}
			}
		},

		getItemsHeight : function(asArray, descOrder){
			asArray = ("boolean" === typeof asArray) ? asArray : true;

			descOrder = ("boolean" === typeof descOrder) ? descOrder : false;

			var ots = OTSlider, a = [], b;

			b = ots.gecn(ots.slider, ots.itemClass);

			for(var i = 0; i < b.length; i++){
				a.push(b[i].offsetHeight);
			}

			if(descOrder){
				a.sort(function(a, b){
					return b - a;
				});
			}

			return (asArray) ? a : a[0];
		},

		updateSliderHeight : function(x){
			var ots = OTSlider
			
		//Only update the height if it was not specified
		if(!ots.configs.height)
			ots.setupDimensions(true);
			
			ots.showNavs();
		},
		
		showNavs : function(){
			var ots = OTSlider, nav, pn;
			
			//Get the container of previous and next buttons
			pn = ots.gecn(ots.slider, ots.prevNextClass);
			
			//Get the container of nav elements
			nav = ots.gecn(ots.slider, ots.navClass);
			
			if(ots.configs.showPrevNext){
				if(pn && pn.length)
					ots.toggleInlineStyle(pn[0], "display", "block");	
			}
			
			if(ots.configs.showNav){
				if(nav && nav.length)
					ots.toggleInlineStyle(nav[0], "display", "block");				
			}
		},

		addEvents : function(){
			var a, b, c, d, e, il, s, ots;
			
			ots = OTSlider;
			
			//Get slider's container
			s = this.slider;
			
			a = this.gecn(s, this.navClass)[0];
			
			//Get the list of all buttons from nav
			b = this.gecn(a, this.navListClass);
			
			//Get the container of previous and next buttons
			c = this.gecn(s, this.prevNextClass)[0];
			
			//Get the previous and next buttons
			d = c.children;

			e = this.gecn(s, this.itemsClass);
			
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

			//Get items' list
			il = this.gecn(s, this.itemClass);

			for(var i = 0; i < il.length; i++){
				if(il[i].getElementsByTagName("img")[0]){
					il[i].getElementsByTagName("img")[0].onload = function(){
						ots.updateSliderHeight(this);
					};
				}
			}
		},
		
		toggleInlineStyle : function(e, p, pv){
			if("undefined" === typeof e || e.nodeType != 1)
				return;
				
			if(!("string" === typeof p &&
			p.replace(/(\s)+|(\s\s)+/gi, "").length))
				return;

			var a, b, c = "";

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
					
					if(b[0].replace(/(\s|\s\s)+/gi, "") !== p && b[1]){
						c = c + b[0] +":"+ b[1] +";";
					}
				}
				
				//We've removed the specified property from the inline style
				e.setAttribute("style", c);
			}
		},

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
			
			var a, b, c, e, f, h, j, k, items, its, ti;
			
			a = this.itemWidth * this.configs.itemsScrollBy;
			
			b = this.totalItemsWidth;
			
			e = this.configs.transitionDuration;
			
			f = this.slideFPS;
			
			//Get all items within slider
			items = this.sliderItems;
			
			//The amount of time in miliseconds that each frame is displayed
			this.realEffectDuration = (e / f) / (e / 1000);
			
			this.slideBy = (a / f) / (e / 1000);
			
			this.slideByReset = (b / f) / (e / 1000);
			
			ti = this.sliderItems.length;

			its = this.configs.itemsToShow;

			if(this.isStartUp){
				if(this.configs.direction === 'rtl'){
					this.currentItemIndex = (ti > its) ? ti - its : 0;
					
					//The current active item index
					c = this.currentItemIndex;
					
					//This array contain the beginning of left  absolute
					//position of each item.
					h = this.itemStartPosition;

					j = h[c];
					j = this.dynamicLeft(j - j * 2);
					
					if(this.configs.transition === "slide"){
						this.__setSliderLeft(j);
						
						this.left = j;
					}
					
					this.acn(items[c], "active");
				}else{
					if(this.configs.transition === "slide"){
						this.__setSliderLeft(0);
						
						this.left = 0;
					}
				}
				
				//The list of button from nav
				k = this.sliderNavListItems;
				
				//Add the active class to the index(es) of displayed item(s)
				this.acn(k[(this.configs.direction === "ltr") ? 0 : k.length - 1], "active");
				
				if(this.configs.transition === "slide"){
					this.isStartUp = false;

					this.canSlide = (ti > its) ? true : false;
				}
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
			if(!this.configs.autoPlay || !this.canSlide)
				return;
			
			var a, b, d, ots = OTSlider;
			
			a = ots.canTransition;

			b = ots.configs.direction;

			d = ots.configs.duration;

			if(a){
				if(b === "ltr"){
					ots.slideStarted = setInterval(ots.dynamicTransition, d);
				}else{
					ots.slideStarted = setInterval(function(){
						ots.dynamicTransition(false);}, d);
				}
			}else{
				if(b === "ltr"){
					ots.slideStarted = setInterval(function(){ots.genericSlide(true);}, d);
				}else{
					ots.slideStarted =
					setInterval(function(){ots.genericSlide(false);}, d);
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

						//Let's show the current displayed item
						d[i].style.display = "block";

						this.acn(e[i], "active");
					
						this.currentItemIndex = i;
					}else{
						if(mo){
							d[i].style.opacity = 0;
						}else{
							d[i].style.filter = "alpha(opacity=0)";
						}

						//let's hide the items that are current not displayed
						d[i].style.display = "none";
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
			
			d = (ots.swipeDuration && "number" === ots.swipeDuration) ?
			ots.swipeDuration / ots.slideFPS : ots.realEffectDuration;
			
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
				//Let's show the target item
				a[ots.targetItemIndex].style.display = "block";

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
					a[c].style.opacity = 1;
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
					a[c].style.filter = "alpha(opacity=" + ((e + d) * 100) + ")";
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

					a[i].style.display = "none";
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
			
			ots.targetItemIndex = ots.swipeDuration = null;
			
			if(ots.configs.autoPlay){
				if(ots.configs.direction === "ltr"){
					ots.slideStarted = setInterval(ots.fadeStart, d);
				}else{
					ots.slideStarted = setInterval(function(){
						ots.fadeStart(false);}, d);
				}
			}
		},

		genericSlide : function(f, jump){
			var ots = OTSlider, d, isp, dd, sjt;

			if(ots.isSliding)
				return;

			if(ots.canTransition){
				ots.dynamicTransition();
			}else{
				isp = ots.itemStartPosition;

				if("boolean" === typeof f){
					//Get the index of the target item index
					ots.currentItemIndex = ots.dynamicTargetIndex(f);
				}else{
					f = (Math.abs(ots.left) < ots.slideJumpTo) ? true : false;
				}

				ots.slideJumpTo = sjt = Math.abs(ots.dynamicLeft(isp[ots.currentItemIndex]));

				//Fix fallback transition
				if(!jump){
					if(f){
						f = (ots.currentItemIndex == 0) ? false : true;

						jump = !f ? true : false;
					}else{
						f = (ots.currentItemIndex == isp.length - ots.configs.itemsToShow) ?
						true : false;

						jump = f ? true : false;
					}
				}

				d = ("number" === typeof ots.swipeDuration) ?
				ots.swipeDuration / ots.slideFPS : ots.realEffectDuration;

				//Get the diferente between the current left position and the
				//target left position.
				dd = Math.abs(ots.left) - Math.abs(sjt);

				ots.slideJumpToBy = Math.abs(
					(dd / ots.slideFPS) /(ots.configs.transitionDuration / 1000));

				ots.isSliding = true;

				ots.slideEffectStarted = setInterval(function(){
					ots.genericSlideFrame(f, jump);
				}, d);
			}
		},

		genericSlideFrame : function(f, jump){
			var ots = OTSlider, l, fv, sjt;

			//Get the value of frame
			fv = jump ? ots.slideJumpToBy : ots.slideBy;

			//Get the left target
			sjt = ots.slideJumpTo;

			l = Math.abs(ots.left);

			l = (f) ? l + fv : l - fv;

			if((f && l >= sjt) || (!f && l <= sjt)){

				sjt = (sjt) ? sjt : ots.dynamicLeft(
					ots.itemStartPosition[ots.currentItemIndex]);

				ots.__setSliderLeft(sjt);

				ots.left = sjt;

				ots.stopSlideEffect();
			}else{
				ots.__setSliderLeft(l);

				ots.left = l;
			}
		},

		dynamicTransition : function(x, fw){
			var a, b, c, d, e, f, g, k, ots = OTSlider, ttp;

			if(ots.isSliding || ots.isFading || ots.isResizing)
				return;

			clearInterval(ots.slideEffectStarted);
			
			if(ots.slideStarted)
				clearInterval(ots.slideStarted);

			fw = ("boolean" === typeof fw) ? fw : true;

			ttp = ots.transitionPrefix;

			f = (ots.swipeDuration && "number" === typeof ots.swipeDuration) ?
			ots.swipeDuration : ots.configs.transitionDuration;

			if(ots.configs.transition === "slide"){
				ots.isSliding = true;

				a = ots.sliderNavListItems;

				//Get the left position of each item within slider
				b = ots.itemStartPosition;

				k = ots.itemEndPosition;

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

						e = b[ots.dynamicTargetIndex(x)];
					}
				}

				for(var i = 0; i < b.length; i++){
					if((Math.abs(e) >= b[i]) && (Math.abs(e) < (k[i])))
						ots.currentItemIndex = i;
				}

				ots.left = e = ots.dynamicLeft(e);

				g = ttp + "transform " + ots.configs.transitionTiming + " " +
				f + "ms";

				ots.toggleInlineStyle(d, ttp + "transition", g);
				ots.__setSliderLeft(e);

				ots.isSliding = true;

				if(window.ontransitionend){
					d.ontransitionend = function(){
						ots.dynamicTransitionTrack();
					};
				}else{
					ots.slideEffectStarted =
					setInterval(ots.dynamicTransitionTrack, f + 200);
				}
			}else{
				ots.isFading = true;

				a = ots.currentItemIndex;

				b = ots.targetItemIndex;

				c = ots.sliderItems;

				g = ots.sliderNavListItems;

				if(a == b)
					return;

				d = (ots.swipeDuration && "number" === typeof ots.swipeDuration)
				? ots.swipeDuration : ots.configs.transitionDuration;

				e = ots.configs.transitionTiming;

				//Unhide the target item
				ots.toggleInlineStyle(c[b], "display", "block");

				setTimeout(function(){
					ots.toggleInlineStyle(c[a], ttp + "transition",
					"opacity " + d + "ms " + e);
					ots.toggleInlineStyle(c[b], ttp + "transition",
					"opacity " + d + "ms " + e);

					ots.toggleInlineStyle(c[a], "opacity", "0");
					ots.toggleInlineStyle(c[b], "opacity", "1");
				}, 50);

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

			ttp = ots.transitionPrefix;

			if(ots.configs.transition === "slide"){
				e = ots.sliderItemsParent;

				ots.toggleInlineStyle(e, ttp + "transition");

				ots.stopSlideEffect();
			}else{
				e = ots.sliderItems;

				ots.toggleInlineStyle(e[ots.currentItemIndex], ttp + "transition");
				ots.toggleInlineStyle(e[ots.targetItemIndex], ttp + "transition");

				ots.stopFadeEffect();
			}
		},

		dynamicTargetIndex : function(f){
			var ots = OTSlider, a, b, c, d, g;

			a = ots.configs.itemsToShow;

			b = ots.configs.itemsScrollBy;

			c = ots.currentItemIndex;

			d = ots.sliderItems.length;

			if(f){
				if(d > (c + a)){
					for(var i = 0; i < b; i++){
						if((c + 1 + a + i) > d){
							g = c + i;
							break;
						}else{
							g = c + 1 + i;
						}
					}
				}else{
					g = 0;
				}
			}else{
				if(c > 0){
					for(var i = b; i > 0; i--){
						if(c - i >= 0){
							g = c - i;
							break;
						}else{
							g = c - i;
						}
					}
				}else{
					g = d - a;
				}
			}

			return g;
		},

		dynamicLeft : function(targetLeft){
			if('number' !== typeof targetLeft)
				return;

			var a, b, c, d, e, its;

			a = this.configs.teasing;

			b = this.itemStartPosition;

			//Get the index of the current item
			c = this.currentItemIndex;

			//Get slider's direction
			d = this.configs.direction;

			its = this.configs.itemsToShow;

			targetLeft = Math.abs(targetLeft);

			if(targetLeft == b[b.length - its])
				e = b.length;

			if(targetLeft){
				targetLeft = (d === "rtl" || e == b.length) ? targetLeft - a :
				targetLeft;

				if(this.configs.centered){
					if(d === "ltr")
						targetLeft -= (b[c + its]) ? a / 2 : 0;
					else
						targetLeft += (b[c + its]) ? a / 2 : 0;

					/*
					* Prevent the target left position to be higher than the total width of all
					* items, minus the current width of the slider.
					*/
					if(Math.abs(targetLeft) > (this.totalItemsWidth - this.slider.offsetWidth))
						targetLeft = this.totalItemsWidth - this.slider.offsetWidth;
				}
			}

			return targetLeft - (targetLeft * 2);
		},

		/*
		* Desc: This method return the index of the current displayed item
		* according to the left position.
		*/
		dynamicItemIndex : function(l){
			var ots = OTSlider, t, x, iw, isp, its, tiw, index, z;
			
			l = ("number" === typeof l) ? l : ots.left;
			l = Math.abs(l);

			t = ots.configs.teasing;

			iw = ots.itemWidth;

			tiw = ots.totalItemsWidth;

			isp = ots.itemStartPosition;

			its = ots.configs.itemsToShow;

			x = tiw - (iw * its + t);

			z = (ots.configs.centered) ? t / 2 : t;

			if(l >= x){
				index = isp.length - its;
			}else{
				for(var i = 0; i < isp.length; i++){
					if(ots.configs.direction === "ltr"){
						if(l >= isp[i] && l <= isp[i] + iw)
							index = i;
					}else{
						if(l >= isp[i] - z && l <= isp[i] + iw + z)
							index = i;
					}
				}
			}
			
			return index;
		},

		__setSliderLeft :function(l){
			if("number" !== typeof l)
				return;

			var e, p, ots = OTSlider;

			e = ots.sliderItemsParent;

			p = ots.transformPrefix;

			l = (l > 0) ? l - l * 2 : l;

			if(ots.canTransform){
				ots.toggleInlineStyle(e, p + "transform",
				"translate(" + l + "px, 0)");
			}else{
				ots.toggleInlineStyle(e, "left", l + "px");
			}
		},

		stopSlideEffect : function(x){
			x = ('boolean' === typeof x) ? x : true;
			
			var ots = OTSlider, d, t;

			t = ots.canTransition;
			
			//Stop slide effect
			clearInterval(ots.slideEffectStarted);
			clearInterval(ots.slideStarted);
			
			ots.slideTrack();
			
			if(x){
				if(this.configs.autoPlay){
					d = ots.configs.duration ;

					if(ots.configs.direction === "ltr"){
						ots.slideStarted = (t) ?
						setInterval(ots.dynamicTransition, d) :
						setInterval(function(){ots.genericSlide(true);}, d);
					}else{
						ots.slideStarted = (t) ?
						setInterval(function(){ots.dynamicTransition(false);}, d) :
						setInterval(function(){ots.genericSlide(false);}, d);
					}
				}
			}
		},

		slideTrack : function(){
			var a, b, c, ots = OTSlider, isb;
			
			c = ots.currentItemIndex;
			
			a = ots.sliderItems;
			
			b = ots.sliderNavListItems;

			isb = ots.configs.itemsScrollBy;
			
			for(var i = 0; i < a.length; i++){
				if(i == c){
					//Add the class that is used to identify the current
					//displayed item on slide.
					ots.acn(a[i], "active");
				}else{
					//Remove the active class on non displayed items
					ots.rcn(a[i], "active");

					//Hide the non displayed items if the slider is set to
					//used fade transition.
					if(ots.configs.transition === "fade")
						a[i].style.display = "none";
				}
			}

			for(var i = 0; i < b.length; i++){
				if(i == (/(\.)/gi.test(c / isb) ? Math.floor(c / isb + 1) : c / isb)){
					ots.acn(b[i], "active");
				}else{
					ots.rcn(b[i], "active");
				}
			}

			ots.swipeDuration = null;
			
			if(ots.configs.transition === "slide")
				ots.slideJumpTo = ots.slideJumpToItemIndex = ots.slideJumpToBy = null;

			ots.isSliding = ots.isResizing = false;

			if(ots.dragEvents && ots.dragEvents.dragStart)
				ots.dragEvents.dragStart = 0;
		},

		navListButton : function(e){
			if(window.preventDefault)
				e.preventDefault();
			
			if(window.stopPropagation)
				e.stopPropagation();
			
			if(!this.canSlide || this.isSliding || this.isFading)
				return;
			
			//Get the element on which the event occurred
			e = e.target || e.srcElement;
			
			var a, c, t, ti, isb, its;
			
			if(this.configs.transition === "slide"){
				a = this.itemStartPosition;
			
				c = this.sliderNavListItems;

				isb = this.configs.itemsScrollBy;

				its = this.configs.itemsToShow;

				ti = this.sliderItems.length;
			
				for(var i = 0; i < c.length; i++){
					if(c[i] == e){
						if((c.length - 1) == i){
							e = (ti > its) ? ti - its : c;
							t = a[e];
						}else{
							e = i * isb;
							t = a[i * isb];
						}
					}
				}
			
				//Return if click on the button that is the reference of
				//current displayed item.
				if(e == this.currentItemIndex)
					return;
				
				this.slideJumpTo = t;
				
				this.currentItemIndex = e;
				
				this.genericSlide(null, true);
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
			
			clearInterval(this.slideStarted);
			
			//Show the previous item
			if(this.configs.transition === "slide"){
				if(this.canTransition)
					this.dynamicTransition(false);
				else
					this.genericSlide(false);
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
			
			clearInterval(this.SlideStarted);
			
			//Show the next item
			if(this.configs.transition === "slide"){
				if(this.canTransition)
					this.dynamicTransition();
				else
					this.genericSlide(true);
			}else{
				this.fadeStart();
			}
		},
		
		pauseSlider : function(e){
			if(window.preventDefault)
				e.preventDefault();

			var ots = OTSlider;
			
			if(!ots.configs.pauseOnHover)
				return;
			
			clearInterval(ots.slideStarted);
		},
		
		resumeSlider : function(e){
			if(window.preventDefault)
				e.preventDefault();
			
			var d, t, ots = OTSlider;

			if(!ots.canSlide)
				return;
			
			if(!ots.configs.pauseOnHover)
				return;
			
			clearInterval(ots.slideStarted);

			t = ots.canTransition;
			
			if(ots.configs.autoPlay){
				d = ots.configs.duration;

				if(ots.configs.transition === "slide"){
					if(ots.configs.direction === "ltr"){
						ots.slideStarted = (t) ?
						setInterval(ots.dynamicTransition, d) :
						setInterval(function(){ots.genericSlide(true);}, d);
					}else{
						ots.slideStarted = (t) ?
						setInterval(function(){ots.dynamicTransition(false);}, d) :
						setInterval(function(){ots.genericSlide(false);}, d);
					}
				}else{
					if(ots.isFading)
						return
					
					if(ots.configs.direction === "ltr"){
						ots.slideStarted = setInterval(ots.fadeStart, d);
					}else{
						ots.slideStarted = setInterval(function(){
							ots.fadeStart(false);}, d);
					}
				}
			}
		},
		
		swipeStart : function(x){
			x.preventDefault();
			
			x.stopPropagation();
			
			var ct, ots = OTSlider;
			
			if(!ots.canSlide || ots.isSliding || ots.isFading)
				return;

			clearInterval(ots.slideEffectStarted);
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
				totalSwiped : 0,
				totalSwipedPerc : 0,
				isTouch : (x.type.toLowerCase() === "touchstart") ?
				true : false
			};
			
			ots.isSliding = true;
		},
		
		swipeEnd : function(x){
			x.preventDefault();
			
			var se, ots = OTSlider, l, isp, cii, ciisp, sd, z, f;
			
			if(!(ots.swipeEvents && ots.swipeEvents.pageX))
				return;
			
			se = ots.swipeEvents;
			
			//Determine the amount of time that the swipe took
			 sd = new Date().getTime() - se.startTimestamp;
			 ots.swipeDuration = Math.min(sd, 500 );

			ots.isSliding = false;

			if(ots.configs.transition === "slide"){
				l = Math.abs(ots.left);

				isp = ots.itemStartPosition;

				//Determine the index of the target item
				cii = ots.dynamicItemIndex();

				z = Math.abs(ots.dynamicLeft(isp[cii])) - l;
				
				//Determine the swiped distance between the current item and
				//its siblings.
				z = Math.abs(z / ots.itemWidth * 100);

				ciisp = isp[cii];

				if(ots.configs.swipeFreely || ots.dynamicLeft(ciisp) == l){
					//Set the index of the target item
					ots.currentItemIndex = cii;

					ots.stopSlideEffect();
				}else{
					if(ots.configs.direction === "ltr"){
						ots.slideJumpTo = (z >= 50 && isp[cii + 1]) ?
						isp[cii + 1] : ciisp;
					}else{
						ots.slideJumpTo = (z <= 50 && isp[cii]) ?
						isp[cii] : (isp[cii + 1] && z >= 50) ? isp[cii + 1] :
						ciisp;
					}

					//Determine and set the index of the target item
					ots.currentItemIndex = ots.dynamicItemIndex(ots.slideJumpTo);

					ots.genericSlide();
				}
			}else{
				z = se.totalSwipedPerc;

				if(z >= 20 || z <= -20){
					f = (z >= 20) ? false : true;

					ots.fadeStart(f);
				}
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
			
			if(!(ots.swipeEvents && ots.swipeEvents.pageX && ots.isSliding))
				return;
			
			var l, sb, se, sd, ct, ts, psx, psy, csx, csy, sw, tiw, nl, sll;
			
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
				//Get the total width of all items within slider
				tiw = ots.totalItemsWidth;

				//Get the current width of the slider
				sw = ots.slider.offsetWidth;

				//Determine the allowed swipe limit to left
				sll = tiw - sw;

				//Determine the last swiped distance
				sb = Math.abs(psx - csx);

				//Get the total swiped distance
				ts = se.totalSwiped;

				ts = (sd == 0) ? ts - sb : ts + sb;
				
				if(ots.configs.transition === "slide"){
					//Get the current left position
					l = Math.abs(ots.left);
					
					if(sd == 0){//Swipe to left
						nl = l + sb;

						if(nl > sll){
							nl = sll;

							ots.__setSliderLeft(nl);
						}else{
							ots.__setSliderLeft(nl);
						}

					}else if(sd == 1){//Swipe to right
						nl = l - sb;

						if(nl > 0){
							ots.__setSliderLeft(nl);
						}else{
							nl = 0;

							ots.__setSliderLeft(nl);
						}
					}

					ots.left = nl;
				}else{
					//Determine the total swiped distance in percents
					ots.swipeEvents.totalSwipedPerc =
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
			
			return (csx > psx) ? 1 : 0;
		},
		
		resizeHandler : function(){
			var a, b, d;
			
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
			
			if(this.configs.transition === "slide"){
				d = a[b];

				//If the current position of the parent of items is negative,
				//we must keep it negative else positive.
				d = (/(\-)/.test(this.left)) ? (d - d * 2) : d;
				
				this.__setSliderLeft(this.dynamicLeft(d));

				this.left = this.dynamicLeft(d);
			}
			
			this.slideInit();
		},
		
		//This method is used to check if an HTML element has the
		//specified class.
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
		
		//This method is used to remove an class from the
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
		
		//This method is used to add an class to the specified HTML
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