# otslider
OneTime Slider(otSlider) is an powerful and intuitive slider built from plain/vanilla JS, which is
suitable for any type of Web Application.
It has support for many features like swipe(current supported on Desktop Web Browsers only),
multiple effects(slide and fade), and many more.



## Supported Web browsers
- Microsoft IE 8 or later;
- Microsoft EDGE;
- Mozilla Firefox;
- Google Chrome;
- Opera;
- Apple Safari;
- And many other Web Browsers.

## How to use otSlider
Like many other slider, you must download the zip file of this slider from here. After
that, just uncompress/extract the folder inside the dowloaded zip file. Then upload it 
to your site and call the two files inside the folder in the &lt;head&gt; tag section as following:
<pre>
&lt;head&gt;
&lt;link rel="stylesheet" type="text/css" ref="https://yoursite.com/otslider/otslider.css" &gt;
<br>
&lt;script src="https://yoursite.com/otslider/otslider.js" &gt; &lt;/script&gt;
&lt;/head&gt;
</pre>

## How to initialize otSlider
You can initialize otSlider from &lt;head&gt; or &lt;body&gt; tag by doing the following:
<script>
<br>
  otSlider.init();
<br>
</script>

## otSlider configs
The default configs from the optional object are:
<pre>
otSlider.init({
  ID : 'ot-slider',
  direction: 'ltr',
  effect : 'slide',
  prevButton : '&lt;span class="prev"&gt;&lt;/span&gt;',
  nextButton : '&lt;span class="next"&gt;&lt;/span&gt;',
  duration: 2000,
  effectDuration : 500,
  autoPlay : true,
  pauseOnHover : true,
  showPrevNext : true,
  showNav : true,
  swapeToSlide : true,
  responsive : true
});

</pre>
### Configs Description
<b>ID</b>: The ID of slider container. <b><i>[Default = ot-slider | Type = string]</i></b><br>
.......................................<br>
<b>direction(ltr|rtl)</b>: If set to ltr(default), the perform forward moviment or if is set to ltr,
the slider perform backward movimento. <b><i>[Default = ltr | Type = string]</i></b><br>
.......................................<br>
<b>effect(slide|fade)</b>: Determine the effect that must be used by otSlider. <b><i>[Default = slide | Type = string]</i></b><br>
.......................................<br>
<b>prevButton</b>: The previous button of the slider. <b><i>[Default = see otSlider Configs section above | Type = string]</i></b><br>
.......................................<br>
<b>nextButton</b>: The next button of the slider. <b><i>[Default = see otSlider Configs section above | Type = string]</i></b><br>
.......................................<br>
<b>duration</b>: The amount of time in milliseconds that each item/image is displayed before call another one. <b><i>[Default = 1000(1 second) | Type = Integer(Number)]</i></b><br>
.......................................<br>
<b>effectDuration</b>: The amount of time in milliseconds that the effect takes. <b><i>[Default = 500(half of the second) | Type = Integer]</i></b><br>
.......................................<br>
<b>autoPlay(true|false)</b>: Determine if the slide should start play automatically or manually by clicking on buttons of the slider. <b><i>[Default = true | Type = boolean]</i></b><br>
.......................................<br>
<b>pauseOnHover(true|false)</b>: Determine if the slider must be pause while hover(put the mouse or finger on slider). <b><i>[Default = true | Type = boolean]</i></b><br>
.......................................<br>
<b>showPreNext(true|false)</b>: Detremine if both Prev and Next buttons must be displayed or not on slider. <b><i>[Default = true | Type = boolean]</i></b><br>
.......................................<br>
<b>showNav(true|false)</b>: Determine if the dots must be displayed or not on slider. <b><i>[Default = true | Type = boolean ]</i></b><br>
.......................................<br>
<b>swipeToSlide(true|false)</b>: Turn on/off the swipe actions. <b><i>[Default = true | Type = boolean ]</i></b><br>
.......................................<br>
<b>responsive(true|false)</b>: Determine if the slider must adapt it self to the screen which as dimensions lower than the specified dimensions of the slider. <b><i>[Default = true | Type = boolean]</i></b><br>
</pre>

## Change Log
<b>Version 1.0(Beta 1)</b>
- Initial public release
