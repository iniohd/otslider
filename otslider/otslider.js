/*
* OneTime Slider copyright 2018 HOM
* Author: Herminio Orlando Machava
* Author URL: https://github.com/hom13 
* Version: 1.0(Beta 1)
* Description: OneTime Slider(otSlider) is an powerful and intuitive slider built from plain/vanilla JS, which is suitable for any type of Web Application.
*/

(function(){
	otSlider = {
		slideClass : 'ot-slider',
		itemClass : 'ot-item',
		itemsClass : 'ot-items',
		prevNextClass : 'ot-prev-next',
		navClass : 'ot-nav',
		navListClass : 'ot-nav-list',
		isSliding : 0,
		isFading : 0,
		isJumping : 0,
		isStartUp: 1,
		slideStarted : 0,
		slideEffectStarted : 0,
		slideFPS : 30,
		slideBy : 0,
		slideByReset : 0,
		slideByJump : 0,
		slideFadedRange : 0,
		itemWidth : 0,
		itemSlided : 0,
		itemsSlided : 0,
		totalItemsWidth : 0,
		realEffectDuration : 0,
		effectResetType : 0,
		currentItemIndex : 0,
		left: 0,
		slideBypass : 0,
		canSlide : 1,
		canTransform : false,
		itemStartPosition : [],
		itemEndPosition : [],
		
		configs : {
			ID : 'ot-slider',
			direction: 'ltr',
			effect : 'slide',
			prevButton : '<span class="prev"></span>',
			nextButton : '<span class="next"></span>',
			duration: 2000,
			effectDuration : 500,
			autoPlay : true,
			pauseOnHover : true,
			showPrevNext : true,
			showNav : true,
			swapeToSlide : true,
			responsive : true,
		},
		
		init : function(configs){
			var s,configs = (configs && 'object' === typeof configs) ? configs : {};
			
			if(configs.effect && /^(slide|fade)$/i.test(configs.effect)){
				this.configs.effect = configs.effect;
			}
			
			if(configs.ID && 'string' === typeof configs.ID){
				this.configs.ID = configs.ID.toLowerCase();
			}
			
			if(configs.prevButton && 'string' === typeof configs.prevButton){
				this.configs.prevButton = configs.prevButton;
			}
			
			if(configs.nextButton && 'string' === typeof configs.nextButton){
				this.configs.nextButton = configs.nextButton;
			}
			
			if(configs.duration && 'number' === typeof configs.duration && configs.duration > 9){
				this.configs.duration = configs.duration;
			}
			
			if(configs.effectDuration && 'number' === typeof configs.effectDuration){
				this.configs.effectDuration = configs.effectDuration;
			}
			
			if('boolean' === typeof configs.showNav){
				this.configs.showNav = configs.showNav;
			}
			
			if('boolean' === typeof configs.showPrevNext){
				this.configs.showPrevNext = configs.showNav;
			}
			
			if('boolean' === typeof configs.responsive){
				this.configs.responsive = configs.responsive;
			}
			
			if(configs.width && 'number' === typeof configs.width){
				this.configs.width = configs.width;
			}
			
			if(configs.height && 'number' === typeof configs.height){
				this.configs.height = configs.height;
			}
			
			if('boolean' === typeof configs.pauseOnHover){
				this.configs.pauseOnHover = configs.pauseOnHover;
			}
			
			if('boolean' === typeof configs.autoPlay){
				this.configs.autoPlay = configs.autoPlay;
			}
			
			if(configs.direction && 'string' === typeof configs.direction &&
			/^(ltr|rtl)$/gi.test(configs.direction)){
				this.configs.direction = configs.direction.toLowerCase();
			}

			if('boolean' === typeof configs.swapeToSlide){
				this.configs.swapeToSlide = configs.swapeToSlide;
			}
		
			this.common();
		},
		
		common : function(){
			var loaded = function(){
				//Fisrt we setup the slider
				otSlider.setupSlider();
				//Setup slider's items
				otSlider.setupItems();
				//Setup slider's dimensions and it's items
				otSlider.setupDimensions();
				//Setup the navs
				otSlider.setupNavs();
				//Configure some elements of slider
				otSlider.setupSlideDOM();
				//Slider initialization
				otSlider.slideInit();
			}
			
			if(window.addEventListener){
				document.addEventListener("DOMContentLoaded", loaded, false);
			}else{
				document.attachEvent("onreadystatechange", loaded);
			}
		},
		
		setupSlider : function(){
			var a,b,c,d,e,f;
			
			//Get the slider container
			e = document.getElementById(this.configs.ID);
			
			if(!e){
				throw new Error("The specified element by ID was not not found. Please make sure that the ID is correct.");
			}
			
			//Create slide's reference in our object
			this.slider = e;
			
			//Add the required class attribute in order to style the slide
			this.acn(e,this.slideClass);
			
			//Only set the width or height if it was specified
			if(this.configs.width)
				e.style.width = this.configs.width+"px";
			
			if(this.configs.height)
				e.style.height = this.configs.height+"px";
			
			a = document.createElement("div");
			
			this.canTransform = (undefined !== a.style.transform) ? true : false;
		},
		
		setupItems : function(){
			var s,v,w,x = [],y,z;
			//Get the slider element
			s = this.slider;
			//Get the list of direct children of the slider element
			v = s.children;
			
			var i = 0;
			
			while(v[0]){
				if(v[0].nodeType == 1){
					if(v[0].nodeName.toLowerCase() !== "div"){
						z = document.createElement("div");
						z.className = this.itemClass+' ot-item-'+i;
						z.innerHTML = '<img src="'+v[0].src+'" alt="'+v[0].alt+'" draggable="false">';
						x[i] = z;
					}else{
						w = v[0];
						w.className = this.itemClass+' ot-item-'+i;
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
			var e = [],s,v,w,x,y,z;
			
			for(var i = 0, j = 2; i < j ; i++){
				//Create 2 div elements 
				e[i] = document.createElement("div");
			}
			
			//Previous and next Buttons
			v = e[0];
			v.className = this.prevNextClass;
			v.innerHTML = this.configs.prevButton+this.configs.nextButton;
			
			//Navigation buttons
			w = e[1];
			w.className = this.navClass;
			
			//Get the slider container
			s = this.slider;
			
			x = s.getElementsByClassName(this.itemClass);
			
			y = "<ul>";
			
			for(var i = 0; i < x.length; i++){
				y += '<li class="'+this.navListClass+'">'+(i+1)+'</li>';
			}
			
			y += '</ul>';
			
			w.innerHTML = y;
			
			//Append all created container into slider
			s.appendChild(v);
			s.appendChild(w);
			
			if(!this.configs.showPrevNext){
				v.style.display = "none";
				this.acn(s,"prev-next-hidden");
			}
			
			if(!this.configs.showNav){
				w.style.display = "none";
				this.acn(s,"nav-list-hidden");
			}
				
			this.addEvents();
		},
		
		setupSlideDOM : function(){
			var a,b,c,d,e,f;
			
			//Get the slider element
			a = this.slider;
			
			b = a.getElementsByClassName(this.itemsClass)[0];
			
			c = b.getElementsByClassName(this.itemClass);
			
			d = c[0].parentElement;
			
			e = a.getElementsByClassName(this.navListClass);
			
			this.sliderItems = c;
			
			this.sliderItemsParent = d;
			
			this.sliderNavListItems = e;
		},
		
		setupDimensions : function(f){
			f = ('boolean' === typeof f) ? f : false;
			
			var a,b,c,d = 0,e,s,sw,sh,si,winX,winY;
			
			//Get the slider element
			s = this.slider;
			//Get the container of items
			a = s.getElementsByClassName(this.itemsClass)[0];
			//Get the items of slider
			b = a.getElementsByClassName(this.itemClass);
			
			if(!b.length)
				throw new Error("No item found within the slider");
			
			//Get the direct parent of items
			c = b[0].parentNode;
			
			//Get the width of the window
			winX = (window.innerWidth || document.documentElement.offsetWidth);
			//Get the height of the window
			winY = (window.innerHeight || document.documentElement.offsetHeight);
			
			//Let's get the image with the lowest height
			for(var i = 0; i < b.length; i++){
				a = b[i].getElementsByTagName("img");
				if(a[0]){
					d = (d == 0 || a[0].offsetHeight < d) ? a[0].offsetHeight : d;
				}
			}
			
			//Get the demension of the slider
			sw = (this.configs.width) ? this.configs.width : 768;
			sh = (this.configs.height) ? this.configs.height : 320;
			
			if(!this.isResizing){
				d = sh;
			}
			
			//If the specified width is higher than the window we set it to be same as the window
			sw = (sw>=winX) ? winX : sw;
			sh = (sh>=winY) ? winY : sh;
			
			if(this.configs.effect === "slide"){
				if(f || this.itemWidth < 1 || this.itemsWidth < 1){
					//Set the width for slider
					s.style.width = sw+"px";
					s.style.height = (sh < d) ? sh+"px" : d+"px";
					//The width of the direct parent of the items must be the total sum of the width of all items
					c.style.width = (b.length * sw)+"px";
				
					this.totalItemsWidth = (b.length*sw);
					this.itemWidth = sw;
				
					//Set the width each item and positionate ease item alongside another
					for(var i = 0; i < b.length; i++){
						b[i].style.width = sw+"px";
						b[i].style.height = (sh < d) ? sh+"px" : d+"px";
						b[i].style.left = (sw*i)+"px";
						this.itemStartPosition[i] = sw*i;
						this.itemEndPosition[i] = (sw*i)+sw
					}
				}
			}else{
				s.style.width = sw+"px";
				s.style.height = (sh<d) ? sh+"px": d+"px";
				
				for(var i = 0; i < b.length; i++){
					b[i].style.width = sw+"px";
					b[i].style.height = (sh < d) ? sh+"px" : d+"px";
				}
			}
		},
		
		//Add events
		addEvents : function(){
			var a,b,c,d,e,s;
			
			//Get the container of slide
			s = this.slider;
			
			a = s.getElementsByClassName(this.navClass)[0];
			
			//Get the list of all buttons from nav
			b = a.getElementsByClassName(this.navListClass);
			
			//Get the container of previous and next button
			c = s.getElementsByClassName(this.prevNextClass)[0];
			
			//Get the previous and next button
			d = c.children;

			e = s.getElementsByClassName("ot-items");
			
			if(window.addEventListener){
				s.addEventListener("mouseout", function(e){otSlider.resumeSlider(e);}, false);
				s.addEventListener("mouseover", function(e){otSlider.pauseSlider(e);}, false);
				
				for(var i = 0; i < b.length; i++)
					b[i].addEventListener("click", function(e){otSlider.navListButton(e);}, false);
				
				for(var i = 0; i < d.length; i++){
					if(d[i].nodeType == 1){
						if(i < 1){
							d[i].addEventListener("click", function(e){otSlider.prevItem(e);}, false);
						}else{
							d[i].addEventListener("click", function(e){otSlider.nextItem(e);},false);
						}
					}
				}

				for(var i = 0; i < e.length; i++){
					e[i].addEventListener("mousedown", function(e){e.preventDefault();otSlider.mouseDown(e);}, false);
					e[i].addEventListener("mouseup", function(e){e.preventDefault();otSlider.mouseUp(e);}, false);
					e[i].addEventListener("mousemove", function(e){e.preventDefault();otSlider.slideSwipe(e);}, false);
					e[i].addEventListener("dragstart", function(e){e.preventDefault();e.stopPropagation();},false);
					e[i].addEventListener("drag", function(e){e.preventDefault();e.stopPropagation();},false);
				}
				
				window.addEventListener("resize", function(){otSlider.resizeHandler();}, false);
			}else{
				s.attachEvent("onmouseout", function(e){otSlider.resumeSlider(e);}, false);
				s.attachEvent("onmouseover", function(e){otSlider.pauseSlider(e);}, false);
				
				for(var i = 0; i < b.length; i++)
					b[i].attachEvent("onclick", function(e){otSlider.navListButton(e);}, false);
				
				for(var i = 0; i < d.length; i++){
					if(d[i].nodeType == 1){
						if(i < 1){
							d[i].attachEvent("onclick", function(e){otSlider.prevItem(e);}, false);
						}else{
							d[i].attachEvent("onclick", function(e){otSlider.nextItem(e);}, false);
						}
					}
				}
				
				window.attachEvent("onresize", function(){otSlider.resizeHandler();});
			}
		},
		
		slideInit : function(){
			if(this.sliderItems.length <= 1){
				this.canSlide = 0;
				return false;
			}
			
			var a,b,c,d,e,f,g,h,j,k;
			
			a = this.itemWidth;
			
			b = this.totalItemsWidth;
			
			d = this.configs.duration;
			
			e = this.configs.effectDuration;
			
			f = this.slideFPS;
			
			this.realEffectDuration = (e/f);
			
			this.slideBy = (a/f);
			
			this.slideByReset = (b/f);
			
			if(this.isStartUp){
				if(this.configs.direction === 'rtl'){
					this.currentItemIndex = this.sliderItems.length-1;
					//The current active item index
					c = this.currentItemIndex;
					//The parent element of items
					g = this.sliderItemsParent;
					//This array contain the beginning of left  absolute position of each item
					h = this.itemStartPosition;

					j = h[c];
					j = (j-j*2);
					
					if(this.configs.effect === "slide"){
						g.style.left = j+"px";
						this.left = j;
					}
				}else{
					g = this.sliderItemsParent;
					
					if(this.configs.effect === "slide"){
						g .style.left = 0;
						this.left = 0;
					}
				}
				
				//The list of button from nav
				k = this.sliderNavListItems;
				//Add the active class to the index of displayed item
				this.acn(k[this.currentItemIndex],"active");
				
				if(this.configs.effect === "slide")
				this.isStartUp = 0;
			}
			
			if(this.configs.effect === 'slide'){
				//Carousel Slide
				this.carousel();
			}else{
				//Fade slide
				this.fade();
			}
		},
		
		carousel : function(){
			var d;
			
			d = this.configs.duration;
			
			if(this.configs.direction === "ltr"){
				this.slideStarted = setInterval(function(){otSlider.carouselStart();}, d);
			}else{
				this.slideStarted = setInterval(function(){otSlider.carouselStart(false);}, d);
			}
		},
		
		fade : function(){
			var a,b,c,d,e,f,g,mo,o,dur;
			
			if(this.isStartUp){
				//Let's check if the current Web browser support the modern opacity or the old one
				o = document.createElement("div");
				this.mOpacity = (undefined !== o.style.opacity) ? true : false;
			
				mo = this.mOpacity;
			
				//Get the list of all items
				a = this.sliderItems
				//Get the buttons references of item
				b = this.sliderNavListItems;
			
				//Get the list of all items
				d = this.sliderItems;
			
				//Get the list of buttons of nav
				e = this.sliderNavListItems;
			
				//If the direction is ltr, we start from the first item(difault) else we
				//start from the last item.
				g = (this.configs.direction === "ltr") ? 0 : a.length-1;
			
				//Add the active class to the first itel element
				for(var i = 0; i < d.length; i++){
					if(i == g){
						this.acn(d[i],"active");
					
						if(mo){
							d[i].style.opacity = 1;
						}else{
							d[i].style.filter = "alpha(opacity=100)";
						}
					
						this.acn(e[i],"active");
					
						this.currentItemIndex = i;
					}else{
						if(mo){
							d[i].style.opacity = 0;
						}else{
							d[i].style.filter = "alpha(opacity=0)";
						}
					}
				}
			
				//This array will contain the range of opacity for modern Web browser
				this.fadeRange = [];
				//This array will contain the range of opacity form MSIE8
				this.fadeRangeOld = [];
			
				for(var i = 0; i <= 10; i++){
					this.fadeRange[i] = (i/10);
					this.fadeRangeOld[i] = (i*10);
				}
			
				this.isStartUp = 0;
			}
			
			dur = this.configs.duration;
			
			this.realEffectDuration = (this.configs.effectDuration/this.fadeRange.length);
			
			if(this.configs.direction === "ltr"){
				this.slideStarted = setInterval(function(){otSlider.fadeStart();}, dur);
			}else{
				this.slideStarted = setInterval(function(){otSlider.fadeStart(false);}, dur);
			}
		},
		
		fadeStart  : function(f){
			f = ('boolean' === typeof f) ? f : true;
			
			var a,d;
			
			d = this.realEffectDuration;
			
			if(this.isJumping)
				return false;
			
			if(this.isFading)
				clearInterval(this.slideEffectStarted);
			
			if(this.slideStarted)
				clearInterval(this.slideStarted);
			
			this.isFading = 1;
			
			this.slideFadedRange = this.fadeRange.length;
			
			if(f){
				this.slideEffectStarted = setInterval(function(){otSlider.fadeForward();}, d);
			}else{
				this.slideEffectStarted = setInterval(function(){otSlider.fadeBackward();}, d);
			}
		},
		
		fadeForward : function(f){
			f = ('boolean' === typeof f) ? f : true;
			
			var a,b,c,d,o;
			
			a = this.sliderItems
			
			b = this.slideFadedRange;
			
			this.slideFadedRange = (b-1);

			o = this.mOpacity;
			
			c = (o) ? this.fadeRange : this.fadeRangeOld;

			if(b == c.length){
				for(var i = 0; i < a.length; i++){
					if(!this.hcn(a[i],"active")){
						if(o){
							a[i].style.opacity = 0
						}else{
							a[i].style.filter = "alpha(opacity=0)";
						}
					}
				}
				
				for(var i = 0; i < a.length; i++){
					if(f){
						if(this.hcn(a[i],"active")){
							if(a[i+1]){
								this.acn(a[i+1],"active");
							}else{
								this.acn(a[0],"active");
							}
							
							this.rcn(a[i],"active");
							//End the loop if the fisrt active item was found
							break;
						}
					}else{
						if(this.hcn(a[i],"active")){
							if(a[i-1]){
								this.acn(a[i-1],"active");
							}else{
								this.acn(a[a.length-1],"active");
							}
							
							this.rcn(a[i],"active");
							//End the loop if the first active item was found
							break;
						}
					}
				}
			}

			if(b){
				if(f){
					for(var i = 0; i < a.length; i++){
						if(this.hcn(a[i],"active")){
							if(a[i-1]){
								if(o){
									a[i-1].style.opacity = c[b-1]
									a[i].style.opacity = c[c.length-b]
								}else{
									a[i-1].style.filter = "alpha(opacity="+c[b-1]+")";
									a[i].style.filter = "alpha(opacity="+c[c.length-b]+")";
								}
							}else{
								if(o){
									a[a.length-1].style.opacity = c[b-1];
									a[i].style.opacity = c[c.length-b];
								}else{
									a[a.length-1].style.filter = "alpha(opacity="+c[b-1]+")";
									a[i].style.filter = "alpha(opacity="+c[c.length-b]+")";
								}
							}
						}
					}
				}else{
					for(var i = 0; i < a.length; i++){
						if(this.hcn(a[i],"active")){
							if(a[i+1]){
								if(o){
									a[i+1].style.opacity = c[b-1];
									a[i].style.opacity = c[c.length-b];
								}else{
									a[i+1].style.filter = "alpha(opacity="+c[b-1]+")";
									a[i].style.filter = "alpha(opacity="+c[c.length-b]+")";
								}
							}else{
								if(o){
									a[0].style.opacity = c[b-1];
									a[i].style.opacity = c[c.length-b];
								}else{
									a[0].style.filter = "alpha(opacity="+c[b-1]+")";
									a[i].style.filter = "alpha(opacity="+c[c.length-b]+")";
								}
							}
						}
					}
				}
			}else{
				this.stopFadeEffect();
			}
		},
		
		fadeBackward : function(){
			this.fadeForward(false);
		},
		
		fadeJumpTo : function(e){
			if(this.isFading || this.slideEffectStarted)
				clearInterval(this.slideEffectStarted);
			
			this.isFading = 1;
			
			if(this.slideStarted)
				clearInterval(this.slideStarted);
			
			var jt;

			this.slideFadedRange = this.fadeRange.length;
			
			jt = function(e){
				var a,b,c,d,f,o;
				
				a = otSlider.sliderItems;
				
				d = otSlider.sliderNavListItems;
				
				b = otSlider.slideFadedRange;
				
				otSlider.slideFadedRange = (b-1);
				
				o = otSlider.mOpacity;
				
				c = (o) ? otSlider.fadeRange : otSlider.fadeRangeOld;
				
				if(b == c.length){
					for(var i = 0; i < a.length; i++){
						if(!otSlider.hcn(a[i],"active")){
							if(o){
								a[i].style.opacity = 0;
							}else{
								a[i].style.filter = "alpha(opacity=0)";
							}
						}
					}
				}
				
				if(b){
					for(var i = 0; i < a.length; i++){
						if(otSlider.hcn(a[i],"active")){
							if(o){
								a[i].style.opacity = c[b-1];
							}else{
								a[i].style.filter = c[b-1];
							}
						}
						
						if(d[i] == e){
							if(o){
								a[i].style.opacity = c[c.length-b];
							}else{
								a[i].style.filter = "alpha(opacity="+c[c.length-b]+")";
							}
						}
					}
				}else{
					for(var i = 0; i < a.length; i++){
						if(a[i] != e){
							if(otSlider.hcn(a[i],"active")){
								otSlider.rcn(a[i],"active");
							}
						}
					}
					
					for(var i = 0; i < d.length; i++){
						if(d[i] == e){
							otSlider.acn(a[i],"active");
						}
					}
					
					otSlider.stopFadeEffect();
				}
			};
			
			d = this.realEffectDuration;
			
			this.slideEffectStarted = setInterval(function(){jt(e);}, d);
		},
			
		stopFadeEffect : function(){
			var a,b,c,d;
			
			a = this.sliderItems;
			
			b = this.sliderNavListItems;
			
			d = this.configs.duration;
			
			for(var i = 0; i < a.length; i++){
				if(this.hcn(a[i],"active")){
					this.currentItemIndex = i;
					
					this.acn(b[i],"active");
				}else{
					this.rcn(b[i],"active");
				}
			}
			
			clearInterval(this.slideEffectStarted);
			
			if(this.slideStarted)
				clearInterval(this.slideStarted);
			
			if(this.configs.autoPlay){
				if(this.configs.direction === "lrt"){
					this.slideStarted = setInterval(function(){otSlider.fadeStart();}, d);
				}else{
					this.slideStarted = setInterval(function(){otSlider.fadeStart(false);}, d);
				}
			}
			
			this.isSliding = 0;
			 
			this.isJumping = 0;
			
			this.isFading = 0;
		},

		carouselStart : function(f){
			if(this.isSliding || this.isJumping)
				return false;
			
			f = ('boolean' === typeof f) ? f : true;
			
			var a,b,c,d,e,l,fl;
			
			//This is the interval of time that create the frames of effect
			d = this.realEffectDuration;
			
			//Get the current left absolute position of items parent
			l = this.left;
			
			//Get the module of left position
			fl = (l-l*2);
			
			//Get the width of slider
			a = this.itemWidth;
			
			//Get the sum of width of all items
			b = this.totalItemsWidth;
			
			this.itemSlided = a;
			
			this.itemsSlided = (b-a);
			
			this.isSliding = 1;
			
			if(f){
				if(fl >= b-a){
					//Perform the reset of forward moviment of slide
					this.slideEffectStarted = setInterval(function(){otSlider.carouselResetForward();}, d);
				}else{
					//perform the forward moviment of slide
					this.slideEffectStarted = setInterval(function(){otSlider.carouselForward();}, d);
				}
			}else{
				if(fl <= 0){
					//Perform the reset backward moviment of slide
					this.slideEffectStarted = setInterval(function(){otSlider.carouselResetBackward();}, d);
				}else{
					//Perform the backward moviment of slide
					this.slideEffectStarted = setInterval(function(){otSlider.carouselBackward();}, d);
				}
			}
		},
		
		carouselForward : function(){
			var a,b,c,d,e,f,g,l,fl,t,z;
			
			a = this.sliderItemsParent;
			
			b = this.slideBy;
			
			c = this.totalItemsWidth;
			
			d = this.itemWidth;
			
			e = Math.floor(c-d);
			
			g = this.itemStartPosition;
			
			l = this.left;
			
			fl = (l > 0) ? (l-l*2) : l;
			
			f = this.itemSlided;
			
			t = this.canTransform;
			
			this.itemSlided = (f-b);
			
			if(f-b <= 0){
				j = this.currentItemIndex;
				
				j = j+1;
				
				this.currentItemIndex = j;
				
				z = g[j];
				
				z = (z-z*2);
				
				if(t){
					a.style.transform = "translate("+z+"px,0)";
				}else{
					a.style.left = (z)+"px";
				}
				
				this.left = z;
				
				this.stopSlideEffect();
				
			}else{
				if(t){
					a.style.transform = "translate("+(fl-b)+"px,0)";
				}else{
					a.style.left = (fl-b)+"px";
				}
				
				this.left = fl-b;
				
				if(this.slideStarted){
					clearInterval(this.slideStarted);
				}
			};
		},
		
		carouselResetForward : function(){
			var a,b,c,d,e,f,l,fl,t;
			
			a = this.sliderItemsParent;
			
			b = this.slideByReset;
			
			l = this.left;
			
			fl = (l > 0) ? (l-l*2) : l;
			
			c = this.itemsSlided;
			
			t = this.canTransform;
			
			this.itemsSlided = c-b;

			if(c-b <= 0){
				this.currentItemIndex = 0;
				
				if(t){
					a.style.transform = "translate("+0+"px,0)";
				}else{
					a.style.left = 0;
				}

				this.left = 0;
				
				this.stopSlideEffect();
			}else{
				if(t){
					a.style.transform = "translate("+(fl+b)+"px,0)";
				}else{
					a.style.left = (fl+b)+"px";
				}
			
				this.left = (fl+b);
			}
		},
		
		carouselBackward : function(){
			var a,b,c,d,e,f,j,h,l,t;
			
			a = this.sliderItemsParent;
			
			b = this.slideBy;
			
			c = this.itemStartPosition;
			
			l = this.left;
			
			e = this.itemSlided;
			
			t = this.canTransform;
			
			this.itemSlided = (e-b);
			
			if(e-b <= 0){
				f = this.currentItemIndex;
				
				f = f-1;
				
				this.currentItemIndex = f;

				j = c[f];
				
				j = (j-j*2);
				
				if(t){
					a.style.transform = "translate("+j+"px,0)";
				}else{
					a.style.left = j+"px";
				}
				this.left = j;
				
				this.stopSlideEffect();
			}else{
				if(t){
					a.style.transform = "translate("+(l+b)+"px,0)";
				}else{
					a.style.left = (l+b)+"px";
				}
				
				this.left = (l+b);
				
				if(this.slideStarted){
					clearInterval(this.slideStarted);
				}
			}
		},
		
		carouselResetBackward : function(){
			var a,b,c,d,e,f,bl,g,h,l,t;
			
			a = this.sliderItemsParent;
			
			b = this.slideByReset;
			
			c = this.itemStartPosition;
			
			f = this.itemsSlided;
			
			t = this.canTransform;
			
			this.itemsSlided = (f-b);
			
			l = this.left;
			
			bl = (l-l*2);
			
			if(f-b <= 0){
				g = c.length-1;
				
				this.currentItemIndex = g;

				h = c[g];
				
				h = (h-h*2);
				
				if(t){
					a.style.transform = "translate("+h+"px,0)";
				}else{
					a.style.left = h+"px";
				}
				
				this.left = h;
				
				this.stopSlideEffect();
			}else{
				if(t){
					a.style.transform = "translate("+(l-b)+"px,0)";
				}else{
					a.style.left = (l-b)+"px";
				}
				
				this.left = (l-b);
				
				if(this.slideStarted){
					clearInterval(this.slideStarted);
				}
			}
		},
		
		carouselJumpTo : function(){
			if(this.isSliding || this.isJumping)
				return false;
			
			var d,f;
			
			d = this.realEffectDuration;
			
			f = (this.slideJumpToDistance < 0) ? true : false;
			
			this.isJumping = 1;
			
			if(f){
				//Perform forward jump
				this.slideEffectStarted = setInterval(function(){otSlider.carouselJumpToForward();}, d);
			}else{
				//Perform backward jump
				this.slideEffectStarted = setInterval(function(){otSlider.carouselJumpToBackward()}, d);
			}
		},
		
		carouselJumpToForward : function(){
			var a,b,c,d,l,t,x;
			
			a = this.sliderItemsParent;
			
			b = this.slideJumpToBy;
			
			b = (b < 0) ? (b-b*2) : b;
			
			d = this.slideJumpToDistance;
			
			//If the value of distance is negative. Let's return it's module which is positive
			c = (d < 0) ? (d-d*2) : d;
			
			this.slideJumpToDistance = (c-b);
			
			t = this.slideJumpTo;
			
			l = this.left;
			
			x = this.canTransform;
			
			if((c-b) <= 0){
				//Get it's module
				t = (t-t*2);
				
				if(x){
					a.style.transform = "translate("+t+"px,0)";
				}else{
					a.style.left = t+"px";
				}
				
				this.left = t;
				
				this.currentItemIndex = this.slideJumpToItemIndex;
				
				this.stopSlideEffect();
			}else{
				if(x){
					a.style.transform = "translate("+(l-b)+"px,0)";
				}else{
					a.style.left = (l-b)+"px";
				}
				
				this.left = (l-b);
				
				if(this.slideStarted){
					clearInterval(this.slideStarted);
				}
			}
		},
		
		carouselJumpToBackward : function(){
			var a,b,c,d,e,f,g,l,t,x;
			//Get the direct parect of items
			a = this.sliderItemsParent;
			//Each frame perfom one step of this value
			b = this.slideJumpToBy;
			b = (b < 0) ? (b-b*2) : b;
			//Get the index of current displayed item
			c = this.currentItemIndex;
			//Get the distance that remain in order to reach the item target
			d = this.slideJumpToDistance;
			e = (d < 0) ? (d-d*2) : d;
			//The position of our target
			t = this.slideJumpTo;
			t = (t > 0) ? (t-t*2) : t;
			//Get the current left absolute position of items parent
			l = this.left;
			x = this.canTransform;
			
			this.slideJumpToDistance = (e-b);
			
			if((e-b) <= 0){
				this.currentItemIndex = this.slideJumpToItemIndex;
				
				if(x){
					a.style.transform = "translate("+t+"px,0)";
				}else{
					a.style.left = t+"px";
				}
				
				this.left = t;
				
				this.stopSlideEffect();
			}else{
				
				if(x){
					a.style.transform = "translate("+(l+b)+"px,0)";
				}else{
					a.style.left = (l+b)+"px";
				}
				
				this.left = (l+b);
				
				if(this.slideStarted){
					clearInterval(this.slideStarted);
				}
			}
		},
		
		stopSlideEffect : function(x){
			x = ('boolean' === typeof x) ? x : true;
			
			//Stop slide effect
			clearInterval(this.slideEffectStarted);
			
			if(x){
				var d = this.configs.duration
				
				if(this.slideStarted){
					clearInterval(this.slideStarted);
				}
				
				if(this.configs.autoPlay){
					if(this.configs.direction === "ltr"){
						this.slideStarted = setInterval(function(){otSlider.carouselStart();}, d);
					}else{
						this.slideStarted = setInterval(function(){otSlider.carouselStart(false);}, d);
					}
				}
			}
			
			this.slideTrack();
		},
		
		slideTrack : function(){
			var a,b,c,d;
			
			c = this.currentItemIndex;
			
			a = this.sliderItems;
			
			b = this.sliderNavListItems;
			
			for(var i = 0; i < a.length; i++){
				if(i == c){
					//Add the class that is used to identify the current displayed item on slide
					this.acn(a[i],"active");
					this.acn(b[i],"active");
				}else{
					//Remove the active class on non displayed items
					this.rcn(a[i],"active");
					this.rcn(b[i],"active");
				}
			}
			
			this.isSliding = this.isJumping = this.isResizing = 0;

			this.canSlide = true;

			if(this.dragEvents && this.dragEvents.dragStart)
				this.dragEvents.dragStart = 0;
		},
		
		navListButton : function(e){
			if(window.preventDefault)
				e.preventDefault();
			
			if(window.stopPropagation)
				e.stopPropagation();
			
			if(!this.canSlide)
				return false;
			
			//Get the element on which the event occurred
			e = e.target || e.srcElement;
			
			var a,b,c,d,e,f,g,h,l,t;
			
			if(this.configs.effect === "slide"){
				a = this.itemStartPosition;
			
				b = this.sliderItems;
			
				c = this.sliderNavListItems;
			
				for(var i = 0; i < c.length; i++){
					if(c[i] == e){
						e = i;
						t = a[i];
					}
				}
			
				//Return if click on the button that is the reference of current displayed item
				if((e == this.currentItemIndex))
					return false;
			
				this.slideJumpTo = t;
				this.slideJumpToItemIndex = e;
				//Get the index of the current displayed item
				f = this.currentItemIndex;
				//Get the current left absolute position of our carousel
				l = Math.abs(this.left);
				//Get the distance between the current displayed item and that we wish to go
				g = (t-l);
				//Fix the value of distance
				g = (g-g*2);
			
				h = this.slideFPS;
			
				this.slideJumpToBy = (g/h);
			 
				this.slideJumpToDistance = g;
			
				this.carouselJumpTo();
			}else{
				if(this.hcn(e,"active"))
					return false;
				
				this.isJumping = 1;
				
				//Get the list of all items
				a = this.sliderItems;
				
				//Get the list of items reference
				b = this.sliderNavListItems;
				
				this.fadeJumpTo(e);
			}
		},
		
		prevItem : function(e){
			if(window.preventDefault)
				e.preventDefault();
			
			if(window.stopPropagation)
				e.stopPropagation();
			
			if(!this.canSlide)
				return false;
			
			//Get the element on which the event occurred
			e = e.target || e.srcElement;
			
			var a,e,d;
			
			e = this.configs.effect;
			
			d = this.configs.duration;
			
			if(this.slideStarted){
				clearInterval(this.slideStarted);
			}
			
			//Show the previous item
			if(e === "slide"){
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
				return false;
			
			//Get the element on which the event occurred
			e = e.target || e.srcElement;

			var a,e,d;
			
			e = this.configs.effect;
			
			d = this.configs.duration;
			
			if(this.slideStarted){
				clearInterval(this.SlideStarted);
			}
			
			//Show the next item
			if(e === "slide"){
				this.carouselStart();
			}else{
				this.fadeStart();
			}
		},
		
		pauseSlider : function(e){
			if(window.preventDefault)
				e.preventDefault();
			
			if(!this.configs.pauseOnHover)
				return false;
			
			if(this.slideStarted){
				clearInterval(this.slideStarted);
			}
		},
		
		resumeSlider : function(e){
			if(window.preventDefault)
				e.preventDefault();
			
			if(!this.canSlide)
				return false;
			
			if(!this.configs.pauseOnHover)
				return false;
			
			var a,d;
			
			d = this.configs.duration;
			
			if(this.slideStarted){
				clearInterval(this.slideStarted);
			}
			
			if(this.configs.autoPlay){
				if(this.configs.effect === "slide"){
					if(this.configs.direction === "ltr"){
						this.slideStarted = setInterval(function(){otSlider.carouselStart();}, d);
					}else{
						this.slideStarted = setInterval(function(){otSlider.carouselStart(false);}, d);
					}
				}else{
					if(this.configs.direction === "ltr"){
						this.slideStarted = setInterval(function(){otSlider.fadeStart();}, d);
					}else{
						this.slideStarted = setInterval(function(){otSlider.fadeStart(false);}, d);
					}
				}
			}
		},

		mouseDown : function(e){
			if(window.preventDefault){
				e.preventDefault();
			}

			if(this.configs.effect !== "slide")
				return;

			if(this.canSlide)
				this.canSlide = 0;

			if("undefined" === typeof this.dragEvents){
				this.dragEvents = {dragStart : true};

			}else{
				this.dragEvents.dragStart = true;
			}

			//The left position of the slide when the drag started. This value
			//doesn't change when swipe the slide.
			this.dragEvents.startSlidePos = this.left;
			//The previous left position of the slide when it was swiped. This value
			//get changed every time the slide is swiped.
			this.dragEvents.prevSlidePos = this.left;
			//The position of the mouse when the drag started. This value doesn't
			//change when the swipe slide.
			this.dragEvents.startMousePos = e.pageX;
			//The previous mouse position
			this.dragEvents.prevMousePos = e.pageX;
			//The previous direction of swipe
			this.dragEvents.prevSwipeDir = 0;
			//The swiped length
			this.dragEvents.totalSwiped = 0;
		},

		mouseUp : function(e){
			if(window.preventDefault){
				e.preventDefault();
			}

			this.canSlide = 1;

			if(this.dragEvents.totalPercSwiped <= 40){
				this.slideBySwipe(true);
			}

			if("undefined" === typeof this.dragEvents){
				this.dragEvents = {dragStart : false};
			}else{
				this.dragEvents.dragStart = false;
			}
		},

		slideSwipe : function(e){
			if(window.preventDefault){
				e.preventDefault();
			}

			if(this.configs.effect !== "slide")
				return;

			if(this.isSliding || this.isFading || this.isJumping)
			return;

			//Check if one of buttons from mouse is current clicked
			if(!(this.dragEvents && this.dragEvents.dragStart))
				return;

			if(this.canSlide)
				this.canSlide = 0;

			var a,b,c,f,g,h,swipe = 0,p,mb,ps,iw,ts,sb,pts;

			p = this.sliderItemsParent;

			//Get and set the horizontal position of the mouse pointer relative
			//to the clicked element.
			a = e.pageX;

			//Get the previous position of mouse
			b = this.dragEvents.prevMousePos;
			//Get the start position of slide when the current dragged started
			c = this.dragEvents.startSlidePos;
			//Get the previous position of the slide
			d = this.dragEvents.prevSlidePos;
			//Get the start position of the mouse
			f = this.dragEvents.startMousePos;
			//
			sb = this.slideBy;
			//Get the left position
			l = this.left;

			mb = Math.abs(b-a);
			mb = (mb>=sb) ? sb : mb;

			//Get the direction of the previous swipe
			ps = this.dragEvents.prevSwipeDir;
			//Get the total amount of swiped
			ts = this.dragEvents.totalSwiped;
			//Get the total width of items
			h = this.totalItemsWidth;
			//Get the width of item
			iw = this.itemWidth;

			//Let's determine the direction of the swipe. Left == 0 and Right == 1
			swipe = (a>b || (ps && (a-b) >= 0)) ? 1 : 0;

			if((swipe && l >= 0) || (!swipe && Math.abs(l) >= (h-iw))){
				if(swipe){
					p.style.transform = "translate(0px,0)";
				}else{
					var max_width = (parseInt(p.style.width)-iw);
					max_width = (max_width<0) ? max_width: (max_width-(max_width*2));
					p.style.transform = "translate("+max_width+"px,0)";
				}
				return false;
			}
			
			if(this.configs.effect === "slide"){
				if(swipe){
					if(this.canTransform){
						p.style.transform = "translate("+(l+mb)+"px,0)";
					}else{
						p.style.left = (l+mb)+"px";
					}
				}else{
					if(this.canTransform){
						p.style.transform = "translate("+(l-mb)+"px,0)";
					}else{
						p.style.left = (l-mb)+"px";
					}
				}
			}

			pts = this.dragEvents.totalSwiped = (swipe) ? Math.floor(ts+mb) : Math.floor(ts-mb);
			//Determine the current swiped value in percents
			pts = Math.abs(pts)-iw;
			//Determine the current swiped percents and return in increasing order.
			this.dragEvents.totalPercSwiped = 100-Math.abs(Math.floor((pts/iw)*100));

			this.dragEvents.prevMousePos = a;
			this.dragEvents.prevSlidePos = this.left = (swipe) ? (l+mb) : (l-mb);
			this.dragEvents.prevSwipeDir = swipe;
			
			if(this.dragEvents.totalPercSwiped >= 40){
				this.slideBySwipe();
			}
		},

		slideBySwipe : function(fallback){
			fallback = ("boolean" === typeof fallback) ? fallback : false;

			if(this.isSliding || this.isFading || this.isJumping){
				return false;
			}

			this.dragEvents.dragStart = false;

			var l,is,ie,iw,ts,sd,rf,sp,ci,cip,fps,nd,pd,rd,swipe,ti;

			//Get the current left position
			l = Math.abs(this.left);
			//Get the index of the current displayed item
			ci = this.currentItemIndex;
			//Get the array of absolute left position of items
			is = this.itemStartPosition;
			//Get the array of absolute right position of items
			ie = this.itemEndPosition;
			//Get the width of the slider
			iw = this.itemWidth;
			//Get the total swiped amount
			ts = this.dragEvents.totalSwiped
			//Get the last swipe direction
			sd = this.dragEvents.prevSwipeDir;
			//Let's determine the total remain pixels in order to fit the next item
			rf = Math.floor(iw-Math.abs(ts));
			//Get the current swiped value in percents
			sp = this.dragEvents.totalPercSwiped;
			//Get the swipe direction
			swipe = this.dragEvents.prevSwipeDir;

			if("number" !== typeof is[ci])
				return false;

			//Let's get left position of the current displayed item
			cip = is[ci];

			//Get the left position of the previous and next item
			pd = (ci > 0) ? is[ci-1] : 0;
			nd = ("number" === typeof (is[ci+1])) ? is[ci+1] : is[is.length-1];

			//Get the slideFPS
			fps = this.slideFPS;

			if(swipe){
				//Calculate the remain distance between the current displayed item and
				//the next element.
				rd = (pd-l);
				//alert
				ti = ci-1;
			}else{
				rd = nd-l;
				ti = ci+1;
			}

			this.slideJumpToBy = (rd/fps)*1.5;
			
			if(fallback){
				var d;
				//Get the left position of the current displayed item
				this.dragEvents.currentItemStartPos = is[ci];

				//Get the animation duration
				d = this.realEffectDuration;

				if(this.slideStarted)
					clearInterval(this.slideStarted);

				this.slideStarted = setInterval(function(){otSlider.swipeFallback();},d);

			}else{
				
				this.slideJumpToDistance = rd-2*rd;
				this.slideJumpToItemIndex = ti;
				
				if(swipe){
					this.slideJumpTo = pd;
				}else{
					this.slideJumpTo = nd;
				}
				
				this.carouselJumpTo()
			}
		},

		swipeFallback : function(){
			var a,b,c,d,e,l,t,ts,np;

			//Get the current left position
			l = this.left;
			//Get the target left position
			a = this.dragEvents.currentItemStartPos;
			//Get jump value
			b = this.slideJumpToBy;
			//Get the slide element
			e = this.sliderItemsParent;
			//Get the total swiped value
			ts = this.dragEvents.totalSwiped;
			//This value determine if the current Web Browser support CSS3 transform
			//property.
			t = this.canTransform;

			np = (a > 0) ? a-(a*2) : a;

			if(ts < 0 && Math.abs(l)-b > a){
				if(t){
					e.style.transform = "translate("+(l+b)+"px,0)";
				}else{
					e.style.left = (l+b)+"px";
				}

				this.left = (l+b);
			}else if(ts > 0 && Math.abs(l)-b < a){
				if(t){
					e.style.transform = "translate("+(l+b)+"px,0)";
				}else{
					e.style.left = (l+b)+"px";
				}

				this.left = (l+b);
			}else{
				if(t){
					e.style.transform = "translate("+np+"px,0)";
				}else{
					e.style.left = np+"px";
				}

				this.left = np;

				this.dragEvents.prevMousePos = this.dragEvents.totalSwiped = 0;

				this.stopSlideEffect();
			}
		},
		
		resizeHandler : function(){
			var a,b,c,d,l,t;
			
			this.isResizing = 1;
			
			if(this.slideStarted){
				clearInterval(this.slideStarted);
			}
			
			//We must recalculate the dimensions of the slider and it's items when the
			//window get resized.
			this.setupDimensions(true);
			
			//The array which contain the start position of each item
			a = this.itemStartPosition;
			
			//Get the current displayed item
			b = this.currentItemIndex;
			
			c = this.sliderItemsParent;
			
			t = this.canTransform;
			
			if(this.configs.effect === "slide"){
				d = a[b];

				//If the current position of the parent of items is negative, we must
				//keep it negative else positive.
				d = (/(\-)/.test(this.left)) ? (d-d*2) : d;
				
				if(t){
					c.style.transform = "translate("+d+"px,0)";
				}else{
					c.style.left = d+"px";
				}
			
				this.left = d;
			}
			
			this.slideInit();
		},
		
		//This method is used to check if the specified element has the specific class
		hcn : function(e,c){
			if(!(e && e.nodeType == 1))
				throw new Error('No element specified on hcn method');

			if(!(c && 'string' === typeof c))
				throw new Error('The className was not specified on hcn method');
			
			var x,y,z;
			//Create any array that contain all the classes of thespecified element
			x = e.className.split(" ");
			
			for(var i = 0; i <= x.length; i++){
				if(/[A-Za-z0-9]/i.test(x[i]) && x[i] === c)
					return true;
			}
				
			return false;
		},
		
		//This method id used to remove the specified className
		rcn : function(e,c){
			if(!(e && e.nodeType == 1))
				throw new Error('No element specified on rcn method');
			
			if(!(c && 'string' === typeof c))
				throw new Error('The className was not specified on rcn method');
			
			var x,y,z;
			//Create any array of all classes of the specified element
			x = e.className.split(" ");
			
			for(var i = 0; i <= x.length; i++){
				if(/[A-Za-z0-9]/i.test(x[i]) && x[i] === c)
					x[i] = '';
			}
			
			e.className = x.join(" ").replace(/(\s\s+|\s)/gi, " ").replace(/^(\s)|(\s)$/gi,"");
		},
		
		//This method is used to add a specified class to specified element
		acn : function(e,c){
			if(!(e && e.nodeType == 1))
				throw new Error('The element was not specified or is invalid.');
			
			if(!(c && 'string' === typeof c))
				throw new Error('The class must be valid string.');
			
			var x;
			
			x = e.className.split(" ");
			
			for(var i = 0; i < x.length; i++){
				if(/[A-Za-z0-9]/gi.test(x[i]) && x[i] === c)
					x[i] = "";
			}
			
			//Add the specified class to the array
			x[x.length+1] = c;
			e.className = x.join(" ").replace(/(\s\s+|\s)/gi," ").replace(/^(\s)|(\s)$/gi,"");
		}
	};
	
	//Polyfill the getElementsByClassName method for IE8
	if(!document.getElementsByClassName){
		window.Element.prototype.getElementsByClassName = 
		document.constructor.prototype.getElementsByClassName = function(c){
			if(!(c && 'string' === typeof c))
				throw new TypeError("The className is undefined on getElementsByClassName");
			
			var a,b,e;
			
			c = c.split(" ").join(".");
			
			if(c !== "*")
				c = "."+c;
			
			return this.querySelectorAll(c);
		};
	}
})();