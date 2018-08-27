# otslider
OneTime Slider(otSlider) is an powerful and intuitive slider built from plain/vanilla JS, which is
suitable for any type of Web Application.
It has support for many features like swipe(current supported on Desktop Web Browsers),
multiple effects(slide and fade), and more.

## Supported Web browsers
- IE 8 or later;
- Microsoft EDGE;
- Mozilla Firefox;
- Google Chrome;
- Opera;
- Apple Safari;
- And many other Web Browsers.

## How use otSlider
Like many orders slider, you must download the zip file of this slider from here. After
that, just uncompress/extract the folder inside the dowloaded zip file. Then upload it 
to your site and call the two files inside the folder in the &lt;head&gt; tag section as following:

&lt;link rel="stylesheet" type="text/css" ref="https://yoursite.com/otslider/otslider.css" &gt;
<br>
&lt;script src="https://yoursite.com/otslider/otslider.js" &gt; &lt;/script&gt;

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
});
</pre>

### Configs Description
<b>ID</b>: The ID of slider container. <i>[Default = ot-slider | Type = string]</i>;<br>
.......................................
<b>direction</b>: If set to ltr(default), the perform forward moviment or if is set to ltr,
the slider perform backward movimento. <i>[Default = ltr | Type = string]</i><br>
.......................................


## Change Log
<b>Version 1.0(Beta 1)</b>
- Initial public release
