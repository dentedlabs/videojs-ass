/*! videojs-ass
 * Copyright (c) 2014 Sunny Li
 * Licensed under the Apache-2.0 license. */

(function (videojs, libjass) {
  'use strict';

  var vjs_ass = function (options) {
    var overlay = document.createElement('div'),
      clock = new libjass.renderers.ManualClock(),
      player = this,
      renderer = null;

    // locate ass file source
    if (!options.src) {
      var ass_element = player.el().querySelector('video ass');
      if (!ass_element) {
        return;
      }
      options.src = ass_element.attributes.src.value;
    }

    overlay.className = 'vjs-ass';
    overlay.style.height = screen.height + 'px';
    player.el().insertBefore(overlay, player.el().firstChild.nextSibling);

    player.on('timeupdate', function () {
      clock.timeUpdate(player.currentTime());
    });

    function updateDisplayArea() {
      if (player.isFullscreen()) {
        renderer.resize(screen.width, screen.height);
      } else {
        renderer.resize(player.width(), player.height());
      }
    }

    player.on('resize', updateDisplayArea);
    player.on('fullscreenchange', updateDisplayArea);

    var subsRequest = new XMLHttpRequest();
    subsRequest.open("GET", options.src, true);

    subsRequest.addEventListener("readystatechange", function () {
      if (subsRequest.readyState === XMLHttpRequest.DONE) {
        var ass = libjass.ASS.fromString(
          subsRequest.responseText,
          libjass.Format.ASS
        );

        renderer = new libjass.renderers.WebRenderer(ass, clock, {}, overlay);
        updateDisplayArea();
      }
    }, false);

    subsRequest.send(null);
  };

  videojs.plugin('ass', vjs_ass);
}(window.videojs, window.libjass));
