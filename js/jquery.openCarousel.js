

(function() {

  window.Ocarousel = (function() {
    /* Initialize
    */

    var arrayShuffle;

    Ocarousel.prototype.ocarousel = null;

    Ocarousel.prototype.ocarousel_window = null;

    Ocarousel.prototype.ocarousel_container = null;

    Ocarousel.prototype.indicators_container = null;

    Ocarousel.prototype.frames = null;

    Ocarousel.prototype.indicators = null;

    Ocarousel.prototype.timer = null;

    Ocarousel.prototype.active = 0;

    /* Default Settings
    */


    Ocarousel.settings = {
      speed: .5 * 1000,
      period: 4 * 1000,
      transition: "scroll",
      perscroll: 1,
      wrapearly: 0,
      shuffle: false,
      indicator_fill: "#ffffff",
      indicator_r: 6,
      indicator_spacing: 6,
      indicator_cy: 20,
      indicator_stroke: "#afafaf",
      indicator_strokewidth: "2"
    };

    function Ocarousel(ocarousel) {
      var me, _ref, _ref1, _ref10, _ref11, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      me = this;
      this.ocarousel = $(ocarousel);
      this.ocarousel_window = $(this.ocarousel).find(".ocarousel_window");
      this.frames = $(this.ocarousel_window).children();
      this.indicators_container = $(this.ocarousel).find(".ocarousel_indicators");
      this.pagination_current = $(this.ocarousel).find(".ocarousel_pagination_current");
      this.pagination_total = $(this.ocarousel).find(".ocarousel_pagination_total");
      if (this.frames.length > 1) {
        this.settings = {};
        this.settings.speed = (_ref = $(this.ocarousel).data('ocarousel-speed')) != null ? _ref : Ocarousel.settings.speed;
        this.settings.period = (_ref1 = $(this.ocarousel).data('ocarousel-period')) != null ? _ref1 : Ocarousel.settings.period;
        this.settings.transition = (_ref2 = $(this.ocarousel).data('ocarousel-transition')) != null ? _ref2 : Ocarousel.settings.transition;
        this.settings.perscroll = (_ref3 = $(this.ocarousel).data('ocarousel-perscroll')) != null ? _ref3 : Ocarousel.settings.perscroll;
        this.settings.wrapearly = (_ref4 = $(this.ocarousel).data('ocarousel-wrapearly')) != null ? _ref4 : Ocarousel.settings.wrapearly;
        this.settings.shuffle = (_ref5 = $(this.ocarousel).data('ocarousel-shuffle')) != null ? _ref5 : Ocarousel.settings.shuffle;
        this.settings.indicator_fill = (_ref6 = $(this.ocarousel).data('ocarousel-indicator-fill')) != null ? _ref6 : Ocarousel.settings.indicator_fill;
        this.settings.indicator_r = (_ref7 = $(this.ocarousel).data('ocarousel-indicator-r')) != null ? _ref7 : Ocarousel.settings.indicator_r;
        this.settings.indicator_spacing = (_ref8 = $(this.ocarousel).data('ocarousel-indicator-spacing')) != null ? _ref8 : Ocarousel.settings.indicator_spacing;
        this.settings.indicator_cy = (_ref9 = $(this.ocarousel).data('ocarousel-indicator-cy')) != null ? _ref9 : Ocarousel.settings.indicator_cy;
        this.settings.indicator_stroke = (_ref10 = $(this.ocarousel).data('ocarousel-indicator-stroke')) != null ? _ref10 : Ocarousel.settings.indicator_stroke;
        this.settings.indicator_strokewidth = (_ref11 = $(this.ocarousel).data('ocarousel-indicator-strokewidth')) != null ? _ref11 : Ocarousel.settings.indicator_strokewidth;
        this.ocarousel_container = document.createElement("div");
        this.ocarousel_container.className = "ocarousel_window_slides";
        $(this.ocarousel).show();
        this.render();
        this.ocarousel_window.html("");
        $(this.ocarousel_window).get(0).appendChild(this.ocarousel_container);
      }
    }

    /* Remove and reset everything in the DOM
    */


    Ocarousel.prototype.render = function() {
      var cx, i, indicator, indicators_svg, me, _i, _ref;
      this.timerStop();
      if (this.settings.shuffle === true) {
        this.frames = arrayShuffle(this.frames);
      }
      $(this.ocarousel_container).html("");
      me = this;
      $(this.frames).each(function(i) {
        return me.ocarousel_container.appendChild(this);
      });
      if (this.indicators_container.length && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {
        $(this.indicators_container).html("");
        indicators_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        indicators_svg.setAttribute("version", "1.1");
        $(this.indicators_container).get(0).appendChild(indicators_svg);
        this.indicators = [];
        cx = $(this.indicators_container).width() / 2 - this.settings.indicator_r * this.frames.length - this.settings.indicator_spacing * this.frames.length / 2;
        for (i = _i = 0, _ref = this.frames.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          indicator = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          indicator.className = "ocarousel_link";
          indicator.setAttribute("data-ocarousel-link", i);
          indicator.setAttribute("cx", cx);
          indicator.setAttribute("cy", this.settings.indicator_cy);
          indicator.setAttribute("r", this.settings.indicator_r);
          indicator.setAttribute("stroke", this.settings.indicator_stroke);
          indicator.setAttribute("stroke-width", this.settings.indicator_strokewidth);
          indicator.setAttribute("fill", i === this.active ? this.settings.indicator_stroke : this.settings.indicator_fill);
          indicators_svg.appendChild(indicator);
          this.indicators.push(indicator);
          $(indicator).data("ocarousel_index", i);
          cx = cx + this.settings.indicator_r * 2 + this.settings.indicator_spacing;
        }
      }
      if (this.pagination_current.length) {
        $(this.pagination_current).html(this.active + 1);
      }
      if (this.pagination_total.length) {
        $(this.pagination_total).html(this.frames.length);
      }
      $(this.ocarousel).find("[data-ocarousel-link]").off("click");
      $(this.ocarousel).find("[data-ocarousel-link]").on("click", function(event) {
        var goHere;
        event.preventDefault();
        goHere = $(this).data("ocarousel-link");
        if (goHere != null) {
          if (goHere === "left" || goHere === "Left" || goHere === "l" || goHere === "L") {
            goHere = me.getPrev();
          } else if (goHere === "right" || goHere === "Right" || goHere === "r" || goHere === "R") {
            goHere = me.getNext();
          } else if (goHere === "first" || goHere === "First" || goHere === "beginning" || goHere === "Beginning") {
            goHere = 0;
          } else if (goHere === "last" || goHere === "Last" || goHere === "end" || goHere === "End") {
            goHere = me.frames.length - 1;
          }
          return me.scrollTo(goHere);
        }
      });
      return this.timerStart();
    };

    /* Animate a transition to the given position
    */


    Ocarousel.prototype.scrollTo = function(index, instant) {
      var me, nextPos, perEnd, wrapEnd;
      if (instant == null) {
        instant = false;
      }
      me = this;
      if (index != null) {
        this.timerStop();
        if (index >= (this.frames.length - this.settings.wrapearly)) {
          index = 0;
        } else if (index >= (this.frames.length - this.settings.perscroll)) {
          index = this.frames.length - this.settings.perscroll;
        } else if (index < 0) {
          perEnd = this.frames.length - this.settings.perscroll;
          wrapEnd = this.frames.length - 1 - this.settings.wrapearly;
          index = Math.min(perEnd, wrapEnd);
        }
        $(this.ocarousel_container).stop();
        nextPos = this.getPos(index);
        if (instant) {
          $(this.ocarousel_container).animate({
            right: nextPos + "px"
          }, 0);
        } else if (this.settings.transition === "fade") {
          $(this.ocarousel_container).fadeOut(this.settings.speed, null).animate({
            right: nextPos + "px"
          }, 0).fadeIn(me.settings.speed);
        } else {
          $(this.ocarousel_container).animate({
            right: nextPos + "px"
          }, this.settings.speed);
        }
        if (this.indicators != null) {
          $(this.indicators[this.active]).attr("fill", this.settings.indicator_fill);
          $(this.indicators[index]).attr("fill", this.settings.indicator_stroke);
        }
        this.active = index;
        if (this.pagination_current.length) {
          $(this.pagination_current).html(this.active + 1);
        }
        return this.timerStart();
      }
    };

    /* Returns the distance of a frame from the left edge of its container
    */


    Ocarousel.prototype.getPos = function(index) {
      return $(this.frames[index]).position().left;
    };

    /* Returns the index of the next slide that should be shown
    */


    Ocarousel.prototype.getNext = function() {
      var count, next;
      next = this.active + this.settings.perscroll;
      if (next > (this.frames.length - this.settings.perscroll) && next < this.frames.length) {
        next = this.frames.length - this.settings.perscroll;
      }
      count = this.frames.length;
      while (count && !$(this.frames[next]).is(":visible")) {
        next++;
        if (next > this.frames.length - 1) {
          next = 0;
        }
        count--;
      }
      return next;
    };

    /* Returns the index of the next slide that should be shown before the current position
    */


    Ocarousel.prototype.getPrev = function() {
      var count, prev;
      prev = this.active - this.settings.perscroll;
      if (prev < 0 && this.active !== 0) {
        prev = 0;
      }
      count = this.frames.length;
      while (count && !$(this.frames[prev]).is(":visible")) {
        prev--;
        if (prev < 0) {
          prev = this.frames.length - 1;
        }
        count--;
      }
      return prev;
    };

    /* Starts or resumes the scroll timer
    */


    Ocarousel.prototype.timerStart = function() {
      var me;
      me = this;
      if (this.settings.period !== Infinity) {
        return this.timer = setInterval((function() {
          return me.scrollTo(me.getNext());
        }), this.settings.period);
      }
    };

    /* Stops the scroll timer
    */


    Ocarousel.prototype.timerStop = function() {
      if (this.timer != null) {
        clearInterval(this.timer);
        return this.timer = null;
      }
    };

    /* Starts the timer if it is stopped, stops the timer if it is running
    */


    Ocarousel.prototype.timerToggle = function() {
      if (this.timer != null) {
        return this.timerStop();
      } else {
        return this.timerStart();
      }
    };

    /* Removes a frame, keeping the carousel in an intuitive position afterwards
    */


    Ocarousel.prototype.remove = function(index) {
      if (index > 0 && index < (this.frames.length - 1)) {
        this.frames.splice(index, 1);
        this.render();
        if (this.active > index) {
          return this.scrollTo(this.active - 1, true);
        }
      }
    };

    /* Adds a frame, keeping the carousel in an intuitive position afterwards
    */


    Ocarousel.prototype.add = function(elt, index) {
      if (index > 0 && index < (this.frames.length - 1)) {
        this.frames.splice(index, 0, elt);
        this.render();
        if (this.active >= index) {
          return this.scrollTo(this.active + 1, true);
        }
      }
    };

    arrayShuffle = function(arr) {
      var i, j, tempi, tempj;
      i = arr.length;
      if (i === 0) {
        return false;
      }
      while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        tempi = arr[i];
        tempj = arr[j];
        arr[i] = tempj;
        arr[j] = tempi;
      }
      return arr;
    };

    return Ocarousel;

  })();

  $(document).ready(function() {
    return $(".ocarousel").each(function() {
      return new Ocarousel(this);
    });
  });

}).call(this);
