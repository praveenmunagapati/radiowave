(function(){"use strict";$(document).ready(function(){var a;return $(document).foundation({equalizer:{equalize_on_stack:!0}}),a=function(){var a,b,c;return c=$(window).width(),a=$(window).height(),b=1.1*a+"px",c>975?(console.log("resize -portrait ("+c+" -- "+a+")"),$("#landing-bg").removeClass("portrait")):(console.log("resize +portrait"),$("#landing-bg").addClass("portrait"))},$(window).resize(function(){return a()}),a()})}).call(this);